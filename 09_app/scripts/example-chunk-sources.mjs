import { createReadStream, readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(appRoot, "..");
const vm2Root = path.resolve(projectRoot, "..", "vocabulary_mindmap2");

const LINKAGE_PATH = path.join(
  projectRoot,
  "vocab_dictionary",
  "output",
  "topik_stats_linkage",
  "entry_topik_stats.json.gz",
);
const WORD_OCCURRENCES_PATH = path.join(
  vm2Root,
  "05_source",
  "extracted_corpus",
  "snapshot_20260309",
  "Word_Occurrences.jsonl",
);

function loadLinkageMap() {
  const raw = gunzipSync(readFileSync(LINKAGE_PATH));
  const payload = JSON.parse(raw.toString("utf-8"));
  const mapping = new Map();
  for (const item of payload.matches || []) {
    if (!item?.entry_id || !item?.matched_term_id) continue;
    mapping.set(String(item.entry_id), String(item.matched_term_id));
  }
  return mapping;
}

export async function loadTopikSentenceMap() {
  const linkageMap = loadLinkageMap();
  const meaningSentenceMap = new Map();

  const rl = readline.createInterface({
    input: createReadStream(WORD_OCCURRENCES_PATH, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line) continue;
    const row = JSON.parse(line);
    if (row?.source_type !== "TOPIK기출") continue;
    if (!row?.meaning_id) continue;
    const sentence = typeof row.source_sentence === "string" ? row.source_sentence.trim() : "";
    if (sentence.length < 8) continue;

    const current = meaningSentenceMap.get(row.meaning_id) || [];
    if (current.some((item) => item.ko === sentence)) continue;

    current.push({
      ko: sentence,
      en: null,
      round: row.round || null,
      source_label: row.source_id || "TOPIK기출",
    });
    meaningSentenceMap.set(row.meaning_id, current);
  }

  const entrySentenceMap = new Map();
  for (const [entryId, meaningId] of linkageMap.entries()) {
    const items = meaningSentenceMap.get(meaningId);
    if (!items?.length) continue;
    entrySentenceMap.set(entryId, items);
  }
  return entrySentenceMap;
}

export function collectDictionaryExamples(entry) {
  const seen = new Set();
  const items = [];

  for (const sense of entry?.senses || []) {
    for (const example of sense?.examples || []) {
      const sourceLabel = example?.type || null;
      for (const text of example?.texts || []) {
        const normalized = typeof text === "string" ? text.trim() : "";
        if (!normalized || seen.has(normalized)) continue;
        seen.add(normalized);
        items.push({
          ko: normalized,
          en: null,
          round: null,
          source_label: sourceLabel,
        });
      }
    }
  }

  return items;
}

export function buildExampleEntry(entry, context = {}) {
  const topikSentences = context.topikSentenceMap?.get(String(entry?.id)) || [];
  const dictionaryExamples = collectDictionaryExamples(entry);
  const payload = {};
  const merged = [];
  const seen = new Set();

  for (const item of [...topikSentences, ...dictionaryExamples]) {
    const key = item?.ko?.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  if (merged.length > 0) {
    payload.attested_sentences = merged;
  }
  if ((entry?.related_vocab || []).length > 0) {
    payload.related_vocab = entry.related_vocab;
  }
  const phonetic = entry?.phonetic_romanization || entry?.pronunciation?.[0]?.text || null;
  if (phonetic) {
    payload.phonetic_romanization = phonetic;
  }
  return payload;
}
