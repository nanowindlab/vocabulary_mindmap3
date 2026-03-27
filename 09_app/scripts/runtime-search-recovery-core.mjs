import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import { loadCanonicalRuntimeDetailIds } from "./runtime-detail-projection.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

const unifiedLiveDir = path.join(repoRoot, "vocab_dictionary", "output", "unified_live");
const linkageDir = path.join(repoRoot, "vocab_dictionary", "output", "topik_stats_linkage");
const liveDir = path.join(appRoot, "public", "data", "live");

const TARGET_LANGUAGES = [
  "영어",
  "몽골어",
  "아랍어",
  "중국어",
  "베트남어",
  "타이어",
  "일본어",
  "프랑스어",
  "스페인어",
  "러시아어",
  "인도네시아어",
];

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function readGzipJson(filePath) {
  return JSON.parse(gunzipSync(readFileSync(filePath)));
}

export function loadRuntimeSearchRows() {
  return readJson(path.join(liveDir, "APP_READY_SEARCH_INDEX.json"));
}

export function loadRuntimeFacetPayload() {
  return readJson(path.join(liveDir, "APP_READY_FACETS.json"));
}

export function loadCanonicalFacetPayload() {
  return readGzipJson(path.join(unifiedLiveDir, "kcenter_facet_payload.json.gz"));
}

function buildTranslationMaps() {
  const payload = readGzipJson(path.join(unifiedLiveDir, "kcenter_translations.json.gz"));
  const summaryBySenseId = new Map();
  const englishDefBySenseId = new Map();

  for (const record of payload.records || []) {
    const translations = (record.translations || [])
      .map((item) => ({
        language: item.language || null,
        word: item.word || null,
        definition: item.definition || null,
      }))
      .filter((item) => TARGET_LANGUAGES.includes(item.language))
      .sort((a, b) => TARGET_LANGUAGES.indexOf(a.language) - TARGET_LANGUAGES.indexOf(b.language));
    summaryBySenseId.set(record.sense_id, translations);
    const english = translations.find((item) => item.language === "영어");
    englishDefBySenseId.set(record.sense_id, english?.definition || null);
  }

  return { summaryBySenseId, englishDefBySenseId };
}

function buildTopikStatsMap() {
  const linkagePath = path.join(linkageDir, "entry_topik_stats.json.gz");
  if (!existsSync(linkagePath)) {
    console.warn(`[runtime-search-recovery-core] missing optional topik stats linkage: ${linkagePath}`);
    return new Map();
  }
  const payload = readGzipJson(linkagePath);
  const statsByEntryId = new Map();
  for (const item of payload.matches || []) {
    statsByEntryId.set(String(item.entry_id), item.stats || {});
  }
  return statsByEntryId;
}

function buildChunkMap(entryIds, chunkSize = 500) {
  const chunkMap = new Map();
  for (let index = 0; index < entryIds.length; index += chunkSize) {
    const chunkId = `chunk-${String((index / chunkSize) + 1).padStart(4, "0")}`;
    for (const id of entryIds.slice(index, index + chunkSize)) {
      chunkMap.set(String(id), chunkId);
    }
  }
  return chunkMap;
}

function normalizeStats(rawStats = {}) {
  return {
    frequency: rawStats.frequency ?? null,
    rank: rawStats.rank ?? null,
    round_count: rawStats.round_count ?? null,
    band: rawStats.band ?? null,
    level: rawStats.level ?? "Unrated",
  };
}

function isSubjectNoneCategory(item = {}) {
  return item?.type === "주제 및 상황 범주" && item?.value === "없음";
}

function isSubjectNoneOnly(categories = []) {
  const normalizedCategories = Array.isArray(categories) ? categories : [];
  const hasSituationNone = normalizedCategories.some((item) => isSubjectNoneCategory(item));
  const hasMeaning = normalizedCategories.some((item) => item?.type === "의미 범주");
  return hasSituationNone && !hasMeaning;
}

function buildHierarchy(categories = []) {
  const normalizedCategories = Array.isArray(categories) ? categories : [];
  const firstSituation = normalizedCategories.find((item) => item?.type === "주제 및 상황 범주" && item?.value && item?.value !== "없음");
  if (firstSituation?.value) {
    return {
      system: "MM3",
      root: "주제 및 상황 범주",
      category: firstSituation.value,
      path_ko: `주제 및 상황 범주 > ${firstSituation.value}`,
      scene: "주제 및 상황 범주",
    };
  }

  const firstMeaning = normalizedCategories.find((item) => item?.type === "의미 범주");
  if (firstMeaning?.value) {
    return {
      system: "MM3",
      root: "의미 범주",
      category: firstMeaning.value,
      path_ko: `의미 범주 > ${firstMeaning.value}`,
      scene: "의미 범주",
    };
  }

  return {
    system: "MM3",
    root: "미분류",
    category: "미분류",
    path_ko: "미분류 > 미분류",
    scene: "미분류",
  };
}

export function buildRecoverableSearchRows() {
  const thin = readGzipJson(path.join(unifiedLiveDir, "kcenter_thin_index.json.gz"));
  const { summaryBySenseId, englishDefBySenseId } = buildTranslationMaps();
  const statsByEntryId = buildTopikStatsMap();
  const chunkMap = buildChunkMap(loadCanonicalRuntimeDetailIds());

  return (thin.entries || []).filter((item) => !isSubjectNoneOnly(item.entry?.categories || [])).map((item) => {
    const entry = item.entry || {};
    const representativeSenseId = item.representative_sense?.id || null;
    return {
      id: String(entry.id),
      word: entry.word || null,
      pos: Array.isArray(entry.pos) ? (entry.pos[0] || null) : null,
      pos_list: Array.isArray(entry.pos) ? entry.pos : [],
      word_grade: entry.word_grade || null,
      def_ko: item.representative_sense?.definition || null,
      def_en: representativeSenseId ? (englishDefBySenseId.get(representativeSenseId) || null) : null,
      hierarchy: buildHierarchy(entry.categories || []),
      surface: "mindmap_core",
      routing: "mindmap_core",
      stats: normalizeStats(statsByEntryId.get(String(entry.id)) || {}),
      chunk_id: chunkMap.get(String(entry.id)) || null,
      related_vocab: [],
      refs: {
        cross_links: [],
      },
      is_center_profile: false,
      roman: null,
      sense_count: item.sense_count ?? 0,
      has_subwords: Boolean(item.has_subwords),
      has_related_forms: Boolean(item.has_related_forms),
      representative_sense_id: representativeSenseId,
      translation_summary: representativeSenseId ? (summaryBySenseId.get(representativeSenseId) || []) : [],
      categories: entry.categories || [],
    };
  });
}

function comparableRuntimeRow(runtime) {
  return {
    id: String(runtime.id),
    word: runtime.word || null,
    pos: runtime.pos || null,
    pos_list: runtime.pos_list || [],
    word_grade: runtime.word_grade || null,
    def_ko: runtime.def_ko || null,
    def_en: runtime.def_en || null,
    hierarchy: runtime.hierarchy || null,
    surface: runtime.surface || null,
    routing: runtime.routing || null,
    stats: runtime.stats || {},
    chunk_id: runtime.chunk_id || null,
    related_vocab: runtime.related_vocab || [],
    refs: runtime.refs || { cross_links: [] },
    is_center_profile: Boolean(runtime.is_center_profile),
    roman: runtime.roman || null,
    sense_count: runtime.sense_count ?? 0,
    has_subwords: Boolean(runtime.has_subwords),
    has_related_forms: Boolean(runtime.has_related_forms),
    representative_sense_id: runtime.representative_sense_id || null,
    translation_summary: runtime.translation_summary || [],
    categories: runtime.categories || [],
  };
}

export function compareRuntimeRows(runtimeRows, recoveredRows) {
  const runtimeById = new Map(runtimeRows.map((row) => [String(row.id), row]));
  let matched = 0;
  let mismatched = 0;
  const samples = [];

  for (const recovered of recoveredRows) {
    const runtime = runtimeById.get(recovered.id);
    if (!runtime) {
      mismatched += 1;
      if (samples.length < 10) samples.push({ id: recovered.id, issue: "missing_runtime_row" });
      continue;
    }

    const comparable = comparableRuntimeRow(runtime);
    if (JSON.stringify(comparable) === JSON.stringify(recovered)) {
      matched += 1;
    } else {
      mismatched += 1;
      if (samples.length < 10) {
        samples.push({ id: recovered.id, runtime: comparable, recovered });
      }
    }
  }

  return { matched, mismatched, samples };
}
