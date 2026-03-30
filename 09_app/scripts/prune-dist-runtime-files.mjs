import { existsSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listRuntimeBundleFiles } from "./runtime-bundle-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const distDataDir = path.join(appRoot, "dist", "data");
const distLiveDir = path.join(distDataDir, "live");
const distInternalDir = path.join(distDataDir, "internal", "runtime_payloads");

function pruneDistLiveFiles() {
  if (!existsSync(distLiveDir)) return;

  const keep = new Set(["README.md", ...listRuntimeBundleFiles(distLiveDir)]);
  for (const fileName of readdirSync(distLiveDir)) {
    if (keep.has(fileName)) continue;
    rmSync(path.join(distLiveDir, fileName), { force: true, recursive: true });
  }
}

function removeInternalRuntimePayloads() {
  if (!existsSync(distInternalDir)) return;
  rmSync(distInternalDir, { recursive: true, force: true });
}

pruneDistLiveFiles();
removeInternalRuntimePayloads();

console.log("pruned dist runtime duplicates");
