import { createHash } from "node:crypto";
import { createReadStream, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

export const R2_RUNTIME_MANIFEST_FILE = "runtime-bundle-manifest.json";
export const RUNTIME_FILE = "app-runtime.json";

export function listRuntimeBundleFiles(dirPath) {
  return existsSync(path.join(dirPath, RUNTIME_FILE)) ? [RUNTIME_FILE] : [];
}

export function clearPreparedRuntimeFiles(dirPath) {
  if (!existsSync(dirPath)) return;
  for (const fileName of readdirSync(dirPath)) {
    if (fileName === ".gitkeep") continue;
    rmSync(path.join(dirPath, fileName), { recursive: true, force: true });
  }
}

export function loadRuntimeManifest(dirPath) {
  return JSON.parse(readFileSync(path.join(dirPath, R2_RUNTIME_MANIFEST_FILE), "utf8"));
}

export async function sha256(filePath) {
  const hash = createHash("sha256");
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}
