#!/usr/bin/env bash
# Close the parents of a just-closed issue once all their sub-issues are closed.
#
# GitHub never closes a parent (story, epic, initiative) when its last
# sub-issue closes, so finished parents stayed open and sat on "Todo" on the
# project board. Closing them here lets the board's "Item closed" workflow move
# them to Done.
#
# Walks up the chain in one run: closing the last story can finish its epic,
# which can finish its initiative. (Issues closed with GITHUB_TOKEN don't
# trigger new workflow runs, so the chain can't rely on events.)
#
# Usage: close-finished-parents.sh <issue-number>
# Env:   REPO=owner/name (defaults to the current repo), DRY_RUN=1 to only print.
set -euo pipefail

issue="${1:?usage: close-finished-parents.sh <issue-number>}"
repo="${REPO:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
owner="${repo%/*}"
name="${repo#*/}"
closed_any=0

while :; do
  # Count closed sub-issues from their own states. GitHub's subIssuesSummary
  # lags a few seconds after a close, so a parent we had just closed still
  # looked unfinished to its own parent (#49 closed, epic #11 read 11/12).
  # Retry a few times when the count is one short of done and we closed a
  # parent earlier in this run, in case the listing lags too.
  for attempt in 1 2 3 4 5 6; do
    parent="$(gh api graphql \
      -f query='query($owner:String!,$name:String!,$n:Int!){repository(owner:$owner,name:$name){issue(number:$n){parent{number state subIssues(first:100){totalCount nodes{state}}}}}}' \
      -f owner="$owner" -f name="$name" -F n="$issue" \
      -q '.data.repository.issue.parent // empty | "\(.number) \(.state) \([.subIssues.nodes[] | select(.state == "CLOSED")] | length) \(.subIssues.totalCount)"')"
    [[ -z "$parent" ]] && break
    read -r number state completed total <<<"$parent"
    if [[ "$closed_any" == 1 && "$state" == "OPEN" && $((completed + 1)) -eq "$total" && "$attempt" -lt 6 ]]; then
      sleep 5
      continue
    fi
    break
  done

  if [[ -z "$parent" ]]; then
    echo "#$issue has no parent."
    break
  fi

  if [[ "$state" != "OPEN" ]]; then
    echo "Parent #$number is already closed."
    break
  fi

  if [[ "$completed" != "$total" ]]; then
    echo "Parent #$number still has open sub-issues ($completed/$total done)."
    break
  fi

  if [[ -n "${DRY_RUN:-}" ]]; then
    echo "Would close parent #$number ($completed/$total done)."
  else
    gh issue close "$number" --repo "$repo" --reason completed \
      --comment "All sub-issues are done ($completed/$total). Closing automatically."
    echo "Closed parent #$number."
    closed_any=1
  fi

  issue="$number"
done
