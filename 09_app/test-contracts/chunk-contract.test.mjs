import test from "node:test";
import assert from "node:assert/strict";
import { buildCanonicalChunkMappingPayload, loadCanonicalChunkMappingPayload } from "../scripts/canonical-chunk-mapping-core.mjs";
import { loadCanonicalRuntimeDetailIds } from "../scripts/runtime-detail-projection.mjs";
import { validateChunkContract } from "../scripts/validate-chunk-contract.mjs";

test("canonical chunk mapping covers all canonical ids exactly once", () => {
  const entryIds = loadCanonicalRuntimeDetailIds();
  const payload = buildCanonicalChunkMappingPayload(entryIds);
  const uniqueIds = new Set(payload.records.map((record) => String(record.entry_id)));

  assert.equal(uniqueIds.size, entryIds.length);
  assert.equal(payload.entry_count, entryIds.length);
  assert.equal(payload.chunks.length, payload.chunk_count);
});

test("chunk contract is coherent across mapping, runtime search, manifest, and chunk payloads", () => {
  const summary = validateChunkContract();
  const mapping = loadCanonicalChunkMappingPayload();

  assert.equal(summary.mapping_entry_count, mapping.entry_count);
  assert.equal(summary.mapping_chunk_count, mapping.chunk_count);
  assert.equal(summary.runtime_row_count, mapping.entry_count);
  assert.equal(summary.manifest_chunk_count, mapping.chunk_count);
});
