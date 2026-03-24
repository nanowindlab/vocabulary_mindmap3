import { createReadStream, createWriteStream, existsSync, mkdirSync } from "node:fs";
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
  "APP_READY_DETAIL_MAP.json",
  "APP_READY_FACETS.json",
];

async function inflatePayload(fileName) {
  const source = path.join(compressedDir, `${fileName}.gz`);
  const target = path.join(liveDir, fileName);

  if (!existsSync(source)) {
    throw new Error(`Missing compressed runtime payload: ${source}`);
  }

  await pipeline(
    createReadStream(source),
    createGunzip(),
    createWriteStream(target),
  );
}

async function main() {
  mkdirSync(liveDir, { recursive: true });
  for (const fileName of PAYLOADS) {
    await inflatePayload(fileName);
    console.log(`prepared ${fileName}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
