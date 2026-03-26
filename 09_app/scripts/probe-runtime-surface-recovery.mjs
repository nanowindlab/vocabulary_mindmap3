import {
  buildRecoverableSearchRows,
  compareRuntimeRows,
  loadCanonicalFacetPayload,
  loadRuntimeFacetPayload,
  loadRuntimeSearchRows,
} from "./runtime-search-recovery-core.mjs";

const runtimeSearch = loadRuntimeSearchRows();
const recoveredSearch = buildRecoverableSearchRows();
const runtimeFacets = loadRuntimeFacetPayload();
const canonicalFacets = loadCanonicalFacetPayload();

const searchComparison = compareRuntimeRows(runtimeSearch, recoveredSearch);
const facetExactMatch = JSON.stringify(runtimeFacets) === JSON.stringify(canonicalFacets);

console.log(JSON.stringify({
  search: {
    runtime_rows: runtimeSearch.length,
    recovered_rows: recoveredSearch.length,
    matched: searchComparison.matched,
    mismatched: searchComparison.mismatched,
  },
  facets: {
    runtime_entry_count: runtimeFacets.entry_count,
    canonical_entry_count: canonicalFacets.entry_count,
    exact_match: facetExactMatch,
  },
}, null, 2));
