import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Network, Loader, Book,
  Map as MapIcon, LayoutList, X, Filter, ChevronDown,
} from "lucide-react";

import { SidebarTree } from "./components/SidebarTree";
import { TermDetail } from "./components/TermDetail";
import { SearchBox } from "./components/SearchBox";
import { MindmapCanvas } from "./components/MindmapCanvas";
import { StatusPanel } from "./components/StatusPanel";
import {
  loadUnifiedSearchIndex,
  loadFacetPayload,
  loadEntryDetail,
  loadTermDetailChunk,
} from "./data/loaderAdapter";
import {
  normalizeHierarchyForDisplay,
  toPosLabel,
} from "./utils/hierarchyDisplay";
import { buildProjectedTabPayloads } from "./utils/tabProjection";

import "./index.css";

// ── 3-축 탭 정의 ────────────────────────────────────────────────
const ALL_TABS = [
  { id: "meaning", label: "의미 범주", label_en: "Meaning Categories", color: "#58a6ff" },
  { id: "situation", label: "주제 및 상황", label_en: "Topic & Situation",  color: "#3fb950" },
  { id: "unclassified", label: "분류 밖 항목", label_en: "Unclassified",  color: "#bc8cff" },
];

const NAV_TABS = ALL_TABS.filter((tab) => tab.id !== "unclassified");

const TAB_SUMMARIES = {
  meaning: "뜻과 관계를 중심으로 비교하며 탐색합니다.",
  situation: "장면과 맥락을 따라 실제 쓰임을 확인합니다.",
  unclassified: "fallback surface에서 품사와 난이도 축으로 정리해 봅니다.",
};

const BAND_FILTER_LABELS = {
  1: "최상위 필수",
  2: "핵심 중요",
  3: "일반 활용",
  4: "보조 표현",
  5: "심화 어휘",
};

const INITIAL_LOAD_PERF_QUERY_KEY = "mm3Perf";
const INITIAL_LOAD_PERF_STORAGE_KEY = "MM3_PERF_DEBUG";
const DETAIL_FALLBACK_QUERY_KEY = "mm3DetailFallback";
const DETAIL_FALLBACK_STORAGE_KEY = "MM3_DETAIL_FALLBACK_DEBUG";
const INTERACTION_PERF_HISTORY_LIMIT = 30;

const perfNow = () =>
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

function hasLoadedDetailPayload(detail) {
  if (!detail) return false;
  return Boolean(
    (Array.isArray(detail.senses) && detail.senses.length > 0) ||
    (Array.isArray(detail.related_forms) && detail.related_forms.length > 0) ||
    (Array.isArray(detail.subwords) && detail.subwords.length > 0) ||
    (Array.isArray(detail.examples_bundle) && detail.examples_bundle.length > 0),
  );
}

function isInitialLoadPerfConsoleEnabled() {
  if (typeof window === "undefined") return import.meta.env.DEV;
  if (import.meta.env.DEV) return true;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get(INITIAL_LOAD_PERF_QUERY_KEY) === "1") return true;
    return window.localStorage?.getItem(INITIAL_LOAD_PERF_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function isDetailFallbackDebugEnabled() {
  if (typeof window === "undefined") return import.meta.env.DEV;
  if (import.meta.env.DEV) return true;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get(DETAIL_FALLBACK_QUERY_KEY) === "1") return true;
    return window.localStorage?.getItem(DETAIL_FALLBACK_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function publishInitialLoadPerfSnapshot(snapshot) {
  if (typeof window !== "undefined") {
    window.__MM3_INITIAL_LOAD_PERF__ = snapshot;
  }

  if (!isInitialLoadPerfConsoleEnabled()) return;

  const payloadTable = (snapshot.payloads || []).map((entry) => ({
    payload: entry.payload,
    source: entry.source,
    fetch_ms: Number(entry.fetchMs?.toFixed(1) || 0),
    parse_ms: Number(entry.parseMs?.toFixed(1) || 0),
    total_ms: Number(entry.totalMs?.toFixed(1) || 0),
    size_mb: entry.sizeBytes ? Number((entry.sizeBytes / (1024 * 1024)).toFixed(2)) : null,
  }));

  const stageTable = [
    { stage: "payloads_ready", ms: snapshot.milestones?.payloadsReadyMs ?? null },
    { stage: "search_index_map", ms: snapshot.normalize?.searchIndexMapMs ?? null },
    { stage: "meaning_normalize", ms: snapshot.normalize?.meaningTreeMs ?? null },
    { stage: "state_queued", ms: snapshot.milestones?.stateQueuedMs ?? null },
    { stage: "first_stable_render", ms: snapshot.milestones?.firstStableRenderMs ?? null },
  ].filter((entry) => Number.isFinite(entry.ms))
    .map((entry) => ({ ...entry, ms: Number(entry.ms.toFixed(1)) }));
  const deferredTable = Object.entries(snapshot.deferredTabs || {}).map(([tab, entry]) => ({
    tab,
    normalize_ms: Number(entry.normalizeMs?.toFixed(1) || 0),
    ready_ms: Number(entry.readyMs?.toFixed(1) || 0),
    rows: entry.rows ?? null,
  }));

  const totalMs = snapshot.milestones?.firstStableRenderMs ?? snapshot.milestones?.stateQueuedMs ?? 0;

  console.groupCollapsed(`[MM3] Initial load ${totalMs.toFixed(1)}ms`);
  if (payloadTable.length > 0) console.table(payloadTable);
  if (stageTable.length > 0) console.table(stageTable);
  if (deferredTable.length > 0) console.table(deferredTable);
  console.log("rows", snapshot.rows);
  console.log("enable", {
    query: `?${INITIAL_LOAD_PERF_QUERY_KEY}=1`,
    localStorage: `${INITIAL_LOAD_PERF_STORAGE_KEY}=1`,
  });
  console.groupEnd();
}

function publishRuntimeInteractionPerfSnapshot(snapshot) {
  if (typeof window !== "undefined") {
    window.__MM3_RUNTIME_INTERACTION_PERF__ = snapshot;
  }

  if (!isInitialLoadPerfConsoleEnabled()) return;

  const latestTabLoad = snapshot.tabLoads?.[snapshot.tabLoads.length - 1] || null;
  const latestDetailSelection = snapshot.detailSelections?.[snapshot.detailSelections.length - 1] || null;
  const latestCategoryExpansion = snapshot.categoryExpansions?.[snapshot.categoryExpansions.length - 1] || null;

  console.groupCollapsed("[MM3] Runtime interaction probe");
  if (latestTabLoad) console.log("tabLoad", latestTabLoad);
  if (latestDetailSelection) console.log("detailSelection", latestDetailSelection);
  if (latestCategoryExpansion) console.log("categoryExpansion", latestCategoryExpansion);
  console.groupEnd();
}

// ── 데이터 정규화 ────────────────────────────────────────────────
function normalizeItem(item, surface, idxMap = null) {
  const hier = item.hierarchy || {};
  const normalizedHierarchy = normalizeHierarchyForDisplay({
    hierarchy: hier,
    pos: item.pos || item.part_of_speech || "품사 없음",
    wordGrade: item.word_grade || "없음",
  });

  // 방어 로직: Null/Undefined 방지 및 배열 필터링
  let related_vocab = Array.isArray(item.related_vocab) ? item.related_vocab.filter(Boolean) : [];
  let refs = item.refs && typeof item.refs === "object" ? item.refs : {};
  let cross_links = Array.isArray(refs.cross_links) ? refs.cross_links.filter(c => c && (c.target_id || c.target_term)) : [];

  // 검색 인덱스(idxMap) 존재 시, 양방향으로 빌드된 데이터(연관어 등) 병합 처리
  if (idxMap && item.id && idxMap.has(item.id)) {
    const idxEntry = idxMap.get(item.id);
    if (related_vocab.length === 0 && Array.isArray(idxEntry.related_vocab)) {
      related_vocab = idxEntry.related_vocab.filter(Boolean);
    }
    if (cross_links.length === 0 && idxEntry.refs && Array.isArray(idxEntry.refs.cross_links)) {
      cross_links = idxEntry.refs.cross_links.filter(c => c && (c.target_id || c.target_term));
    }
  }

  return {
    ...item,
    def_ko: item.def_ko || item.def_kr || "",
    phonetic_romanization: item.phonetic_romanization || item.roman || "",
    surface: surface || item.surface || "mindmap_core",
    routing: item.routing || surface || "mindmap_core",
    related_vocab,
    refs: {
      ...refs,
      cross_links,
    },
    hierarchy: normalizedHierarchy,
  };
}

function formatTreeLabel(contextMode, nodeType, rawLabel) {
  if (contextMode === "unclassified") {
    if (nodeType === "root") return "분류 밖 항목";
    if (nodeType === "scene") return rawLabel === "없음" ? "학습난이도 미기재" : `학습난이도 · ${rawLabel}`;
    if (nodeType === "category") {
      if (rawLabel === "품사 없음" || rawLabel === "미분류") return "품사 미기재";
      return `품사 · ${rawLabel}`;
    }
  }

  if (contextMode === "situation") {
    if (nodeType === "scene" && rawLabel === "없음") return "상황 미지정";
    if (nodeType === "category" && rawLabel === "없음") return "일반 어휘";
  }

  return rawLabel;
}

function isDisplayNormalized(item) {
  return !!(
    item?.surface &&
    item?.hierarchy?.display_root_label &&
    item?.hierarchy?.display_path_ko
  );
}

// ── 트리 빌더 ────────────────────────────────────────────────────
function buildTreeFromList(list, surface, contextMode) {
  const tree = {};
  if (!Array.isArray(list)) return tree;
  list.forEach((rawItem) => {
    const item = isDisplayNormalized(rawItem) ? rawItem : normalizeItem(rawItem, surface);
    const rootId    = item.hierarchy?.root_id;
    const centerId  = item.hierarchy?.display_scene || item.hierarchy?.scene || "일반";
    const categoryId= item.hierarchy?.display_category || item.hierarchy?.category || item.pos || "기타";
    const rootLabel = item.hierarchy?.display_root_label || formatTreeLabel(contextMode, "root", item.hierarchy.root_label || rootId);
    const sceneLabel = item.hierarchy?.display_scene || formatTreeLabel(contextMode, "scene", centerId);
    const categoryLabel = item.hierarchy?.display_category || formatTreeLabel(contextMode, "category", categoryId);

    if (!rootId) return;
    if (!tree[rootId])
      tree[rootId] = { id: rootId, type: "root", label: rootLabel, label_en: item.hierarchy.root_en, children: {} };
    if (!tree[rootId].children[centerId])
      tree[rootId].children[centerId] = { id: centerId, type: "scene", rootId, label: sceneLabel, children: {} };
    if (!tree[rootId].children[centerId].children[categoryId])
      tree[rootId].children[centerId].children[categoryId] = { id: categoryId, type: "category", rootId, sceneId: centerId, label: categoryLabel, children: {}, termCount: 0 };
    if (!item.is_center_profile) {
      tree[rootId].children[centerId].children[categoryId].children[item.id] = { id: item.id, type: "term", label: item.word, data: item };
      tree[rootId].children[centerId].children[categoryId].termCount += 1;
    }
  });
  return tree;
}

function matchesTreeNode(item, node) {
  if (!item || !node || node.type === "term") return true;

  const hierarchy = item.hierarchy || {};
  const itemRootId = hierarchy.root_id || null;
  const itemSceneId = hierarchy.display_scene || hierarchy.scene || "일반";
  const itemCategoryId = hierarchy.display_category || hierarchy.category || item.pos || "기타";

  if (node.type === "root") {
    return itemRootId === node.id;
  }

  if (node.type === "scene") {
    return (!node.rootId || itemRootId === node.rootId) && itemSceneId === node.id;
  }

  if (node.type === "category") {
    return (
      (!node.rootId || itemRootId === node.rootId) &&
      (!node.sceneId || itemSceneId === node.sceneId) &&
      itemCategoryId === node.id
    );
  }

  return true;
}

// ── 필터 함수 ────────────────────────────────────────────────────
function applyFilters(list, filters) {
  let result = list;
  if (filters.bands.length > 0) {
    result = result.filter((t) => {
      const b = t.stats?.band ?? null;
      return filters.bands.includes(b);
    });
  }
  if (filters.poses && filters.poses.length > 0) {
    result = result.filter((t) => {
      const p = t.pos || t.part_of_speech || "미분류";
      // 선택된 품사 배열 중 하나라도 항목의 품사 문자열에 포함되면 통과
      return filters.poses.some((posFilter) => p.includes(posFilter));
    });
  }
  if (filters.grades && filters.grades.length > 0) {
    result = result.filter((t) => filters.grades.includes(t.word_grade || "없음"));
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter((t) =>
      t.word?.includes(filters.query) ||
      t.def_ko?.includes(filters.query) ||
      t.def_en?.toLowerCase().includes(q)
    );
  }
  return result;
}

// ── 공통 컴포넌트: 드롭다운 필터 ──────────────────────────────────
const DropdownFilter = ({ label, options, selectedValues, onToggle, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSelection = selectedValues.length > 0;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className="filter-trigger-button"
        data-testid={`filter-toggle-${label}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer",
          background: hasSelection ? "rgba(88,166,255,0.12)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${hasSelection ? "rgba(88,166,255,0.24)" : "rgba(255,255,255,0.06)"}`,
          color: hasSelection ? "var(--accent-blue)" : "var(--text-secondary)",
          transition: "all 0.15s"
        }}
      >
        {label}
        {hasSelection && (
          <span style={{ background: "var(--accent-blue)", color: "#081018", padding: "2px 7px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
            {selectedValues.length}
          </span>
        )}
        <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {isOpen && (
        <div className="filter-dropdown-panel" style={{
          position: "absolute", top: "100%", left: 0, marginTop: 8,
          background: "rgba(9,16,24,0.96)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: "10px", display: "flex", flexDirection: "column", gap: 6,
          minWidth: 220, zIndex: 100, boxShadow: "0 18px 36px rgba(0,0,0,0.32)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 4px 6px" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 2 }}>
                Filter
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                {label}
              </div>
            </div>
            <div style={{ fontSize: 11, color: hasSelection ? "var(--accent-blue)" : "var(--text-muted)" }}>
              {hasSelection ? `${selectedValues.length} 선택` : "전체"}
            </div>
          </div>
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <button
                type="button"
                key={opt.value}
                data-testid={`filter-option-${label}-${String(opt.value)}`}
                onClick={() => onToggle(opt.value)}
                className="filter-option-row"
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10,
                  fontSize: 12, cursor: "pointer", transition: "background 0.1s, border-color 0.1s",
                  background: isSelected ? "rgba(88,166,255,0.10)" : "rgba(255,255,255,0.02)",
                  color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  border: `1px solid ${isSelected ? "rgba(88,166,255,0.22)" : "rgba(255,255,255,0.04)"}`,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 5,
                    border: `1px solid ${isSelected ? "rgba(88,166,255,0.28)" : "rgba(255,255,255,0.08)"}`,
                    background: isSelected ? "rgba(88,166,255,0.16)" : "transparent",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: isSelected ? "var(--accent-blue)" : "transparent",
                    }}
                  />
                </span>
                <span style={{ flex: 1 }}>{opt.label}</span>
                {opt.colorDot && (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: opt.colorDot }} />
                )}
              </button>
            );
          })}
          {hasSelection && (
            <div style={{ marginTop: 4, paddingTop: 6, borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
              <button
                type="button"
                onClick={onClear}
                style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "6px 8px" }}
              >
                초기화
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
// ── 메인 앱 ─────────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState("meaning");
  const [viewMode, setViewMode] = useState("mindmap");

  const [searchIndex, setSearchIndex] = useState([]);
  const [facetPayload, setFacetPayload] = useState(null);

  const [selectedTermId, setSelectedTermId] = useState(null);
  const [selectedTermDetail, setSelectedTermDetail] = useState(null);
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [isLoadingChunk, setIsLoadingChunk] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [tabLoadState, setTabLoadState] = useState({
    meaning: "loading",
    situation: "loading",
    unclassified: "loading",
  });

  const [expandedIds, setExpandedIds] = useState(new Set());
  const [focusedRootId, setFocusedRootId] = useState(null);
  const [showEnglish, setShowEnglish] = useState(true);
  const [translationLanguage, setTranslationLanguage] = useState("영어");
  const initialLoadPerfRef = useRef(null);
  const initialLoadPerfFlushedRef = useRef(false);
  const runtimeInteractionPerfRef = useRef({
    version: "R1",
    tabLoads: [],
    detailSelections: [],
    categoryExpansions: [],
  });
  const lastDetailSelectionRef = useRef(null);
  const selectedTermDetailRef = useRef(null);
  const activeDetailRequestRef = useRef(0);

  // 필터 상태
  const [filters, setFilters] = useState({ bands: [], poses: [], grades: [], query: "" });
  const [showFilterPanel, setShowFilterPanel] = useState(true);

  // 리사이저 상태
  const [detailWidth, setDetailWidth] = useState(45); // 초기 패널 너비(%)
  const isDragging = useRef(false);

  const recordRuntimeInteraction = useCallback((bucket, payload) => {
    const current = runtimeInteractionPerfRef.current || {
      version: "R1",
      tabLoads: [],
      detailSelections: [],
      categoryExpansions: [],
    };
    const nextBucket = [...(current[bucket] || []), {
      ...payload,
      capturedAt: new Date().toISOString(),
    }].slice(-INTERACTION_PERF_HISTORY_LIMIT);
    runtimeInteractionPerfRef.current = {
      ...current,
      [bucket]: nextBucket,
    };
    publishRuntimeInteractionPerfSnapshot(runtimeInteractionPerfRef.current);
  }, []);

  useEffect(() => {
    selectedTermDetailRef.current = selectedTermDetail;
  }, [selectedTermDetail]);

  const startDrag = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      // 전체 컨테이너에서 사이드바(260px)를 제외한 영역 기준
      const containerWidth = window.innerWidth - 260; 
      const newWidth = ((containerWidth - (e.clientX - 260)) / containerWidth) * 100;
      if (newWidth >= 25 && newWidth <= 75) { // 25% ~ 75% 사이로 제한 (레이아웃 보호)
        setDetailWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // ── 데이터 로드 ─────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const perfSnapshot = {
        version: "R1",
        capturedAt: new Date().toISOString(),
        payloads: [],
        normalize: {},
        milestones: {},
        rows: {},
        deferredTabs: {},
        startedAtMs: perfNow(),
      };
      initialLoadPerfRef.current = perfSnapshot;
      initialLoadPerfFlushedRef.current = false;

      try {
        setIsInitializing(true);
        const [idx, facet] = await Promise.all([
          loadUnifiedSearchIndex({
            trace: (metric) => perfSnapshot.payloads.push(metric),
          }),
          loadFacetPayload({
            trace: (metric) => perfSnapshot.payloads.push(metric),
          }),
        ]);
        perfSnapshot.milestones.payloadsReadyMs = perfNow() - perfSnapshot.startedAtMs;

        const searchIndexArr = Array.isArray(idx) ? idx : [];
        perfSnapshot.rows.searchIndex = searchIndexArr.length;

        const idxMapStartedAt = perfNow();
        const idxMap = new Map();
        searchIndexArr.forEach((t) => { if (t.id) idxMap.set(t.id, t); });
        perfSnapshot.normalize.searchIndexMapMs = perfNow() - idxMapStartedAt;
        perfSnapshot.rows.searchIndexMap = idxMap.size;
        setSearchIndex(searchIndexArr);
        setFacetPayload(facet);
        setTabLoadState({
          meaning: "ready",
          situation: "ready",
          unclassified: "ready",
        });
        perfSnapshot.milestones.stateQueuedMs = perfNow() - perfSnapshot.startedAtMs;
      } catch (e) {
        console.error("데이터 로딩 실패", e);
      } finally {
        setIsInitializing(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (isInitializing || initialLoadPerfFlushedRef.current) return undefined;

    let raf1 = 0;
    let raf2 = 0;

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        const snapshot = initialLoadPerfRef.current;
        if (!snapshot || initialLoadPerfFlushedRef.current) return;
        snapshot.milestones.firstStableRenderMs = perfNow() - snapshot.startedAtMs;
        publishInitialLoadPerfSnapshot(snapshot);
        initialLoadPerfFlushedRef.current = true;
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [isInitializing]);

  const projectedTabLists = useMemo(() => {
    const startedAt = perfNow();
    // T1 runtime contract:
    // derive learner-facing tab trees from APP_READY_SEARCH_INDEX instead of
    // fetching the large tree trio payloads at runtime.
    const projected = buildProjectedTabPayloads(
      searchIndex,
      (item) => normalizeItem(item, "mindmap_core"),
    );

    const totalMs = perfNow() - startedAt;
    if (initialLoadPerfRef.current) {
      initialLoadPerfRef.current.deferredTabs.meaning = {
        normalizeMs: Number(totalMs.toFixed(1)),
        readyMs: perfNow() - initialLoadPerfRef.current.startedAtMs,
        rows: projected.meaning.length,
      };
      initialLoadPerfRef.current.deferredTabs.situation = {
        normalizeMs: 0,
        readyMs: perfNow() - initialLoadPerfRef.current.startedAtMs,
        rows: projected.situation.length,
      };
      initialLoadPerfRef.current.deferredTabs.unclassified = {
        normalizeMs: 0,
        readyMs: perfNow() - initialLoadPerfRef.current.startedAtMs,
        rows: projected.unclassified.length,
      };
    }
    return projected;
  }, [searchIndex]);

  useEffect(() => {
    const listForTab = activeTab === "meaning"
      ? projectedTabLists.meaning
      : activeTab === "situation"
        ? projectedTabLists.situation
        : projectedTabLists.unclassified;

    if (focusedRootId || listForTab.length === 0) return;

    const defaultRoot = listForTab[0].hierarchy?.root_id;
    if (defaultRoot) {
      setFocusedRootId(defaultRoot);
      setExpandedIds(new Set([defaultRoot]));
    }
  }, [activeTab, focusedRootId, projectedTabLists]);

  // ── 현재 축 데이터 ──────────────────────────────────────────────
  const activeList = useMemo(() => {
    if (activeTab === "meaning") return projectedTabLists.meaning;
    if (activeTab === "situation") return projectedTabLists.situation;
    return projectedTabLists.unclassified;
  }, [activeTab, projectedTabLists]);

  const filteredList = useMemo(() => applyFilters(activeList, filters), [activeList, filters]);
  const listScopedList = useMemo(() => {
    if (!selectedTreeNode || selectedTreeNode.type === "term") return filteredList;
    return filteredList.filter((item) => matchesTreeNode(item, selectedTreeNode));
  }, [filteredList, selectedTreeNode]);
  const filteredSearchIndex = useMemo(() => applyFilters(searchIndex, filters), [searchIndex, filters]);
  const filterBaseList = activeList.length > 0 ? activeList : searchIndex;
  const filterVisibleList = activeList.length > 0
    ? (viewMode === "list" ? listScopedList : filteredList)
    : filteredSearchIndex;
  const searchIndexById = useMemo(() => {
    const map = new Map();
    searchIndex.forEach((item) => {
      if (item?.id !== null && item?.id !== undefined) {
        map.set(String(item.id), item);
      }
    });
    return map;
  }, [searchIndex]);
  const searchIndexByWord = useMemo(() => {
    const map = new Map();
    searchIndex.forEach((item) => {
      if (item?.word && !map.has(item.word)) {
        map.set(item.word, item);
      }
    });
    return map;
  }, [searchIndex]);
  const searchWordSet = useMemo(
    () => new Set(searchIndex.map((item) => item?.word).filter(Boolean)),
    [searchIndex],
  );

  const activeSurface = "mindmap_core";
  const activeTree = useMemo(() => {
    return buildTreeFromList(filteredList, activeSurface, activeTab);
  }, [filteredList, activeSurface, activeTab]);
  const isActiveTabLoading = tabLoadState[activeTab] === "loading" || tabLoadState[activeTab] === "queued";
  const isActiveTabReady = tabLoadState[activeTab] === "ready";

  // ── 단어 선택 ───────────────────────────────────────────────────
  const handleSelectTerm = useCallback(async (term) => {
    if (!term?.id) return;
    const selectionStartedAt = perfNow();
    const chunkTrace = [];
    const currentDetail = selectedTermDetailRef.current;
    const alreadyLoadedSameTerm = currentDetail?.id === term.id && hasLoadedDetailPayload(currentDetail);
    setSelectedTreeNode((prev) => (
      prev && prev.type !== "term" && matchesTreeNode(term, prev) ? prev : null
    ));
    setSelectedTermId((prev) => (prev === term.id ? prev : term.id));
    setSelectedTermDetail((prev) => (prev?.id === term.id ? prev : term));

    // ── 사이드바 & 마인드맵 루트 상시 동기화: 선택 단어의 소속 노드를 강제 활성화 ──
    const rootId  = term.hierarchy?.root_id;
    const sceneId = term.hierarchy?.scene;
    const catId   = term.hierarchy?.category;
    
    if (rootId) {
      setFocusedRootId(rootId);
    }

    setExpandedIds((prev) => {
      let changed = false;
      const next = new Set(prev);
      if (sceneId && !next.has(sceneId)) {
        next.add(sceneId);
        changed = true;
      }
      if (catId && !next.has(catId)) {
        next.add(catId);
        changed = true;
      }
      return changed ? next : prev;
    });

    if (alreadyLoadedSameTerm) {
      const previousSelection = lastDetailSelectionRef.current;
      recordRuntimeInteraction("detailSelections", {
        termId: term.id,
        chunkId: term.chunk_id || null,
        usedDetailMap: !term.chunk_id,
        sameChunkAsPrevious: Boolean(term.chunk_id && previousSelection?.chunkId === term.chunk_id),
        totalMs: Number((perfNow() - selectionStartedAt).toFixed(1)),
        chunkTrace,
        reuse: "selected-detail",
      });
      lastDetailSelectionRef.current = {
        termId: term.id,
        chunkId: term.chunk_id || null,
      };
      setIsLoadingChunk(false);
      return;
    }

    const requestId = activeDetailRequestRef.current + 1;
    activeDetailRequestRef.current = requestId;
    setIsLoadingChunk(true);

    try {
      if (term.chunk_id) {
        const chunkData = await loadTermDetailChunk(term.id, term.chunk_id, {
          trace: (metric) => chunkTrace.push(metric),
        });
        if (chunkData && activeDetailRequestRef.current === requestId)
          setSelectedTermDetail((prev) => prev?.id === term.id ? { ...prev, ...chunkData } : prev);
      } else if (isDetailFallbackDebugEnabled()) {
        const detail = await loadEntryDetail(term.id);
        if (detail && activeDetailRequestRef.current === requestId) {
          const primarySense = detail.senses?.[0] || null;
          const examples_bundle = (primarySense?.examples || [])
            .flatMap((ex) => (ex.texts || []).map((text) => ({
              text_ko: text,
              text_en: null,
              source: ex.type || null,
            })))
          setSelectedTermDetail((prev) => prev?.id === term.id ? {
            ...prev,
            senses: detail.senses || [],
            related_forms: detail.related_forms || [],
            subwords: detail.subwords || [],
            phonetic_romanization: detail.pronunciation?.[0]?.text || prev?.phonetic_romanization || null,
            examples_bundle,
            translation_summary: primarySense?.translations || prev?.translation_summary || [],
          } : prev);
        }
      } else {
        console.warn("[MM3] detail-map fallback is disabled outside debug mode", term.id);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      const isLatestRequest = activeDetailRequestRef.current === requestId;
      const previousSelection = lastDetailSelectionRef.current;
      recordRuntimeInteraction("detailSelections", {
        termId: term.id,
        chunkId: term.chunk_id || null,
        usedDetailMap: !term.chunk_id,
        sameChunkAsPrevious: Boolean(term.chunk_id && previousSelection?.chunkId === term.chunk_id),
        totalMs: Number((perfNow() - selectionStartedAt).toFixed(1)),
        chunkTrace,
      });
      if (isLatestRequest) {
        lastDetailSelectionRef.current = {
          termId: term.id,
          chunkId: term.chunk_id || null,
        };
        setIsLoadingChunk(false);
      }
    }
  }, [recordRuntimeInteraction]);


  // ── 검색 선택 ───────────────────────────────────────────────────
  // 탭 전환 후 마인드맵 treeData가 갱신될 때까지 pending term을 추적
  const pendingSearchTermRef = useRef(null);

  const handleSearchSelect = useCallback((target) => {
    const categoryTypes = (target.categories || []).map((c) => c.type);
    let targetTab = "meaning";
    if (categoryTypes.includes("주제 및 상황 범주")) {
      targetTab = "situation";
    } else if (!categoryTypes.includes("의미 범주")) {
      targetTab = "unclassified";
    }

    const normalized = normalizeItem(target, "mindmap_core");

    // 탭 전환 + focusedRootId 를 먼저 설정
    setActiveTab(targetTab);
    setSelectedTreeNode(null);
    if (targetTab === "unclassified") {
      setViewMode("list");
    }
    const rid = normalized.hierarchy?.root_id;
    if (rid) {
      setFocusedRootId(rid);
      setExpandedIds((prev) => {
        if (prev.has(rid)) return prev;
        return new Set([...prev, rid]);
      });
    }

    // term 선택은 동기 경로로 호출 (chunk 로드 + detail 표시)
    handleSelectTerm(normalized);

    // 탭 전환 시 treeData가 비동기 갱신되므로, MindmapCanvas의 외부 effect
    // (selectedTermId 변화 → treeData 탐색 → zoom)가 새 treeData 기준으로
    // 재실행되도록 pendingSearchTermRef를 통해 추적
    pendingSearchTermRef.current = normalized.id;
  }, [handleSelectTerm]);

  const resolveReferenceTarget = useCallback((ref) => {
    if (!ref) return null;

    if (typeof ref === "string") {
      return searchIndexByWord.get(ref) || null;
    }

    const targetCode =
      ref.target_code ||
      ref.target_id ||
      ref.id ||
      null;

    if (targetCode && searchIndexById.has(String(targetCode))) {
      return searchIndexById.get(String(targetCode));
    }

    const wordCandidates = [
      ref.word,
      ref.target_term,
      ref.text,
    ].filter(Boolean);

    for (const candidate of wordCandidates) {
      if (searchIndexByWord.has(candidate)) {
        return searchIndexByWord.get(candidate);
      }
    }

    return null;
  }, [searchIndexById, searchIndexByWord]);

  const resolveReferenceMeta = useCallback((ref) => {
    const target = resolveReferenceTarget(ref);
    if (!target) return null;
    return {
      word: target.word || null,
      pos: toPosLabel(target.pos || null),
      def_ko: target.def_ko || null,
      path_ko: target.hierarchy?.path_ko || null,
      id: target.id || null,
    };
  }, [resolveReferenceTarget]);

  const handleReferenceJump = useCallback((ref) => {
    const target = resolveReferenceTarget(ref);
    if (target && target.id !== selectedTermDetail?.id) {
      handleSearchSelect(target);
      return;
    }
    console.warn("[ReferenceJump] 점프 불가:", ref);
  }, [handleSearchSelect, resolveReferenceTarget, selectedTermDetail?.id]);

  const isReferenceJumpAvailable = useCallback((ref) => {
    const target = resolveReferenceTarget(ref);
    return Boolean(target && target.id);
  }, [resolveReferenceTarget]);

  const handleSubwordJump = useCallback((subword) => {
    if (!subword?.text) return;
    const target = searchIndexByWord.get(subword.text);
    if (target && target.id !== selectedTermDetail?.id) {
      handleSearchSelect(target);
      return;
    }
    console.info("[Subword] 독립 표제어 연결 없음:", subword.text);
  }, [handleSearchSelect, searchIndexByWord, selectedTermDetail?.id]);

  // ── 필터 토글 ───────────────────────────────────────────────────
  const toggleBandFilter = (b) =>
    setFilters((f) => ({
      ...f,
      bands: f.bands.includes(b) ? f.bands.filter((x) => x !== b) : [...f.bands, b],
    }));

  const togglePosFilter = (posKey) =>
    setFilters((f) => ({
      ...f,
      poses: (f.poses || []).includes(posKey) ? f.poses.filter((x) => x !== posKey) : [...(f.poses || []), posKey],
    }));

  const toggleGradeFilter = (gradeKey) =>
    setFilters((f) => ({
      ...f,
      grades: (f.grades || []).includes(gradeKey) ? f.grades.filter((x) => x !== gradeKey) : [...(f.grades || []), gradeKey],
    }));

  const activeFilterCount =
    filters.bands.length +
    (filters.poses?.length || 0) +
    (filters.grades?.length || 0);

  const facetData = facetPayload?.facets || {};
  const bandOptions = (facetData["TOPIK"]?.options?.band || [])
    .filter((opt) => opt.value !== "미기재")
    .map((opt) => {
      const numericBand = Number(opt.value);
      const label = BAND_FILTER_LABELS[numericBand] || `Band ${opt.value}`;
      return {
        value: numericBand,
        label: `${label} (${opt.count})`,
      };
    });
  const posOptions = (facetData["품사"]?.options || []).map((opt) => ({ value: opt.value, label: `${opt.value} (${opt.count})` }));
  const gradeOptions = (facetData["학습난이도"]?.options || []).map((opt) => ({ value: opt.value, label: `${opt.value} (${opt.count})` }));
  const translationLanguageOptions = useMemo(() => {
    const counts = new Map();
    searchIndex.forEach((item) => {
      (item.translation_summary || []).forEach((t) => {
        if (!t?.language) return;
        counts.set(t.language, (counts.get(t.language) || 0) + 1);
      });
    });
    if (!counts.has("영어")) counts.set("영어", 0);
    return Array.from(counts.entries())
      .sort((a, b) => {
        if (a[0] === "영어") return -1;
        if (b[0] === "영어") return 1;
        return b[1] - a[1];
      })
      .map(([value, count]) => ({
        value,
        label: count > 0 ? `${value} (${count})` : `${value}`,
      }));
  }, [searchIndex]);

  // ── 연관 어휘 클릭 — 3대 축 횟단 점프 로직 ─────────────────────────────────
  // 자동 탭 전환 → 데이터 동기화 → 카테고리 Expand → Zoom-to-node
  const SYSTEM_TO_TAB = {
    "상황과 장소": "situations",
    "마음과 표현": "expressions",
    "구조와 기초": "basics",
  };

  const handleRelatedVocabClick = useCallback((wordString) => {
    const target = searchIndexByWord.get(wordString);
    if (!target) {
      console.warn("[RelatedVocab] 검색 인덱스 미존재:", wordString);
      return;
    }
    // handleSearchSelect로 통일: 탭/focusedRootId/expandedIds/마인드맵이 모두 함께 동기화됨
    handleSearchSelect(target);
  }, [searchIndexByWord, handleSearchSelect]);

  const handleTreeNodeSelect = useCallback((node, source = "sidebar") => {
    if (!node || node.type === "term") return;
    if (source === "mindmap") {
      setViewMode("mindmap");
    }
    setSelectedTermId(null);
    setSelectedTermDetail(null);
    if (node.rootId) {
      setFocusedRootId(node.rootId);
    }
    if (source === "mindmap") {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (node.type === "scene") {
          next.add(node.id);
        }
        if (node.type === "category") {
          if (node.sceneId) next.add(node.sceneId);
          next.add(node.id);
        }
        return next;
      });
    }
    setSelectedTreeNode({ id: node.id, type: node.type });
  }, []);

  // ── 로딩 ────────────────────────────────────────────────────────
  if (isInitializing)
    return (
      <div className="welcome-screen">
        <StatusPanel
          kicker="Initial Load"
          title="어휘 데이터를 준비 중입니다"
          description={`현재 ${NAV_TABS.map((t) => t.label).join(" · ")} 축을 순서대로 준비하고 있습니다.`}
          icon={Loader}
          tone="var(--accent-blue)"
          loading
        />
      </div>
    );

  const currentTab = ALL_TABS.find((t) => t.id === activeTab);

  return (
    <div className="app-root fade-enter-active">
      {/* ── 상단 내비게이션 ─────────────────────────────────── */}
      <div className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <div className="logo-mark">
              <Network size={18} color="var(--accent-blue)" />
            </div>
            <div className="logo-copy">
              <span className="logo-kicker">Explorer</span>
              <span className="logo-text">어휘 마인드맵</span>
            </div>
          </div>
          <div className="nav-tabs">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedTermDetail(null);
                  setSelectedTermId(null);
                  setSelectedTreeNode(null);
                  setFocusedRootId(null);
                  if (tab.id === "unclassified") {
                    setViewMode("list");
                  }
                }}
                style={{ "--tab-color": tab.color }}
              >
                {tab.label}
                {activeTab === tab.id && isActiveTabReady && (
                  <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 6 }}>
                    ({filteredList.length.toLocaleString()})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-right">
          {/* ENG 토글 */}
          <button
            className={`card-glass nav-utility-button ${showEnglish ? "is-active" : ""}`}
            onClick={() => setShowEnglish(!showEnglish)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", borderRadius: 12, cursor: "pointer", fontSize: 12,
              border: `1px solid ${showEnglish ? "rgba(63,185,80,0.22)" : "rgba(255,255,255,0.06)"}`,
              color: showEnglish ? "var(--accent-green)" : "var(--text-secondary)",
              background: showEnglish ? "rgba(63,185,80,0.10)" : "rgba(255,255,255,0.03)",
            }}
          >
            <Book size={14} />
            <span>{showEnglish ? "번역 ON" : "번역 OFF"}</span>
            <span
              className="nav-utility-pill"
              style={{
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: 999,
                background: showEnglish ? "rgba(63,185,80,0.16)" : "rgba(255,255,255,0.06)",
                color: showEnglish ? "var(--accent-green)" : "var(--text-muted)",
                border: `1px solid ${showEnglish ? "rgba(63,185,80,0.18)" : "rgba(255,255,255,0.05)"}`,
              }}
            >
              {showEnglish ? translationLanguage : "비활성"}
            </span>
          </button>

          {/* 필터 버튼 */}
          <button
            className={`card-glass nav-utility-button ${activeFilterCount > 0 ? "is-active is-filter" : ""}`}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", borderRadius: 12, cursor: "pointer", fontSize: 12,
              border: `1px solid ${activeFilterCount > 0 ? "rgba(255,166,87,0.22)" : "rgba(255,255,255,0.06)"}`,
              color: activeFilterCount > 0 ? "var(--accent-orange)" : "var(--text-secondary)",
              background: activeFilterCount > 0 ? "rgba(255,166,87,0.10)" : "rgba(255,255,255,0.03)",
              position: "relative",
            }}
          >
            <Filter size={14} />
            <span>필터</span>
            {activeFilterCount > 0 && <span className="nav-utility-pill nav-utility-count" style={{ background: "var(--accent-orange)", color: "#081018", borderRadius: 999, padding: "2px 7px", fontSize: 10, fontWeight: 700 }}>{activeFilterCount}</span>}
            <ChevronDown size={12} style={{ transform: showFilterPanel ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          <SearchBox
            searchIndex={filteredSearchIndex}
            onSelect={handleSearchSelect}
            showEnglish={showEnglish}
            translationLanguage={translationLanguage}
          />
        </div>
      </div>

      {/* ── 필터 패널 ─────────────────────────────────────────── */}
      {showFilterPanel && (
        <div className="filter-panel-shell">
          <div className="filter-panel-heading">
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 2 }}>
              Interaction Controls
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              필터와 번역 언어
            </div>
          </div>

          {/* 드롭다운 필터 요소들 */}
          <DropdownFilter
            label="난이도"
            options={gradeOptions}
            selectedValues={filters.grades || []}
            onToggle={toggleGradeFilter}
            onClear={() => setFilters(f => ({ ...f, grades: [] }))}
          />

          <DropdownFilter
            label="품사별"
            options={posOptions}
            selectedValues={filters.poses || []}
            onToggle={togglePosFilter}
            onClear={() => setFilters(f => ({ ...f, poses: [] }))}
          />

          <DropdownFilter
            label="TOPIK빈도"
            options={bandOptions}
            selectedValues={filters.bands}
            onToggle={toggleBandFilter}
            onClear={() => setFilters(f => ({ ...f, bands: [] }))}
          />

          <DropdownFilter
            label="번역 언어"
            options={translationLanguageOptions}
            selectedValues={[translationLanguage]}
            onToggle={(value) => setTranslationLanguage(value)}
            onClear={() => setTranslationLanguage("영어")}
          />

          {/* 모든 필터 초기화 버튼 */}
          {activeFilterCount > 0 && (
            <button onClick={() => setFilters({ bands: [], poses: [], grades: [], query: "" })}
              style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--accent-orange)", background: "rgba(255,166,87,0.1)", border: "1px solid rgba(255,166,87,0.3)", transition: "all 0.15s" }}>
              전체 필터 초기화
            </button>
          )}

          <span data-testid="filter-visible-count" className="filter-summary-pill" style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: "auto" }}>
            {filterVisibleList.length.toLocaleString()} / {filterBaseList.length.toLocaleString()}건 표시 중
          </span>
        </div>
      )}

      {/* ── 메인 콘텐츠 ───────────────────────────────────────── */}
      <div className="app-container">
        <SidebarTree
          treeData={activeTree}
          isLoading={isActiveTabLoading}
          expandedIds={expandedIds}
          toggleExpand={(id) =>
            setExpandedIds((prev) => {
              const n = new Set(prev);
              if (n.has(id)) n.delete(id); else n.add(id);
              return n;
            })
          }
          onSelectNode={(node) => handleTreeNodeSelect(node, "sidebar")}
          onSelectTerm={handleSelectTerm}
          selectedTermId={selectedTermId}
          selectedTreeNode={selectedTreeNode}
        />

        <div className="main-content">
          {/* 뷰 전환 바 */}
          <div className="surface-header">
            <div className="surface-header-copy">
              <div className="surface-header-kicker">Explorer View</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: currentTab?.color || "var(--text-primary)" }}>
                {currentTab?.label}
                {currentTab?.label_en && <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: 8 }}>{currentTab.label_en}</span>}
              </div>
            </div>
            <div className="surface-header-actions">
              {[
                { mode: "mindmap", icon: <MapIcon size={14} />, label: "마인드맵" },
                { mode: "list",    icon: <LayoutList size={14} />, label: "리스트" },
              ].map(({ mode, icon, label }) => (
                <button key={mode}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                    borderRadius: 6, cursor: "pointer", fontSize: 13,
                    border: viewMode === mode ? "1px solid var(--border-color)" : "1px solid transparent",
                    backgroundColor: viewMode === mode ? "var(--bg-secondary)" : "transparent",
                    color: viewMode === mode ? "var(--text-primary)" : "var(--text-secondary)",
                    transition: "all 0.15s",
                  }}
                  onClick={() => setViewMode(mode)}
                >{icon} {label}</button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* 뷰 영역 */}
            <div style={{
              flex: selectedTermDetail ? `1 1 ${100 - detailWidth}%` : "1",
              overflow: "hidden",
            }}>
              {isActiveTabLoading ? (
                <div className="welcome-screen" style={{ minHeight: 240 }}>
                  <StatusPanel
                    kicker="Tab Load"
                    title={`${currentTab?.label || "탭"} 데이터를 준비 중입니다`}
                    description="탐색 축에 맞는 트리와 리스트 surface를 먼저 안정화하고 있습니다."
                    icon={Loader}
                    tone={currentTab?.color || "var(--accent-blue)"}
                    loading
                  />
                </div>
              ) : viewMode === "mindmap" ? (
                <MindmapCanvas
                  treeData={activeTree}
                  onSelectTerm={handleSelectTerm}
                  onSelectTreeNode={(node) => handleTreeNodeSelect(node, "mindmap")}
                  onCategoryExpandPerf={(entry) => recordRuntimeInteraction("categoryExpansions", entry)}
                  selectedTermId={selectedTermId}
                  focusedRootId={focusedRootId}
                  selectedTreeNode={selectedTreeNode}
                />
              ) : (
                <ListView
                  list={listScopedList}
                  selectedTermId={selectedTermId}
                  onSelectTerm={handleSelectTerm}
                  showEnglish={showEnglish}
                  translationLanguage={translationLanguage}
                />
              )}
            </div>

            {/* Splitter (가변 조절바) */}
            {selectedTermDetail && (
              <div
                onMouseDown={startDrag}
                className="detail-splitter"
                style={{
                  width: 10,
                  cursor: "col-resize",
                  backgroundColor: "transparent",
                  zIndex: 50,
                  position: "relative",
                  marginLeft: -5,
                  marginRight: -5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="detail-splitter-thumb"
                  style={{
                    width: 4,
                    height: "100%",
                    backgroundColor: "var(--border-color)",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "var(--accent-blue)")}
                  onMouseLeave={(e) => {
                    if (!isDragging.current) e.target.style.backgroundColor = "var(--border-color)";
                  }}
                />
              </div>
            )}

            {/* 상세 패널 */}
            {selectedTermDetail && (
              <div className="detail-panel-shell" style={{
                flex: `0 0 ${detailWidth}%`,
                display: "flex", flexDirection: "column",
                minWidth: 300,
              }}>
                <div className="detail-panel-scroll" style={{ flex: 1, overflowY: "auto" }}>
                  {isLoadingChunk ? (
                    <div className="welcome-screen">
                      <StatusPanel
                        kicker="Detail Load"
                        title="상세 정보를 불러오는 중입니다"
                        description="현재 선택한 항목의 관계, 표현, 예문 surface를 합치는 중입니다."
                        icon={Loader}
                        tone="var(--accent-blue)"
                        loading
                        compact
                      />
                    </div>
                  ) : (
                    <TermDetail
                      term={selectedTermDetail}
                      siblingSenses={[]}
                      onSenseSwitch={handleSelectTerm}
                      onCrossLinkClick={handleReferenceJump}
                      onRelatedVocabClick={handleRelatedVocabClick}
                      onSenseRelationClick={handleReferenceJump}
                      onRelatedFormClick={handleReferenceJump}
                      onSubwordClick={handleSubwordJump}
                      isSearchWordAvailable={(word) => searchWordSet.has(word)}
                      isReferenceJumpAvailable={isReferenceJumpAvailable}
                      resolveReferenceMeta={resolveReferenceMeta}
                      showEnglish={showEnglish}
                      translationLanguage={translationLanguage}
                      onClose={() => setSelectedTermDetail(null)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 리스트 뷰 ────────────────────────────────────────────────────
const BAND_COLORS_INLINE = {
  1: { color: "#ff7b72", bg: "rgba(255,123,114,0.12)", label: "Essential" },
  2: { color: "#ffa657", bg: "rgba(255,166,87,0.12)",  label: "High"      },
  3: { color: "#e3b341", bg: "rgba(227,179,65,0.12)",  label: "Medium"    },
  4: { color: "#3fb950", bg: "rgba(63,185,80,0.12)",   label: "Low"       },
  5: { color: "#58a6ff", bg: "rgba(88,166,255,0.12)",  label: "Rare"      },
};

function ListView({ list, selectedTermId, onSelectTerm, showEnglish, translationLanguage }) {
  const getPrimaryTranslation = (term) => {
    const translations = term?.translation_summary || [];
    if (!translations.length) return null;
    return translations.find((t) => t?.language === translationLanguage) ||
      translations.find((t) => t?.language === "영어") ||
      translations[0];
  };
  return (
    <div className="list-shell" style={{ padding: 18, overflowY: "auto", height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((term) => {
          const primaryTranslation = getPrimaryTranslation(term);
          const band = term.stats?.band ?? null;
          const bandValid = band !== null && band >= 1 && band <= 5;
          const bm = bandValid ? BAND_COLORS_INLINE[band] : null;
          const isSelected = selectedTermId === term.id;
          const displayPath = term.hierarchy?.display_path_ko || term.hierarchy?.path_ko || null;

          return (
              <div
                key={term.id}
                data-list-term-id={term.id}
                onClick={() => onSelectTerm(term)}
                className="list-row-shell"
                style={{
                padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                background: isSelected
                  ? "linear-gradient(180deg, rgba(88,166,255,0.16), rgba(88,166,255,0.08))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
                border: `1px solid ${isSelected ? "rgba(88,166,255,0.28)" : "rgba(255,255,255,0.06)"}`,
                display: "flex", flexDirection: "column", gap: 10, transition: "all 0.12s",
                boxShadow: isSelected ? "0 10px 24px rgba(0,0,0,0.18)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, color: isSelected ? "var(--accent-blue)" : "var(--text-primary)", fontSize: 15, marginBottom: 6 }}>
                    {term.word}
                  </div>
                  {showEnglish && (primaryTranslation?.word || term.def_en) && (
                    <div style={{ color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.5 }}>
                      {primaryTranslation?.language ? `${primaryTranslation.language}: ` : ""}{primaryTranslation?.word || term.def_en}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {term.has_subwords && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "rgba(255,166,87,0.12)", color: "var(--accent-orange)", border: "1px solid rgba(255,166,87,0.24)" }}>
                      다음: 표현층
                    </span>
                  )}
                  {bm ? (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: bm.bg, color: bm.color, border: `1px solid ${bm.color}44` }}>
                      B{band}
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: "#6e7681", padding: "3px 8px", borderRadius: 999, background: "rgba(110,118,129,0.1)", border: "1px solid rgba(110,118,129,0.2)" }}>
                      —
                    </span>
                  )}
                </div>
              </div>
              {displayPath ? (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", borderRadius: 999, padding: "3px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {displayPath}
                  </span>
                </div>
              ) : null}
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {term.def_ko}
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div style={{ padding: "28px 0" }}>
            <StatusPanel
              kicker="No Result"
              title="해당 조건의 단어가 없습니다"
              description="필터를 줄이거나 다른 번역 언어/검색어로 다시 확인해 보세요."
              tone="var(--accent-orange)"
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
