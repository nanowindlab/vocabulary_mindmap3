import { createHash } from "node:crypto";
import { createReadStream, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

export const R2_RUNTIME_MANIFEST_FILE = "runtime-bundle-manifest.json";
export const LOCAL_RUNTIME_MANIFEST_FILE = "MANIFEST.json";
export const RUNTIME_PAYLOAD_NAMING_VERSION = "content-addressed-immutable-v1";
export const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";
export const MANIFEST_CACHE_CONTROL = "public, max-age=0, must-revalidate";
export const TOP_LEVEL_RUNTIME_FILES = [
  "APP_READY_SEARCH_INDEX.json",
  "APP_READY_SEARCH_THIN_INDEX.json",
  "APP_READY_MEANING_TREE_SHELL.json",
  "APP_READY_MEANING_TREE.json",
  "APP_READY_SITUATION_TREE.json",
  "APP_READY_UNCLASSIFIED_TREE.json",
  "APP_READY_FACETS.json",
  "APP_READY_TRANSLATION_LANGUAGES.json",
  "CHUNK_MANIFEST_V1.json",
];

export function loadTranslationLanguageManifest(dirPath) {
  const manifestPath = path.join(dirPath, "APP_READY_TRANSLATION_LANGUAGES.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing translation language manifest: ${manifestPath}`);
  }
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

export function translationOverlayFilesFromManifest(manifest) {
  return (manifest?.languages || [])
    .map((entry) => entry?.file)
    .filter(Boolean);
}

export function loadChunkManifest(dirPath) {
  const manifestPath = path.join(dirPath, "CHUNK_MANIFEST_V1.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing chunk manifest: ${manifestPath}`);
  }
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

export function chunkFilesFromManifest(manifest) {
  return (manifest?.chunks || []).flatMap((chunk) => [
    `APP_READY_CHUNK_RICH_${chunk.chunk_id}.json`,
    `APP_READY_CHUNK_EXAMPLES_${chunk.chunk_id}.json`,
  ]);
}

export function listRuntimeBundleFiles(dirPath) {
  const manifest = loadChunkManifest(dirPath);
  const translationManifest = loadTranslationLanguageManifest(dirPath);
  return [
    ...TOP_LEVEL_RUNTIME_FILES,
    ...translationOverlayFilesFromManifest(translationManifest),
    ...chunkFilesFromManifest(manifest),
  ];
}

export function loadLocalRuntimeManifest(dirPath) {
  const manifestPath = path.join(dirPath, LOCAL_RUNTIME_MANIFEST_FILE);
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing local runtime manifest: ${manifestPath}`);
  }
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

export function buildHashedRemotePath(fileName, digest) {
  const parsed = path.posix.parse(fileName);
  const suffix = String(digest || "").slice(0, 16);
  if (!suffix) {
    throw new Error(`Cannot build hashed remote path without digest for ${fileName}`);
  }
  return path.posix.join("immutable", `${parsed.name}.${suffix}${parsed.ext}`);
}

export function buildImmutableRuntimeEntry({ fileName, bytes, digest }) {
  return {
    file: fileName,
    remote_path: buildHashedRemotePath(fileName, digest),
    bytes,
    sha256: digest,
    cache_control: IMMUTABLE_CACHE_CONTROL,
  };
}

export function clearPreparedRuntimeFiles(dirPath) {
  if (!existsSync(dirPath)) return;
  for (const fileName of readdirSync(dirPath)) {
    if (fileName === ".gitkeep") continue;
    rmSync(path.join(dirPath, fileName), { recursive: true, force: true });
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
