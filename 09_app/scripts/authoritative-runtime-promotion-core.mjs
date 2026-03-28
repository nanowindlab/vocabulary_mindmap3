import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  buildRecoverableSearchRows,
  compareRuntimeRows,
  loadCanonicalFacetPayload,
  loadRuntimeFacetPayload,
  loadRuntimeSearchRows,
} from "./runtime-search-recovery-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const appRoot = path.resolve(__dirname, "..");
export const repoRoot = path.resolve(appRoot, "..");
export const liveDir = path.join(appRoot, "public", "data", "live");
export const compressedDir = path.join(appRoot, "public", "data", "internal", "runtime_payloads");
export const tmpReportsDir = path.join(repoRoot, "tmp_reports");
export const promotionRootDir = path.join(tmpReportsDir, "authoritative_runtime_promotions");
export const rollbackRootDir = path.join(tmpReportsDir, "authoritative_runtime_rollbacks");
export const SEARCH_FILE = "APP_READY_SEARCH_INDEX.json";
export const FACET_FILE = "APP_READY_FACETS.json";
export const MANIFEST_FILE = "MANIFEST.json";

export function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function writeJsonAtomic(filePath, payload) {
  const tempPath = `${filePath}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  renameSync(tempPath, filePath);
}

export function copyFileIntoDir(sourcePath, targetDir) {
  ensureDir(targetDir);
  copyFileSync(sourcePath, path.join(targetDir, path.basename(sourcePath)));
}

export function buildAuthoritativeCandidate() {
  return {
    searchRows: buildRecoverableSearchRows(),
    facetPayload: loadCanonicalFacetPayload(),
  };
}

export function stripChunkId(row) {
  return {
    ...row,
    chunk_id: null,
  };
}

export function buildDualRunDiffSummary() {
  const runtimeSearch = loadRuntimeSearchRows();
  const { searchRows, facetPayload } = buildAuthoritativeCandidate();
  const runtimeFacets = loadRuntimeFacetPayload();

  const fullComparison = compareRuntimeRows(runtimeSearch, searchRows);
  const semanticComparison = compareRuntimeRows(
    runtimeSearch.map(stripChunkId),
    searchRows.map(stripChunkId),
  );

  return {
    generated_at: new Date().toISOString(),
    search: {
      runtime_rows: runtimeSearch.length,
      candidate_rows: searchRows.length,
      exact_match_full: fullComparison.mismatched === 0 && fullComparison.matched === searchRows.length,
      exact_match_without_chunk_id:
        semanticComparison.mismatched === 0 && semanticComparison.matched === searchRows.length,
      full_mismatch_samples: fullComparison.samples,
      semantic_mismatch_samples: semanticComparison.samples,
    },
    facets: {
      runtime_entry_count: runtimeFacets.entry_count,
      candidate_entry_count: facetPayload.entry_count,
      exact_match: JSON.stringify(runtimeFacets) === JSON.stringify(facetPayload),
    },
  };
}

export function formatTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "_",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

export function listRollbackDirs() {
  if (!existsSync(rollbackRootDir)) return [];
  return readdirSync(rollbackRootDir)
    .map((name) => path.join(rollbackRootDir, name))
    .filter((candidate) => existsSync(path.join(candidate, "metadata.json")))
    .sort();
}

export function getLatestRollbackDir() {
  const dirs = listRollbackDirs();
  return dirs.length > 0 ? dirs[dirs.length - 1] : null;
}

function runNodeScript(scriptFile) {
  const result = spawnSync(process.execPath, [path.join(__dirname, scriptFile)], {
    cwd: appRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`${scriptFile} failed with exit code ${result.status}`);
  }
}

export function refreshRuntimePayloadPackage() {
  runNodeScript("package-live-payloads.mjs");
  runNodeScript("verify-runtime-payloads.mjs");
}
