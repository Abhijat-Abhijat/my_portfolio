// Runnable check for the Hall of hackers validation: `node scripts/check-hall.mts`
import assert from "node:assert/strict";
import { FLAG_LIST, validateHallEntry, formatClock } from "../src/lib/hack/flags.ts";

const good = { handle: "zero_cool", flags: [...FLAG_LIST].reverse(), ms: 95_000, hints: 1 };
assert.equal(validateHallEntry(good).ok, true);
assert.equal(validateHallEntry({ ...good, handle: "x" }).ok, false, "too short");
assert.equal(validateHallEntry({ ...good, handle: "<script>" }).ok, false, "bad chars");
assert.equal(validateHallEntry({ ...good, flags: FLAG_LIST.slice(0, 3) }).ok, false, "missing flag");
assert.equal(validateHallEntry({ ...good, flags: [...FLAG_LIST.slice(0, 3), "flag{fake}"] }).ok, false, "fake flag");
assert.equal(validateHallEntry({ ...good, ms: 5_000 }).ok, false, "impossibly fast");
assert.equal(validateHallEntry({ ...good, ms: Number.NaN }).ok, false, "NaN time");
assert.equal(validateHallEntry({ ...good, hints: -1 }).ok, false, "negative hints");
assert.equal(formatClock(95_000), "01:35");
console.log("hall checks passed");
