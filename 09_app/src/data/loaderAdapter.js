// loaderAdapter.js
// Runtime contract:
// - eager runtime payloads: APP_READY_MEANING_TREE_SHELL
// - background runtime payloads: APP_READY_MEANING_TREE, APP_READY_SEARCH_THIN_INDEX, APP_READY_FACETS, APP_READY_TRANSLATION_LANGUAGES
// - on-demand runtime payloads: APP_READY_CHUNK_RICH_*, APP_READY_CHUNK_EXAMPLES_*
// - APP_READY_DETAIL_MAP is no longer part of the normal runtime delivery contract;
//   it remains a debug-only fallback artifact during the demotion transition.
// - APP_READY_MEANING_TREE / SITUATION_TREE / UNCLASSIFIED_TREE are still generated
//   as build/validation artifacts, but the learner-facing app runtime no longer fetches them.
//
// NOTE:
// - internal/, legacy/, archive/ are build or recovery layers.
// - app runtime reads only live/ payloads.

const BASE_URL = import.meta.env.BASE_URL || "/";
const DATA_DIR = `${BASE_URL}data/`;
// ★ LIVE: 앱 canonical runtime 경로 (live/만 사용)
const LIVE_DIR = `${DATA_DIR}live/`;
const LEGACY_DIR = `${DATA_DIR}legacy/`;
let detailMapPromise = null;
const richChunkDataCache = new Map();
const richChunkPromiseCache = new Map();
const examplesChunkDataCache = new Map();
const examplesChunkPromiseCache = new Map();
let translationLanguageManifestPromise = null;
const translationOverlayDataCache = new Map();
const translationOverlayPromiseCache = new Map();

const now = () =>
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

async function loadJsonPayload(url, errorMessage, trace = null, meta = {}) {
  const fetchStartedAt = now();
  const resp = await fetch(url);
  const responseReceivedAt = now();

  if (!resp.ok) {
    const error = new Error(errorMessage);
    error.response = resp;
    throw error;
  }

  const parseStartedAt = now();
  const data = await resp.json();
  const parseEndedAt = now();

  trace?.({
    ...meta,
    url,
    fetchMs: responseReceivedAt - fetchStartedAt,
    parseMs: parseEndedAt - parseStartedAt,
    totalMs: parseEndedAt - fetchStartedAt,
    sizeBytes: Number(resp.headers.get("content-length")) || null,
  });

  return data;
}

async function loadChunkPayload(kind, chunkId, trace = null) {
  const payloadName = kind === "rich" ? "richChunk" : "examplesChunk";
  const dataCache = kind === "rich" ? richChunkDataCache : examplesChunkDataCache;
  const promiseCache = kind === "rich" ? richChunkPromiseCache : examplesChunkPromiseCache;
  const url = `${LIVE_DIR}APP_READY_CHUNK_${kind === "rich" ? "RICH" : "EXAMPLES"}_${chunkId}.json`;

  if (dataCache.has(chunkId)) {
    trace?.({
      payload: payloadName,
      source: "live",
      chunkId,
      cache: "memory",
      fetchMs: 0,
      parseMs: 0,
      totalMs: 0,
      sizeBytes: null,
      found: dataCache.get(chunkId) !== null,
      url,
    });
    return dataCache.get(chunkId);
  }

  if (promiseCache.has(chunkId)) {
    const waitStartedAt = now();
    const data = await promiseCache.get(chunkId);
    trace?.({
      payload: payloadName,
      source: "live",
      chunkId,
      cache: "inflight",
      fetchMs: 0,
      parseMs: 0,
      totalMs: now() - waitStartedAt,
      sizeBytes: null,
      found: data !== null,
      url,
    });
    return data;
  }

  const request = (async () => {
    const fetchStartedAt = now();
    const resp = await fetch(url);
    const responseReceivedAt = now();

    if (!resp.ok) {
      if (kind === "examples" && resp.status === 404) {
        trace?.({
          payload: payloadName,
          source: "live",
          chunkId,
          cache: "network",
          fetchMs: responseReceivedAt - fetchStartedAt,
          parseMs: 0,
          totalMs: responseReceivedAt - fetchStartedAt,
          sizeBytes: Number(resp.headers.get("content-length")) || null,
          found: false,
          url,
        });
        dataCache.set(chunkId, null);
        return null;
      }

      const error = new Error(`Failed to load ${payloadName}`);
      error.response = resp;
      throw error;
    }

    const parseStartedAt = now();
    const data = await resp.json();
    const parseEndedAt = now();

    trace?.({
      payload: payloadName,
      source: "live",
      chunkId,
      cache: "network",
      fetchMs: responseReceivedAt - fetchStartedAt,
      parseMs: parseEndedAt - parseStartedAt,
      totalMs: parseEndedAt - fetchStartedAt,
      sizeBytes: Number(resp.headers.get("content-length")) || null,
      found: true,
      url,
    });

    dataCache.set(chunkId, data);
    return data;
  })();

  promiseCache.set(chunkId, request);

  try {
    return await request;
  } finally {
    promiseCache.delete(chunkId);
  }
}

export async function loadUnifiedSearchIndex(options = {}) {
  try {
    return await loadJsonPayload(
      `${LIVE_DIR}APP_READY_SEARCH_THIN_INDEX.json`,
      "Failed to load thin unified search index",
      options.trace,
      { payload: "searchThinIndex", source: "live" },
    );
  } catch (thinError) {
    if (!thinError?.response) throw thinError;
  }

  try {
    return await loadJsonPayload(
      `${LIVE_DIR}APP_READY_SEARCH_INDEX.json`,
      "Failed to load unified search index",
      options.trace,
      { payload: "searchIndex", source: "live" },
    );
  } catch (error) {
    if (!error?.response) throw error;
    console.warn("[LIVE] Unified search index not found, falling back to legacy V1");
    return loadSearchIndex(options);
  }
}

export async function loadFacetPayload(options = {}) {
  try {
    return await loadJsonPayload(
      `${LIVE_DIR}APP_READY_FACETS.json`,
      "Failed to load facet payload",
      options.trace,
      { payload: "facetPayload", source: "live" },
    );
  } catch (error) {
    if (!error?.response) throw error;
    console.warn("[LIVE] Facet payload not found, falling back to null");
    return null;
  }
}

export async function loadTreeShellPayload(tabId, options = {}) {
  const fileName =
    tabId === "meaning"
      ? "APP_READY_MEANING_TREE_SHELL.json"
      : null;

  if (!fileName) return null;

  try {
    return await loadJsonPayload(
      `${LIVE_DIR}${fileName}`,
      `Failed to load ${tabId} tree shell payload`,
      options.trace,
      { payload: `${tabId}TreeShell`, source: "live" },
    );
  } catch (error) {
    if (!error?.response) throw error;
    console.warn(`[LIVE] ${tabId} tree shell payload not found, falling back to null`);
    return null;
  }
}

export async function loadProjectedTabPayload(tabId, options = {}) {
  const fileName =
    tabId === "meaning"
      ? "APP_READY_MEANING_TREE.json"
      : tabId === "situation"
        ? "APP_READY_SITUATION_TREE.json"
        : "APP_READY_UNCLASSIFIED_TREE.json";

  try {
    return await loadJsonPayload(
      `${LIVE_DIR}${fileName}`,
      `Failed to load ${tabId} payload`,
      options.trace,
      { payload: `${tabId}Tree`, source: "live" },
    );
  } catch (error) {
    if (!error?.response) throw error;
    console.warn(`[LIVE] ${tabId} payload not found, falling back to empty array`);
    return [];
  }
}

export async function loadTranslationLanguageManifest(options = {}) {
  if (!translationLanguageManifestPromise) {
    translationLanguageManifestPromise = loadJsonPayload(
      `${LIVE_DIR}APP_READY_TRANSLATION_LANGUAGES.json`,
      "Failed to load translation language manifest",
      options.trace,
      { payload: "translationLanguageManifest", source: "live" },
    );
  }
  return translationLanguageManifestPromise;
}

export async function loadTranslationOverlay(language, options = {}) {
  if (!language || language === "영어") return null;

  if (translationOverlayDataCache.has(language)) {
    return translationOverlayDataCache.get(language);
  }

  if (translationOverlayPromiseCache.has(language)) {
    return translationOverlayPromiseCache.get(language);
  }

  const request = (async () => {
    const manifest = await loadTranslationLanguageManifest(options);
    const entry = (manifest?.languages || []).find((candidate) => candidate.language === language);
    if (!entry?.file) {
      translationOverlayDataCache.set(language, null);
      return null;
    }

    const payload = await loadJsonPayload(
      `${LIVE_DIR}${entry.file}`,
      `Failed to load translation overlay for ${language}`,
      options.trace,
      { payload: "translationOverlay", source: "live", language },
    );

    translationOverlayDataCache.set(language, payload);
    return payload;
  })();

  translationOverlayPromiseCache.set(language, request);

  try {
    return await request;
  } finally {
    translationOverlayPromiseCache.delete(language);
  }
}

async function loadDetailMap() {
  if (!detailMapPromise) {
    detailMapPromise = fetch(`${LIVE_DIR}APP_READY_DETAIL_MAP.json`)
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to load detail map");
        return resp.json();
      });
  }
  return detailMapPromise;
}

export async function loadEntryDetail(entryId) {
  if (!entryId) return null;
  const payload = await loadDetailMap();
  return payload?.entries?.[entryId] || null;
}

// ── 레거시 호환 로더 ───────────────────────────────────────────────────
export async function loadCoreManifest() {
  const resp = await fetch(`${LEGACY_DIR}APP_READY_CORE_TREE_V1.json`);
  if (!resp.ok) throw new Error("Failed to load core manifest");
  return await resp.json();
}

export async function loadMetaManifest() {
  const resp = await fetch(`${LEGACY_DIR}APP_READY_META_TREE_V1.json`);
  if (!resp.ok) throw new Error("Failed to load meta manifest");
  return await resp.json();
}

export async function loadExpressionManifest() {
  const resp = await fetch(`${LEGACY_DIR}APP_READY_EXPRESSION_TREE_V1.json`);
  if (!resp.ok) throw new Error("Failed to load expression manifest");
  return await resp.json();
}

export async function loadEnglishMapping() {
  try {
    // ENGLISH_MAPPING은 live/ 미포함 → fallback null
    const resp = await fetch(`${LIVE_DIR}ENGLISH_MAPPING_INVENTORY_V1.json`);
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

export async function loadSearchIndex(options = {}) {
  try {
    return await loadJsonPayload(
      `${LEGACY_DIR}APP_READY_SEARCH_INDEX_V1.json`,
      "Failed to load legacy search index",
      options.trace,
      { payload: "searchIndex", source: "legacy" },
    );
  } catch (error) {
    if (!error?.response) throw error;
    console.warn("Search index not found, falling back to empty array");
    return [];
  }
}

/**
 * 단어 상세 데이터를 RICH chunk + EXAMPLES chunk 에서 합산하여 반환한다.
 */
export async function loadTermDetailChunk(termId, chunkId, options = {}) {
  if (!termId || !chunkId) return null;

  const [richData, examplesData] = await Promise.all([
    loadChunkPayload("rich", chunkId, options.trace),
    loadChunkPayload("examples", chunkId, options.trace),
  ]);

  const richEntry = richData?.[termId] || null;
  const examplesEntry = (examplesData?.data || {})[termId] || null;

  if (!richEntry && !examplesEntry) return null;

  let examples_bundle = [];
  if (examplesEntry?.attested_sentences) {
    examples_bundle = examplesEntry.attested_sentences
      .filter((s) => s.ko && s.ko.length > 5)
      .map((s) => ({
        text_ko: s.ko,
        text_en: s.en || null,
        source: s.round ? `TOPIK ${s.round}` : (s.source_label || s.category || s.type || null),
      }));
  }

  return {
    ...(richEntry || {}),
    related_vocab:
      richEntry?.related_vocab || examplesEntry?.related_vocab || [],
    examples_bundle,
    phonetic_romanization:
      examplesEntry?.phonetic_romanization ||
      richEntry?.phonetic_romanization ||
      null,
  };
}
