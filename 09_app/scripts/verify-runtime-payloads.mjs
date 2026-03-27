import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
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
  "APP_READY_FACETS.json",
  "APP_READY_DETAIL_MAP.json",
  "CHUNK_MANIFEST_V1.json",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function sha256(filePath) {
  const hash = createHash("sha256");
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

async function main() {
  assert(existsSync(manifestPath), `Missing runtime payload manifest: ${manifestPath}`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  assert(Array.isArray(manifest.entries), "Invalid runtime payload manifest: entries missing");

  const manifestEntries = new Map(manifest.entries.map((entry) => [entry.file, entry]));
  for (const fileName of REQUIRED) {
    const livePath = path.join(liveDir, fileName);
    const compressedPath = path.join(compressedDir, `${fileName}.gz`);
    assert(existsSync(compressedPath), `Missing compressed payload: ${compressedPath}`);
    assert(manifestEntries.has(fileName), `Manifest missing payload entry: ${fileName}`);
    assert(existsSync(livePath), `Missing restored live payload: ${livePath}`);
    const manifestEntry = manifestEntries.get(fileName);
    assert(statSync(compressedPath).size === manifestEntry.compressed_bytes, `Compressed payload size mismatch: ${compressedPath}`);
    assert(statSync(livePath).size === manifestEntry.source_bytes, `Restored live payload size mismatch: ${livePath}`);
    assert(await sha256(compressedPath) === manifestEntry.sha256, `Compressed payload hash mismatch: ${compressedPath}`);
  }

  const chunkManifest = JSON.parse(readFileSync(path.join(liveDir, "CHUNK_MANIFEST_V1.json"), "utf-8"));
  for (const chunk of chunkManifest.chunks || []) {
    for (const fileName of [
      `APP_READY_CHUNK_RICH_${chunk.chunk_id}.json`,
      `APP_READY_CHUNK_EXAMPLES_${chunk.chunk_id}.json`,
    ]) {
      const livePath = path.join(liveDir, fileName);
      const compressedPath = path.join(compressedDir, `${fileName}.gz`);
      const manifestEntry = manifestEntries.get(fileName);
      assert(existsSync(compressedPath), `Missing compressed chunk payload: ${compressedPath}`);
      assert(existsSync(livePath), `Missing restored live chunk payload: ${livePath}`);
      assert(manifestEntry, `Manifest missing chunk payload entry: ${fileName}`);
      assert(statSync(compressedPath).size === manifestEntry.compressed_bytes, `Compressed chunk size mismatch: ${compressedPath}`);
      assert(statSync(livePath).size === manifestEntry.source_bytes, `Restored chunk payload size mismatch: ${livePath}`);
      assert(await sha256(compressedPath) === manifestEntry.sha256, `Compressed chunk hash mismatch: ${compressedPath}`);
    }
  }

  console.log(`verified ${REQUIRED.length} runtime payloads`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
