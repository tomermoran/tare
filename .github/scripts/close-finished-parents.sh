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

while :; do
  parent="$(gh api graphql \
    -f query='query($owner:String!,$name:String!,$n:Int!){repository(owner:$owner,name:$name){issue(number:$n){parent{number state subIssuesSummary{total completed}}}}}' \
    -f owner="$owner" -f name="$name" -F n="$issue" \
    -q '.data.repository.issue.parent // empty | "\(.number) \(.state) \(.subIssuesSummary.completed) \(.subIssuesSummary.total)"')"

  if [[ -z "$parent" ]]; then
    echo "#$issue has no parent."
    break
  fi

  read -r number state completed total <<<"$parent"

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
  fi

  issue="$number"
done
