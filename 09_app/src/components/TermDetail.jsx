import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Hash,
  Link as LinkIcon,
  Volume2,
  Languages,
  Share2,
  Globe,
} from "lucide-react";

// ── V3 명세 방어 함수 ────────────────────────────────────────────
const safeBand = (stats) => {
  if (!stats) return null;
  const b = stats.band;
  if (b === null || b === undefined) return null;
  return typeof b === "number" && b >= 1 && b <= 5 ? b : null;
};

// V8 명세 국문 Band 명칭
const BAND_META = {
  1: { label: "최상위 필수",  label_en: "Essential", color: "#ff7b72", bg: "rgba(255,123,114,0.15)", border: "rgba(255,123,114,0.4)" },
  2: { label: "핵심 중요",    label_en: "High",       color: "#ffa657", bg: "rgba(255,166,87,0.15)",  border: "rgba(255,166,87,0.4)"  },
  3: { label: "일반 활용",    label_en: "Medium",     color: "#e3b341", bg: "rgba(227,179,65,0.15)",  border: "rgba(227,179,65,0.4)"  },
  4: { label: "보조 표현",    label_en: "Low",        color: "#3fb950", bg: "rgba(63,185,80,0.15)",   border: "rgba(63,185,80,0.4)"   },
  5: { label: "심화 어휘",    label_en: "Rare",       color: "#58a6ff", bg: "rgba(88,166,255,0.15)",  border: "rgba(88,166,255,0.4)"  },
};

const pickPrimaryTranslation = (translations = [], preferredLanguage = "영어") => {
  if (!translations.length) {
    return { primary: null, matchedPreferred: false };
  }
  const preferredIndex = translations.findIndex((t) => t?.language === preferredLanguage);
  const englishIndex = translations.findIndex((t) => t?.language === "영어");
  const primaryIndex = preferredIndex >= 0 ? preferredIndex : (englishIndex >= 0 ? englishIndex : 0);
  const primary = translations[primaryIndex] || null;
  return { primary, matchedPreferred: preferredIndex >= 0 };
};

const dedupeDisplayItems = (items, keyBuilder) => {
  const seen = new Set();
  const result = [];
  for (const item of items || []) {
    const key = keyBuilder(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
};

const isUnresolvedRelation = (item) => {
  const status = item?.link_status || "";
  const targetCode = item?.target_code;
  return status.startsWith("unresolved") || targetCode === 0 || targetCode === "0" || targetCode === null || targetCode === undefined;
};

// ── 컴포넌트 ─────────────────────────────────────────────────────
export const TermDetail = ({
  term,
  siblingSenses = [],
  onSenseSwitch,
  onCrossLinkClick,
  onRelatedVocabClick,
  onSenseRelationClick,
  onRelatedFormClick,
  onSubwordClick,
  isSearchWordAvailable,
  resolveReferenceMeta,
  showEnglish,
  translationLanguage,
}) => {
  const [activeTab, setActiveTab] = useState("core");
  const [selectedSenseId, setSelectedSenseId] = useState(null);
  const [showAllSenses, setShowAllSenses] = useState(false);

  if (!term) return null;

  const isVirtual = term.routing === "detail_only";

  const senses = term.senses || [];
  const relatedForms = term.related_forms || [];
  const subwords = term.subwords || [];
  const defaultSenseId = term.representative_sense_id || senses[0]?.id || null;

  useEffect(() => {
    setSelectedSenseId(defaultSenseId);
  }, [term?.id, defaultSenseId]);

  useEffect(() => {
    setShowAllSenses(false);
    setActiveTab("core");
  }, [term?.id, selectedSenseId]);

  const currentSense =
    senses.find((sense) => sense.id === selectedSenseId) ||
    senses[0] ||
    null;
  const currentTranslations = currentSense?.translations || term.translation_summary || [];
  const { primary: primaryTranslation, matchedPreferred } = pickPrimaryTranslation(currentTranslations, translationLanguage);
  const currentRelatedTerms = dedupeDisplayItems(
    currentSense?.related_terms || [],
    (item) =>
      isUnresolvedRelation(item)
        ? `${item?.type || ""}|${item?.word || ""}|unresolved`
        : `${item?.type || ""}|${item?.word || ""}|${item?.target_code || item?.homonym_no || item?.link_type || item?.link_status || "na"}`,
  );
  const dedupedRelatedForms = dedupeDisplayItems(
    relatedForms,
    (item) => `${item?.type || ""}|${item?.word || ""}|${item?.target_code || item?.link_type || item?.link_status || "na"}`,
  );
  const dedupedCrossLinks = dedupeDisplayItems(
    term.refs?.cross_links || [],
    (item) => `${item?.target_term || ""}|${item?.target_id || item?.target_category || item?.target_center_id || "na"}`,
  );
  const currentExamples =
    currentSense?.examples?.flatMap((ex) =>
      (ex.texts || []).map((text) => ({
        text_ko: text,
        text_en: null,
        source: ex.type || null,
      })),
    ) ||
    [];

  const band = safeBand(term.stats);
  const bandMeta = band ? BAND_META[band] : null;
  const roman =
    term.phonetic_romanization ||
    term.pronunciation?.[0]?.text ||
    term.roman ||
    "";
  const defKo = currentSense?.definition || term.def_ko || term.def_kr || "";
  const defEn = primaryTranslation?.definition || term.def_en || "";
  const pos = Array.isArray(term.pos) ? term.pos.join(", ") : term.pos || term.part_of_speech || "";
  const jumpableSubwords = subwords.filter((item) => isSearchWordAvailable?.(item.text));
  const previewOnlySubwords = subwords.filter((item) => !isSearchWordAvailable?.(item.text));
  const subwordJumpableCount = jumpableSubwords.length;
  const relationCount =
    (term.related_vocab?.length || 0) +
    currentRelatedTerms.length +
    dedupedRelatedForms.length +
    dedupedCrossLinks.length;
  const visibleSenses = showAllSenses ? senses : senses.slice(0, 8);
  const contextKind = term.hierarchy?.context_kind || null;
  const helperTitle = term.hierarchy?.helper_title || null;
  const helperDescription = term.hierarchy?.helper_description || null;
  const helperAccent = contextKind?.startsWith("unclassified")
    ? "var(--accent-purple)"
    : contextKind === "situation_none"
      ? "var(--accent-green)"
      : null;

  const renderSubwordCards = (items) => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, idx) => {
          const firstSense = item.senses?.[0] || null;
          const firstTranslation = firstSense?.translations?.[0] || null;
          const firstExample = firstSense?.examples?.[0] || null;
          const exampleText = firstExample?.texts?.[0] || null;
          const canJump = !!(item.text && isSearchWordAvailable?.(item.text));
          const senseCount = item.senses?.length || 0;

          return (
            <div
              key={`${item.unit}-${item.text}-${idx}`}
              data-testid={`subword-card-${item.text}`}
              className="card-glass"
              onClick={() => canJump && onSubwordClick && onSubwordClick(item)}
              style={{
                padding: 14,
                borderRadius: 12,
                borderLeft: "3px solid var(--accent-orange)",
                cursor: canJump ? "pointer" : "default",
                transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{item.text}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <div style={{ fontSize: 11, color: "var(--accent-orange)", border: "1px solid rgba(255,166,87,0.24)", background: "rgba(255,166,87,0.12)", borderRadius: 10, padding: "2px 8px", flexShrink: 0 }}>
                    {item.unit || "표현"}
                  </div>
                  <div style={{ fontSize: 11, color: canJump ? "var(--accent-blue)" : "var(--text-secondary)", border: `1px solid ${canJump ? "rgba(88,166,255,0.28)" : "var(--border-color)"}`, background: canJump ? "rgba(88,166,255,0.1)" : "rgba(255,255,255,0.04)", borderRadius: 10, padding: "2px 8px", flexShrink: 0 }}>
                    {canJump ? "독립 항목 연결" : "상세 연결 없음"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", border: "1px solid var(--border-color)", padding: "2px 8px", borderRadius: 10 }}>
                  부모 표제어 · {term.word}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", border: "1px solid var(--border-color)", padding: "2px 8px", borderRadius: 10 }}>
                  의미 {senseCount}개
                </span>
              </div>
              {firstSense?.definition && (
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.5 }}>
                  {firstSense.definition}
                </div>
              )}
              {firstTranslation && (
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>
                  {firstTranslation.language}: {firstTranslation.word}
                </div>
              )}
              {exampleText && (
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8, opacity: 0.8 }}>
                  예: {exampleText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderRelatedChips = (items, onClick) => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
        {items.map((i, idx) => {
          const word = typeof i === "string" ? i : i.label || i;
          const clickable = !!onClick;
          return (
            <span
              key={idx}
              onClick={() => clickable && onClick(word)}
              title={clickable ? `'${word}' 탐색` : word}
              style={{
                padding: "5px 12px",
                borderRadius: 16,
                background: clickable
                  ? "linear-gradient(135deg, rgba(88,166,255,0.1), rgba(188,140,255,0.1))"
                  : "rgba(255,255,255,0.05)",
                border: clickable
                  ? "1px solid rgba(88,166,255,0.35)"
                  : "1px solid var(--border-color)",
                fontSize: 13,
                fontWeight: 500,
                color: clickable ? "var(--accent-blue)" : "var(--text-secondary)",
                cursor: clickable ? "pointer" : "default",
                transition: "all 0.18s",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (clickable) {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(88,166,255,0.22), rgba(188,140,255,0.22))";
                  e.currentTarget.style.borderColor = "rgba(88,166,255,0.7)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 3px 10px rgba(88,166,255,0.25)";
                }
              }}
              onMouseLeave={(e) => {
                if (clickable) {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(88,166,255,0.1), rgba(188,140,255,0.1))";
                  e.currentTarget.style.borderColor = "rgba(88,166,255,0.35)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  const renderSectionTitle = (icon, label, color, count = null) => (
    <h4
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        color,
        fontSize: 12,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {icon}
      <span>{label}</span>
      {count !== null && (
        <span
          style={{
            fontSize: 10,
            color: "var(--text-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 999,
            padding: "1px 6px",
            letterSpacing: 0,
          }}
        >
          {count}
        </span>
      )}
    </h4>
  );

  const renderWorkflowTitle = (label, count = null) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{label}</div>
      {count !== null && (
        <span
          style={{
            fontSize: 10,
            color: "var(--text-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 999,
            padding: "1px 6px",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );

  const renderEmptyState = (label) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "var(--text-secondary)" }}>
      <BookOpen size={24} style={{ marginBottom: 12, opacity: 0.45 }} />
      <span>{label}</span>
    </div>
  );

  const buildRelationLabel = (item, fallbackPrefix) => {
    const meta = resolveReferenceMeta?.(item);
    const base = `${fallbackPrefix || item?.type}: ${item?.word}`;
    if (!meta) return base;
    const pos = meta.pos ? ` · ${meta.pos}` : "";
    let gloss = "";
    if (meta.def_ko) {
      const def = meta.def_ko.trim();
      if (def.length > 20) {
        gloss = ` · ${def.slice(0, 10)}…${def.slice(-8)}`;
      } else {
        gloss = ` · ${def}`;
      }
    }
    return `${base}${pos}${gloss}`;
  };

  const hasRepeatedRelationWord = (items) => {
    const counts = new Map();
    (items || []).forEach((item) => {
      const word = item?.word;
      if (!word) return;
      counts.set(word, (counts.get(word) || 0) + 1);
    });
    return Array.from(counts.values()).some((count) => count > 1);
  };

  const renderChips = (items, onClick) => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {items.map((i, idx) => (
          <span
            key={idx}
            onClick={() => onClick && onClick(i)}
            style={{
              padding: "4px 10px", borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-color)",
              fontSize: 12, color: "var(--text-secondary)",
              cursor: onClick ? "pointer" : "default",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (onClick) {
                e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                e.currentTarget.style.color = "var(--text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (onClick) {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }
            }}
          >
            {typeof i === "string" ? i : i.label || i}
          </span>
        ))}
      </div>
    );
  };


  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", backgroundColor: "var(--bg-primary)" }}>

      {/* ── 헤더 ── */}
      <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(22,27,34,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          {/* 단어 + 발음 */}
          <div>
            <div data-testid="detail-word" style={{ fontSize: 32, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
              {term.word}
            </div>
            {roman && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-purple)", marginTop: 6, fontSize: 14 }}>
                <Volume2 size={14} /> <span>[{roman}]</span>
              </div>
            )}
          </div>

          {/* Band + Level 배지 (우측 상단) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            {bandMeta ? (
              <span style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                color: bandMeta.color, background: bandMeta.bg, border: `1.5px solid ${bandMeta.border}`,
                whiteSpace: "nowrap",
              }}>
                Band {band} · {bandMeta.label}
              </span>
            ) : (
              <span style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                color: "#6e7681", background: "rgba(110,118,129,0.08)", border: "1px solid rgba(110,118,129,0.2)",
              }}>Band 미산출</span>
            )}
          </div>
        </div>

        {/* 메타 태그 — 빈도수 숫자 제거, path_ko만 노출 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {pos && (
            <span style={{ fontSize: 12, color: "var(--text-secondary)", border: "1px solid var(--border-color)", padding: "2px 8px", borderRadius: 12 }}>
              {pos}
            </span>
          )}
          {(term.hierarchy?.display_path_ko || term.hierarchy?.path_ko) && (
            <span data-testid="detail-path" style={{ fontSize: 12, color: "var(--text-secondary)", border: "1px solid var(--border-color)", padding: "2px 8px", borderRadius: 12 }}>
              {term.hierarchy.display_path_ko || term.hierarchy.path_ko}
            </span>
          )}
        </div>
      </div>

      {/* ── 탭 (통계 탭 제거) ── */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", padding: "0 16px" }}>
        {[
          { key: "core", label: "핵심", count: null },
          { key: "relations", label: "관계", count: relationCount || null },
          { key: "expressions", label: "표현", count: subwords.length || null },
          { key: "examples", label: "예문", count: (currentExamples.length > 0 ? currentExamples.length : term.examples_bundle?.length) || null },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              ...tabBtnStyle,
              color: activeTab === t.key ? "var(--accent-blue)" : "var(--text-secondary)",
              borderBottomColor: activeTab === t.key ? "var(--accent-blue)" : "transparent",
            }}
          >
            {t.label}
            {t.count ? <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.65 }}>{t.count}</span> : null}
          </button>
        ))}
      </div>

      {/* ── 콘텐츠 ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

        {/* 핵심 탭 */}
        {activeTab === "core" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {!isVirtual && (
              <div className="card-glass" style={{ padding: 20, borderRadius: 12 }}>
                <div data-testid="detail-definition" style={{ fontSize: 16, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.6 }}>
                  {defKo || "정의 없음"}
                </div>
                {showEnglish && defEn && (
                  <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <Globe size={14} style={{ marginTop: 2, flexShrink: 0, opacity: 0.7 }} />
                    <div>
                      {primaryTranslation?.language && (
                        <div style={{ fontSize: 11, color: "var(--accent-green)", marginBottom: 4 }}>
                          {matchedPreferred ? `번역 언어 · ${primaryTranslation.language}` : `대표 번역 · ${primaryTranslation.language}`}
                        </div>
                      )}
                      <span style={{ fontStyle: "italic" }}>{defEn}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {isVirtual && (
              <div style={{ color: "var(--text-secondary)", fontStyle: "italic", padding: "20px 0" }}>
                (관련 어휘로 탐색 중 — 코어 상세 정보가 없습니다)
              </div>
            )}

            {helperTitle && helperDescription && helperAccent && (
              <div data-testid="detail-context-helper" className="card-glass" style={{ padding: 14, borderRadius: 12, borderLeft: `3px solid ${helperAccent}` }}>
                <div style={{ fontSize: 12, color: helperAccent, fontWeight: 700, marginBottom: 6 }}>
                  {helperTitle}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {helperDescription}
                </div>
              </div>
            )}

            {subwords.length > 0 && (
              <div data-testid="expression-workflow-helper" className="card-glass" style={{ padding: 16, borderRadius: 12, borderLeft: "3px solid var(--accent-orange)" }}>
                <div style={{ fontSize: 12, color: "var(--accent-orange)", fontWeight: 700, marginBottom: 6 }}>
                  표현 활용 워크플로우
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
                  핵심 뜻을 확인한 뒤 표현층으로 확장해 보세요. {subwordJumpableCount > 0
                    ? `먼저 \`독립 항목 연결\`이 있는 표현부터 열면 별도 표제어 학습으로 이어집니다.`
                    : "현재는 부모 어휘 맥락에서 쓰임을 미리보기로 확인하는 흐름이 중심입니다."}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>1. 핵심 뜻과 대표 의미를 먼저 확인</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>2. 표현층에서 문장형·관용형 확장을 확인</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>3. `독립 항목 연결`은 점프, `상세 연결 없음`은 부모 어휘 맥락에서 preview</div>
                </div>
                <button
                  data-testid="expression-workflow-open"
                  onClick={() => setActiveTab("expressions")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,166,87,0.32)",
                    background: "rgba(255,166,87,0.12)",
                    color: "var(--accent-orange)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  활용 흐름 열기
                </button>
              </div>
            )}

            {currentTranslations.length > 0 && (
              <div>
                {renderSectionTitle(<Languages size={13} />, "번역", "var(--accent-green)", 1)}
                {primaryTranslation && (
                  <div className="card-glass" style={{ padding: 14, borderRadius: 12, borderLeft: "3px solid var(--accent-green)", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{primaryTranslation.word}</div>
                      <div style={{ fontSize: 11, color: "var(--accent-green)", border: "1px solid rgba(63,185,80,0.24)", background: "rgba(63,185,80,0.12)", borderRadius: 10, padding: "2px 8px", flexShrink: 0 }}>
                        {primaryTranslation.language || "대표 번역"}
                      </div>
                    </div>
                    {primaryTranslation.definition && (
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.5 }}>
                        {primaryTranslation.definition}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {senses.length > 1 && (
              <div>
                {renderSectionTitle(<BookOpen size={13} />, "의미 선택", "var(--accent-blue)", senses.length)}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {visibleSenses.map((sense) => {
                    const isActive = currentSense?.id === sense.id;
                    return (
                      <button
                        key={sense.id}
                        onClick={() => setSelectedSenseId(sense.id)}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: `1px solid ${isActive ? "var(--accent-blue)" : "var(--border-color)"}`,
                          background: isActive ? "rgba(88,166,255,0.12)" : "var(--bg-secondary)",
                          color: isActive ? "var(--accent-blue)" : "var(--text-secondary)",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: 12,
                          maxWidth: 260,
                        }}
                      >
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>
                          {sense.id?.split("#sense-")[1] || "의미"}
                        </div>
                        <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {sense.definition}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {senses.length > 8 && (
                  <button
                    onClick={() => setShowAllSenses((v) => !v)}
                    style={{
                      marginTop: 10,
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "1px solid rgba(88,166,255,0.24)",
                      background: "rgba(88,166,255,0.08)",
                      color: "var(--accent-blue)",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {showAllSenses ? "대표 의미만 보기" : `전체 의미 ${senses.length}개 보기`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 관계 탭 */}
        {activeTab === "relations" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {term.related_vocab && term.related_vocab.length > 0 && (
              <div>
                {renderSectionTitle(<Share2 size={13} />, "연관 어휘", "var(--text-secondary)", term.related_vocab.length)}
                {renderRelatedChips(term.related_vocab, onRelatedVocabClick)}
              </div>
            )}

            {currentRelatedTerms.length > 0 && (
              <div>
                {renderSectionTitle(<LinkIcon size={13} />, "의미 관계어", "var(--accent-blue)", currentRelatedTerms.length)}
                {hasRepeatedRelationWord(currentRelatedTerms) && (
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>
                    같은 표면형이라도 대상 의미가 다르면 따로 유지합니다.
                  </div>
                )}
                {renderChips(
                  currentRelatedTerms.map((item) => ({
                    label: buildRelationLabel(item, item.type),
                    value: item,
                  })),
                  (item) => onSenseRelationClick && onSenseRelationClick(item.value),
                )}
              </div>
            )}

            {dedupedRelatedForms.length > 0 && (
              <div>
                {renderSectionTitle(<Share2 size={13} />, "관련형", "var(--accent-purple)", dedupedRelatedForms.length)}
                {hasRepeatedRelationWord(dedupedRelatedForms) && (
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>
                    같은 표면형으로 보여도 관계 유형 또는 대상 의미가 다르면 따로 유지합니다.
                  </div>
                )}
                {renderChips(
                  dedupedRelatedForms.map((item) => ({
                    label: buildRelationLabel(item, item.type),
                    value: item,
                  })),
                  (item) => onRelatedFormClick && onRelatedFormClick(item.value),
                )}
              </div>
            )}

            {term.original_language?.form && (
              <div>
                <h4 style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                  <Hash size={13} /> 원어 정보
                </h4>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {term.original_language?.type || "원어"} · {term.original_language.form}
                </div>
              </div>
            )}

            {dedupedCrossLinks.length > 0 && (
              <div>
                {renderSectionTitle(<LinkIcon size={13} />, "교차 연결 장면", "var(--accent-blue)", dedupedCrossLinks.length)}
                {renderChips(
                  dedupedCrossLinks.map((c) => ({ label: `${c.target_term} ➔ ${c.target_category || c.target_center_id || ""}`, value: c })),
                  (val) => onCrossLinkClick && onCrossLinkClick(val.value),
                )}
              </div>
            )}

            {siblingSenses.length > 1 && (
              <div>
                {renderSectionTitle(<Hash size={13} />, "다른 뜻 보기", "var(--accent-orange)", siblingSenses.length - 1)}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {siblingSenses.filter((s) => s.id !== term.id).map((sib) => (
                    <button key={sib.id} onClick={() => onSenseSwitch(sib)}
                      style={{ padding: "8px 12px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8, color: "var(--text-primary)", cursor: "pointer", fontSize: 13, textAlign: "left" }}>
                      <div style={{ fontWeight: 600, color: "var(--accent-orange)" }}>{sib.word}</div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                        {showEnglish && sib.def_en ? sib.def_en : sib.def_ko}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {relationCount === 0 && !term.original_language?.form && siblingSenses.length <= 1 ? renderEmptyState("관계 데이터가 없습니다.") : null}
          </div>
        )}

        {/* 표현 탭 */}
        {activeTab === "expressions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {subwords.length > 0 ? (
              <div>
                {renderSectionTitle(<BookOpen size={13} />, "표현층", "var(--accent-orange)", subwords.length)}
                <div className="card-glass" style={{ padding: 14, borderRadius: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "var(--accent-orange)", fontWeight: 700, marginBottom: 6 }}>
                    표현 학습 파이프라인
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    핵심 뜻을 이해한 뒤 표현층으로 확장합니다. `독립 항목 연결`이 있는 표현은 별도 표제어로 이동하고, `상세 연결 없음` 표현은 현재 표제어 안에서 쓰임을 확인합니다.
                  </div>
                </div>
                {jumpableSubwords.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    {renderWorkflowTitle("바로 탐색 가능한 표현", jumpableSubwords.length)}
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>
                      독립 표제어로 바로 이어지는 표현입니다. 먼저 여기서 확장하면 표현 중심 탐색이 자연스럽게 이어집니다.
                    </div>
                    {renderSubwordCards(jumpableSubwords)}
                  </div>
                )}
                {previewOnlySubwords.length > 0 && (
                  <div>
                    {renderWorkflowTitle("부모 어휘 맥락에서 보는 표현", previewOnlySubwords.length)}
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>
                      독립 표제어 연결은 없지만, 현재 단어가 실제 문장형·관용형 표현에서 어떻게 쓰이는지 확인하는 preview 영역입니다.
                    </div>
                    {renderSubwordCards(previewOnlySubwords)}
                  </div>
                )}
              </div>
            ) : (
              renderEmptyState("표현층 데이터가 없습니다.")
            )}
          </div>
        )}

        {/* 예문 탭 */}
        {activeTab === "examples" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div data-testid="examples-workflow-helper" className="card-glass" style={{ padding: "12px 14px", borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                예문은 현재 선택된 의미의 사전 예문을 우선 보여주고, 없으면 대표 예문으로 대체합니다. 카드 하단 source는 `구/문장` 같은 사전 예문 유형이나, chunk fallback이 쓰일 때는 `TOPIK round`를 표시합니다. 현재는 최대 8개까지만 노출합니다.
              </div>
            </div>
            {currentExamples.length === 0 && (!term.examples_bundle || term.examples_bundle.length === 0) ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "var(--text-secondary)" }}>
                <BookOpen size={24} style={{ marginBottom: 12, opacity: 0.5 }} />
                <span>예문 데이터가 없습니다.</span>
              </div>
            ) : (
              (currentExamples.length > 0 ? currentExamples : term.examples_bundle).map((ex, idx) => (
                <div key={idx} className="card-glass" style={{ padding: "16px 20px", borderRadius: 12, borderLeft: "3px solid var(--accent-blue)" }}>
                  <div style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.6, marginBottom: 8 }}>
                    {ex.text_ko}
                  </div>
                  {showEnglish && ex.text_en && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic", borderTop: "1px solid var(--border-color)", paddingTop: 8 }}>
                      <Globe size={12} style={{ marginTop: 2, flexShrink: 0, opacity: 0.7 }} />
                      {ex.text_en}
                    </div>
                  )}
                  {ex.source && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)", opacity: 0.5, textAlign: "right", letterSpacing: 0.5 }}>
                      {ex.source}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const tabBtnStyle = {
  all: "unset", padding: "12px 20px", fontSize: 14, fontWeight: 600,
  cursor: "pointer", borderBottom: "2px solid transparent",
  transition: "all 0.2s ease", flex: 1, textAlign: "center",
};
