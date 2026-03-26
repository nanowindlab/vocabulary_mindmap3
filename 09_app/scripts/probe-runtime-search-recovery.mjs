import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRecoverableSearchRows,
  compareRuntimeRows,
  loadRuntimeSearchRows,
} from "./runtime-search-recovery-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

const reportDir = path.join(repoRoot, "tmp_reports");
const reportPath = path.join(reportDir, "runtime_search_recovery_probe.json");

function main() {
  const runtimeRows = loadRuntimeSearchRows();
  const recoveredRows = buildRecoverableSearchRows();
  const comparison = compareRuntimeRows(runtimeRows, recoveredRows);

  const report = {
    generated_at: new Date().toISOString(),
    runtime_rows: runtimeRows.length,
    recovered_rows: recoveredRows.length,
    comparison,
    recoverable_fields: [
      "id",
      "word",
      "pos",
      "pos_list",
      "word_grade",
      "def_ko",
      "def_en",
      "hierarchy",
      "surface",
      "routing",
      "stats",
      "chunk_id",
      "related_vocab",
      "refs",
      "is_center_profile",
      "roman",
      "sense_count",
      "has_subwords",
      "has_related_forms",
      "representative_sense_id",
      "translation_summary",
      "categories",
    ],
  };

  mkdirSync(reportDir, { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
}

main();
