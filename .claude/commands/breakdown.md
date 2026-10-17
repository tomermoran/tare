---
description: Break the Tare spec into initiatives, epics, stories, design and tasks, then create GitHub issues after approval.
---

Run the Tare planning team on docs/spec.md. Stop for my approval at every gate.

1. Use the strategist agent. Show me its summary and open questions. Wait for approval or edits.
2. Use the epic-planner agent. Show its summary. Wait for approval.
3. Use the story-writer agent. Show its summary. Wait for approval.
4. Use the designer agent. Show its summary and new components. Wait for approval.
5. Use the tech-lead agent. Show its summary and risks. Wait for approval.
6. Use the reviewer agent. If the verdict is "Needs fixes", send each blocker back to the agent that owns it, then review again. Show me the final verdict.
7. After my final approval, create GitHub issues with `gh`:
   - Labels: initiative, epic, story, task, design, frontend, backend, qa
   - Create top-down so parents exist first, and link each child to its parent as a sub-issue
   - Every issue body starts with its planning ID and "Source: S-xx"
   - Add every issue to the Tare project board
8. Write planning/trace.json (section ID → issue numbers and planning IDs) and save the current commit hash to planning/last-sync.txt. Commit the planning folder.
9. Show a summary: issue counts per level and a link to the board.

Extra instructions from me, if any: $ARGUMENTS
