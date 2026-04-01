import React, { useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Folder,
  BookOpen,
  Loader,
} from "lucide-react";
import { StatusPanel } from "./StatusPanel";

// ── 아이템 렌더러 ──────────────────────────────────────────────
const SidebarItem = ({
  node,
  level,
  expandedIds,
  toggleExpand,
  onSelectNode,
  onSelectTerm,
  selectedTermId,
  selectedTreeNode,
}) => {
  const isExpanded = expandedIds.has(node.id);
  const isSelected =
    node.type === "term"
      ? selectedTermId === node.data?.id
      : selectedTreeNode?.id === node.id && selectedTreeNode?.type === node.type;
  const hasChildren = node.children && Object.keys(node.children).length > 0;

  const getSceneTermCount = () =>
    Object.values(node.children || {}).reduce((sum, child) => sum + (child?.termCount ?? Object.keys(child?.children || {}).length), 0);

  const handleClick = (e) => {
    e.stopPropagation();
    if (node.type === "term") {
      onSelectTerm(node.data);
    } else {
      const willCollapse = hasChildren && isExpanded;
      toggleExpand(node.id);
      if (onSelectNode) onSelectNode(node, { collapseToParent: willCollapse });
    }
  };

  const renderIcon = () => {
    if (node.type === "term") return <BookOpen size={13} style={{ opacity: 0.5 }} />;
    if (hasChildren) return isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />;
    return node.type === "scene" ? <FolderOpen size={14} /> : <Folder size={14} />;
  };
  const displayCount = node.type === "scene"
    ? {
        categories: Object.keys(node.children || {}).length,
        terms: getSceneTermCount(),
      }
    : node.type === "category"
      ? (node.termCount ?? Object.keys(node.children || {}).length)
      : null;

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
        data-sidebar-selected={isSelected ? "true" : "false"}
        // data-term-id: 사이드바 scrollIntoView 타겟팅에 사용
        data-term-id={node.type === "term" ? node.data?.id : undefined}
        style={{
          display: "flex", alignItems: "center",
          padding: "8px 10px", cursor: "pointer", borderRadius: 10, marginBottom: 4,
          transition: "background 0.15s, border-color 0.15s",
          background: isSelected ? "rgba(88,166,255,0.12)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${isSelected ? "rgba(88,166,255,0.22)" : "rgba(255,255,255,0.04)"}`,
          color: colorMap[node.type] || "var(--text-primary)",
        }}
      >
        <div style={{ width: 22, height: 22, display: "flex", justifyContent: "center", alignItems: "center", marginRight: 8, flexShrink: 0, color: isSelected ? "var(--accent-blue)" : "var(--text-secondary)", borderRadius: 8, background: "rgba(255,255,255,0.03)" }}>
          {renderIcon()}
        </div>
        <span style={{ fontSize: 13, fontWeight: node.type === "term" ? 400 : 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {node.label}
        </span>
        {(node.type === "scene" || node.type === "category") && hasChildren && (
          node.type === "scene" ? (
            <span
              data-testid={`sidebar-count-${node.type}-${node.id}`}
              style={{ fontSize: 10, color: "var(--text-secondary)", marginLeft: 6, padding: "2px 8px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}
            >
              {displayCount.categories} · {displayCount.terms.toLocaleString()}
            </span>
          ) : (
            <span
              data-testid={`sidebar-count-${node.type}-${node.id}`}
              style={{ fontSize: 10, color: "var(--text-secondary)", marginLeft: 6, padding: "2px 6px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              {displayCount}
            </span>
          )
        )}
      </div>
      {isExpanded && hasChildren && (
        <div style={{ paddingLeft: 10, borderLeft: "1px solid rgba(255,255,255,0.06)", marginLeft: 11 }}>
          {Object.values(node.children).map((child) => (
            <SidebarItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onSelectNode={onSelectNode}
              onSelectTerm={onSelectTerm}
              selectedTermId={selectedTermId}
              selectedTreeNode={selectedTreeNode}
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
  onSelectNode,
  onSelectTerm,
  selectedTermId,
  selectedTreeNode,
}) => {
  const scrollContainerRef = useRef(null);

  // 선택된 단어가 바뀌면 해당 항목으로 자동 스크롤 (Auto-scroll to selected term)
  useEffect(() => {
    if (!selectedTermId || !scrollContainerRef.current) return;
    const t = setTimeout(() => {
      const el = scrollContainerRef.current?.querySelector(
        `[data-term-id="${selectedTermId}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [expandedIds, selectedTermId, treeData]);

  useEffect(() => {
    if (selectedTermId) return;
    if (!selectedTreeNode?.id || !scrollContainerRef.current) return;
    const t = setTimeout(() => {
      const el = scrollContainerRef.current?.querySelector(
        `[data-sidebar-node-id="${selectedTreeNode.id}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [expandedIds, selectedTreeNode, treeData]);

  // root 레벨 숨기고 scene(중분류)부터 노출
  const sceneNodes = Object.values(treeData).flatMap((root) =>
    Object.values(root.children || {})
  );

  return (
    <div className="sidebar-shell" style={{ width: 272, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div className="sidebar-shell-header">
        <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
          Tree Navigator
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
          계층 탐색
        </div>
      </div>
      <div ref={scrollContainerRef} style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {isLoading ? (
          <StatusPanel
            kicker="Tree Load"
            title="계층 데이터를 준비 중입니다"
            description="현재 축에 맞는 tree branch를 정리하고 있습니다."
            icon={Loader}
            tone="var(--accent-blue)"
            compact
            loading
          />
        ) : sceneNodes.length === 0 ? (
          <StatusPanel
            kicker="Tree Empty"
            title="표시할 계층 데이터가 없습니다"
            description="현재 축이나 필터 기준에 맞는 branch가 아직 없습니다."
            tone="var(--accent-purple)"
            compact
          />
        ) : (
          sceneNodes.map((scene) => (
            <SidebarItem
              key={scene.id}
              node={scene}
              level={0}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onSelectNode={onSelectNode}
              onSelectTerm={onSelectTerm}
              selectedTermId={selectedTermId}
              selectedTreeNode={selectedTreeNode}
            />
          ))
        )}
      </div>
    </div>
  );
};
