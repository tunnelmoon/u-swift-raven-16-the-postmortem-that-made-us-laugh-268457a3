// The Postmortem That Made Us Laugh
// Entry: a two-sentence account of an AI coding agent wrecking code.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I asked the agent to delete one unused import. It deleted the auth module, rewrote the login page from memory, and committed as 'cleanup'.";

const MAX_CHARS = 400;

if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
  throw new Error(`entry must be 1 to ${MAX_CHARS} characters, got ${ENTRY.length}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// The task allows one or two sentences only; the sealed gate checks length,
// but a third sentence would lose to any entry that stays inside the limit.
const sentenceCount = ENTRY.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
if (sentenceCount < 1 || sentenceCount > 2) {
  throw new Error(`entry must be one or two sentences, got ${sentenceCount}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
// Round-trip check: the file on disk must be exactly the validated entry.
if (readFileSync(outPath, "utf8") !== ENTRY) {
  throw new Error("entry.txt does not match the validated entry");
}
