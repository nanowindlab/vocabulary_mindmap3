import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Hash,
  Link as LinkIcon,
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

const isTopikSource = (source = "") =>
  typeof source === "string" && source.toUpperCase().startsWith("TOPIK");

const formatExampleSourceLabel = (source = null) => {
  if (!source) return null;
  if (isTopikSource(source)) return "TOPIK";
  return source;
};

const buildExampleItems = (senseExamples = [], fallbackExamples = []) => {
  const prioritized = [
    ...(senseExamples || []).map((item, index) => ({
      ...item,
      __priority: isTopikSource(item?.source) ? 0 : 1,
      __order: index,
    })),
    ...(fallbackExamples || []).map((item, index) => ({
      ...item,
      __priority: isTopikSource(item?.source) ? 0 : 2,
      __order: index,
    })),
  ]
    .filter((item) => item?.text_ko)
    .sort((a, b) => a.__priority - b.__priority || a.__order - b.__order);

  const seen = new Set();
  return prioritized
    .filter((item) => {
      const key = item.text_ko.trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(({ __priority, __order, ...item }) => item);
};

const formatRelationDisplayLabel = (item, meta = null) => {
  const baseLabel = item?.word || meta?.word || "—";
  const homonymNo = item?.homonym_no ?? meta?.homonym_no ?? null;
  const normalized = homonymNo === null || homonymNo === undefined ? "" : String(homonymNo).trim();
  if (!normalized || normalized === "0") return baseLabel;
  return `${baseLabel}${normalized}`;
};

const formatSenseNumber = (senseId, totalCount) => {
  const raw = String(senseId || "").split("#sense-")[1] || "";
  const numeric = Number.parseInt(raw, 10);
  if (!Number.isFinite(numeric)) return raw || "의미";
  const width = Math.max(String(totalCount || 0).length, 1);
  return String(numeric).padStart(width, "0");
};

const toSenseTestId = (senseId) =>
  String(senseId || "sense").replace(/[^a-zA-Z0-9_-]/g, "_");

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

const relationStatusMeta = (item) => {
  const status = item?.link_status || "";
  if (status === "unresolved_no_target_code" || status === "unresolved_zero_code") {
    return {
      label: "원본 target 미지정",
      tone: "var(--text-secondary)",
      border: "rgba(148,163,184,0.28)",
      bg: "rgba(148,163,184,0.10)",
      helper: "원본 사전에서 연결 대상을 명시하지 않은 관련형입니다.",
    };
  }
  if (status === "resolved_multi_exact_word_backfill") {
    return {
      label: "다중 연결",
      tone: "var(--accent-purple)",
      border: "rgba(188,140,255,0.35)",
      bg: "rgba(188,140,255,0.12)",
      helper: "같은 표면형이 여러 내부 항목으로 이어져 품사와 뜻으로 구분해 보여 줍니다.",
    };
  }
  if (status === "resolved_exact_word_backfill") {
    return {
      label: "단일 연결",
      tone: "var(--accent-blue)",
      border: "rgba(88,166,255,0.35)",
      bg: "rgba(88,166,255,0.12)",
      helper: null,
    };
  }
  return null;
};

const selectPreferredRelatedForm = (current, candidate) => {
  const isPointer = (item) => (item?.type || "").startsWith("☞");
  if (isPointer(current) && !isPointer(candidate)) return candidate;
  return current;
};

const dedupeRelatedFormsByTarget = (items = []) => {
  const unresolved = [];
  const byTarget = new Map();

  for (const item of items) {
    const targetKey = item?.target_code || item?.word || null;
    if (!targetKey) {
      unresolved.push(item);
      continue;
    }
    if (!byTarget.has(targetKey)) {
      byTarget.set(targetKey, item);
      continue;
    }
    byTarget.set(targetKey, selectPreferredRelatedForm(byTarget.get(targetKey), item));
  }

  return [...byTarget.values(), ...unresolved];
};

const getRepeatedWordSet = (items) => {
  const counts = new Map();
  (items || []).forEach((item) => {
    const word = item?.word;
    if (!word) return;
    counts.set(word, (counts.get(word) || 0) + 1);
  });
  return new Set(
    Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([word]) => word),
  );
};

const countUniqueRelationGroups = (items = []) => {
  const groups = new Set();
  items.forEach((item) => {
    const typeLabel = item?.type || "관련형";
    const word = item?.word || "—";
    groups.add(`${typeLabel}|${word}`);
  });
  return groups.size;
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
  onClose,
  isSearchWordAvailable,
  isReferenceJumpAvailable,
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
  const dedupedRelatedForms = dedupeRelatedFormsByTarget(dedupeDisplayItems(
    relatedForms,
    (item) => `${item?.type || ""}|${item?.word || ""}|${item?.target_code || item?.link_type || item?.link_status || "na"}`,
  ));
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
  const shouldUseFallbackExamples =
    senses.length <= 1 || currentSense?.id === defaultSenseId;
  const exampleItems = buildExampleItems(
    currentExamples,
    shouldUseFallbackExamples ? (term.examples_bundle || []) : [],
  );

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
  const shouldShowContextHelper =
    !!(helperTitle && helperDescription && helperAccent && contextKind !== "situation_none");
  const fallbackGuidanceChip = contextKind === "situation_none"
    ? {
        label: "탐색 기준 · 핵심/예문 먼저",
        tone: "var(--accent-green)",
        border: "rgba(63,185,80,0.24)",
        background: "rgba(63,185,80,0.12)",
      }
    : contextKind === "unclassified_functional"
      ? {
          label: "탐색 기준 · 품사/형태 먼저",
          tone: "var(--accent-purple)",
          border: "rgba(188,140,255,0.24)",
          background: "rgba(188,140,255,0.12)",
        }
      : contextKind === "unclassified_content"
        ? {
            label: "탐색 기준 · 품사/난이도 먼저",
            tone: "var(--accent-purple)",
            border: "rgba(188,140,255,0.24)",
            background: "rgba(188,140,255,0.12)",
          }
        : null;
  const headerTranslationPreview =
    showEnglish && primaryTranslation?.word
      ? `${primaryTranslation.language || "대표 번역"} · ${primaryTranslation.word}`
      : null;
  const canJumpToRelation = (item) => {
    if (typeof isReferenceJumpAvailable === "function") {
      return isReferenceJumpAvailable(item);
    }
    return !isUnresolvedRelation(item);
  };
  const jumpableRelatedForms = dedupedRelatedForms.filter((item) => !isUnresolvedRelation(item) && canJumpToRelation(item));
  const textOnlyRelatedForms = dedupedRelatedForms.filter((item) => !jumpableRelatedForms.includes(item));
  const relationOverviewItems = [
    {
      label: "의미 관계어",
      count: currentRelatedTerms.length,
      tone: "var(--accent-blue)",
      border: "rgba(88,166,255,0.28)",
      background: "rgba(88,166,255,0.10)",
    },
    {
      label: "바로 이동 관련형",
      count: countUniqueRelationGroups(jumpableRelatedForms),
      tone: "var(--accent-purple)",
      border: "rgba(188,140,255,0.32)",
      background: "rgba(188,140,255,0.10)",
    },
    {
      label: "원본 표면형만 있음",
      count: countUniqueRelationGroups(textOnlyRelatedForms),
      tone: "var(--text-secondary)",
      border: "rgba(148,163,184,0.28)",
      background: "rgba(148,163,184,0.10)",
    },
    {
      label: "교차 연결 장면",
      count: dedupedCrossLinks.length,
      tone: "var(--accent-green)",
      border: "rgba(63,185,80,0.28)",
      background: "rgba(63,185,80,0.10)",
    },
  ].filter((item) => item.count > 0);

  const renderSubwordCards = (items) => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, idx) => {
          const firstSense = item.senses?.[0] || null;
          const firstTranslations = firstSense?.translations || [];
          const {
            primary: firstTranslation,
            matchedPreferred: matchedSubwordPreferred,
          } = pickPrimaryTranslation(firstTranslations, translationLanguage);
          const firstExample = firstSense?.examples?.[0] || null;
          const exampleText = firstExample?.texts?.[0] || null;
          const canJump = !!(item.text && isSearchWordAvailable?.(item.text));

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
                  {canJump ? (
                    <div style={{ fontSize: 11, color: "var(--accent-blue)", border: "1px solid rgba(88,166,255,0.28)", background: "rgba(88,166,255,0.1)", borderRadius: 10, padding: "2px 8px", flexShrink: 0 }}>
                      독립 항목 연결
                    </div>
                  ) : null}
                </div>
              </div>
              {firstSense?.definition && (
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.5 }}>
                  {firstSense.definition}
                </div>
              )}
              {showEnglish && firstTranslation && (
                <div
                  data-testid={`subword-translation-${item.text}`}
                  style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 8 }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--accent-green)",
                      border: "1px solid rgba(63,185,80,0.24)",
                      background: "rgba(63,185,80,0.12)",
                      borderRadius: 999,
                      padding: "2px 8px",
                    }}
                  >
                    {(matchedSubwordPreferred ? "번역 언어" : "대표 번역")} · {firstTranslation.language}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>
                    {firstTranslation.word}
                  </span>
                </div>
              )}
              {exampleText && (
                <div
                  data-testid={`subword-example-${item.text}`}
                  style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 8 }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: 999,
                      padding: "2px 8px",
                    }}
                  >
                    예문:
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", opacity: 0.9 }}>
                    {exampleText}
                  </span>
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
      {icon ? icon : null}
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

  const renderCompactOverview = (testId, title, description, items, accentColor = "var(--accent-blue)") => {
    if (!items || items.length === 0) return null;
    return (
      <div
        data-testid={testId}
        className="card-glass"
        style={{ padding: 10, borderRadius: 12, borderLeft: `3px solid ${accentColor}` }}
      >
        <div style={{ fontSize: 11, color: accentColor, fontWeight: 700, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
          {description}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {items.map((item) => (
            <div
              key={item.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                border: `1px solid ${item.border}`,
                background: item.background,
              }}
            >
              <span style={{ fontSize: 11, color: item.tone, fontWeight: 700 }}>
                {item.label}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 700 }}>
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
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

  const renderRelationSection = (testId, title, helper, count, color, content) => (
    <div data-testid={testId} className="card-glass detail-section-card" style={{ padding: 16, borderRadius: 12, borderLeft: `3px solid ${color}` }}>
      {renderSectionTitle(null, title, color, count)}
      {helper ? (
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.5 }}>
          {helper}
        </div>
      ) : null}
      {content}
    </div>
  );

  const renderRelationOverview = () => {
    if (relationOverviewItems.length === 0) return null;
    return (
      <div
        data-testid="relation-overview"
        className="card-glass detail-section-card"
        style={{ padding: 16, borderRadius: 12, borderLeft: "3px solid var(--accent-blue)" }}
      >
        <div style={{ fontSize: 12, color: "var(--accent-blue)", fontWeight: 700, marginBottom: 6 }}>
          읽는 순서
        </div>
        <div style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6 }}>
          먼저 현재 뜻과 직접 연결된 관계를 보고, 그다음 관련형과 교차 연결 장면을 확인하면 됩니다.
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 8 }}>
          같은 표면형이더라도 품사와 뜻이 다르면 따로 유지하고, 원본 사전에 target이 없는 항목은 text-only로 남깁니다.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {relationOverviewItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                border: `1px solid ${item.border}`,
                background: item.background,
              }}
            >
              <span style={{ fontSize: 11, color: item.tone, fontWeight: 700 }}>
                {item.label}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 700 }}>
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRelationCards = (items, options = {}) => {
    if (!items || items.length === 0) return null;
    const {
      accentColor = "var(--accent-blue)",
      testPrefix = "relation-card",
      onItemClick = null,
      groupBySurface = false,
    } = options;

    let displayItems = [];
    if (groupBySurface) {
      const groups = new Map();
      items.forEach((item) => {
        const meta = resolveReferenceMeta?.(item);
        const label = item?.word || meta?.word || "—";
        const typeLabel = item?.type || "관련형";
        const key = `${typeLabel}|${label}`;
        if (!groups.has(key)) {
          groups.set(key, {
            label,
            typeLabel,
            posLabels: new Set(),
            definitions: [],
            entries: [],
            rows: [],
            statusMeta: null,
          });
        }
        const group = groups.get(key);
        if (meta?.pos) group.posLabels.add(meta.pos);
        if (meta?.def_ko && !group.definitions.includes(meta.def_ko)) {
          group.definitions.push(meta.def_ko);
        }
        group.rows.push({
          entry: item,
          pos: meta?.pos || null,
          definition: meta?.def_ko || null,
          statusMeta: relationStatusMeta(item),
        });
        if (!group.statusMeta && relationStatusMeta(item)) {
          group.statusMeta = relationStatusMeta(item);
        }
        group.entries.push(item);
      });
      displayItems = Array.from(groups.values());
    } else {
      displayItems = items.map((item) => {
        const meta = resolveReferenceMeta?.(item);
        return {
          label: formatRelationDisplayLabel(item, meta),
          typeLabel: item?.type || "관련형",
          posLabels: meta?.pos ? new Set([meta.pos]) : new Set(),
          definitions: meta?.def_ko ? [meta.def_ko] : [],
          entries: [item],
          rows: [{
            entry: item,
            pos: meta?.pos || null,
            definition: meta?.def_ko || null,
            statusMeta: relationStatusMeta(item),
          }],
          statusMeta: relationStatusMeta(item),
        };
      });
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        {displayItems.map((item, idx) => {
          const clickableEntries = item.entries.filter((entry) => {
            if (!onItemClick) return false;
            return canJumpToRelation(entry);
          });
          const singleEntryClickable = clickableEntries.length === 1 && item.entries.length === 1;
          const unresolvedOnly = item.entries.length > 0 && clickableEntries.length === 0;
          return (
          <div
            key={`${item.label}-${item.typeLabel}-${idx}`}
            data-testid={`${testPrefix}-${item.label}-${idx}`}
            className="card-glass"
            onClick={() => singleEntryClickable && onItemClick(item.entries[0])}
            style={{
              padding: 14,
              borderRadius: 12,
              borderLeft: `3px solid ${accentColor}`,
              background: "rgba(255,255,255,0.02)",
              borderTop: "1px solid var(--border-color)",
              borderRight: "1px solid var(--border-color)",
              borderBottom: "1px solid var(--border-color)",
              cursor: singleEntryClickable ? "pointer" : "default",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.25 }}>
                  {item.label}
                </div>
                {item.posLabels.size > 0 ? (
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                    {Array.from(item.posLabels).join(" · ")}
                  </div>
                ) : null}
              </div>
              <div
                data-testid={`${testPrefix}-type-${item.label}-${idx}`}
                style={{
                  fontSize: 11,
                  color: accentColor,
                  border: `1px solid ${accentColor}4d`,
                  background: accentColor === "var(--accent-blue)" ? "rgba(88,166,255,0.12)" : "rgba(188,140,255,0.12)",
                  borderRadius: 999,
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  fontWeight: 700,
                }}
              >
                {item.typeLabel}
              </div>
            </div>
            {item.statusMeta?.helper ? (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {item.statusMeta.helper}
              </div>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {item.rows.map((row, definitionIdx) => {
                const sourceEntry = row.entry || item.entries[definitionIdx] || item.entries[0];
                const clickable = clickableEntries.includes(sourceEntry);
                return (
                  <div
                    key={`${item.label}-definition-${definitionIdx}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: 0,
                    }}
                  >
                    {row.pos ? (
                      <span
                        style={{
                          flexShrink: 0,
                          marginTop: 1,
                          fontSize: 11,
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-color)",
                          borderRadius: 999,
                          padding: "2px 8px",
                          lineHeight: 1.4,
                        }}
                      >
                        {row.pos}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (clickable) onItemClick(sourceEntry);
                      }}
                      style={{
                        all: "unset",
                        display: "block",
                        cursor: clickable ? "pointer" : "default",
                        color: "var(--text-secondary)",
                        fontSize: 14,
                        lineHeight: 1.6,
                        flex: 1,
                      }}
                    >
                      {row.definition || "정의 없음"}
                    </button>
                    {row.statusMeta?.label ? (
                      <span
                        style={{
                          flexShrink: 0,
                          fontSize: 11,
                          color: row.statusMeta.tone,
                          border: `1px solid ${row.statusMeta.border}`,
                          background: row.statusMeta.bg,
                          borderRadius: 999,
                          padding: "2px 8px",
                          lineHeight: 1.4,
                        }}
                      >
                        {row.statusMeta.label}
                      </span>
                    ) : null}
                  </div>
                );
              })}
              {unresolvedOnly ? (
                <div
                  data-testid={`${testPrefix}-unresolved-${item.label}-${idx}`}
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  원본 사전에서 연결 대상을 지정하지 않은 항목입니다.
                </div>
              ) : null}
            </div>
          </div>
        );
        })}
      </div>
    );
  };

  return (
    <div className="detail-surface-root" style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", backgroundColor: "var(--bg-primary)" }}>

      {/* ── 헤더 ── */}
      <div className="detail-header-shell" style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(22,27,34,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          {/* 단어 + 발음 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <div data-testid="detail-word" style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                {term.word}
              </div>
              {roman && (
                <div data-testid="detail-pronunciation" style={{ color: "var(--accent-purple)", fontSize: 14, fontWeight: 600 }}>
                  [{roman}]
                </div>
              )}
            </div>
            {(defKo || headerTranslationPreview) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginTop: 6 }}>
                {defKo ? (
                  <div
                    data-testid="detail-header-definition"
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      minWidth: 0,
                    }}
                  >
                    {defKo}
                  </div>
                ) : null}
                {headerTranslationPreview ? (
                  <span
                    data-testid="detail-header-translation-preview"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: 10,
                      color: "var(--accent-green)",
                      border: "1px solid rgba(63,185,80,0.24)",
                      background: "rgba(63,185,80,0.12)",
                      borderRadius: 999,
                      padding: "3px 8px",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {headerTranslationPreview}
                  </span>
                ) : null}
              </div>
            )}
          </div>

          {/* Band + 닫기 */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
            {bandMeta ? (
              <span style={{
                padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                color: bandMeta.color, background: bandMeta.bg, border: `1.5px solid ${bandMeta.border}`,
                whiteSpace: "nowrap",
              }}>
                {bandMeta.label}
              </span>
            ) : (
              <span style={{
                padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500,
                color: "#6e7681", background: "rgba(110,118,129,0.08)", border: "1px solid rgba(110,118,129,0.2)",
              }}>TOPIK band 없음</span>
            )}
            <button
              data-testid="detail-close-button"
              onClick={() => onClose && onClose()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 9px",
                borderRadius: 8,
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </div>
        </div>

        {/* 메타 태그 — 빈도수 숫자 제거, path_ko만 노출 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, rowGap: 6, marginTop: 8 }}>
          {pos && (
            <span style={{ fontSize: 11, color: "var(--text-secondary)", border: "1px solid var(--border-color)", padding: "2px 8px", borderRadius: 999 }}>
              {pos}
            </span>
          )}
          {(term.hierarchy?.display_path_ko || term.hierarchy?.path_ko) && (
            <span
              data-testid="detail-path"
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                border: "1px solid rgba(88,166,255,0.16)",
                background: "rgba(88,166,255,0.06)",
                padding: "2px 8px",
                borderRadius: 999,
              }}
            >
              {term.hierarchy.display_path_ko || term.hierarchy.path_ko}
            </span>
          )}
          {fallbackGuidanceChip ? (
            <span
              data-testid="detail-guidance-chip"
              style={{
                fontSize: 11,
                color: fallbackGuidanceChip.tone,
                border: `1px solid ${fallbackGuidanceChip.border}`,
                background: fallbackGuidanceChip.background,
                padding: "2px 8px",
                borderRadius: 999,
              }}
            >
              {fallbackGuidanceChip.label}
            </span>
          ) : null}
        </div>
      </div>

      {/* ── 탭 (통계 탭 제거) ── */}
      <div className="detail-tab-shell" style={{ display: "flex", borderBottom: "1px solid var(--border-color)", padding: "0 10px" }}>
        {[
          { key: "core", label: "핵심", cue: null, count: null, countAccent: null },
          { key: "relations", label: "의미 관계", cue: null, count: relationCount || null, countAccent: null },
          { key: "expressions", label: "활용 표현", cue: null, count: subwords.length || null, countAccent: "var(--accent-orange)" },
          { key: "examples", label: "예문", cue: null, count: exampleItems.length || null, countAccent: null },
        ].map((t) => (
          <button
            key={t.key}
            data-testid={`detail-tab-${t.key}`}
            className={`detail-tab-button ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
            style={{
              ...tabBtnStyle,
              color: activeTab === t.key ? "var(--accent-blue)" : "var(--text-secondary)",
              borderBottomColor: activeTab === t.key ? "var(--accent-blue)" : "transparent",
            }}
          >
            <span>{t.label}</span>
            {t.count ? (
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  borderRadius: 999,
                  padding: "1px 8px",
                  border: t.countAccent ? `1px solid ${t.countAccent}44` : "1px solid var(--border-color)",
                  background: t.countAccent ? "rgba(255,166,87,0.12)" : "rgba(255,255,255,0.04)",
                  color: t.countAccent || "var(--text-secondary)",
                  opacity: 1,
                }}
              >
                {t.count}
              </span>
            ) : null}
            {t.cue ? (
              <span style={{ display: "block", fontSize: 10, opacity: 0.6, marginTop: 2 }}>
                {t.cue}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── 콘텐츠 ── */}
      <div className="detail-content-shell" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>

        {/* 핵심 탭 */}
        {activeTab === "core" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {!isVirtual && (
              <div className="card-glass detail-primary-card" style={{ padding: 20, borderRadius: 12 }}>
                <div className="detail-definition-block">
                  <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                    핵심 뜻
                  </div>
                  <div data-testid="detail-definition" style={{ fontSize: 16, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.7 }}>
                    {defKo || "정의 없음"}
                  </div>
                </div>
                {showEnglish && defEn && primaryTranslation && (
                  <div data-testid="detail-primary-translation" className="detail-translation-panel" style={{ marginTop: 14, fontSize: 14, color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <Globe size={14} style={{ marginTop: 2, flexShrink: 0, opacity: 0.7 }} />
                    <div style={{ width: "100%" }}>
                      {primaryTranslation?.language && (
                        <div data-testid="detail-translation-language" style={{ fontSize: 11, color: "var(--accent-green)", marginBottom: 4 }}>
                          {matchedPreferred ? `번역 언어 · ${primaryTranslation.language}` : `대표 번역 · ${primaryTranslation.language}`}
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                        <div data-testid="detail-translation-word" style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {primaryTranslation.word}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--accent-green)", border: "1px solid rgba(63,185,80,0.24)", background: "rgba(63,185,80,0.12)", borderRadius: 10, padding: "2px 8px", flexShrink: 0 }}>
                          {primaryTranslation.language || "대표 번역"}
                        </div>
                      </div>
                      <div data-testid="detail-translation-definition" style={{ fontStyle: "italic", marginTop: 8 }}>
                        {defEn}
                      </div>
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

            {shouldShowContextHelper && (
              <div data-testid="detail-context-helper" className="card-glass" style={{ padding: 12, borderRadius: 12, borderLeft: `3px solid ${helperAccent}` }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
                  <div style={{ fontSize: 12, color: helperAccent, fontWeight: 700 }}>
                    {helperTitle}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, flex: 1 }}>
                    {helperDescription}
                  </div>
                </div>
              </div>
            )}

            {senses.length > 1 && (
              <div>
                {renderSectionTitle(<BookOpen size={13} />, "의미 선택", "var(--accent-blue)", senses.length)}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {visibleSenses.map((sense) => {
                    const isActive = currentSense?.id === sense.id;
                    const senseNumber = formatSenseNumber(sense.id, senses.length);
                    return (
                      <button
                        key={sense.id}
                        data-testid={`sense-option-${toSenseTestId(sense.id)}`}
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
                          {senseNumber}
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
            {renderRelationOverview()}

            {term.related_vocab && term.related_vocab.length > 0 && (
              renderRelationSection(
                "relation-related-vocab",
                "연관 어휘",
                "비슷하게 이어서 탐색할 수 있는 어휘입니다.",
                term.related_vocab.length,
                "var(--text-secondary)",
                renderRelatedChips(term.related_vocab, onRelatedVocabClick),
              )
            )}

            {currentRelatedTerms.length > 0 && (
              renderRelationSection(
                "relation-sense-relations",
                "의미 관계어",
                hasRepeatedRelationWord(currentRelatedTerms)
                  ? "같은 표면형이라도 대상 의미가 다르면 따로 유지합니다."
                  : "현재 의미와 직접 연결된 비교/연결 어휘입니다.",
                currentRelatedTerms.length,
                "var(--accent-blue)",
                renderRelationCards(currentRelatedTerms, {
                  accentColor: "var(--accent-blue)",
                  testPrefix: "sense-relation-card",
                  onItemClick: (item) => onSenseRelationClick && onSenseRelationClick(item),
                }),
              )
            )}

            {dedupedRelatedForms.length > 0 && (
              renderRelationSection(
                "relation-related-forms",
                "관련형",
                hasRepeatedRelationWord(dedupedRelatedForms)
                  ? "형태나 파생 관계로 이어지는 어휘입니다. 바로 이동되는 항목과 원본 표면형만 남은 항목을 나누어 보여 줍니다."
                  : "형태나 파생 관계로 이어지는 어휘입니다. 바로 이동되는 항목과 원본 표면형만 남은 항목을 나누어 보여 줍니다.",
                dedupedRelatedForms.length,
                "var(--accent-purple)",
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {jumpableRelatedForms.length > 0 ? (
                    <div>
                      {renderWorkflowTitle("바로 이동 가능한 관련형", countUniqueRelationGroups(jumpableRelatedForms))}
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 10 }}>
                        원본 사전에서 연결 target이 확인된 관련형입니다. 품사와 뜻을 보고 바로 이동할 수 있습니다.
                      </div>
                      {renderRelationCards(jumpableRelatedForms, {
                        accentColor: "var(--accent-purple)",
                        testPrefix: "related-form-card",
                        onItemClick: (item) => onRelatedFormClick && onRelatedFormClick(item),
                        groupBySurface: true,
                      })}
                    </div>
                  ) : null}
                  {textOnlyRelatedForms.length > 0 ? (
                    <div>
                      {renderWorkflowTitle("원본에 표면형만 있는 관련형", countUniqueRelationGroups(textOnlyRelatedForms))}
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 10 }}>
                        원본 사전에 관련형 표면형만 있고 연결 target은 지정되지 않은 항목입니다.
                      </div>
                      {renderRelationCards(textOnlyRelatedForms, {
                        accentColor: "var(--accent-purple)",
                        testPrefix: "related-form-card",
                        onItemClick: (item) => onRelatedFormClick && onRelatedFormClick(item),
                        groupBySurface: true,
                      })}
                    </div>
                  ) : null}
                </div>,
              )
            )}

            {dedupedCrossLinks.length > 0 && (
              renderRelationSection(
                "relation-cross-links",
                "교차 연결 장면",
                "현재 단어가 다른 탐색 장면과 이어지는 경우에만 보입니다.",
                dedupedCrossLinks.length,
                "var(--accent-blue)",
                renderChips(
                  dedupedCrossLinks.map((c) => ({ label: `${c.target_term} ➔ ${c.target_category || c.target_center_id || ""}`, value: c })),
                  (val) => onCrossLinkClick && onCrossLinkClick(val.value),
                ),
              )
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

            {relationCount === 0 && siblingSenses.length <= 1 ? renderEmptyState("관계 데이터가 없습니다.") : null}
          </div>
        )}

        {/* 표현 탭 */}
        {activeTab === "expressions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {subwords.length > 0 ? (
              <div>
                {renderCompactOverview(
                  "expression-overview",
                  "표현 읽는 순서",
                  "먼저 바로 이동 가능한 표현을 보고, 연결이 없는 항목은 현재 표제어 맥락에서 쓰임을 먼저 확인하면 됩니다.",
                  [
                    {
                      label: "바로 이동 가능",
                      count: jumpableSubwords.length,
                      tone: "var(--accent-orange)",
                      border: "rgba(255,166,87,0.28)",
                      background: "rgba(255,166,87,0.10)",
                    },
                    {
                      label: "맥락 안에서 먼저 보기",
                      count: previewOnlySubwords.length,
                      tone: "var(--text-secondary)",
                      border: "rgba(148,163,184,0.28)",
                      background: "rgba(148,163,184,0.10)",
                    },
                  ].filter((item) => item.count > 0),
                  "var(--accent-orange)",
                )}
                {renderSectionTitle(<BookOpen size={13} />, "표현층", "var(--accent-orange)", subwords.length)}
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
                    {renderWorkflowTitle("현재 표제어 맥락에서 먼저 보는 표현", previewOnlySubwords.length)}
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>
                      독립 표제어 연결은 없지만, 현재 단어 안에서 쓰임만 먼저 확인할 수 있는 표현입니다.
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
            {exampleItems.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "var(--text-secondary)" }}>
                <BookOpen size={24} style={{ marginBottom: 12, opacity: 0.5 }} />
                <span>예문 데이터가 없습니다.</span>
              </div>
            ) : (
              <>
                {renderCompactOverview(
                  "examples-overview",
                  "예문 읽는 순서",
                  "현재 의미 예문을 먼저 모두 보여 주고, source가 있을 때만 오른쪽 badge로 조용하게 표시합니다.",
                  [
                    {
                      label: "현재 의미 우선",
                      count: currentExamples.filter((item) => item?.text_ko).length,
                      tone: "var(--accent-blue)",
                      border: "rgba(88,166,255,0.28)",
                      background: "rgba(88,166,255,0.10)",
                    },
                    {
                      label: "총 예문",
                      count: exampleItems.length,
                      tone: "var(--text-secondary)",
                      border: "rgba(148,163,184,0.28)",
                      background: "rgba(148,163,184,0.10)",
                    },
                  ].filter((item) => item.count > 0),
                  "var(--accent-blue)",
                )}
                {exampleItems.map((ex, idx) => {
                  const sourceLabel = formatExampleSourceLabel(ex.source);
                  return (
                    <div key={idx} data-testid={`example-card-${idx}`} className="card-glass" style={{ padding: "16px 20px", borderRadius: 12, borderLeft: "3px solid var(--accent-blue)" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", columnGap: 8, rowGap: 6 }}>
                        <div style={{ flex: "1 1 320px", minWidth: 0, fontSize: 15, color: "var(--text-primary)", lineHeight: 1.8 }}>
                          {ex.text_ko}
                        </div>
                        {sourceLabel ? (
                          <span
                            data-testid={`example-source-${idx}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              marginLeft: "auto",
                              padding: "2px 8px",
                              borderRadius: 999,
                              fontSize: 11,
                              color: "var(--text-secondary)",
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid var(--border-color)",
                              alignSelf: "flex-start",
                            }}
                          >
                            {sourceLabel}
                          </span>
                        ) : null}
                      </div>
                      {showEnglish && ex.text_en && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic", borderTop: "1px solid var(--border-color)", paddingTop: 8 }}>
                          <Globe size={12} style={{ marginTop: 2, flexShrink: 0, opacity: 0.7 }} />
                          {ex.text_en}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
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
