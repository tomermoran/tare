import { runScenario, scenarios } from "../src/domain/drift/scenarios";

/*
 * `npm run evals:drift` (STORY-04-02-09 AC 1): runs the drift scenarios and
 * prints the pass rate against the target. The target isn't set yet (X-2),
 * so the rate is reported, not judged; the test suite still requires all.
 */

const TARGET: number | null = null;

const results = scenarios.map(runScenario);
for (const r of results) console.log(`${r.pass ? "pass" : "FAIL"}  [${r.scenario.group}] ${r.scenario.name}: ${r.got}`);
const passed = results.filter((r) => r.pass).length;
const rate = passed / results.length;
console.log(`\n${passed}/${results.length} passed (${(rate * 100).toFixed(1)} %), target ${TARGET === null ? "not set" : `${(TARGET * 100).toFixed(0)} %`}`);
process.exitCode = TARGET !== null && rate < TARGET ? 1 : 0;
