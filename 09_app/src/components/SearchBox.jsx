import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

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

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (!results.length) return;
    e.preventDefault();
    const exact = results.find((item) => item.word === query.trim());
    handleItemClick(exact || results[0]);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: 260 }}>
      <div style={{ position: "relative" }}>
        <input
          data-testid="search-input"
          type="text"
          placeholder="단어 검색..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          style={{
            width: "100%",
            padding: "6px 12px 6px 32px",
            borderRadius: 8,
            border: "1px solid var(--border-color)",
            backgroundColor: "rgba(22, 27, 34, 0.5)",
            color: "var(--text-primary)",
            fontSize: 13,
            outline: "none",
          }}
        />
        <Search
          size={14}
          color="var(--text-secondary)"
          style={{ position: "absolute", left: 10, top: 8 }}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            backgroundColor: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            borderRadius: 8,
            overflow: "hidden",
            zIndex: 100,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {results.map((res) => (
            (() => {
              const primaryTranslation = getPrimaryTranslation(res, translationLanguage);
              const homonymCount = results.filter((item) => item.word === res.word).length;
              return (
            <div
              key={res.id}
              data-search-result="true"
              data-search-result-id={res.id}
              onClick={() => handleItemClick(res)}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: "var(--text-primary)",
                  }}
                >
                  {res.word}
                </span>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {homonymCount > 1 && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--accent-blue)",
                        padding: "2px 6px",
                        borderRadius: 4,
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
                        padding: "2px 6px",
                        borderRadius: 4,
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
                        padding: "2px 6px",
                        borderRadius: 4,
                        backgroundColor: "rgba(255,166,87,0.12)",
                        border: "1px solid rgba(255,166,87,0.24)",
                      }}
                    >
                      다음: 표현층
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      padding: "2px 6px",
                      borderRadius: 4,
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }}
                  >
                    {res.routing === "meta_learning"
                      ? "메타"
                      : res.routing === "expression_core"
                        ? "표현 표제어"
                        : "코어"}
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {res.def_ko}
                {showEnglish && primaryTranslation?.word && ` · ${primaryTranslation.language}: ${primaryTranslation.word}`}
              </div>
              {(res.hierarchy?.display_path_ko || res.hierarchy?.path_ko) && (
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    opacity: 0.75,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {res.hierarchy.display_path_ko || res.hierarchy.path_ko}
                </div>
              )}
            </div>
              );
            })()
          ))}
        </div>
      )}
    </div>
  );
};
