import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildRecoverableSearchRows } from "./runtime-search-recovery-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

const outDir = path.join(repoRoot, "tmp_reports");
const defaultOutPath = path.join(outDir, "recovered_APP_READY_SEARCH_INDEX.json");

const args = process.argv.slice(2);
const outFlagIndex = args.indexOf("--out");
const outPath = outFlagIndex >= 0 ? path.resolve(args[outFlagIndex + 1]) : defaultOutPath;

const rows = buildRecoverableSearchRows();
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ written: outPath, row_count: rows.length }, null, 2));
