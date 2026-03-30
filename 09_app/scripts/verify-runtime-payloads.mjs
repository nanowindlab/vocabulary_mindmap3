import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listRuntimeBundleFiles } from "./runtime-bundle-core.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");

async function main() {
  const files = listRuntimeBundleFiles(liveDir);
  if (files.length === 0) {
    throw new Error(`No runtime bundle files found in ${liveDir}`);
  }

  for (const fileName of files) {
    const filePath = path.join(liveDir, fileName);
    if (!existsSync(filePath)) {
      throw new Error(`Missing restored runtime payload: ${filePath}`);
    }
  }

  console.log(JSON.stringify({ status: "PASS", liveDir, fileCount: files.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
