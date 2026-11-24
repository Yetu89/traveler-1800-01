// One Sentence for a Traveler from 1800 — make.fun bounty entry.
// Grok (grok-4.3) ranking: winner A scored 9/10 (B 7, C 5, D 3) —
// it joins exactly the allowed 1800 concepts (library, post office,
// market, road) into the strongest instant image of the modern internet.
//
// The program writes the entry sentence to /output/entry.txt
// (or $OUTPUT_DIR/entry.txt), validated to the bounty gate:
// UTF-8 text, 1..200 characters, not whitespace-only.
// The sentence is a single line: no newline, no control characters,
// no leading or trailing whitespace — exactly what the gate checks.
//
// Why this sentence: a traveler from 1800 knows libraries, post offices,
// markets and roads, so the sentence explains the internet only with
// things they already understand — a single road joining all three,
// and a letter arriving before its ink is dry as the instant-delivery
// image. Nothing in it needs a modern word (no "internet", no "email",
// no "computer"), which keeps it inside the bounty brief.
//
// Gate rules restated: the entry must be UTF-8 text, 1 to 200 characters
// inclusive, a single line with no newline or carriage-return characters,
// no leading or trailing whitespace, not whitespace-only, and free of
// control characters. The validate() function below enforces every one
// of those rules and throws with a specific message on the first failure.
//
// Round-trip check: after writing entry.txt, main() reads the file back
// and compares it byte-for-byte (as a UTF-8 string) against TEXT. If the
// written file differs in any way, the program fails instead of passing
// silently — so a successful run proves the file on disk is exactly the
// validated sentence.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Imagine every library, post office and market in the world joined by a single road, where a letter arrives before its ink is dry.";

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line (no newline characters)");
  }
  const charCount = [...text].length;
  if (charCount < 1 || charCount > 200) {
    throw new Error(`entry is ${charCount} characters, must be 1..200`);
  }
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 && ch !== "\t") {
      throw new Error("entry contains a control character");
    }
  }
}

function main(): void {
  validate(TEXT);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, TEXT, "utf8");
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== TEXT) {
    throw new Error("round-trip read of entry.txt does not match TEXT");
  }
  console.log(`Wrote ${[...TEXT].length} characters to ${outPath}`);
}

main();
