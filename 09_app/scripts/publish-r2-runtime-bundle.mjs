import { execFileSync } from "node:child_process";
import { mkdtempSync, statSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listRuntimeBundleFiles, R2_RUNTIME_MANIFEST_FILE, sha256 } from "./runtime-bundle-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");
const bucket = process.env.MM3_R2_BUCKET || "";
const prefix = (process.env.MM3_R2_PREFIX || "").replace(/^\/+|\/+$/g, "");

function bucketKey(fileName) {
  return prefix ? `${bucket}/${prefix}/${fileName}` : `${bucket}/${fileName}`;
}

function remotePath(fileName) {
  return prefix ? `${prefix}/${fileName}` : fileName;
}

function putObject(fileName, filePath) {
  execFileSync("npx", [
    "wrangler",
    "r2",
    "object",
    "put",
    bucketKey(fileName),
    "--file",
    filePath,
    "--remote",
  ], {
    cwd: appRoot,
    stdio: "inherit",
  });
}

async function main() {
  if (!bucket) {
    throw new Error("MM3_R2_BUCKET is required");
  }

  const fileNames = listRuntimeBundleFiles(liveDir);
  const manifest = {
    version: "v1",
    generated_at: new Date().toISOString(),
    entries: [],
  };

  for (const fileName of fileNames) {
    const filePath = path.join(liveDir, fileName);
    manifest.entries.push({
      file: fileName,
      remote_path: remotePath(fileName),
      source_bytes: statSync(filePath).size,
      sha256: await sha256(filePath),
    });
    putObject(fileName, filePath);
    console.log(`uploaded ${fileName}`);
  }

  const tempDir = mkdtempSync(path.join(tmpdir(), "mm3-r2-manifest-"));
  const manifestPath = path.join(tempDir, R2_RUNTIME_MANIFEST_FILE);
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");
  putObject(R2_RUNTIME_MANIFEST_FILE, manifestPath);
  console.log(`uploaded ${R2_RUNTIME_MANIFEST_FILE}`);
  rmSync(tempDir, { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
