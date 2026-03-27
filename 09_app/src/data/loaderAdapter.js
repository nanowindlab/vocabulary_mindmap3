// loaderAdapter.js  – V4 (2026-03-19)
// ★ Canonical Runtime: live/ (relation model replacement 승격 + 전체 패치 반영)
// 파일 기준:
//   APP_READY_SITUATIONS_TREE.json   → Array<item>  (상황과 장소)
//   APP_READY_EXPRESSIONS_TREE.json  → Array<item>  (마음과 표현)
//   APP_READY_BASICS_TREE.json       → Array<item>  (구조와 기초)
//   APP_READY_SEARCH_INDEX.json      → Array<item>  (8,094건+ 통합)
//
// cross_links: relation model 기준 (asymmetry_count=0), related_vocab 유지
// fully_unlinked=0 (PM 기준, non-control zero-cross 해소 완료)
//
// chunk 파일:
//   APP_READY_CHUNK_RICH_*           → {[termId]: {...}}
//   APP_READY_CHUNK_EXAMPLES_*       → { chunk_id, data: {[termId]: {...}} }
//
// NOTE: internal/, legacy/, archive/는 빌드/복구용. 앱 런타임은 live/만 사용.

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

// ── 3-축 분리 로더 (신규) ───────────────────────────────────────────────
export async function loadMeaningTree(options = {}) {
  return loadJsonPayload(
    `${LIVE_DIR}APP_READY_MEANING_TREE.json`,
    "Failed to load meaning tree",
    options.trace,
    { payload: "meaningTree", source: "live" },
  );
}

export async function loadSituationTree(options = {}) {
  return loadJsonPayload(
    `${LIVE_DIR}APP_READY_SITUATION_TREE.json`,
    "Failed to load situation tree",
    options.trace,
    { payload: "situationTree", source: "live" },
  );
}

export async function loadUnclassifiedTree(options = {}) {
  return loadJsonPayload(
    `${LIVE_DIR}APP_READY_UNCLASSIFIED_TREE.json`,
    "Failed to load unclassified tree",
    options.trace,
    { payload: "unclassifiedTree", source: "live" },
  );
}

export async function loadUnifiedSearchIndex(options = {}) {
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
