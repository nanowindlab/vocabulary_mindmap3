import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");
const compressedDir = path.join(appRoot, "public", "data", "internal", "runtime_payloads");
const manifestPath = path.join(compressedDir, "MANIFEST.json");

const REQUIRED = [
  "APP_READY_SEARCH_INDEX.json",
  "APP_READY_MEANING_TREE.json",
  "APP_READY_SITUATION_TREE.json",
  "APP_READY_UNCLASSIFIED_TREE.json",
  "APP_READY_DETAIL_MAP.json",
  "APP_READY_FACETS.json",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function main() {
  assert(existsSync(manifestPath), `Missing runtime payload manifest: ${manifestPath}`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  assert(Array.isArray(manifest.entries), "Invalid runtime payload manifest: entries missing");

  const manifestFiles = new Set(manifest.entries.map((entry) => entry.file));
  for (const fileName of REQUIRED) {
    const livePath = path.join(liveDir, fileName);
    const compressedPath = path.join(compressedDir, `${fileName}.gz`);
    assert(existsSync(compressedPath), `Missing compressed payload: ${compressedPath}`);
    assert(manifestFiles.has(fileName), `Manifest missing payload entry: ${fileName}`);
    assert(existsSync(livePath), `Missing restored live payload: ${livePath}`);
    assert(statSync(livePath).size > 0, `Restored live payload is empty: ${livePath}`);
  }

  console.log(`verified ${REQUIRED.length} runtime payloads`);
}

main();
