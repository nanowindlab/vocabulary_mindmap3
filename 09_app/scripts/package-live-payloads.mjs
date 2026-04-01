import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureCanonicalChunkMapping } from "./canonical-chunk-mapping-core.mjs";
import { buildExampleEntry, loadTopikSentenceMap } from "./example-chunk-sources.mjs";
import { loadCanonicalRuntimeDetailEntries } from "./runtime-detail-projection.mjs";
import { buildRuntimeTranslationOverlays } from "./build-runtime-translation-overlays.mjs";
import { TARGET_TRANSLATION_LANGUAGES, DEFAULT_TRANSLATION_LANGUAGE, getTranslationOverlayFileName } from "../src/utils/translationPayloads.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");
const compressedDir = path.join(appRoot, "public", "data", "internal", "runtime_payloads");
const manifestPath = path.join(compressedDir, "MANIFEST.json");

const PAYLOADS = [
  "APP_READY_SEARCH_INDEX.json",
  "APP_READY_SEARCH_THIN_INDEX.json",
  "APP_READY_MEANING_TREE_SHELL.json",
  "APP_READY_MEANING_TREE.json",
  "APP_READY_SITUATION_TREE.json",
  "APP_READY_UNCLASSIFIED_TREE.json",
  "APP_READY_FACETS.json",
  "APP_READY_TRANSLATION_LANGUAGES.json",
  ...TARGET_TRANSLATION_LANGUAGES
    .filter((language) => language !== DEFAULT_TRANSLATION_LANGUAGE)
    .map((language) => getTranslationOverlayFileName(language)),
  "CHUNK_MANIFEST_V1.json",
];
const DETAIL_MAP_FILE = "APP_READY_DETAIL_MAP.json";
const CHUNK_SIZE = 500;

function sha256(filePath) {
  const hash = createHash("sha256");
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

async function gzipPayload(fileName) {
  const source = path.join(liveDir, fileName);
  const target = path.join(compressedDir, `${fileName}.gz`);
  const tempTarget = `${target}.tmp`;

  if (!existsSync(source)) {
    throw new Error(`Missing live payload: ${source}`);
  }

  await pipeline(
    createReadStream(source),
    createGzip({ level: 6, mtime: 0 }),
    createWriteStream(tempTarget),
  );

  renameSync(tempTarget, target);

  return {
    file: fileName,
    source_bytes: statSync(source).size,
    compressed_bytes: statSync(target).size,
    sha256: await sha256(target),
  };
}

function loadJson(fileName) {
  return JSON.parse(readFileSync(path.join(liveDir, fileName), "utf-8"));
}

function writeJsonAtomic(filePath, payload, options = {}) {
  const tempPath = `${filePath}.tmp`;
  const serialized = options.compact
    ? JSON.stringify(payload)
    : `${JSON.stringify(payload, null, 2)}\n`;
  writeFileSync(tempPath, serialized, "utf-8");
  renameSync(tempPath, filePath);
}

function chunkEntries(detailEntries, chunkMappingPayload) {
  const detailById = new Map(detailEntries.map((item) => [String(item.id), item.detail]));
  const chunkMap = new Map();
  const chunks = [];

  for (const chunk of chunkMappingPayload.chunks || []) {
    const ids = (chunk.entry_ids || []).map((id) => String(id));
    const richData = {};
    for (const id of ids) {
      const entry = detailById.get(id);
      if (!entry) {
        throw new Error(`Canonical chunk mapping references missing detail entry: ${id}`);
      }
      richData[id] = entry;
      chunkMap.set(id, chunk.chunk_id);
    }
    chunks.push({
      chunkId: chunk.chunk_id,
      ids,
      richData,
    });
  }

  if (chunkMap.size !== detailById.size) {
    const missingIds = [];
    for (const id of detailById.keys()) {
      if (!chunkMap.has(id)) missingIds.push(id);
      if (missingIds.length >= 10) break;
    }
    throw new Error(`Canonical chunk mapping does not cover all detail entries: ${missingIds.join(", ")}`);
  }

  return { chunkMap, chunks };
}

function applyChunkIds(payload, chunkMap) {
  const records = payload.records || payload;
  if (!Array.isArray(records)) {
    return payload;
  }
  for (const item of records) {
    const id = item?.id;
    if (!id) continue;
    item.chunk_id = chunkMap.get(String(id)) || null;
  }
  return payload;
}

async function writeChunkArtifacts(detailEntries) {
  const chunkMappingPayload = ensureCanonicalChunkMapping({ force: false });
  const { chunkMap, chunks } = chunkEntries(
    detailEntries,
    chunkMappingPayload,
  );
  const topikSentenceMap = await loadTopikSentenceMap();
  const manifest = {
    version: "MM3_CHUNKED",
    chunk_size: chunkMappingPayload.chunk_size,
    chunk_count: chunks.length,
    chunks: chunks.map((chunk) => ({
      chunk_id: chunk.chunkId,
      entry_count: chunk.ids.length,
      entry_ids: chunk.ids,
    })),
  };

  writeJsonAtomic(path.join(liveDir, "CHUNK_MANIFEST_V1.json"), manifest);

  for (const chunk of chunks) {
    const richPath = path.join(liveDir, `APP_READY_CHUNK_RICH_${chunk.chunkId}.json`);
    writeJsonAtomic(richPath, chunk.richData);

    const examplesData = {};
    for (const id of chunk.ids) {
      const built = buildExampleEntry(chunk.richData[id], { topikSentenceMap });
      if (Object.keys(built).length > 0) {
        examplesData[id] = built;
      }
    }
    const examplesPath = path.join(liveDir, `APP_READY_CHUNK_EXAMPLES_${chunk.chunkId}.json`);
    writeJsonAtomic(examplesPath, {
      chunk_id: chunk.chunkId,
      data: examplesData,
    });
  }

  return { chunkMap, manifest };
}

async function main() {
  mkdirSync(compressedDir, { recursive: true });
  rmSync(path.join(compressedDir, "MANIFEST.json"), { force: true });
  rmSync(path.join(compressedDir, `${DETAIL_MAP_FILE}.gz`), { force: true });
  const entries = [];

  buildRuntimeTranslationOverlays();

  const canonicalDetailEntries = loadCanonicalRuntimeDetailEntries();
  const { chunkMap } = await writeChunkArtifacts(canonicalDetailEntries);

  for (const fileName of [
    "APP_READY_SEARCH_INDEX.json",
    "APP_READY_SEARCH_THIN_INDEX.json",
    "APP_READY_MEANING_TREE_SHELL.json",
    "APP_READY_MEANING_TREE.json",
    "APP_READY_SITUATION_TREE.json",
    "APP_READY_UNCLASSIFIED_TREE.json",
  ]) {
    const payload = loadJson(fileName);
    writeJsonAtomic(path.join(liveDir, fileName), applyChunkIds(payload, chunkMap), {
      compact: fileName === "APP_READY_SEARCH_THIN_INDEX.json" || fileName === "APP_READY_MEANING_TREE_SHELL.json",
    });
  }

  for (const fileName of PAYLOADS) {
    const entry = await gzipPayload(fileName);
    entries.push(entry);
    console.log(`packaged ${fileName}`);
  }

  const chunkFiles = chunksFromManifest(path.join(liveDir, "CHUNK_MANIFEST_V1.json"));
  for (const chunkFile of chunkFiles) {
    const entry = await gzipPayload(chunkFile);
    entries.push(entry);
    console.log(`packaged ${chunkFile}`);
  }

  const manifest = {
    version: "v1",
    payload_count: entries.length,
    entries,
  };

  const tempManifestPath = `${manifestPath}.tmp`;
  writeFileSync(tempManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");
  renameSync(tempManifestPath, manifestPath);
  console.log(`wrote ${path.basename(manifestPath)}`);
}

function chunksFromManifest(manifestFilePath) {
  const manifest = JSON.parse(readFileSync(manifestFilePath, "utf-8"));
  return (manifest.chunks || []).flatMap((chunk) => [
    `APP_READY_CHUNK_RICH_${chunk.chunk_id}.json`,
    `APP_READY_CHUNK_EXAMPLES_${chunk.chunk_id}.json`,
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
