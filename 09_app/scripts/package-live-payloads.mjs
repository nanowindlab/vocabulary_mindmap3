import { createReadStream, createWriteStream, existsSync, mkdirSync, renameSync, statSync, writeFileSync } from "node:fs";
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
  "APP_READY_DETAIL_MAP.json",
  "APP_READY_FACETS.json",
];

function sha256(filePath) {
  const hash = createHash("sha256");
  hash.update(statSync(filePath).size.toString());
  return hash.digest("hex");
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
    sha256_hint: sha256(target),
  };
}

async function main() {
  mkdirSync(compressedDir, { recursive: true });
  const entries = [];

  for (const fileName of PAYLOADS) {
    const entry = await gzipPayload(fileName);
    entries.push(entry);
    console.log(`packaged ${fileName}`);
  }

  const manifest = {
    version: "v1",
    generated_at: new Date().toISOString(),
    payload_count: entries.length,
    entries,
  };

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");
  console.log(`wrote ${path.basename(manifestPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
