import { execFileSync } from "node:child_process";
import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRecoverableSearchRows,
  loadCanonicalFacetPayload,
} from "./runtime-search-recovery-core.mjs";
import { ensureCanonicalChunkMapping } from "./canonical-chunk-mapping-core.mjs";
import { buildProjectedTabPayloads } from "../src/utils/tabProjection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");

function writeJsonAtomic(filePath, payload) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  renameSync(tempPath, filePath);
}

function runNodeScript(scriptName) {
  execFileSync(process.execPath, [path.join(__dirname, scriptName)], {
    cwd: appRoot,
    stdio: "inherit",
  });
}

function main() {
  const args = new Set(process.argv.slice(2));
  const skipPackage = args.has("--skip-package");
  const skipVerify = args.has("--skip-verify");
  const chunkMapping = ensureCanonicalChunkMapping({ force: false });

  const searchRows = buildRecoverableSearchRows();
  const facetPayload = loadCanonicalFacetPayload();
  const projected = buildProjectedTabPayloads(searchRows);

  writeJsonAtomic(path.join(liveDir, "APP_READY_SEARCH_INDEX.json"), searchRows);
  writeJsonAtomic(path.join(liveDir, "APP_READY_FACETS.json"), facetPayload);
  writeJsonAtomic(path.join(liveDir, "APP_READY_MEANING_TREE.json"), projected.meaning);
  writeJsonAtomic(path.join(liveDir, "APP_READY_SITUATION_TREE.json"), projected.situation);
  writeJsonAtomic(path.join(liveDir, "APP_READY_UNCLASSIFIED_TREE.json"), projected.unclassified);

  console.log(JSON.stringify({
    step: "canonical-live-written",
    canonical_chunk_mapping_entries: chunkMapping.entry_count,
    canonical_chunk_mapping_chunks: chunkMapping.chunk_count,
    search_rows: searchRows.length,
    meaning_rows: projected.meaning.length,
    situation_rows: projected.situation.length,
    unclassified_rows: projected.unclassified.length,
    facet_entry_count: facetPayload.entry_count ?? null,
  }, null, 2));

  if (!skipPackage) {
    runNodeScript("package-live-payloads.mjs");
  }

  if (!skipVerify) {
    runNodeScript("verify-runtime-payloads.mjs");
  }
}

main();
