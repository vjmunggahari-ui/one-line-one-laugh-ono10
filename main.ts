// One Line, One Laugh — make.fun entry by @ono10
// Winner C01 (101 chars): "My agent read my mind and filed a bug report against it — apparently even my thoughts need a rewrite."
// Writes the winning one-liner to $MAKEFUN_OUTPUT_DIR/entry.txt and self-checks by read-back.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My agent read my mind and filed a bug report against it \u2014 apparently even my thoughts need a rewrite.";
const EXPECTED_SHA256 =
  "450f59c918f4fe6aafecbf2fde2ac240ac90c7fb8ebdc147740c89c79f012a39";
const EXPECTED_LENGTH = 101;

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const entryBytes = Buffer.from(ENTRY, "utf-8");
if ([...ENTRY].length !== EXPECTED_LENGTH) {
  throw new Error(
    `entry length mismatch: expected ${EXPECTED_LENGTH} chars, got ${[...ENTRY].length}`,
  );
}
if (ENTRY.includes("\n")) {
  throw new Error("entry must be a single line");
}
if (createHash("sha256").update(entryBytes).digest("hex") !== EXPECTED_SHA256) {
  throw new Error("entry sha256 mismatch");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, entryBytes);

// Read-back self-check: byte-identical, same sha256, single line, 1-140 chars.
const back = readFileSync(outPath);
if (!back.equals(entryBytes)) {
  throw new Error("read-back mismatch: entry.txt differs from ENTRY");
}
if (
  createHash("sha256").update(back).digest("hex") !== EXPECTED_SHA256
) {
  throw new Error("read-back sha256 mismatch");
}
const backText = back.toString("utf-8");
if (backText.includes("\n") || [...backText].length < 1 || [...backText].length > 140) {
  throw new Error("read-back gate check failed");
}
if (backText !== backText.trim() || back.length !== entryBytes.length) {
  throw new Error("read-back whitespace/byte-length check failed");
}

console.log(`wrote ${outPath} (${[...ENTRY].length} chars)`);
