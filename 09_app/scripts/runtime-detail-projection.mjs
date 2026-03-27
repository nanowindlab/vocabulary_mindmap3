import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

const canonicalBasePath = path.join(repoRoot, "vocab_dictionary", "output", "unified_live", "kcenter_base.json.gz");

function readGzipJson(filePath) {
  return JSON.parse(gunzipSync(readFileSync(filePath)));
}

function projectSense(sense = {}) {
  return {
    id: sense.id || null,
    definition: sense.definition || null,
    reference: sense.reference || null,
    syntactic_patterns: sense.syntactic_patterns || [],
    translations: sense.translations || [],
    related_terms: sense.related_terms || [],
    examples: sense.examples || [],
  };
}

function projectSubwordSense(sense = {}) {
  return {
    definition: sense.definition || null,
    translations: sense.translations || [],
    examples: sense.examples || [],
  };
}

function projectSubword(subword = {}) {
  return {
    text: subword.text || null,
    unit: subword.unit || null,
    senses: (subword.senses || []).map(projectSubwordSense),
  };
}

export function projectCanonicalEntryToRuntimeDetail(entry = {}) {
  return {
    id: entry.id || null,
    word: entry.word || null,
    pos: entry.pos || [],
    word_grade: entry.word_grade || null,
    categories: entry.categories || [],
    pronunciation: entry.pronunciation || [],
    original_language: entry.original_language || null,
    related_forms: entry.related_forms || [],
    senses: (entry.senses || []).map(projectSense),
    subwords: (entry.subwords || []).map(projectSubword),
  };
}

export function loadCanonicalRuntimeDetailEntries() {
  const payload = readGzipJson(canonicalBasePath);
  return (payload.entries || []).map((wrapper) => {
    const entry = wrapper.entry || {};
    return {
      id: String(entry.id),
      detail: projectCanonicalEntryToRuntimeDetail(entry),
    };
  });
}

export function loadCanonicalRuntimeDetailIds() {
  return loadCanonicalRuntimeDetailEntries().map((item) => item.id);
}
