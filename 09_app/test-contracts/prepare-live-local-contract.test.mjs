import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { gzipSync } from "node:zlib";
import { restoreLocalRuntimeBundle } from "../scripts/prepare-live-payloads.mjs";

test("restoreLocalRuntimeBundle restores gzipped payloads from MANIFEST.json", async () => {
  const rootDir = mkdtempSync(path.join(tmpdir(), "mm3-prepare-live-local-"));
  const runtimeBundleDir = path.join(rootDir, "runtime_payloads");
  const liveDir = path.join(rootDir, "live");

  mkdirSync(runtimeBundleDir, { recursive: true });
  mkdirSync(liveDir, { recursive: true });

  const payload = { status: "ok", entries: [1, 2, 3] };
  writeFileSync(
    path.join(runtimeBundleDir, "MANIFEST.json"),
    `${JSON.stringify({
      version: "v1",
      payload_count: 1,
      entries: [{ file: "APP_READY_SAMPLE.json" }],
    }, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    path.join(runtimeBundleDir, "APP_READY_SAMPLE.json.gz"),
    gzipSync(Buffer.from(JSON.stringify(payload))),
  );

  await restoreLocalRuntimeBundle({ runtimeBundleDir, liveDir });

  const restored = JSON.parse(readFileSync(path.join(liveDir, "APP_READY_SAMPLE.json"), "utf8"));
  assert.deepEqual(restored, payload);
});
