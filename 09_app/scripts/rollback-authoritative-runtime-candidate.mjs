import path from "node:path";
import {
  FACET_FILE,
  SEARCH_FILE,
  copyFileIntoDir,
  ensureDir,
  getLatestRollbackDir,
  liveDir,
  readJson,
  refreshRuntimePayloadPackage,
} from "./authoritative-runtime-promotion-core.mjs";

const shouldExecute = process.argv.includes("--execute");
const explicitDirIndex = process.argv.indexOf("--dir");
const explicitDir =
  explicitDirIndex >= 0 ? process.argv[explicitDirIndex + 1] : null;
const rollbackDir = explicitDir || getLatestRollbackDir();

if (!rollbackDir) {
  console.log(JSON.stringify({
    status: "NO_ROLLBACK_FOUND",
    mode: shouldExecute ? "execute" : "dry_run",
  }, null, 2));
  process.exit(0);
}

const metadata = readJson(path.join(rollbackDir, "metadata.json"));
const liveBackupDir = path.join(rollbackDir, "live");

if (!shouldExecute) {
  console.log(JSON.stringify({
    status: "ROLLBACK_READY",
    mode: "dry_run",
    rollback_dir: rollbackDir,
    scope: metadata.scope,
    files: metadata.rollback_files,
  }, null, 2));
  process.exit(0);
}

ensureDir(liveDir);
copyFileIntoDir(path.join(liveBackupDir, SEARCH_FILE), liveDir);
copyFileIntoDir(path.join(liveBackupDir, FACET_FILE), liveDir);

refreshRuntimePayloadPackage();

console.log(JSON.stringify({
  status: "ROLLED_BACK",
  mode: "execute",
  rollback_dir: rollbackDir,
}, null, 2));
