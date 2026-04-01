import test from "node:test";
import assert from "node:assert/strict";
import {
  buildHashedRemotePath,
  buildImmutableRuntimeEntry,
  IMMUTABLE_CACHE_CONTROL,
} from "../scripts/runtime-bundle-core.mjs";

test("buildHashedRemotePath uses immutable directory and hash suffix", () => {
  const remotePath = buildHashedRemotePath(
    "APP_READY_SEARCH_INDEX.json",
    "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  );

  assert.equal(remotePath, "immutable/APP_READY_SEARCH_INDEX.1234567890abcdef.json");
});

test("buildImmutableRuntimeEntry returns manifest indirection fields", () => {
  const entry = buildImmutableRuntimeEntry({
    fileName: "APP_READY_MEANING_TREE_SHELL.json",
    bytes: 38262,
    digest: "ea85db7a48f5da7ef29a265be6cd65d187590cce873c4668767b31a5e66a5d97",
  });

  assert.deepEqual(entry, {
    file: "APP_READY_MEANING_TREE_SHELL.json",
    remote_path: "immutable/APP_READY_MEANING_TREE_SHELL.ea85db7a48f5da7e.json",
    bytes: 38262,
    sha256: "ea85db7a48f5da7ef29a265be6cd65d187590cce873c4668767b31a5e66a5d97",
    cache_control: IMMUTABLE_CACHE_CONTROL,
  });
});
