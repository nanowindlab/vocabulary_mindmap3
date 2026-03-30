import { deepStrictEqual } from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

const liveDir = path.join(appRoot, "public", "data", "live");
const unifiedLiveDir = path.join(repoRoot, "vocab_dictionary", "output", "unified_live");

const args = process.argv.slice(2);
const reportFlagIndex = args.indexOf("--report");
const reportPath = reportFlagIndex >= 0 ? path.resolve(args[reportFlagIndex + 1]) : null;

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function readGzipJson(filePath) {
  return JSON.parse(gunzipSync(readFileSync(filePath)));
}

function countDiff(left, right) {
  let missing = 0;
  for (const id of left) {
    if (!right.has(id)) missing += 1;
  }
  return missing;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label} mismatch: expected ${expected}, received ${actual}`);
  }
}

function main() {
  // During T1 the tree trio is still validated as generated build artifacts,
  // not as learner-facing runtime fetch objects.
  const runtimeSearch = readJson(path.join(liveDir, "APP_READY_SEARCH_INDEX.json"));
  const runtimeFacets = readJson(path.join(liveDir, "APP_READY_FACETS.json"));
  const meaningTree = readJson(path.join(liveDir, "APP_READY_MEANING_TREE.json"));
  const situationTree = readJson(path.join(liveDir, "APP_READY_SITUATION_TREE.json"));
  const unclassifiedTree = readJson(path.join(liveDir, "APP_READY_UNCLASSIFIED_TREE.json"));

  const thinIndex = readGzipJson(path.join(unifiedLiveDir, "kcenter_thin_index.json.gz"));
  const canonicalFacets = readGzipJson(path.join(unifiedLiveDir, "kcenter_facet_payload.json.gz"));
  const linkIntegrity = readJson(path.join(unifiedLiveDir, "kcenter_link_integrity.json"));

  const runtimeIds = new Set(runtimeSearch.map((item) => String(item.id)));
  const thinIds = new Set(thinIndex.entries.map((item) => String(item.entry.id)));
  const treeUnionIds = new Set();
  for (const list of [meaningTree, situationTree, unclassifiedTree]) {
    for (const item of list) {
      treeUnionIds.add(String(item.id));
    }
  }

  assertEqual(runtimeSearch.length, runtimeIds.size, "runtime search unique ids");
  assertEqual(runtimeSearch.length, thinIndex.entry_count, "runtime search vs thin entry_count");
  assertEqual(thinIndex.entries.length, thinIndex.entry_count, "thin entries vs thin entry_count");
  assertEqual(countDiff(thinIds, runtimeIds), 0, "thin ids missing from runtime search");
  assertEqual(countDiff(runtimeIds, thinIds), 0, "runtime search extra ids vs thin");
  assertEqual(countDiff(runtimeIds, treeUnionIds), 0, "runtime search ids missing from tree union");
  assertEqual(countDiff(treeUnionIds, runtimeIds), 0, "tree union extra ids vs runtime search");
  assertEqual(runtimeFacets.entry_count, canonicalFacets.entry_count, "runtime facets entry_count");
  deepStrictEqual(runtimeFacets, canonicalFacets);

  const runtimeStatsCounts = {
    frequency: 0,
    rank: 0,
    round_count: 0,
    band: 0,
    level_rated: 0,
  };
  for (const item of runtimeSearch) {
    const stats = item.stats || {};
    if (stats.frequency !== null && stats.frequency !== undefined) runtimeStatsCounts.frequency += 1;
    if (stats.rank !== null && stats.rank !== undefined) runtimeStatsCounts.rank += 1;
    if (stats.round_count !== null && stats.round_count !== undefined) runtimeStatsCounts.round_count += 1;
    if (stats.band !== null && stats.band !== undefined) runtimeStatsCounts.band += 1;
    if (stats.level && stats.level !== "Unrated") runtimeStatsCounts.level_rated += 1;
  }

  const topikFacet = canonicalFacets.facets.TOPIK;
  const expectedBandRated = topikFacet.options.band
    .filter((item) => item.value !== "미기재")
    .reduce((sum, item) => sum + item.count, 0);
  const expectedLevelRated = topikFacet.options.level
    .filter((item) => item.value !== "Unrated")
    .reduce((sum, item) => sum + item.count, 0);

  assertEqual(runtimeStatsCounts.frequency, expectedBandRated, "runtime frequency-populated count");
  assertEqual(runtimeStatsCounts.rank, expectedBandRated, "runtime rank-populated count");
  assertEqual(runtimeStatsCounts.round_count, expectedBandRated, "runtime round_count-populated count");
  assertEqual(runtimeStatsCounts.band, expectedBandRated, "runtime band-populated count");
  assertEqual(runtimeStatsCounts.level_rated, expectedLevelRated, "runtime rated-level count");

  const report = {
    generated_at: new Date().toISOString(),
    status: "PASS",
    runtime: {
      search_rows: runtimeSearch.length,
      tree_rows: {
        meaning: meaningTree.length,
        situation: situationTree.length,
        unclassified: unclassifiedTree.length,
      },
      stats_populated_rows: runtimeStatsCounts,
    },
    canonical: {
      thin_entry_count: thinIndex.entry_count,
      facet_entry_count: canonicalFacets.entry_count,
      topik_match_count: topikFacet.match_count,
      link_integrity_summary: linkIntegrity.summary || null,
    },
    set_checks: {
      thin_missing_from_runtime: countDiff(thinIds, runtimeIds),
      runtime_extra_from_thin: countDiff(runtimeIds, thinIds),
      runtime_missing_from_trees: countDiff(runtimeIds, treeUnionIds),
      tree_extra_from_runtime: countDiff(treeUnionIds, runtimeIds),
    },
  };

  if (reportPath) {
    mkdirSync(path.dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  console.log(JSON.stringify(report, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
