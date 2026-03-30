import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, statSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { createHash } from "node:crypto";
import { createGunzip } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  clearPreparedRuntimeFiles,
  R2_RUNTIME_MANIFEST_FILE,
  TOP_LEVEL_RUNTIME_FILES,
} from "./runtime-bundle-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const compressedDir = path.join(appRoot, "public", "data", "internal", "runtime_payloads");
const liveDir = path.join(appRoot, "public", "data", "live");
const payloadSource = process.env.MM3_RUNTIME_PAYLOAD_SOURCE || "local_gz";
const r2BaseUrl = process.env.MM3_RUNTIME_BUNDLE_BASE_URL || null;

// These payloads are still restored into live/ for build-side validation and sidecar
// tooling, even though the learner-facing runtime no longer fetches the tree trio.
const PAYLOADS = TOP_LEVEL_RUNTIME_FILES;

async function inflatePayload(fileName) {
  const source = path.join(compressedDir, `${fileName}.gz`);
  const target = path.join(liveDir, fileName);
  const tempTarget = `${target}.tmp`;

  if (!existsSync(source)) {
    throw new Error(`Missing compressed runtime payload: ${source}`);
  }

  await pipeline(
    createReadStream(source),
    createGunzip(),
    createWriteStream(tempTarget),
  );

  renameSync(tempTarget, target);
}

async function sha256(filePath) {
  const hash = createHash("sha256");
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

function joinRemoteUrl(baseUrl, fileName) {
  return `${baseUrl.replace(/\/$/, "")}/${fileName}`;
}

async function fetchRemoteManifest() {
  if (!r2BaseUrl) {
    throw new Error("MM3_RUNTIME_BUNDLE_BASE_URL is required when MM3_RUNTIME_PAYLOAD_SOURCE=r2");
  }

  const resp = await fetch(joinRemoteUrl(r2BaseUrl, R2_RUNTIME_MANIFEST_FILE));
  if (!resp.ok) {
    throw new Error(`Failed to load remote runtime manifest: ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}

async function downloadRemotePayload(entry) {
  const target = path.join(liveDir, entry.file);
  const tempTarget = `${target}.tmp`;
  const remotePath = entry.remote_path || entry.file;
  const resp = await fetch(joinRemoteUrl(r2BaseUrl, remotePath));
  if (!resp.ok) {
    throw new Error(`Failed to download remote runtime payload ${entry.file}: ${resp.status} ${resp.statusText}`);
  }

  await pipeline(Readable.fromWeb(resp.body), createWriteStream(tempTarget));
  renameSync(tempTarget, target);

  if (Number.isFinite(entry.source_bytes) && statSync(target).size !== entry.source_bytes) {
    throw new Error(`Remote runtime payload size mismatch: ${entry.file}`);
  }
  if (entry.sha256 && await sha256(target) !== entry.sha256) {
    throw new Error(`Remote runtime payload hash mismatch: ${entry.file}`);
  }
}

async function restoreFromRemote() {
  const manifest = await fetchRemoteManifest();
  if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) {
    throw new Error("Invalid remote runtime manifest: entries missing");
  }

  clearPreparedRuntimeFiles(liveDir);

  for (const entry of manifest.entries) {
    await downloadRemotePayload(entry);
    console.log(`prepared ${entry.file}`);
  }
}

function listCompressedChunkFiles() {
  return readFileSync(path.join(compressedDir, "MANIFEST.json"), "utf-8");
}

async function main() {
  mkdirSync(liveDir, { recursive: true });

  if (payloadSource === "r2") {
    await restoreFromRemote();
    return;
  }

  clearPreparedRuntimeFiles(liveDir);

  for (const fileName of PAYLOADS) {
    await inflatePayload(fileName);
    console.log(`prepared ${fileName}`);
  }

  const manifest = JSON.parse(listCompressedChunkFiles());
  const chunkFiles = (manifest.entries || [])
    .map((entry) => entry.file)
    .filter((fileName) =>
      fileName.startsWith("APP_READY_CHUNK_RICH_") || fileName.startsWith("APP_READY_CHUNK_EXAMPLES_"));
  for (const fileName of chunkFiles) {
    await inflatePayload(fileName);
    console.log(`prepared ${fileName}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
