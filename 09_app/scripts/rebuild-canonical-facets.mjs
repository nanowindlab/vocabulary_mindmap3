import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync, gzipSync } from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

const liveFacetPath = path.join(appRoot, "public", "data", "live", "APP_READY_FACETS.json");
const canonicalBasePath = path.join(repoRoot, "vocab_dictionary", "output", "unified_live", "kcenter_base.json.gz");
const canonicalFacetPath = path.join(repoRoot, "vocab_dictionary", "output", "unified_live", "kcenter_facet_payload.json.gz");
const topikLinkagePath = path.join(repoRoot, "vocab_dictionary", "output", "topik_stats_linkage", "entry_topik_stats.json.gz");
const reportPath = path.join(repoRoot, "tmp_reports", "canonical_facet_rebuild_report.json");

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function readGzipJson(filePath) {
  return JSON.parse(gunzipSync(readFileSync(filePath)));
}

function writeJsonAtomic(filePath, payload) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  renameSync(tempPath, filePath);
}

function writeGzipJsonAtomic(filePath, payload) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  writeFileSync(tempPath, gzipSync(JSON.stringify(payload, null, 2)));
  renameSync(tempPath, filePath);
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function updateOrderedOptions(existingOptions, counts) {
  const used = new Set();
  const next = existingOptions.map((option) => {
    used.add(option.value);
    return {
      value: option.value,
      count: counts.get(option.value) || 0,
    };
  });

  for (const [value, count] of counts.entries()) {
    if (used.has(value)) continue;
    next.push({ value, count });
  }

  return next;
}

function main() {
  const template = readJson(liveFacetPath);
  const canonicalBase = readGzipJson(canonicalBasePath);
  const topikLinkage = readGzipJson(topikLinkagePath);

  const gradeCounts = new Map();
  const posCounts = new Map();
  const languageCounts = new Map();
  const levelCounts = new Map();
  const bandCounts = new Map();
  const topikStatsByEntryId = new Map(
    (topikLinkage.matches || []).map((item) => [String(item.entry_id), item.stats || {}]),
  );

  let topikMatchCount = 0;

  for (const wrapper of canonicalBase.entries || []) {
    const entry = wrapper.entry || {};

    increment(gradeCounts, entry.word_grade || "없음");

    const posList = Array.isArray(entry.pos) && entry.pos.length > 0 ? entry.pos : ["품사 없음"];
    for (const pos of posList) increment(posCounts, pos);

    increment(languageCounts, entry.original_language?.type || "안 밝힘");

    const topikStats = topikStatsByEntryId.get(String(entry.id));
    if (!topikStats) continue;

    topikMatchCount += 1;
    increment(levelCounts, topikStats.level || "Unrated");
    increment(bandCounts, topikStats.band == null ? "미기재" : String(topikStats.band));
  }

  const nextFacetPayload = {
    ...template,
    generated_at: new Date().toISOString(),
    entry_count: canonicalBase.entry_count,
    facets: {
      ...template.facets,
      "학습난이도": {
        ...template.facets["학습난이도"],
        options: updateOrderedOptions(template.facets["학습난이도"].options, gradeCounts),
      },
      TOPIK: {
        ...template.facets.TOPIK,
        match_count: topikMatchCount,
        options: {
          level: updateOrderedOptions(template.facets.TOPIK.options.level, levelCounts),
          band: updateOrderedOptions(template.facets.TOPIK.options.band, bandCounts),
        },
      },
      "품사": {
        ...template.facets["품사"],
        options: updateOrderedOptions(template.facets["품사"].options, posCounts),
      },
      "외국어 종류": {
        ...template.facets["외국어 종류"],
        options: updateOrderedOptions(template.facets["외국어 종류"].options, languageCounts),
      },
    },
  };

  writeJsonAtomic(liveFacetPath, nextFacetPayload);
  writeGzipJsonAtomic(canonicalFacetPath, nextFacetPayload);
  writeJsonAtomic(reportPath, {
    generated_at: nextFacetPayload.generated_at,
    entry_count: nextFacetPayload.entry_count,
    topik_match_count: nextFacetPayload.facets.TOPIK.match_count,
    live_facet_path: liveFacetPath,
    canonical_facet_path: canonicalFacetPath,
  });

  console.log(
    JSON.stringify(
      {
        status: "ok",
        entry_count: nextFacetPayload.entry_count,
        topik_match_count: nextFacetPayload.facets.TOPIK.match_count,
        live_facet_path: liveFacetPath,
        canonical_facet_path: canonicalFacetPath,
        report_path: reportPath,
      },
      null,
      2,
    ),
  );
}

main();
