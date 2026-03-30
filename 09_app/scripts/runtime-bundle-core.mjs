import { createHash } from "node:crypto";
import { createReadStream, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

export const TOP_LEVEL_RUNTIME_FILES = [
  "APP_READY_SEARCH_INDEX.json",
  "APP_READY_MEANING_TREE.json",
  "APP_READY_SITUATION_TREE.json",
  "APP_READY_UNCLASSIFIED_TREE.json",
  "APP_READY_FACETS.json",
  "CHUNK_MANIFEST_V1.json",
];

export const R2_RUNTIME_MANIFEST_FILE = "runtime-bundle-manifest.json";

export function chunkFilesFromManifest(manifest) {
  return (manifest?.chunks || []).flatMap((chunk) => [
    `APP_READY_CHUNK_RICH_${chunk.chunk_id}.json`,
    `APP_READY_CHUNK_EXAMPLES_${chunk.chunk_id}.json`,
  ]);
}

export function loadChunkManifest(dirPath) {
  const manifestPath = path.join(dirPath, "CHUNK_MANIFEST_V1.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing chunk manifest: ${manifestPath}`);
  }
  return JSON.parse(readFileSync(manifestPath, "utf-8"));
}

export function listRuntimeBundleFiles(dirPath) {
  const manifest = loadChunkManifest(dirPath);
  return [...TOP_LEVEL_RUNTIME_FILES, ...chunkFilesFromManifest(manifest)];
}

export function clearPreparedRuntimeFiles(dirPath) {
  if (!existsSync(dirPath)) return;

  const fileNames = readdirSync(dirPath);
  for (const fileName of fileNames) {
    const shouldRemove =
      TOP_LEVEL_RUNTIME_FILES.includes(fileName) ||
      fileName.startsWith("APP_READY_CHUNK_RICH_") ||
      fileName.startsWith("APP_READY_CHUNK_EXAMPLES_");

    if (shouldRemove) {
      rmSync(path.join(dirPath, fileName), { force: true });
    }
  }
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
