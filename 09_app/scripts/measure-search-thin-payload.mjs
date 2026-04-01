import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const liveDir = path.join(appRoot, "public", "data", "live");

const FULL_FILE = path.join(liveDir, "APP_READY_SEARCH_INDEX.json");
const THIN_FILE = path.join(liveDir, "APP_READY_SEARCH_THIN_INDEX.json");
const SAMPLE_QUERIES = ["요리하다", "보다", "가게", "cook"];
const SEARCH_RESULT_LIMIT = 10;

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function normalizeText(value) {
  return (value || "").toLowerCase().trim();
}

function hasHangul(value) {
  return /[가-힣]/.test(value);
}

function getForeignSearchRank(item, queryLower) {
  const word = normalizeText(item.word);
  const defEn = normalizeText(item.def_en);
  const translationTexts = (item.translation_summary || [])
    .map((translation) => normalizeText(translation.word))
    .filter(Boolean);

  if (translationTexts.includes(queryLower)) {
    return {
      stage: 0,
      tieBreaker: translationTexts.findIndex((translation) => translation === queryLower),
      wordLength: word.length,
    };
  }

  if (translationTexts.some((translation) => translation.startsWith(queryLower))) {
    return {
      stage: 1,
      tieBreaker: translationTexts.findIndex((translation) => translation.startsWith(queryLower)),
      wordLength: word.length,
    };
  }

  if (translationTexts.some((translation) => translation.includes(queryLower))) {
    return {
      stage: 2,
      tieBreaker: translationTexts.findIndex((translation) => translation.includes(queryLower)),
      wordLength: word.length,
    };
  }

  if (defEn === queryLower) {
    return { stage: 3, tieBreaker: 0, wordLength: word.length };
  }

  if (defEn.startsWith(queryLower)) {
    return { stage: 4, tieBreaker: 0, wordLength: word.length };
  }

  if (queryLower.length > 3 && defEn.includes(queryLower)) {
    return {
      stage: 5,
      tieBreaker: defEn.indexOf(queryLower),
      wordLength: word.length,
    };
  }

  return null;
}

function getKoreanSearchRank(item, queryLower) {
  const word = normalizeText(item.word);
  const defKo = normalizeText(item.def_ko);
  const defEn = normalizeText(item.def_en);

  if (word === queryLower) return { stage: 0, wordLength: word.length };
  if (word.startsWith(queryLower)) return { stage: 1, wordLength: word.length };
  if (word.includes(queryLower)) return { stage: 2, wordLength: word.length };
  if (defKo.includes(queryLower)) return { stage: 3, wordLength: word.length };
  if (defEn.includes(queryLower)) return { stage: 4, wordLength: word.length };
  return null;
}

function compareRank(a, b) {
  if (a.stage !== b.stage) return a.stage - b.stage;

  if ((a.tieBreaker ?? Number.MAX_SAFE_INTEGER) !== (b.tieBreaker ?? Number.MAX_SAFE_INTEGER)) {
    return (a.tieBreaker ?? Number.MAX_SAFE_INTEGER) - (b.tieBreaker ?? Number.MAX_SAFE_INTEGER);
  }

  return a.wordLength - b.wordLength;
}

function collectTopMatches(searchIndex, rawQuery) {
  const queryLower = normalizeText(rawQuery);
  if (!queryLower) return [];

  const koreanQuery = hasHangul(rawQuery);
  const topRanked = [];

  for (const item of searchIndex) {
    const rank = koreanQuery
      ? getKoreanSearchRank(item, queryLower)
      : getForeignSearchRank(item, queryLower);

    if (!rank) continue;

    let insertAt = topRanked.findIndex((current) => compareRank(rank, current.rank) < 0);
    if (insertAt === -1) insertAt = topRanked.length;
    if (insertAt >= SEARCH_RESULT_LIMIT) continue;

    topRanked.splice(insertAt, 0, { item, rank });
    if (topRanked.length > SEARCH_RESULT_LIMIT) {
      topRanked.length = SEARCH_RESULT_LIMIT;
    }
  }

  return topRanked.map(({ item }) => item.word || null);
}

function benchmark(searchIndex) {
  const startedAt = process.hrtime.bigint();
  for (const query of SAMPLE_QUERIES) {
    collectTopMatches(searchIndex, query);
  }
  return Number(process.hrtime.bigint() - startedAt) / 1e6;
}

function main() {
  const fullRows = readJson(FULL_FILE);
  const thinRows = readJson(THIN_FILE);
  const fullBytes = statSync(FULL_FILE).size;
  const thinBytes = statSync(THIN_FILE).size;

  console.log(JSON.stringify({
    fullBytes,
    thinBytes,
    savedBytes: fullBytes - thinBytes,
    savedPct: Number((((fullBytes - thinBytes) / fullBytes) * 100).toFixed(2)),
    fullRows: fullRows.length,
    thinRows: thinRows.length,
    benchMs: {
      full: Number(benchmark(fullRows).toFixed(2)),
      thin: Number(benchmark(thinRows).toFixed(2)),
    },
    queryTop1: Object.fromEntries(SAMPLE_QUERIES.map((query) => [
      query,
      {
        full: collectTopMatches(fullRows, query)[0] || null,
        thin: collectTopMatches(thinRows, query)[0] || null,
      },
    ])),
  }, null, 2));
}

main();
