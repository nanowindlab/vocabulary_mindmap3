import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveFile = path.join(appRoot, "public", "data", "live", "app-runtime.json");

async function main() {
  if (!existsSync(liveFile)) {
    throw new Error(`Missing restored runtime bundle: ${liveFile}`);
  }

  const payload = JSON.parse(readFileSync(liveFile, "utf8"));
  for (const key of ["title", "description", "generatedAt", "entryCount", "source"]) {
    if (!(key in payload)) {
      throw new Error(`Runtime bundle missing key: ${key}`);
    }
  }

  console.log(JSON.stringify({ status: "PASS", liveFile }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
