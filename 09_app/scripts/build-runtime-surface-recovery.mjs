import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRecoverableSearchRows,
  loadCanonicalFacetPayload,
} from "./runtime-search-recovery-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

const outDir = path.join(repoRoot, "tmp_reports", "runtime_surface_recovery");

mkdirSync(outDir, { recursive: true });

const searchRows = buildRecoverableSearchRows();
const facetPayload = loadCanonicalFacetPayload();

const searchOut = path.join(outDir, "APP_READY_SEARCH_INDEX.json");
const facetOut = path.join(outDir, "APP_READY_FACETS.json");

writeFileSync(searchOut, `${JSON.stringify(searchRows, null, 2)}\n`, "utf8");
writeFileSync(facetOut, `${JSON.stringify(facetPayload, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  out_dir: outDir,
  search_rows: searchRows.length,
  facet_entry_count: facetPayload.entry_count,
}, null, 2));
