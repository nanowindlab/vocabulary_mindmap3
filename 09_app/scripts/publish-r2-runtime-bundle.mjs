import { execFileSync } from "node:child_process";
import { mkdtempSync, statSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildImmutableRuntimeEntry,
  listRuntimeBundleFiles,
  MANIFEST_CACHE_CONTROL,
  R2_RUNTIME_MANIFEST_FILE,
  RUNTIME_PAYLOAD_NAMING_VERSION,
  sha256,
} from "./runtime-bundle-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");
const bucket = process.env.MM3_R2_BUCKET || "vocabulary-mindmap3-runtime";
const prefix = (process.env.MM3_R2_PREFIX || "").replace(/^\/+|\/+$/g, "");

function bucketKey(objectKey) {
  return prefix ? `${bucket}/${prefix}/${objectKey}` : `${bucket}/${objectKey}`;
}

function putObject(objectKey, filePath, cacheControl) {
  const args = ["wrangler", "r2", "object", "put", bucketKey(objectKey), "--file", filePath, "--remote"];
  if (cacheControl) {
    args.push("--cache-control", cacheControl);
  }
  execFileSync("npx", args, {
    cwd: appRoot,
    stdio: "inherit",
  });
}

async function main() {
  const fileNames = listRuntimeBundleFiles(liveDir);
  const manifest = {
    version: "v2",
    generated_at: new Date().toISOString(),
    naming_strategy: RUNTIME_PAYLOAD_NAMING_VERSION,
    manifest_cache_control: MANIFEST_CACHE_CONTROL,
    entries: [],
  };

  for (const fileName of fileNames) {
    const filePath = path.join(liveDir, fileName);
    const digest = await sha256(filePath);
    const entry = buildImmutableRuntimeEntry({
      fileName,
      bytes: statSync(filePath).size,
      digest,
    });
    manifest.entries.push(entry);
    putObject(entry.remote_path, filePath, entry.cache_control);
  }

  const tempDir = mkdtempSync(path.join(tmpdir(), "mm3-r2-manifest-"));
  const manifestPath = path.join(tempDir, R2_RUNTIME_MANIFEST_FILE);
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  putObject(R2_RUNTIME_MANIFEST_FILE, manifestPath, MANIFEST_CACHE_CONTROL);
  rmSync(tempDir, { recursive: true, force: true });

  console.log(JSON.stringify({ status: "PUBLISHED", bucket, prefix, fileCount: fileNames.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
