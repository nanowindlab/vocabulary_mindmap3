import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");
const compressedDir = path.join(appRoot, "public", "data", "internal", "runtime_payloads");
const manifestPath = path.join(compressedDir, "MANIFEST.json");

const PAYLOADS = [
  "APP_READY_SEARCH_INDEX.json",
  "APP_READY_MEANING_TREE.json",
  "APP_READY_SITUATION_TREE.json",
  "APP_READY_UNCLASSIFIED_TREE.json",
  "APP_READY_FACETS.json",
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
    createGzip({ level: 6 }),
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

function writeJsonAtomic(filePath, payload) {
  const tempPath = `${filePath}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  renameSync(tempPath, filePath);
}

function chunkEntries(detailMapPayload) {
  const entries = detailMapPayload.entries || {};
  const entryIds = Object.keys(entries);
  const chunkMap = new Map();
  const chunks = [];

  for (let index = 0; index < entryIds.length; index += CHUNK_SIZE) {
    const ids = entryIds.slice(index, index + CHUNK_SIZE);
    const chunkId = `chunk-${String((index / CHUNK_SIZE) + 1).padStart(4, "0")}`;
    const richData = {};
    for (const id of ids) {
      richData[id] = entries[id];
      chunkMap.set(id, chunkId);
    }
    chunks.push({
      chunkId,
      ids,
      richData,
    });
  }

  return { chunkMap, chunks };
}

function applyChunkIds(payload, chunkMap) {
  const records = payload.records || payload;
  for (const item of records) {
    const id = item?.id;
    if (!id) continue;
    item.chunk_id = chunkMap.get(String(id)) || null;
  }
  return payload;
}

async function writeChunkArtifacts(detailMapPayload) {
  const { chunkMap, chunks } = chunkEntries(detailMapPayload);
  const manifest = {
    version: "MM3_CHUNKED",
    generated_at: new Date().toISOString(),
    chunk_size: CHUNK_SIZE,
    chunk_count: chunks.length,
    chunks: chunks.map((chunk) => ({
      chunk_id: chunk.chunkId,
      entry_count: chunk.ids.length,
    })),
  };

  writeJsonAtomic(path.join(liveDir, "CHUNK_MANIFEST_V1.json"), manifest);

  for (const chunk of chunks) {
    const richPath = path.join(liveDir, `APP_READY_CHUNK_RICH_${chunk.chunkId}.json`);
    writeJsonAtomic(richPath, chunk.richData);
  }

  return { chunkMap, manifest };
}

async function main() {
  mkdirSync(compressedDir, { recursive: true });
  rmSync(path.join(compressedDir, "MANIFEST.json"), { force: true });
  const entries = [];

  const detailMapPayload = loadJson(DETAIL_MAP_FILE);
  const { chunkMap } = await writeChunkArtifacts(detailMapPayload);

  for (const fileName of [
    "APP_READY_SEARCH_INDEX.json",
    "APP_READY_MEANING_TREE.json",
    "APP_READY_SITUATION_TREE.json",
    "APP_READY_UNCLASSIFIED_TREE.json",
  ]) {
    const payload = loadJson(fileName);
    writeJsonAtomic(path.join(liveDir, fileName), applyChunkIds(payload, chunkMap));
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
    generated_at: new Date().toISOString(),
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
  return (manifest.chunks || []).map((chunk) => `APP_READY_CHUNK_RICH_${chunk.chunk_id}.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
