---
description: Break the Tare spec into initiatives, epics, design, stories and tasks, with a design review loop, then create GitHub issues after approval.
---

Run the Tare planning team on docs/spec.md. Stop for my approval at every gate.

1. Use the strategist agent. Show me its summary and open questions. Wait for approval or edits.
2. Use the epic-planner agent. Show its summary. Wait for approval.
3. Use the designer agent to design the UX flows for each approved epic. Show its summary, new components and any proposed epic changes.
4. Design review loop. I review the design and user flows and give feedback. For each round:
   - Send design changes back to the designer.
   - Send epic changes (split, merge, rescope, reprioritise), mine or the designer's proposed ones, to the epic-planner first, then have the designer update the affected flows.
   - Make sure the designer logs the round in the review log at the end of design.md.
   - Show me what changed, then wait.
   Repeat until I approve both the design and the epics. Don't continue until I do.
5. Use the story-writer agent to write the stories from the approved epics and design. If stories.md already exists, it revises it instead of starting over. Show its summary and what changed. Wait for approval.
6. Use the tech-lead agent. Show its summary and risks. Wait for approval.
7. Use the reviewer agent. If the verdict is "Needs fixes", send each blocker back to the agent that owns it, then review again. Show me the final verdict.
8. After my final approval, create GitHub issues with `gh`:
   - Labels: initiative, epic, story, task, design, frontend, backend, qa
   - Create top-down so parents exist first, and link each child to its parent as a sub-issue
   - Every issue body starts with its planning ID and "Source: S-xx"
   - Don't add issues to the project board with `gh`: the Tare board's auto-add workflow picks up new issues from this repo
9. Write planning/trace.json (section ID → issue numbers and planning IDs) and save the current commit hash to planning/last-sync.txt. Commit the planning folder.
10. Show a summary: issue counts per level and a link to the repository's issues.

Extra instructions from me, if any: $ARGUMENTS
