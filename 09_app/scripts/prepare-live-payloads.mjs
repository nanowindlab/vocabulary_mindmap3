import {
  copyFileSync,
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { clearPreparedRuntimeFiles, R2_RUNTIME_MANIFEST_FILE, RUNTIME_FILE, sha256 } from "./runtime-bundle-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");
const runtimeBundleDir = path.join(appRoot, "public", "data", "internal", "runtime_payloads");
const payloadSource = process.env.MM3_RUNTIME_PAYLOAD_SOURCE || "r2";
const r2BaseUrl = process.env.MM3_RUNTIME_BUNDLE_BASE_URL || "";
const localSeedPath = path.join(appRoot, "public", "data", "runtime-seed.json");

function joinRemoteUrl(baseUrl, fileName) {
  return `${baseUrl.replace(/\/$/, "")}/${fileName}`;
}

function copyLocalBundle() {
  const source = existsSync(path.join(runtimeBundleDir, RUNTIME_FILE))
    ? path.join(runtimeBundleDir, RUNTIME_FILE)
    : localSeedPath;
  const target = path.join(liveDir, RUNTIME_FILE);
  if (!existsSync(source)) {
    throw new Error(`Missing local runtime bundle: ${source}`);
  }
  copyFileSync(source, target);
}

async function restoreRemoteBundle() {
  if (!r2BaseUrl) {
    throw new Error("MM3_RUNTIME_BUNDLE_BASE_URL is required for R2 restore");
  }

  const manifestResponse = await fetch(joinRemoteUrl(r2BaseUrl, R2_RUNTIME_MANIFEST_FILE));
  if (!manifestResponse.ok) {
    throw new Error(`Failed to fetch runtime manifest: ${manifestResponse.status}`);
  }
  const manifest = await manifestResponse.json();
  const entry = (manifest.entries || []).find((item) => item.file === RUNTIME_FILE);
  if (!entry) {
    throw new Error(`Runtime manifest missing ${RUNTIME_FILE}`);
  }

  const response = await fetch(joinRemoteUrl(r2BaseUrl, entry.remote_path || entry.file));
  if (!response.ok) {
    throw new Error(`Failed to fetch runtime bundle: ${response.status}`);
  }

  const target = path.join(liveDir, RUNTIME_FILE);
  const tempTarget = `${target}.tmp`;
  await pipeline(Readable.fromWeb(response.body), createWriteStream(tempTarget));
  renameSync(tempTarget, target);

  if (statSync(target).size !== entry.bytes) {
    throw new Error(`Runtime bundle size mismatch: ${target}`);
  }
  if (await sha256(target) !== entry.sha256) {
    throw new Error(`Runtime bundle hash mismatch: ${target}`);
  }
}

async function main() {
  mkdirSync(liveDir, { recursive: true });
  clearPreparedRuntimeFiles(liveDir);

  if (payloadSource === "local") {
    copyLocalBundle();
    console.log(`prepared ${RUNTIME_FILE} from local`);
    return;
  }

  try {
    await restoreRemoteBundle();
    console.log(`prepared ${RUNTIME_FILE} from r2`);
  } catch (error) {
    copyLocalBundle();
    console.warn(`r2 restore unavailable, fell back to local bundle: ${error instanceof Error ? error.message : error}`);
    console.log(`prepared ${RUNTIME_FILE} from local fallback`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
