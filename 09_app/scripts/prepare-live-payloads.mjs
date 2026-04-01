import { createReadStream, createWriteStream, existsSync, mkdirSync, renameSync } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createGunzip } from "node:zlib";
import {
  clearPreparedRuntimeFiles,
  loadLocalRuntimeManifest,
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

export async function restoreLocalPayload(entry, options = {}) {
  const sourceDir = options.runtimeBundleDir || runtimeBundleDir;
  const targetDir = options.liveDir || liveDir;
  const source = path.join(sourceDir, `${entry.file}.gz`);
  const target = path.join(targetDir, entry.file);
  if (!existsSync(source)) {
    throw new Error(`Missing local runtime payload: ${source}`);
  }
  const tempTarget = `${target}.tmp`;
  await pipeline(
    createReadStream(source),
    createGunzip(),
    createWriteStream(tempTarget),
  );
  renameSync(tempTarget, target);
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

export async function restoreLocalRuntimeBundle(options = {}) {
  const sourceDir = options.runtimeBundleDir || runtimeBundleDir;
  const targetDir = options.liveDir || liveDir;
  const manifest = loadLocalRuntimeManifest(sourceDir);
  for (const entry of manifest.entries || []) {
    await restoreLocalPayload(entry, { runtimeBundleDir: sourceDir, liveDir: targetDir });
    console.log(`prepared ${entry.file} from local`);
  }
}

async function main() {
  mkdirSync(liveDir, { recursive: true });
  clearPreparedRuntimeFiles(liveDir);

  if (payloadSource === "local") {
    await restoreLocalRuntimeBundle();
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
