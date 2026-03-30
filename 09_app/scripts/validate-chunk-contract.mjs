import { deepStrictEqual } from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCanonicalChunkMappingPayload } from "./canonical-chunk-mapping-core.mjs";
import { loadRuntimeSearchRows } from "./runtime-search-recovery-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sortedStrings(values = []) {
  return [...values].map((value) => String(value)).sort();
}

export function validateChunkContract() {
  const mapping = loadCanonicalChunkMappingPayload();
  const runtimeSearch = loadRuntimeSearchRows();
  const chunkManifest = readJson(path.join(liveDir, "CHUNK_MANIFEST_V1.json"));

  const mappingIds = new Set();
  const mappingById = new Map();
  for (const record of mapping.records || []) {
    const entryId = String(record.entry_id);
    assert(!mappingIds.has(entryId), `Duplicate mapping entry_id: ${entryId}`);
    mappingIds.add(entryId);
    mappingById.set(entryId, record.chunk_id);
  }

  assert(mappingIds.size === mapping.entry_count, `Mapping entry_count mismatch: ${mapping.entry_count} vs ${mappingIds.size}`);
  assert((mapping.chunks || []).length === mapping.chunk_count, `Mapping chunk_count mismatch: ${mapping.chunk_count} vs ${(mapping.chunks || []).length}`);

  const runtimeIds = new Set();
  for (const row of runtimeSearch) {
    const entryId = String(row.id);
    runtimeIds.add(entryId);
    const expectedChunkId = mappingById.get(entryId);
    assert(expectedChunkId, `Runtime row missing canonical mapping: ${entryId}`);
    assert(row.chunk_id === expectedChunkId, `Runtime chunk_id mismatch for ${entryId}: ${row.chunk_id} vs ${expectedChunkId}`);
  }

  assert(runtimeIds.size === runtimeSearch.length, `Runtime search duplicate ids detected: ${runtimeSearch.length} vs ${runtimeIds.size}`);
  assert(runtimeIds.size === mappingIds.size, `Runtime row count vs mapping count mismatch: ${runtimeIds.size} vs ${mappingIds.size}`);
  assert((chunkManifest.chunks || []).length === mapping.chunk_count, `Manifest chunk_count mismatch: ${(chunkManifest.chunks || []).length} vs ${mapping.chunk_count}`);

  const mappingChunksById = new Map((mapping.chunks || []).map((chunk) => [chunk.chunk_id, sortedStrings(chunk.entry_ids)]));
  for (const chunk of chunkManifest.chunks || []) {
    assert(Array.isArray(chunk.entry_ids), `Manifest chunk missing entry_ids: ${chunk.chunk_id}`);
    const expectedIds = mappingChunksById.get(chunk.chunk_id);
    assert(expectedIds, `Manifest chunk missing from canonical mapping: ${chunk.chunk_id}`);
    deepStrictEqual(sortedStrings(chunk.entry_ids), expectedIds);

    const richPath = path.join(liveDir, `APP_READY_CHUNK_RICH_${chunk.chunk_id}.json`);
    const examplesPath = path.join(liveDir, `APP_READY_CHUNK_EXAMPLES_${chunk.chunk_id}.json`);
    assert(existsSync(richPath), `Missing rich chunk payload: ${richPath}`);
    assert(existsSync(examplesPath), `Missing examples chunk payload: ${examplesPath}`);

    const richPayload = readJson(richPath);
    deepStrictEqual(sortedStrings(Object.keys(richPayload)), expectedIds);

    const examplesPayload = readJson(examplesPath);
    assert(examplesPayload.chunk_id === chunk.chunk_id, `Examples chunk_id mismatch: ${examplesPath}`);
    for (const entryId of Object.keys(examplesPayload.data || {})) {
      assert(expectedIds.includes(String(entryId)), `Examples chunk contains out-of-contract entry_id: ${chunk.chunk_id} -> ${entryId}`);
    }
  }

  return {
    mapping_entry_count: mapping.entry_count,
    mapping_chunk_count: mapping.chunk_count,
    runtime_row_count: runtimeSearch.length,
    manifest_chunk_count: (chunkManifest.chunks || []).length,
  };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedPath === __filename) {
  const summary = validateChunkContract();
  console.log(JSON.stringify({
    status: "PASS",
    ...summary,
  }, null, 2));
}
