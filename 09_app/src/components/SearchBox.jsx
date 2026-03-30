import React, { useState, useRef, useEffect } from "react";
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

const SEARCH_ORDER_DESCRIPTION = "정렬: 정확히 일치 -> 앞부분 일치 -> 포함 일치 -> 짧은 단어 순";

export const SearchBox = ({
  searchIndex,
  onSelect,
  showEnglish,
  translationLanguage,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = (e) => {
    const v = e.target.value;
    setQuery(v);
    if (!v.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Filter and Sort
    const queryLower = v.toLowerCase();
    const matches = searchIndex
      .filter(
        (item) =>
          item.word?.toLowerCase().includes(queryLower) ||
          item.def_ko?.toLowerCase().includes(queryLower) ||
          item.def_en?.toLowerCase().includes(queryLower) ||
          item.translation_summary?.some((t) => t.word?.toLowerCase().includes(queryLower)),
      )
      .sort((a, b) => {
        const aWord = a.word?.toLowerCase() || "";
        const bWord = b.word?.toLowerCase() || "";

        // 1. 정확히 일치 (Exact Match)
        const aExact = aWord === queryLower ? 1 : 0;
        const bExact = bWord === queryLower ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;

        // 2. 검색어로 시작 (Starts With)
        const aStarts = aWord.startsWith(queryLower) ? 1 : 0;
        const bStarts = bWord.startsWith(queryLower) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;

        // 3. 단어에 포함 (Includes)
        const aIncludes = aWord.includes(queryLower) ? 1 : 0;
        const bIncludes = bWord.includes(queryLower) ? 1 : 0;
        if (aIncludes !== bIncludes) return bIncludes - aIncludes;

        // 4. 단어 길이가 짧은 순으로
        return aWord.length - bWord.length;
      })
      .slice(0, 10);

    setResults(collapseExactSearchDuplicates(matches));
    setIsOpen(true);
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
              const homonymCount = results.filter((item) => item.word === res.word).length;
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
              {SEARCH_ORDER_DESCRIPTION}
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
