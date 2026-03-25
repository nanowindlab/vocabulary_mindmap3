import React, { useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Folder,
  BookOpen,
} from "lucide-react";

// ── 아이템 렌더러 ──────────────────────────────────────────────
const SidebarItem = ({
  node,
  level,
  expandedIds,
  toggleExpand,
  onSelectTerm,
  selectedTermId,
}) => {
  const isExpanded = expandedIds.has(node.id);
  const isSelected =
    selectedTermId === (node.type === "term" ? node.data?.id : node.id);
  const hasChildren = node.children && Object.keys(node.children).length > 0;

  const handleClick = (e) => {
    e.stopPropagation();
    if (node.type === "term") {
      onSelectTerm(node.data);
    } else {
      toggleExpand(node.id);
    }
  };

  const renderIcon = () => {
    if (node.type === "term") return <BookOpen size={13} style={{ opacity: 0.5 }} />;
    if (hasChildren) return isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />;
    return node.type === "scene" ? <FolderOpen size={14} /> : <Folder size={14} />;
  };

  const colorMap = {
    root: "var(--accent-blue)",
    scene: "var(--accent-green)",
    category: "var(--accent-purple)",
    term: isSelected ? "var(--accent-blue)" : "var(--text-primary)",
  };

  return (
    <div style={{ marginLeft: level * 12 }}>
      <div
        onClick={handleClick}
        data-sidebar-node-type={node.type}
        data-sidebar-node-id={node.id}
        // data-term-id: 사이드바 scrollIntoView 타겟팅에 사용
        data-term-id={node.type === "term" ? node.data?.id : undefined}
        style={{
          display: "flex", alignItems: "center",
          padding: "5px 8px", cursor: "pointer", borderRadius: 6, marginBottom: 2,
          transition: "background 0.15s",
          backgroundColor: isSelected ? "rgba(88,166,255,0.12)" : "transparent",
          color: colorMap[node.type] || "var(--text-primary)",
        }}
      >
        <div style={{ width: 18, display: "flex", justifyContent: "center", marginRight: 6, flexShrink: 0, color: isSelected ? "var(--accent-blue)" : "var(--text-secondary)" }}>
          {renderIcon()}
        </div>
        <span style={{ fontSize: 13, fontWeight: node.type === "term" ? 400 : 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {node.label}
        </span>
        {node.type === "scene" && hasChildren && (
          <span style={{ fontSize: 10, color: "var(--text-secondary)", marginLeft: 4, opacity: 0.6 }}>
            {Object.keys(node.children).length}
          </span>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div style={{ paddingLeft: 8, borderLeft: "1px solid var(--border-color)", marginLeft: 8 }}>
          {Object.values(node.children).map((child) => (
            <SidebarItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onSelectTerm={onSelectTerm}
              selectedTermId={selectedTermId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── 메인 사이드바 ──────────────────────────────────────────────
export const SidebarTree = ({
  treeData = {},
  isLoading = false,
  expandedIds,
  toggleExpand,
  onSelectTerm,
  selectedTermId,
}) => {
  const scrollContainerRef = useRef(null);

  // 선택된 단어가 바뀌면 해당 항목으로 자동 스크롤 (Auto-scroll to selected term)
  useEffect(() => {
    if (!selectedTermId || !scrollContainerRef.current) return;
    // 150ms 딜레이: React가 확장된 노드를 렌더링할 시간을 줌
    const t = setTimeout(() => {
      const el = scrollContainerRef.current?.querySelector(
        `[data-term-id="${selectedTermId}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [selectedTermId]);

  // root 레벨 숨기고 scene(중분류)부터 노출
  const sceneNodes = Object.values(treeData).flatMap((root) =>
    Object.values(root.children || {})
  );

  return (
    <div style={{ width: 260, backgroundColor: "var(--bg-secondary)", borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-color)", fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>
        계층 탐색
      </div>
      <div ref={scrollContainerRef} style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
        {isLoading ? (
          <div style={{ color: "var(--text-secondary)", fontSize: 13, padding: "20px 8px" }}>
            데이터 준비 중…
          </div>
        ) : sceneNodes.length === 0 ? (
          <div style={{ color: "var(--text-secondary)", fontSize: 13, padding: "20px 8px" }}>
            데이터 없음
          </div>
        ) : (
          sceneNodes.map((scene) => (
            <SidebarItem
              key={scene.id}
              node={scene}
              level={0}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onSelectTerm={onSelectTerm}
              selectedTermId={selectedTermId}
            />
          ))
        )}
      </div>
    </div>
  );
};
