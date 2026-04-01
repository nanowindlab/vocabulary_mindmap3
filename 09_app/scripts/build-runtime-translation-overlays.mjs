import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import {
  DEFAULT_TRANSLATION_LANGUAGE,
  TARGET_TRANSLATION_LANGUAGES,
  getTranslationOverlayFileName,
  getTranslationLanguageSlug,
} from "../src/utils/translationPayloads.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");
const liveDir = path.join(appRoot, "public", "data", "live");
const unifiedLiveDir = path.join(repoRoot, "vocab_dictionary", "output", "unified_live");

function readGzipJson(filePath) {
  return JSON.parse(gunzipSync(readFileSync(filePath)));
}

function writeJsonAtomic(filePath, payload) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  renameSync(tempPath, filePath);
}

function normalizeTranslation(item = {}) {
  return {
    language: item.language || null,
    word: item.word || null,
    definition: item.definition || null,
  };
}

function buildTranslationIndex() {
  const translationsPayload = readGzipJson(path.join(unifiedLiveDir, "kcenter_translations.json.gz"));
  const thinIndexPayload = readGzipJson(path.join(unifiedLiveDir, "kcenter_thin_index.json.gz"));

  const translationsBySenseId = new Map();
  for (const record of translationsPayload.records || []) {
    translationsBySenseId.set(
      record.sense_id,
      (record.translations || []).map(normalizeTranslation),
    );
  }

  const entryTranslationsByLanguage = new Map();
  const languageEntryCounts = new Map();

  for (const language of TARGET_TRANSLATION_LANGUAGES) {
    if (language === DEFAULT_TRANSLATION_LANGUAGE) continue;
    entryTranslationsByLanguage.set(language, {});
    languageEntryCounts.set(language, 0);
  }

  for (const item of thinIndexPayload.entries || []) {
    const entryId = String(item?.entry?.id || "");
    const representativeSenseId = item?.representative_sense?.id || null;
    if (!entryId || !representativeSenseId) continue;

    const translations = translationsBySenseId.get(representativeSenseId) || [];
    for (const language of TARGET_TRANSLATION_LANGUAGES) {
      if (language === DEFAULT_TRANSLATION_LANGUAGE) continue;
      const translation = translations.find((candidate) => candidate.language === language);
      if (!translation) continue;
      entryTranslationsByLanguage.get(language)[entryId] = translation;
      languageEntryCounts.set(language, (languageEntryCounts.get(language) || 0) + 1);
    }
  }

  return {
    entryTranslationsByLanguage,
    languageEntryCounts,
  };
}

export function buildRuntimeTranslationOverlays() {
  const { entryTranslationsByLanguage, languageEntryCounts } = buildTranslationIndex();

  const manifest = {
    version: "v1",
    generated_at: new Date().toISOString(),
    default_language: DEFAULT_TRANSLATION_LANGUAGE,
    languages: TARGET_TRANSLATION_LANGUAGES.map((language) => ({
      language,
      slug: getTranslationLanguageSlug(language),
      entry_count:
        language === DEFAULT_TRANSLATION_LANGUAGE
          ? null
          : languageEntryCounts.get(language) || 0,
      file:
        language === DEFAULT_TRANSLATION_LANGUAGE
          ? null
          : getTranslationOverlayFileName(language),
    })),
  };

  writeJsonAtomic(path.join(liveDir, "APP_READY_TRANSLATION_LANGUAGES.json"), manifest);

  for (const language of TARGET_TRANSLATION_LANGUAGES) {
    if (language === DEFAULT_TRANSLATION_LANGUAGE) continue;
    const fileName = getTranslationOverlayFileName(language);
    writeJsonAtomic(path.join(liveDir, fileName), {
      version: "v1",
      generated_at: manifest.generated_at,
      language,
      slug: getTranslationLanguageSlug(language),
      entry_translations: entryTranslationsByLanguage.get(language) || {},
    });
  }

  console.log(
    JSON.stringify(
      {
        status: "ok",
        generated_at: manifest.generated_at,
        languages: manifest.languages,
      },
      null,
      2,
    ),
  );
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectRun) {
  buildRuntimeTranslationOverlays();
}
