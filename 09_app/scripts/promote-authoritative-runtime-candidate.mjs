import path from "node:path";
import {
  FACET_FILE,
  MANIFEST_FILE,
  SEARCH_FILE,
  buildAuthoritativeCandidate,
  buildDualRunDiffSummary,
  compressedDir,
  copyFileIntoDir,
  ensureDir,
  formatTimestamp,
  liveDir,
  promotionRootDir,
  refreshRuntimePayloadPackage,
  rollbackRootDir,
  writeJsonAtomic,
} from "./authoritative-runtime-promotion-core.mjs";

const shouldExecute = process.argv.includes("--execute");
const stamp = formatTimestamp();
const candidateDir = path.join(promotionRootDir, stamp, "candidate");
const rollbackDir = path.join(rollbackRootDir, stamp);
const diffSummary = buildDualRunDiffSummary();
const { searchRows, facetPayload } = buildAuthoritativeCandidate();

ensureDir(candidateDir);
writeJsonAtomic(path.join(candidateDir, SEARCH_FILE), searchRows);
writeJsonAtomic(path.join(candidateDir, FACET_FILE), facetPayload);
writeJsonAtomic(path.join(candidateDir, "dual_run_diff_summary.json"), diffSummary);

const plan = {
  generated_at: new Date().toISOString(),
  mode: shouldExecute ? "execute" : "dry_run",
  candidate_dir: candidateDir,
  rollback_dir: rollbackDir,
  target_files: [SEARCH_FILE, FACET_FILE],
  live_target_dir: liveDir,
  compressed_target_dir: compressedDir,
  dual_run_ready:
    diffSummary.search.exact_match_without_chunk_id && diffSummary.facets.exact_match,
  notes: [
    "current switch scope is search semantic fields + facets",
    "chunk_id remains outside the semantic authority gate",
    "rollback restores live search/facets and re-runs package+verify",
  ],
};

writeJsonAtomic(path.join(path.dirname(candidateDir), "promotion_plan.json"), plan);

if (!shouldExecute) {
  console.log(JSON.stringify({
    status: "PLAN_READY",
    mode: "dry_run",
    candidate_dir: candidateDir,
    rollback_dir: rollbackDir,
    dual_run_ready: plan.dual_run_ready,
  }, null, 2));
  process.exit(0);
}

const liveBackupDir = path.join(rollbackDir, "live");
const compressedBackupDir = path.join(rollbackDir, "compressed");
ensureDir(liveBackupDir);
ensureDir(compressedBackupDir);

copyFileIntoDir(path.join(liveDir, SEARCH_FILE), liveBackupDir);
copyFileIntoDir(path.join(liveDir, FACET_FILE), liveBackupDir);
copyFileIntoDir(path.join(compressedDir, `${SEARCH_FILE}.gz`), compressedBackupDir);
copyFileIntoDir(path.join(compressedDir, `${FACET_FILE}.gz`), compressedBackupDir);
copyFileIntoDir(path.join(compressedDir, MANIFEST_FILE), compressedBackupDir);
writeJsonAtomic(path.join(rollbackDir, "metadata.json"), {
  created_at: new Date().toISOString(),
  scope: "search_semantic_fields_plus_facets",
  rollback_files: [SEARCH_FILE, FACET_FILE],
});

writeJsonAtomic(path.join(liveDir, SEARCH_FILE), searchRows);
writeJsonAtomic(path.join(liveDir, FACET_FILE), facetPayload);

refreshRuntimePayloadPackage();

console.log(JSON.stringify({
  status: "PROMOTED",
  mode: "execute",
  candidate_dir: candidateDir,
  rollback_dir: rollbackDir,
}, null, 2));
