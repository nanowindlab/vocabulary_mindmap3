import path from "node:path";
import {
  buildDualRunDiffSummary,
  ensureDir,
  formatTimestamp,
  tmpReportsDir,
  writeJsonAtomic,
} from "./authoritative-runtime-promotion-core.mjs";

const stamp = formatTimestamp();
const outDir = path.join(tmpReportsDir, "authoritative_runtime_dual_run_diff");
const outFile = path.join(outDir, `dual_run_diff_${stamp}.json`);

ensureDir(outDir);

const summary = buildDualRunDiffSummary();
const status =
  summary.search.exact_match_without_chunk_id && summary.facets.exact_match
    ? "PASS"
    : "FAIL";

writeJsonAtomic(outFile, {
  ...summary,
  status,
  policy_scope: "search_semantic_fields_plus_facets",
  chunk_id_mode: "excluded_from_semantic_authority_gate",
});

console.log(JSON.stringify({
  status,
  out_file: outFile,
  search_exact_match_full: summary.search.exact_match_full,
  search_exact_match_without_chunk_id: summary.search.exact_match_without_chunk_id,
  facets_exact_match: summary.facets.exact_match,
}, null, 2));

if (status !== "PASS") {
  process.exit(1);
}
