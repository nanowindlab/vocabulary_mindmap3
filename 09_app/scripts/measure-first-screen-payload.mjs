import { statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");

function bytes(fileName) {
  return statSync(path.join(liveDir, fileName)).size;
}

const beforeFiles = [
  "APP_READY_MEANING_TREE.json",
  "APP_READY_FACETS.json",
  "APP_READY_TRANSLATION_LANGUAGES.json",
];

const afterFiles = [
  "APP_READY_MEANING_TREE_SHELL.json",
];

const beforeTotal = beforeFiles.reduce((sum, fileName) => sum + bytes(fileName), 0);
const afterTotal = afterFiles.reduce((sum, fileName) => sum + bytes(fileName), 0);

console.log(JSON.stringify({
  before: {
    files: beforeFiles.map((file) => ({ file, bytes: bytes(file) })),
    payloadCount: beforeFiles.length,
    totalBytes: beforeTotal,
  },
  after: {
    files: afterFiles.map((file) => ({ file, bytes: bytes(file) })),
    payloadCount: afterFiles.length,
    totalBytes: afterTotal,
  },
  delta: {
    savedBytes: beforeTotal - afterTotal,
    savedPct: Number((((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(2)),
    payloadCountReducedBy: beforeFiles.length - afterFiles.length,
  },
}, null, 2));
