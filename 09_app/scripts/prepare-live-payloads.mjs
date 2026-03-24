import { createReadStream, createWriteStream, existsSync, mkdirSync, renameSync } from "node:fs";
import { readdirSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const compressedDir = path.join(appRoot, "public", "data", "internal", "runtime_payloads");
const liveDir = path.join(appRoot, "public", "data", "live");

const PAYLOADS = [
  "APP_READY_SEARCH_INDEX.json",
  "APP_READY_MEANING_TREE.json",
  "APP_READY_SITUATION_TREE.json",
  "APP_READY_UNCLASSIFIED_TREE.json",
  "APP_READY_FACETS.json",
  "CHUNK_MANIFEST_V1.json",
];

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

async function main() {
  mkdirSync(liveDir, { recursive: true });
  for (const fileName of PAYLOADS) {
    await inflatePayload(fileName);
    console.log(`prepared ${fileName}`);
  }

  const chunkFiles = readdirSync(compressedDir)
    .filter((fileName) => fileName.startsWith("APP_READY_CHUNK_RICH_") && fileName.endsWith(".json.gz"));
  for (const fileName of chunkFiles) {
    await inflatePayload(fileName.replace(/\.gz$/, ""));
    console.log(`prepared ${fileName.replace(/\.gz$/, "")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
