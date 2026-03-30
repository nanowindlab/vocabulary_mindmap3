import { copyFileSync, createWriteStream, existsSync, mkdirSync, renameSync } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import {
  clearPreparedRuntimeFiles,
  listRuntimeBundleFiles,
  R2_RUNTIME_MANIFEST_FILE,
} from "./runtime-bundle-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const runtimeBundleDir = path.join(appRoot, "public", "data", "internal", "runtime_payloads");
const liveDir = path.join(appRoot, "public", "data", "live");
const payloadSource = process.env.MM3_RUNTIME_PAYLOAD_SOURCE || "r2";
const r2BaseUrl = process.env.MM3_RUNTIME_BUNDLE_BASE_URL || "";

function joinRemoteUrl(baseUrl, fileName) {
  return `${baseUrl.replace(/\/$/, "")}/${fileName}`;
}

function restoreLocalPayload(fileName) {
  const source = path.join(runtimeBundleDir, fileName);
  const target = path.join(liveDir, fileName);
  if (!existsSync(source)) {
    throw new Error(`Missing local runtime payload: ${source}`);
  }
  copyFileSync(source, target);
}

async function restoreRemotePayload(entry) {
  const target = path.join(liveDir, entry.file);
  const tempTarget = `${target}.tmp`;
  const response = await fetch(joinRemoteUrl(r2BaseUrl, entry.remote_path || entry.file));
  if (!response.ok) {
    throw new Error(`Failed to fetch ${entry.file}: ${response.status}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(tempTarget));
  renameSync(tempTarget, target);
}

async function main() {
  mkdirSync(liveDir, { recursive: true });
  clearPreparedRuntimeFiles(liveDir);

  if (payloadSource === "local") {
    const files = listRuntimeBundleFiles(runtimeBundleDir);
    for (const fileName of files) {
      restoreLocalPayload(fileName);
      console.log(`prepared ${fileName} from local`);
    }
    return;
  }

  if (!r2BaseUrl) {
    throw new Error("MM3_RUNTIME_BUNDLE_BASE_URL is required for R2 restore");
  }

  const manifestResponse = await fetch(joinRemoteUrl(r2BaseUrl, R2_RUNTIME_MANIFEST_FILE));
  if (!manifestResponse.ok) {
    throw new Error(`Failed to fetch runtime manifest: ${manifestResponse.status}`);
  }
  const manifest = await manifestResponse.json();
  for (const entry of manifest.entries || []) {
    await restoreRemotePayload(entry);
    console.log(`prepared ${entry.file} from r2`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
