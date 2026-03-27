import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRecoverableSearchRows,
  compareRuntimeRows,
  loadCanonicalFacetPayload,
  loadRuntimeFacetPayload,
  loadRuntimeSearchRows,
} from "./runtime-search-recovery-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");

function stripChunkId(row) {
  return {
    ...row,
    chunk_id: null,
  };
}

const runtimeSearch = loadRuntimeSearchRows();
const recoveredSearch = buildRecoverableSearchRows();
const runtimeFacets = loadRuntimeFacetPayload();
const canonicalFacets = loadCanonicalFacetPayload();
const chunkManifest = JSON.parse(readFileSync(path.join(liveDir, "CHUNK_MANIFEST_V1.json"), "utf8"));

const fullComparison = compareRuntimeRows(runtimeSearch, recoveredSearch);
const semanticComparison = compareRuntimeRows(
  runtimeSearch.map(stripChunkId),
  recoveredSearch.map(stripChunkId),
);
const facetExactMatch = JSON.stringify(runtimeFacets) === JSON.stringify(canonicalFacets);
const runtimeRowsWithChunkId = runtimeSearch.filter((row) => Boolean(row.chunk_id)).length;
const manifestHasEntryIds = (chunkManifest.chunks || []).some(
  (chunk) => Array.isArray(chunk.ids) && chunk.ids.length > 0,
);

console.log(JSON.stringify({
  generated_at: new Date().toISOString(),
  search: {
    runtime_rows: runtimeSearch.length,
    recovered_rows: recoveredSearch.length,
    exact_match_full: fullComparison.mismatched === 0 && fullComparison.matched === recoveredSearch.length,
    exact_match_without_chunk_id:
      semanticComparison.mismatched === 0 && semanticComparison.matched === recoveredSearch.length,
    runtime_rows_with_chunk_id: runtimeRowsWithChunkId,
    runtime_rows_without_chunk_id: runtimeSearch.length - runtimeRowsWithChunkId,
  },
  facets: {
    runtime_entry_count: runtimeFacets.entry_count,
    canonical_entry_count: canonicalFacets.entry_count,
    exact_match: facetExactMatch,
  },
  dependency: {
    detail_map_bytes: existsSync(path.join(liveDir, "APP_READY_DETAIL_MAP.json"))
      ? statSync(path.join(liveDir, "APP_READY_DETAIL_MAP.json")).size
      : null,
    chunk_manifest_chunk_count: (chunkManifest.chunks || []).length,
    chunk_manifest_has_entry_ids: manifestHasEntryIds,
  },
  interpretation: {
    semantic_authority_candidate_ready:
      semanticComparison.mismatched === 0 && facetExactMatch,
    unresolved_authoritative_gap:
      manifestHasEntryIds
        ? null
        : "chunk_id cannot be reconstructed from CHUNK_MANIFEST_V1.json alone",
  },
}, null, 2));
