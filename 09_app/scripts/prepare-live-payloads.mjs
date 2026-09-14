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
const gatewayToken = process.env.MM3_RUNTIME_GATEWAY_TOKEN || "";

function joinRemoteUrl(baseUrl, fileName) {
  return `${baseUrl.replace(/\/$/, "")}/${fileName}`;
}

function validGatewayToken(token) {
  return typeof token === "string" && /^[A-Za-z0-9_-]{32,256}$/.test(token);
}

export async function fetchGatewayObject(fileName, options = {}) {
  const baseUrl = options.baseUrl || r2BaseUrl;
  const token = options.token || gatewayToken;
  const fetchImpl = options.fetchImpl || fetch;
  if (!validGatewayToken(token)) {
    throw new Error("MM3_RUNTIME_GATEWAY_TOKEN is required for R2 restore");
  }
  const url = new URL(joinRemoteUrl(baseUrl, fileName));
  if (url.protocol !== "https:") {
    throw new Error("R2 gateway URL must use HTTPS");
  }
  return fetchImpl(url, {
    headers: { Authorization: `Bearer ${token}` },
    redirect: "error",
  });
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
  const response = await fetchGatewayObject(entry.remote_path || entry.file);
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
  if (payloadSource !== "local" && !r2BaseUrl) {
    throw new Error("MM3_RUNTIME_BUNDLE_BASE_URL is required for R2 restore");
  }
  if (payloadSource !== "local" && !validGatewayToken(gatewayToken)) {
    throw new Error("MM3_RUNTIME_GATEWAY_TOKEN is required for R2 restore");
  }
  let remoteManifest = null;
  if (payloadSource === "local") {
    const manifest = loadLocalRuntimeManifest(runtimeBundleDir);
    for (const entry of manifest.entries || []) {
      if (!existsSync(path.join(runtimeBundleDir, `${entry.file}.gz`))) {
        throw new Error(`Missing local runtime payload: ${entry.file}`);
      }
    }
  } else {
    const manifestResponse = await fetchGatewayObject(R2_RUNTIME_MANIFEST_FILE);
    if (!manifestResponse.ok) {
      throw new Error(`Failed to fetch runtime manifest: ${manifestResponse.status}`);
    }
    remoteManifest = await manifestResponse.json();
  }

  mkdirSync(liveDir, { recursive: true });
  clearPreparedRuntimeFiles(liveDir);

  if (payloadSource === "local") {
    await restoreLocalRuntimeBundle();
    return;
  }

  for (const entry of remoteManifest.entries || []) {
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
