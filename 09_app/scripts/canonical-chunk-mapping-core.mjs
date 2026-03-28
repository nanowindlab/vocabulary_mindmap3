import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync, gzipSync } from "node:zlib";
import { loadCanonicalRuntimeDetailIds } from "./runtime-detail-projection.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

export const CANONICAL_CHUNK_SIZE = 500;
export const canonicalChunkMappingPath = path.join(
  repoRoot,
  "vocab_dictionary",
  "output",
  "unified_live",
  "kcenter_chunk_id_mapping.json.gz",
);

function readGzipJson(filePath) {
  return JSON.parse(gunzipSync(readFileSync(filePath)));
}

function writeDeterministicGzipJson(filePath, payload) {
  const tempPath = `${filePath}.tmp`;
  const body = Buffer.from(`${JSON.stringify(payload, null, 2)}\n`, "utf8");
  const compressed = gzipSync(body, { level: 6, mtime: 0 });
  writeFileSync(tempPath, compressed);
  renameSync(tempPath, filePath);
}

export function buildCanonicalChunkMappingPayload(entryIds, chunkSize = CANONICAL_CHUNK_SIZE) {
  const normalizedIds = (entryIds || []).map((id) => String(id));
  const chunks = [];
  const records = [];

  for (let index = 0; index < normalizedIds.length; index += chunkSize) {
    const entryIdsForChunk = normalizedIds.slice(index, index + chunkSize);
    const chunkId = `chunk-${String((index / chunkSize) + 1).padStart(4, "0")}`;
    chunks.push({
      chunk_id: chunkId,
      entry_count: entryIdsForChunk.length,
      entry_ids: entryIdsForChunk,
    });
    for (const entryId of entryIdsForChunk) {
      records.push({
        entry_id: entryId,
        chunk_id: chunkId,
      });
    }
  }

  return {
    schema_version: "MM3_CANONICAL_CHUNK_ID_MAPPING_V1",
    source_artifact: "kcenter_base.json.gz",
    chunk_size: chunkSize,
    entry_count: normalizedIds.length,
    chunk_count: chunks.length,
    chunks,
    records,
  };
}

export function loadCanonicalChunkMappingPayload() {
  if (!existsSync(canonicalChunkMappingPath)) {
    return ensureCanonicalChunkMapping({ force: false });
  }
  return readGzipJson(canonicalChunkMappingPath);
}

export function loadCanonicalChunkMap() {
  const payload = loadCanonicalChunkMappingPayload();
  return new Map((payload.records || []).map((record) => [String(record.entry_id), record.chunk_id]));
}

export function ensureCanonicalChunkMapping(options = {}) {
  const { force = false } = options;
  const nextPayload = buildCanonicalChunkMappingPayload(loadCanonicalRuntimeDetailIds());

  if (!force && existsSync(canonicalChunkMappingPath)) {
    const currentPayload = readGzipJson(canonicalChunkMappingPath);
    if (JSON.stringify(currentPayload) === JSON.stringify(nextPayload)) {
      return currentPayload;
    }
  }

  writeDeterministicGzipJson(canonicalChunkMappingPath, nextPayload);
  return nextPayload;
}
