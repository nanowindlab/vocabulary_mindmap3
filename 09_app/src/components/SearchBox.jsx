import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { normalizeHierarchyForDisplay } from "../utils/hierarchyDisplay";

const getPrimaryTranslation = (item, preferredLanguage = "영어") => {
  const translations = item?.translation_summary || [];
  if (!translations.length) return null;
  const preferred = translations.find((t) => t?.language === preferredLanguage);
  const english = translations.find((t) => t?.language === "영어");
  const primary = preferred || english || translations[0];
  return {
    language: primary.language || null,
    word: primary.word || null,
    definition: primary.definition || null,
  };
};

const collapseExactSearchDuplicates = (items) => {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = `${item.word || ""}|${item.pos || ""}|${item.def_ko || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
};

const KOREAN_SEARCH_ORDER_DESCRIPTION = "정렬: 정확히 일치 -> 앞부분 일치 -> 포함 일치 -> 짧은 단어 순";
const FOREIGN_SEARCH_ORDER_DESCRIPTION = "정렬: 직접 번역 정확히 일치 -> 앞부분 일치 -> 포함 일치 -> 영어 뜻 설명";
const SEARCH_RESULT_LIMIT = 10;

const hasHangul = (value) => /[가-힣]/.test(value);

const normalizeText = (value) => (value || "").toLowerCase().trim();

const getForeignSearchRank = (item, queryLower) => {
  const word = normalizeText(item.word);
  const defEn = normalizeText(item.def_en);
  const translations = item.translation_summary || [];

  const translationTexts = translations
    .map((translation) => normalizeText(translation.word))
    .filter(Boolean);
  if (translationTexts.includes(queryLower)) {
    return {
      stage: 0,
      tieBreaker: translationTexts.findIndex((translation) => translation === queryLower),
      wordLength: word.length,
    };
  }

  const translationStarts = translationTexts.some((translation) => translation.startsWith(queryLower));
  if (translationStarts) {
    return {
      stage: 1,
      tieBreaker: translationTexts.findIndex((translation) => translation.startsWith(queryLower)),
      wordLength: word.length,
    };
  }

  const translationIncludes = translationTexts.some((translation) => translation.includes(queryLower));
  if (translationIncludes) {
    return {
      stage: 2,
      tieBreaker: translationTexts.findIndex((translation) => translation.includes(queryLower)),
      wordLength: word.length,
    };
  }

  if (defEn === queryLower) {
    return {
      stage: 3,
      tieBreaker: 0,
      wordLength: word.length,
    };
  }

  if (defEn.startsWith(queryLower)) {
    return {
      stage: 4,
      tieBreaker: 0,
      wordLength: word.length,
    };
  }

  if (queryLower.length > 3 && defEn.includes(queryLower)) {
    return {
      stage: 5,
      tieBreaker: defEn.indexOf(queryLower),
      wordLength: word.length,
    };
  }

  return null;
};

const getKoreanSearchRank = (item, queryLower) => {
  const word = normalizeText(item.word);
  const defKo = normalizeText(item.def_ko);
  const defEn = normalizeText(item.def_en);

  if (word === queryLower) {
    return { stage: 0, wordLength: word.length };
  }

  if (word.startsWith(queryLower)) {
    return { stage: 1, wordLength: word.length };
  }

  if (word.includes(queryLower)) {
    return { stage: 2, wordLength: word.length };
  }

  if (defKo.includes(queryLower)) {
    return { stage: 3, wordLength: word.length };
  }

  if (defEn.includes(queryLower)) {
    return { stage: 4, wordLength: word.length };
  }

  return null;
};

const compareRank = (a, b) => {
  if (a.stage !== b.stage) return a.stage - b.stage;

  if ((a.tieBreaker ?? Number.MAX_SAFE_INTEGER) !== (b.tieBreaker ?? Number.MAX_SAFE_INTEGER)) {
    return (a.tieBreaker ?? Number.MAX_SAFE_INTEGER) - (b.tieBreaker ?? Number.MAX_SAFE_INTEGER);
  }

  return a.wordLength - b.wordLength;
};

const pushTopRanked = (topRanked, candidate, limit = SEARCH_RESULT_LIMIT) => {
  let insertAt = topRanked.findIndex((current) => compareRank(candidate.rank, current.rank) < 0);
  if (insertAt === -1) insertAt = topRanked.length;
  if (insertAt >= limit) return;
  topRanked.splice(insertAt, 0, candidate);
  if (topRanked.length > limit) topRanked.length = limit;
};

const collectTopMatches = (searchIndex, rawQuery) => {
  const queryLower = normalizeText(rawQuery);
  if (!queryLower) return [];

  const koreanQuery = hasHangul(rawQuery);
  const topRanked = [];

  for (const item of searchIndex) {
    const rank = koreanQuery
      ? getKoreanSearchRank(item, queryLower)
      : getForeignSearchRank(item, queryLower);

    if (!rank) continue;
    pushTopRanked(topRanked, { item, rank });
  }

  return collapseExactSearchDuplicates(topRanked.map(({ item }) => item));
};

export const SearchBox = ({
  searchIndex,
  onSelect,
  showEnglish,
  translationLanguage,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const isComposingRef = useRef(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const results = useMemo(
    () => collectTopMatches(searchIndex, deferredQuery),
    [deferredQuery, searchIndex],
  );

  const homonymCountByWord = useMemo(() => {
    const counts = new Map();
    results.forEach((item) => {
      if (!item?.word) return;
      counts.set(item.word, (counts.get(item.word) || 0) + 1);
    });
    return counts;
  }, [results]);

  useEffect(() => {
    if (!query.trim()) {
      setIsOpen(false);
      return;
    }

    if (results.length > 0) {
      setIsOpen(true);
    }
  }, [query, results]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleItemClick = (item) => {
    onSelect(item);
    setIsOpen(false);
    setQuery("");
  };

  const getDisplayPath = (item) => {
    const normalizedHierarchy = normalizeHierarchyForDisplay({
      hierarchy: item?.hierarchy || {},
      pos: item?.pos || item?.part_of_speech || "품사 없음",
      wordGrade: item?.word_grade || "없음",
    });
    return normalizedHierarchy.display_path_ko || normalizedHierarchy.path_ko || null;
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (e.nativeEvent?.isComposing || isComposingRef.current || e.keyCode === 229) return;
    if (!results.length) return;
    e.preventDefault();
    const exact = results.find((item) => item.word === query.trim());
    handleItemClick(exact || results[0]);
  };

  const searchOrderDescription = hasHangul(query)
    ? KOREAN_SEARCH_ORDER_DESCRIPTION
    : FOREIGN_SEARCH_ORDER_DESCRIPTION;

  return (
    <div ref={wrapperRef} className="search-shell" style={{ position: "relative", width: 360 }}>
      <div className="search-input-shell" style={{ position: "relative" }}>
        <input
          className="search-input-field"
          data-testid="search-input"
          type="text"
          placeholder="어휘 / 뜻 / 번역 검색"
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          style={{
            width: "100%",
            padding: "11px 14px 11px 40px",
            borderRadius: 15,
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.035)",
            color: "var(--text-primary)",
            fontSize: 13,
            outline: "none",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        />
        <Search
          size={14}
          color="var(--text-secondary)"
          style={{ position: "absolute", left: 14, top: 12 }}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div
          className="search-dropdown-shell"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 8,
            backgroundColor: "rgba(10,17,25,0.96)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            overflow: "hidden",
            zIndex: 120,
            boxShadow: "0 24px 48px rgba(0,0,0,0.36)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="search-dropdown-header" style={{ padding: "13px 14px 11px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
                  Search Result Panel
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                  `{query.trim()}`
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", padding: "3px 8px", borderRadius: 999 }}>
                  결과 {results.length}개
                </span>
                <span style={{ fontSize: 11, color: showEnglish ? "var(--accent-green)" : "var(--text-muted)", border: `1px solid ${showEnglish ? "rgba(63,185,80,0.16)" : "rgba(255,255,255,0.06)"}`, background: showEnglish ? "rgba(63,185,80,0.10)" : "rgba(255,255,255,0.03)", padding: "3px 8px", borderRadius: 999 }}>
                  {showEnglish ? `번역 · ${translationLanguage}` : "번역 OFF"}
                </span>
              </div>
            </div>
          </div>
          {results.map((res) => (
            (() => {
              const primaryTranslation = getPrimaryTranslation(res, translationLanguage);
              const homonymCount = homonymCountByWord.get(res.word) || 0;
              return (
            <div
              key={res.id}
              data-search-result="true"
              data-search-result-id={res.id}
              className="search-result-row"
              onClick={() => handleItemClick(res)}
              style={{
                padding: "12px 14px",
                cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {res.word}
                </span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {homonymCount > 1 && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--accent-blue)",
                        padding: "3px 8px",
                        borderRadius: 999,
                        backgroundColor: "rgba(88,166,255,0.12)",
                        border: "1px solid rgba(88,166,255,0.24)",
                      }}
                    >
                      동형어 {homonymCount}
                    </span>
                  )}
                  {res.pos && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        padding: "3px 8px",
                        borderRadius: 999,
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {res.pos}
                    </span>
                  )}
                  {res.has_subwords && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--accent-orange)",
                        padding: "3px 8px",
                        borderRadius: 999,
                        backgroundColor: "rgba(255,166,87,0.12)",
                        border: "1px solid rgba(255,166,87,0.24)",
                      }}
                    >
                      표현 연결
                    </span>
                  )}
                  {res.routing !== "mindmap_core" && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        padding: "3px 8px",
                        borderRadius: 999,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                    >
                      {res.routing === "meta_learning" ? "메타" : "표현 항목"}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                }}
              >
                {res.def_ko}
                {showEnglish && primaryTranslation?.word && ` · ${primaryTranslation.language}: ${primaryTranslation.word}`}
              </div>
              {getDisplayPath(res) && (
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {getDisplayPath(res)}
                </div>
              )}
            </div>
              );
            })()
          ))}
          <div
            data-testid="search-result-helper"
            className="search-helper-shell"
            style={{
              padding: "10px 14px",
              backgroundColor: "rgba(255,255,255,0.02)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {searchOrderDescription}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              `기본 항목`은 현재 상세 보기로 바로 들어가는 기본 표제어입니다.
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
              번역이 켜져 있으면 현재 선택한 언어 surface를 search row에서도 같이 보여 줍니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
