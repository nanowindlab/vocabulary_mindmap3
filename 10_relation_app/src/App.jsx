import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Compass,
  Database,
  Drill,
  Filter,
  GitBranch,
  Layers3,
  Search,
  Map as MapIcon,
  Network,
  PanelLeft,
  RefreshCw,
} from "lucide-react";

const TONE_CLASS = {
  blue: "tone-blue",
  orange: "tone-orange",
  green: "tone-green",
  purple: "tone-purple",
  red: "tone-red",
};

const TOPIK_LABELS = {
  1: "Band 1 · 최상위 필수",
  2: "Band 2 · 핵심 중요",
  3: "Band 3 · 일반 활용",
  4: "Band 4 · 보조 표현",
  5: "Band 5 · 심화 어휘",
};

function readRouteState() {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return {
      family: params.get("family") || "",
      group: params.get("group") || "",
      card: params.get("card") || "",
      view: params.get("view") || "compare",
      term: params.get("term") || "",
      bucket: params.get("bucket") || "",
      subgroup_query: params.get("subgroup_query") || "",
      pos: params.get("pos") || "all",
      grade: params.get("grade") || "all",
      lang: params.get("lang") || "영어",
      band: params.get("band") || "all",
    };
  } catch {
    return {};
  }
}

function cardMatchesFilters(card, { pos, grade, band }) {
  return card.terms.some((term) => {
    const posMatch = pos === "all" || term.pos === pos;
    const gradeMatch = grade === "all" || term.wordGrade === grade;
    const bandMatch = band === "all" || String(term.topikBand) === band;
    return posMatch && gradeMatch && bandMatch;
  });
}

function pickTranslation(term, language) {
  const translations = term.translationSummary || [];
  if (translations.length === 0) return null;
  return (
    translations.find((item) => item.language === language) ||
    translations.find((item) => item.language === "영어") ||
    translations[0]
  );
}

function App() {
  const routeState = useMemo(() => readRouteState(), []);
  const [bootstrap, setBootstrap] = useState(null);
  const [bootstrapError, setBootstrapError] = useState("");
  const [familyId, setFamilyId] = useState(routeState.family || "");
  const [familyData, setFamilyData] = useState(null);
  const [familyError, setFamilyError] = useState("");
  const [groupId, setGroupId] = useState(routeState.group || "");
  const [cardId, setCardId] = useState(routeState.card || "");
  const [bucketFilter, setBucketFilter] = useState(routeState.bucket || "");
  const [subgroupQuery, setSubgroupQuery] = useState(routeState.subgroup_query || "");
  const [viewMode, setViewMode] = useState(routeState.view || "compare");
  const [detailTermId, setDetailTermId] = useState(routeState.term || "");
  const [posFilter, setPosFilter] = useState(routeState.pos || "all");
  const [gradeFilter, setGradeFilter] = useState(routeState.grade || "all");
  const [languageFilter, setLanguageFilter] = useState(routeState.lang || "영어");
  const [bandFilter, setBandFilter] = useState(routeState.band || "all");

  useEffect(() => {
    let cancelled = false;
    async function loadBootstrap() {
      try {
        setBootstrapError("");
        const response = await fetch("/data/relation-bootstrap.json");
        if (!response.ok) throw new Error(`bootstrap ${response.status}`);
        const payload = await response.json();
        if (cancelled) return;
        setBootstrap(payload);
        if (!familyId) {
          setFamilyId(payload.families?.[0]?.id || "");
        }
      } catch (error) {
        if (cancelled) return;
        setBootstrapError(error instanceof Error ? error.message : "bootstrap load failed");
      }
    }
    loadBootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const families = bootstrap?.families || [];

  useEffect(() => {
    if (!familyId) return;
    const familyMeta = families.find((family) => family.id === familyId);
    if (!familyMeta?.dataUrl) return;

    let cancelled = false;
    async function loadFamily() {
      try {
        setFamilyError("");
        const response = await fetch(familyMeta.dataUrl);
        if (!response.ok) throw new Error(`family ${response.status}`);
        const payload = await response.json();
        if (cancelled) return;
        setFamilyData(payload);
        const requestedBucket = payload.groups?.some((group) => group.bucketLabel === bucketFilter)
          ? bucketFilter
          : payload.groups?.[0]?.bucketLabel || "";
        setBucketFilter(requestedBucket);
        const requestedGroup = payload.groups?.find((group) => group.id === groupId);
        setGroupId(requestedGroup?.id || payload.groups?.[0]?.id || "");
      } catch (error) {
        if (cancelled) return;
        setFamilyError(error instanceof Error ? error.message : "family load failed");
      }
    }
    loadFamily();
    return () => {
      cancelled = true;
    };
  }, [familyId, families]);

  const currentFamily = useMemo(
    () => families.find((family) => family.id === familyId) || null,
    [families, familyId],
  );
  const groups = familyData?.groups || [];
  const bucketOptions = useMemo(() => {
    const counts = new Map();
    const filterState = { pos: posFilter, grade: gradeFilter, band: bandFilter };
    for (const group of groups) {
      const matchedCount = group.cards.filter((card) => cardMatchesFilters(card, filterState)).length;
      if (matchedCount === 0) continue;
      counts.set(group.bucketLabel, (counts.get(group.bucketLabel) || 0) + matchedCount);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"))
      .map(([label, count]) => ({ label, count }));
  }, [groups, posFilter, gradeFilter, bandFilter]);

  const visibleGroups = useMemo(() => {
    const filterState = { pos: posFilter, grade: gradeFilter, band: bandFilter };
    let next = groups;
    if (bucketFilter) {
      next = next.filter((group) => group.bucketLabel === bucketFilter);
    }
    if (subgroupQuery) {
      const q = subgroupQuery.trim();
      next = next.filter((group) => group.label.includes(q));
    }
    return next
      .map((group) => ({
        ...group,
        visibleCardCount: group.cards.filter((card) => cardMatchesFilters(card, filterState)).length,
      }))
      .filter((group) => group.visibleCardCount > 0);
  }, [groups, bucketFilter, subgroupQuery, posFilter, gradeFilter, bandFilter]);

  const currentGroup = useMemo(
    () => visibleGroups.find((group) => group.id === groupId) || visibleGroups[0] || null,
    [visibleGroups, groupId],
  );

  const filterOptions = useMemo(() => {
    const pos = new Map();
    const grades = new Map();
    const languages = new Map([["영어", 0]]);
    const bands = new Map([
      ["1", 0],
      ["2", 0],
      ["3", 0],
      ["4", 0],
      ["5", 0],
    ]);
    for (const group of groups) {
      for (const card of group.cards || []) {
        for (const term of card.terms || []) {
          if (term.pos) pos.set(term.pos, (pos.get(term.pos) || 0) + 1);
          if (term.wordGrade) grades.set(term.wordGrade, (grades.get(term.wordGrade) || 0) + 1);
          if (term.topikBand !== null && term.topikBand !== undefined) {
            const bandKey = String(term.topikBand);
            bands.set(bandKey, (bands.get(bandKey) || 0) + 1);
          }
          for (const translation of term.translationSummary || []) {
            if (translation?.language) {
              languages.set(translation.language, (languages.get(translation.language) || 0) + 1);
            }
          }
        }
      }
    }
    return {
      pos: [...pos.entries()]
        .sort((a, b) => a[0].localeCompare(b[0], "ko"))
        .map(([value, count]) => ({ value, label: `${value} (${count})` })),
      grades: [...grades.entries()]
        .sort((a, b) => a[0].localeCompare(b[0], "ko"))
        .map(([value, count]) => ({ value, label: `${value} (${count})` })),
      languages: [...languages.entries()]
        .sort((a, b) => {
          if (a[0] === "영어") return -1;
          if (b[0] === "영어") return 1;
          return b[1] - a[1] || a[0].localeCompare(b[0], "ko");
        })
        .map(([value, count]) => ({
          value,
          label: count > 0 ? `${value} (${count})` : value,
        })),
      bands: [...bands.entries()]
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([value, count]) => ({
          value,
          label: `${TOPIK_LABELS[value] || `Band ${value}`} (${count})`,
        })),
    };
  }, [groups]);

  const filteredCards = useMemo(() => {
    const cards = currentGroup?.cards || [];
    return cards.filter((card) =>
      cardMatchesFilters(card, {
        pos: posFilter,
        grade: gradeFilter,
        band: bandFilter,
      }),
    );
  }, [currentGroup, posFilter, gradeFilter, bandFilter]);

  useEffect(() => {
    const requestedCard = filteredCards.find((card) => card.id === cardId);
    setCardId(requestedCard?.id || filteredCards[0]?.id || "");
  }, [filteredCards, cardId]);

  const currentCard = useMemo(
    () => filteredCards.find((card) => card.id === cardId) || filteredCards[0] || null,
    [filteredCards, cardId],
  );

  useEffect(() => {
    setDetailTermId(currentCard?.terms?.[0]?.id || "");
    setViewMode("compare");
  }, [currentCard]);

  const detailTerm = useMemo(
    () => currentCard?.terms?.find((term) => term.id === detailTermId) || currentCard?.terms?.[0] || null,
    [currentCard, detailTermId],
  );

  const mindmapNodes = useMemo(() => {
    if (!currentCard) return [];
    const radius = 120;
    const centerX = 170;
    const centerY = 150;
    return currentCard.terms.map((term, index) => {
      const angle = ((Math.PI * 2) / currentCard.terms.length) * index - Math.PI / 2;
      return {
        ...term,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });
  }, [currentCard]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (familyId) params.set("family", familyId);
    if (groupId) params.set("group", groupId);
    if (cardId) params.set("card", cardId);
    if (viewMode) params.set("view", viewMode);
    if (detailTermId) params.set("term", detailTermId);
    if (bucketFilter) params.set("bucket", bucketFilter);
    if (subgroupQuery) params.set("subgroup_query", subgroupQuery);
    if (posFilter !== "all") params.set("pos", posFilter);
    if (gradeFilter !== "all") params.set("grade", gradeFilter);
    if (languageFilter !== "영어") params.set("lang", languageFilter);
    if (bandFilter !== "all") params.set("band", bandFilter);
    const nextHash = params.toString();
    window.history.replaceState(null, "", nextHash ? `#${nextHash}` : window.location.pathname);
  }, [familyId, groupId, cardId, viewMode, detailTermId, bucketFilter, subgroupQuery, posFilter, gradeFilter, languageFilter, bandFilter]);

  return (
    <div className="shell-root">
      <header className="top-nav">
        <div className="brand-block">
          <div className="brand-mark">
            <Network size={18} />
          </div>
          <div className="brand-copy">
            <span className="brand-kicker">Phase 2</span>
            <strong>관계 탐색 앱</strong>
          </div>
        </div>
        <div className="nav-meta">
          <span className="meta-chip">
            <Compass size={14} />
            Relation-First Shell
          </span>
          <span className="meta-chip">
            <Database size={14} />
            Actual Data Wired
          </span>
        </div>
      </header>

      <section className="top-filter-bar">
        <div className="section-head">
          <Filter size={15} />
          <span>상단 필터</span>
        </div>
        <div className="filter-row">
          <label className="filter-control">
            <span>품사</span>
            <select value={posFilter} onChange={(event) => setPosFilter(event.target.value)}>
              <option value="all">전체</option>
              {filterOptions.pos.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-control">
            <span>난이도</span>
            <select value={gradeFilter} onChange={(event) => setGradeFilter(event.target.value)}>
              <option value="all">전체</option>
              {filterOptions.grades.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-control">
            <span>번역 언어</span>
            <select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)}>
              {filterOptions.languages.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-control">
            <span>TOPIK 빈도</span>
            <select value={bandFilter} onChange={(event) => setBandFilter(event.target.value)}>
              <option value="all">전체</option>
              {filterOptions.bands.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="filter-summary">
            <strong>{filteredCards.length}</strong>
            <span>cards in current subgroup</span>
          </div>
          <button
            type="button"
            className="filter-reset"
            onClick={() => {
              setPosFilter("all");
              setGradeFilter("all");
              setLanguageFilter("영어");
              setBandFilter("all");
            }}
          >
            필터 초기화
          </button>
        </div>
      </section>

      <main className="shell-body">
        <aside className="left-rail">
          <div className="rail-section">
            <div className="section-head">
              <PanelLeft size={15} />
              <span>관계 종류</span>
            </div>
            {bootstrapError ? (
              <div className="empty-state">bootstrap load failed: {bootstrapError}</div>
            ) : families.length === 0 ? (
              <div className="empty-state">
                <RefreshCw size={16} className="spin" />
                relation bootstrap loading
              </div>
            ) : (
              <div className="family-list">
                {families.map((family) => (
                  <button
                    key={family.id}
                    type="button"
                    className={`family-card ${family.id === currentFamily?.id ? "is-active" : ""}`}
                    onClick={() => setFamilyId(family.id)}
                  >
                    <div className="family-line">
                      <span className={`family-dot ${TONE_CLASS[family.tone]}`} />
                      <strong>{family.label}</strong>
                    </div>
                    <p>{family.summary}</p>
                    <div className="family-meta">
                      <span>{family.bucketCount} buckets</span>
                      <span>{family.groupCount} groups</span>
                      <span>{family.cardCount} cards</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rail-section compact">
            <div className="section-head">
              <GitBranch size={15} />
              <span>현재 규칙</span>
            </div>
            <ul className="rule-list">
              <li>branch 기준은 current schema direct use 또는 adapted grouping</li>
              <li>subgroup split trigger는 `30+` card risk</li>
              <li>compare card 기본 term count는 `2~4`</li>
              <li>`활용 표현`은 later roadmap `MM3-295`</li>
            </ul>
          </div>
        </aside>

        <section className="center-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Navigator</span>
              <h1>{currentFamily?.label || "관계 탐색"}</h1>
              <p>{currentFamily?.summary || "actual relation family bootstrap을 불러옵니다."}</p>
            </div>
            <div className="header-badges">
              <span className="badge">actual relation bootstrap</span>
              <span className="badge">default 3단계</span>
            </div>
          </div>

          {familyError ? (
            <div className="empty-state">family load failed: {familyError}</div>
          ) : groups.length === 0 ? (
            <div className="empty-state">
              <RefreshCw size={16} className="spin" />
              family data loading
            </div>
          ) : filteredCards.length === 0 ? (
            <>
              <div className="bucket-row">
                {bucketOptions.map((bucket) => (
                  <button
                    key={bucket.label}
                    type="button"
                    className={`bucket-chip ${bucket.label === bucketFilter ? "is-active" : ""}`}
                    onClick={() => setBucketFilter(bucket.label)}
                  >
                    {bucket.label}
                    <span className="group-count">{bucket.count}</span>
                  </button>
                ))}
              </div>
              <label className="subgroup-search">
                <Search size={14} />
                <input
                  type="text"
                  value={subgroupQuery}
                  onChange={(event) => setSubgroupQuery(event.target.value)}
                  placeholder="하위 묶음 찾기"
                />
              </label>
              <div className="group-tabs">
                {visibleGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    className={`group-chip ${group.id === currentGroup?.id ? "is-active" : ""}`}
                    onClick={() => setGroupId(group.id)}
                  >
                    {group.label}
                    <span className="group-count">{group.visibleCardCount}</span>
                  </button>
                ))}
              </div>
              <div className="empty-state">현재 필터에 맞는 카드가 없습니다.</div>
            </>
          ) : (
            <>
              <div className="bucket-row">
                {bucketOptions.map((bucket) => (
                  <button
                    key={bucket.label}
                    type="button"
                    className={`bucket-chip ${bucket.label === bucketFilter ? "is-active" : ""}`}
                    onClick={() => setBucketFilter(bucket.label)}
                  >
                    {bucket.label}
                    <span className="group-count">{bucket.count}</span>
                  </button>
                ))}
              </div>
              <label className="subgroup-search">
                <Search size={14} />
                <input
                  type="text"
                  value={subgroupQuery}
                  onChange={(event) => setSubgroupQuery(event.target.value)}
                  placeholder="하위 묶음 찾기"
                />
              </label>
              <div className="group-tabs">
                {visibleGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    className={`group-chip ${group.id === currentGroup?.id ? "is-active" : ""}`}
                    onClick={() => setGroupId(group.id)}
                  >
                    {group.label}
                    <span className="group-count">{group.visibleCardCount}</span>
                  </button>
                ))}
              </div>

              <div className="card-stack">
                {filteredCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className={`study-card ${card.id === currentCard?.id ? "is-active" : ""}`}
                    onClick={() => setCardId(card.id)}
                  >
                    <div className="card-top">
                      <span className={`family-pill ${TONE_CLASS[currentFamily?.tone]}`}>
                        {currentFamily?.label}
                      </span>
                      <ArrowRight size={14} />
                    </div>
                    <h2>{card.title}</h2>
                    <p>{card.note}</p>
                    <div className="example-box">{card.example}</div>
                    {pickTranslation(card.terms[0], languageFilter) ? (
                      <div className="card-translation">
                        {pickTranslation(card.terms[0], languageFilter).language} · {pickTranslation(card.terms[0], languageFilter).word}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        <aside className="right-panel">
          {currentCard ? (
            <>
              <div className="mode-tabs">
                <button
                  type="button"
                  className={`mode-chip ${viewMode === "compare" ? "is-active" : ""}`}
                  onClick={() => setViewMode("compare")}
                >
                  <Layers3 size={14} />
                  Compare
                </button>
                <button
                  type="button"
                  className={`mode-chip ${viewMode === "detail" ? "is-active" : ""}`}
                  onClick={() => setViewMode("detail")}
                >
                  <Drill size={14} />
                  Detail
                </button>
                <button
                  type="button"
                  className={`mode-chip ${viewMode === "mindmap" ? "is-active" : ""}`}
                  onClick={() => setViewMode("mindmap")}
                >
                  <MapIcon size={14} />
                  Mindmap
                </button>
              </div>

              <div className="compare-card">
                <div className="section-head">
                  <Layers3 size={15} />
                  <span>
                    {viewMode === "compare"
                      ? "비교 학습 화면"
                      : viewMode === "detail"
                        ? "단어 drilldown"
                        : "관계도 보기"}
                  </span>
                </div>
                <h2>{currentCard.title}</h2>
                <p className="compare-note">{currentCard.note}</p>
                {viewMode === "compare" ? (
                  <>
                    <div className="definition-box">{currentCard.definition}</div>
                    <div className="term-grid">
                      {currentCard.terms.map((term) => (
                        <button
                          key={term.id}
                          type="button"
                          className={`term-tile ${detailTerm?.id === term.id ? "is-active" : ""}`}
                          onClick={() => setDetailTermId(term.id)}
                        >
                          <strong>{term.word}</strong>
                          <p>{term.hint}</p>
                          <span className="tile-meta">
                            {term.pos || "품사 미기재"}
                            {term.topikBand ? ` · ${TOPIK_LABELS[term.topikBand] || `Band ${term.topikBand}`}` : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}

                {viewMode === "detail" && detailTerm ? (
                  <div className="detail-sheet">
                    <div className="detail-sheet-head">
                      <strong>{detailTerm.word}</strong>
                      <span>{detailTerm.pos || "품사 미기재"}</span>
                    </div>
                    <p className="detail-definition">{detailTerm.definition}</p>
                    <ul className="rule-list detail-list">
                      <li>등급: {detailTerm.wordGrade || "미기재"}</li>
                      <li>TOPIK: {detailTerm.topikBand ? TOPIK_LABELS[detailTerm.topikBand] || `Band ${detailTerm.topikBand}` : "미기재"}</li>
                      <li>분류: {detailTerm.categoryValue || "미기재"}</li>
                      <li>경로: {detailTerm.hierarchyPath || "미기재"}</li>
                      <li>chunk: {detailTerm.chunkId || "없음"}</li>
                      <li>routing: {detailTerm.routing || "없음"}</li>
                    </ul>
                    <div className="translation-rail">
                      {(detailTerm.translationSummary || []).length > 0 ? (
                        (() => {
                          const selected = pickTranslation(detailTerm, languageFilter);
                          return selected ? (
                            <div key={`${detailTerm.id}-${selected.language}`} className="translation-chip">
                              <strong>{selected.language}</strong>
                              <span>{selected.word}</span>
                            </div>
                          ) : null;
                        })()
                      ) : (
                        <span className="muted-copy">translation summary 없음</span>
                      )}
                    </div>
                  </div>
                ) : null}

                {viewMode === "mindmap" ? (
                  <div className="mindmap-panel">
                    <svg viewBox="0 0 340 300" className="mindmap-svg" role="img" aria-label="관계도 보기">
                      {mindmapNodes.map((node) => (
                        <line
                          key={`line-${node.id}`}
                          x1="170"
                          y1="150"
                          x2={node.x}
                          y2={node.y}
                          className="mindmap-link"
                        />
                      ))}
                      <circle cx="170" cy="150" r="42" className="mindmap-center" />
                      <text x="170" y="145" textAnchor="middle" className="mindmap-center-label">
                        {currentFamily?.label}
                      </text>
                      <text x="170" y="162" textAnchor="middle" className="mindmap-center-sub">
                        {currentCard.subgroup}
                      </text>
                      {mindmapNodes.map((node) => (
                        <g
                          key={node.id}
                          className="mindmap-node"
                          onClick={() => {
                            setDetailTermId(node.id);
                            setViewMode("detail");
                          }}
                        >
                          <circle cx={node.x} cy={node.y} r="26" className="mindmap-node-circle" />
                          <text x={node.x} y={node.y + 4} textAnchor="middle" className="mindmap-node-label">
                            {node.word}
                          </text>
                        </g>
                      ))}
                    </svg>
                    <p className="mindmap-caption">
                      node를 누르면 actual detail drilldown으로 이동합니다.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="status-card">
                <div className="section-head">
                  <MapIcon size={15} />
                  <span>데이터 연결 상태</span>
                </div>
                <ul className="rule-list">
                  <li>subgroup: {currentCard.subgroup}</li>
                  <li>term ids: {currentCard.compareTarget.termIds.join(", ")}</li>
                  <li>chunk ids: {currentCard.compareTarget.chunkIds.join(", ") || "없음"}</li>
                  <li>routing: {currentCard.compareTarget.routing.join(", ") || "없음"}</li>
                  <li>view mode: {viewMode}</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="empty-state">study card가 아직 없습니다.</div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
