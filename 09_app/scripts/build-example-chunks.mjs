import { readFileSync, writeFileSync, renameSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildExampleEntry, loadTopikSentenceMap } from "./example-chunk-sources.mjs";
import { loadCanonicalChunkMappingPayload } from "./canonical-chunk-mapping-core.mjs";
import { loadCanonicalRuntimeDetailEntries } from "./runtime-detail-projection.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");
const chunkManifestPath = path.join(liveDir, "CHUNK_MANIFEST_V1.json");

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function writeJsonAtomic(filePath, payload) {
  const tempPath = `${filePath}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  renameSync(tempPath, filePath);
}

async function main() {
  const chunkManifest = loadJson(chunkManifestPath);
  const entries = new Map(loadCanonicalRuntimeDetailEntries().map((item) => [item.id, item.detail]));
  const canonicalChunkMapping = loadCanonicalChunkMappingPayload();
  const fallbackChunkIdsByChunkId = new Map(
    (canonicalChunkMapping.chunks || []).map((chunk) => [chunk.chunk_id, (chunk.entry_ids || []).map((id) => String(id))]),
  );
  const topikSentenceMap = await loadTopikSentenceMap();

  for (const chunk of chunkManifest.chunks || []) {
    const chunkId = chunk.chunk_id;
    const ids = Array.isArray(chunk.entry_ids) && chunk.entry_ids.length > 0
      ? chunk.entry_ids.map((id) => String(id))
      : (fallbackChunkIdsByChunkId.get(chunkId) || []);

    const data = {};
    for (const id of ids) {
      const entry = entries.get(id);
      if (!entry) continue;
      const built = buildExampleEntry(entry, { topikSentenceMap });
      if (Object.keys(built).length > 0) {
        data[id] = built;
      }
    }

    writeJsonAtomic(
      path.join(liveDir, `APP_READY_CHUNK_EXAMPLES_${chunkId}.json`),
      {
        chunk_id: chunkId,
        data,
      },
    );
  }
}

main();
