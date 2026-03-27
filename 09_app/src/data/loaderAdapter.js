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
let examplesChunkAvailability = null;

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
export async function loadTermDetailChunk(termId, chunkId) {
  if (!termId || !chunkId) return null;

  const richResp = await fetch(`${LIVE_DIR}APP_READY_CHUNK_RICH_${chunkId}.json`);
  let examplesResp = null;

  if (examplesChunkAvailability !== false) {
    const candidate = await fetch(`${LIVE_DIR}APP_READY_CHUNK_EXAMPLES_${chunkId}.json`);
    if (candidate.ok) {
      examplesChunkAvailability = true;
      examplesResp = candidate;
    } else {
      examplesChunkAvailability = false;
    }
  }

  let richEntry = null;
  let examplesEntry = null;

  if (richResp.ok) {
    try {
      const richData = await richResp.json();
      richEntry = richData[termId] || null;
    } catch (e) {
      console.warn("[loaderAdapter] RICH chunk parse error:", e);
    }
  }

  if (examplesResp?.ok) {
    try {
      const exData = await examplesResp.json();
      examplesEntry = (exData.data || {})[termId] || null;
    } catch (e) {
      console.warn("[loaderAdapter] EXAMPLES chunk parse error:", e);
    }
  }

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
