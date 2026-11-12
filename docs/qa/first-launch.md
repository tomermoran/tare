# First launch (STORY-01-01-01)

How each acceptance criterion is checked: automated where it can be, by hand
where it needs a real browser and Firebase.

| AC | What | Automated | Manual step |
| --- | --- | --- | --- |
| 1 | No sign-in, consent or survey | `StartScreen` › Starting; `StartGate` › Starts; route test "creates the account…" | 1 |
| 2 | Account, owner household and main persona created | `bootstrap.test.ts` (persona, drinks, owner, idempotent, race); `bootstrap-rollback.test.ts` | 2 |
| 3 | "Still setting up" when slow | `StartScreen` › Slow; `StartGate` › TurnsSlow | 3 |
| 4 | Failure says so, retry works, nothing partial | `StartScreen` › Failed; `StartGate` › FailsThenRetries; `bootstrap-rollback.test.ts` | 4 |
| 5 | Reopen lands in the same account | `bootstrap.test.ts` "same account on a second launch"; route test "finds the same household" | 5 |

Starter milk checks are skipped here (`it.todo`) and run in
TASK-01-01-08-QA1 once milks ship.

## Manual script

Use a test Firebase project in `.env.local` and `npm run dev`. Use a private
window so the browser starts with no Firebase account and no cookie.

1. **First open.** Open `http://localhost:3000`. Expect the wordmark, then
   Brew's empty state with the tab bar. No sign-in, consent or questions.
   DevTools › Network shows exactly one `POST /api/session` → 204.
2. **What was created.** `npm run db:studio`: one new row each in `users`,
   `households` and `personas` (default), a `household_members` row with role
   `owner`, and nine `drink_types` for that household.
3. **Slow.** DevTools › Network › throttling "Slow 3G", new private window,
   open the app. After about 3 seconds "Still setting up…" appears under the
   wordmark, and the app opens when it finishes.
4. **Offline, then retry.** New private window, DevTools › Network › Offline,
   open the app. Expect "Couldn't get started", one sentence and "Try again";
   no tab bar or app content is reachable. Check in db:studio that no new
   household appeared. Go back online and press "Try again": the app opens.
5. **Reopen.** Close the tab and open the app again in the same window. It
   goes straight to the app with no `POST /api/session`. Delete the
   `tare_session` cookie (DevTools › Application › Cookies) and reload: one
   exchange, and db:studio shows no new household (same Firebase account).
