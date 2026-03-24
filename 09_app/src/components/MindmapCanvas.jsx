import React, { useRef, useEffect, useCallback, useState } from "react";
import * as d3 from "d3";
import { ZoomIn, ZoomOut, RefreshCcw } from "lucide-react";

// ── 색상 팔레트 ──────────────────────────────────────────────────
const ROOT_COLOR = "#58a6ff";
const SCENE_COLOR = "#3fb950";
const CATEGORY_COLOR = "#bc8cff";
const TERM_COLOR = "#cdd9e5";
const SELECTED_COLOR = "#f78166";

const BAND_COLORS = {
  1: "#ff7b72",
  2: "#ffa657",
  3: "#e3b341",
  4: "#3fb950",
  5: "#58a6ff",
  null: "#6e7681",
};

// Band/Level 방어 함수 (V3 명세 기준)
const safeBand = (stats) => {
  if (!stats) return null;
  const b = stats.band;
  if (b === null || b === undefined) return null;
  return typeof b === "number" && b >= 1 && b <= 5 ? b : null;
};

// ── 노드 크기 ────────────────────────────────────────────────────
const nodeRadius = (type) => {
  if (type === "root") return 36;
  if (type === "scene") return 24;
  if (type === "category") return 18;
  return 14;
};

const nodeColor = (type, selected) => {
  if (selected) return SELECTED_COLOR;
  if (type === "root") return ROOT_COLOR;
  if (type === "scene") return SCENE_COLOR;
  if (type === "category") return CATEGORY_COLOR;
  return TERM_COLOR;
};

// ── 트리 → D3 노드/링크 변환 ───────────────────────────────────
function flattenTree(treeData, focusedRootId, expandedCategoryId) {
  const nodes = [];
  const links = [];

  let roots = focusedRootId
    ? Object.values(treeData).filter((r) => r.id === focusedRootId)
    : Object.values(treeData);
  if (roots.length === 0) {
    roots = Object.values(treeData);
  }

  roots.forEach((root) => {
    nodes.push({ id: root.id, label: root.label, type: "root", data: null });

    Object.values(root.children || {}).forEach((scene) => {
      nodes.push({ id: scene.id, label: scene.label, type: "scene", data: null });
      links.push({ source: root.id, target: scene.id });

      Object.values(scene.children || {}).forEach((cat) => {
        nodes.push({ id: cat.id, label: cat.label, type: "category", data: null, sceneId: scene.id });
        links.push({ source: scene.id, target: cat.id });

        // 배타적 단계별 렌더링: expandedCategoryId와 일치하는 중분류만 단어 노출
        if (cat.id === expandedCategoryId) {
          const terms = Object.values(cat.children || {}); // 제한 없음
          terms.forEach((term) => {
            nodes.push({
              id: term.id,
              label: term.label,
              type: "term",
              data: term.data,
              categoryId: cat.id,
            });
            links.push({ source: cat.id, target: term.id });
          });
        }
      });
    });
  });

  return { nodes, links };
}

// ── 컴포넌트 ─────────────────────────────────────────────────────
export const MindmapCanvas = ({
  treeData = {},
  onSelectTerm,
  selectedTermId,
  focusedRootId,
}) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const zoomGroupRef = useRef(null);
  const zoomBehaviorRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  // 현재 확장된(클릭된) 카테고리
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  // draw() 내부의 centerOnNode를 외부에서 호출하기 위한 ref
  const centerOnNodeRef = useRef(null);
  // 다음 draw 완료 후 줌할 termId (외부 선택 → 카테고리 확장 → 리드로 → 줌)
  const pendingZoomTermRef = useRef(null);

  // 이전 노드 위치 저장용 (레이아웃 재계산 시 점프 방지)
  const nodePositionsRef = useRef(new Map());

  const draw = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const { nodes: rawNodes, links: rawLinks } = flattenTree(treeData, focusedRootId, expandedCategoryId);
    if (rawNodes.length === 0) return;

    const width = svgEl.clientWidth || 900;
    const height = svgEl.clientHeight || 700;

    // 이전 위치 복원
    const prevPosMap = nodePositionsRef.current;
    rawNodes.forEach((n) => {
      if (prevPosMap.has(n.id)) {
        const p = prevPosMap.get(n.id);
        n.x = p.x;
        n.y = p.y;
        n.vx = 0;
        n.vy = 0;
      } else {
        // 새로 추가된 노드 (보통 부모 위치 근처러 초기화)
        if (n.type === "term" && prevPosMap.has(n.categoryId)) {
          const p = prevPosMap.get(n.categoryId);
          n.x = p.x + (Math.random() - 0.5) * 50;
          n.y = p.y + (Math.random() - 0.5) * 50;
        } else {
          n.x = width / 2 + (Math.random() - 0.5) * 200;
          n.y = height / 2 + (Math.random() - 0.5) * 200;
        }
      }
    });

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const g = svg.append("g");
    zoomGroupRef.current = g;

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => g.attr("transform", event.transform));
    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Zoom-to-node 함수 — ref에 저장하여 외부 effect에서도 호출 가능
    const centerOnNode = (x, y, scale = 1.2) => {
      const tx = width / 2 - x * scale;
      const ty = height / 2 - y * scale;
      svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    };
    centerOnNodeRef.current = centerOnNode;

    const nodeMap = new Map(rawNodes.map((n, i) => [n.id, i]));
    const links = rawLinks
      .filter((l) => nodeMap.has(l.source) && nodeMap.has(l.target))
      .map((l) => ({ source: nodeMap.get(l.source), target: nodeMap.get(l.target) }));

    const nodes = rawNodes.map((n, i) => ({ ...n, index: i }));

    // Force 시뮬레이션
    simulationRef.current?.stop();
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance((l) => {
        const src = nodes[l.source.index ?? l.source];
        if (!src) return 80;
        if (src.type === "root") return 200;
        if (src.type === "scene") return 140;
        if (src.type === "category") return 60;
        return 40;
      }).strength(0.8))
      .force("charge", d3.forceManyBody().strength((n) => {
        if (n.type === "root") return -1200;
        if (n.type === "scene") return -600;
        if (n.type === "category") return -200;
        return -80;
      }))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((n) => nodeRadius(n.type) + 10))
      .alphaDecay(0.08)
      .velocityDecay(0.6);
    simulationRef.current = simulation;

    // 링크 렌더
    const linkSel = g.append("g").attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "rgba(100,120,150,0.25)")
      .attr("stroke-width", 1);

    // 노드 렌더
    const nodeSel = g.append("g").attr("class", "nodes")
      .selectAll("g.node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("data-node-id", (n) => n.id)
      .attr("data-node-type", (n) => n.type)
      .style("cursor", (n) => (n.type === "term" || n.type === "category" ? "pointer" : "default"))
      .style("opacity", (n) => {
        // 인터랙션 격리: expanded된 카테고리가 있을 때, 해당 카테고리와 그 이하 단어가 아니면 Dim 처리
        if (expandedCategoryId && n.type === "scene") return 0.5;
        if (expandedCategoryId && n.type === "category" && n.id !== expandedCategoryId) return 0.3;
        return 1.0;
      })
      .on("click", (event, n) => {
        event.stopPropagation();
        if (n.type === "term" && n.data && onSelectTerm) {
          internalClickRef.current = true; // 내부 클릭 표시 → 외부 effect 무한루프 차단
          onSelectTerm(n.data);
          // Zoom to Term (즉시 실행)
          centerOnNode(n.x, n.y, 1.8);
        } else if (n.type === "category") {
          // Category 배타적 전개 토글
          if (expandedCategoryId === n.id) {
            setExpandedCategoryId(null); // Collapse
          } else {
            setExpandedCategoryId(n.id); // Expand
            centerOnNode(n.x, n.y, 1.1);
          }
        }
      })
      .on("mouseenter", (event, n) => {
        if (n.type === "term" && n.data) {
          setTooltip({
            x: event.clientX,
            y: event.clientY,
            word: n.data.word,
            def: n.data.def_ko,
            band: safeBand(n.data.stats),
          });
        }
      })
      .on("mouseleave", () => setTooltip(null))
      .call(
        d3.drag()
          .on("start", (event, n) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            n.fx = n.x; n.fy = n.y;
          })
          .on("drag", (event, n) => { n.fx = event.x; n.fy = event.y; })
          .on("end", (event, n) => {
            if (!event.active) simulation.alphaTarget(0);
            n.fx = null; n.fy = null;
          })
      );

    nodeSel.append("circle")
      .attr("r", (n) => {
        const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
        // 선택된 term은 반경을 키워 한눈에 띄게
        return isSelected ? nodeRadius(n.type) + 4 : nodeRadius(n.type);
      })
      .attr("fill", (n) => {
        const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
        if (isSelected) return "rgba(247,129,102,0.55)";
        if (n.type === "root") return "rgba(88,166,255,0.15)";
        if (n.type === "scene") return "rgba(63,185,80,0.12)";
        if (n.type === "category") return "rgba(188,140,255,0.10)";

        const band = safeBand(n.data?.stats);
        const bc = BAND_COLORS[band] || BAND_COLORS[null];
        return bc + "22";
      })
      .attr("stroke", (n) => {
        const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
        if (isSelected) return SELECTED_COLOR;
        return nodeColor(n.type, false);
      })
      .attr("stroke-width", (n) => {
        const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
        return isSelected ? 3.5 : 1.5;
      });

    // ── 선택 노드 외곽 Glow Ring (선택된 term에만 추가) ──────────────
    nodeSel.filter((n) => {
      const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
      return isSelected && n.type === "term";
    })
      .append("circle")
      .attr("r", (n) => nodeRadius(n.type) + 11)
      .attr("fill", "none")
      .attr("stroke", SELECTED_COLOR)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5 3")
      .attr("opacity", 0.9);

    // ── Band 링 (비선택 term에만 표시, 선택 glow와 겹치지 않게) ──────
    nodeSel.filter((n) => {
      const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
      return !isSelected && n.type === "term" && safeBand(n.data?.stats) !== null;
    })
      .append("circle")
      .attr("r", (n) => nodeRadius(n.type) + 3)
      .attr("fill", "none")
      .attr("stroke", (n) => BAND_COLORS[safeBand(n.data?.stats)])
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "3 2")
      .attr("opacity", 0.7);

    nodeSel.append("text")
      .text((n) => {
        if (n.type === "term") return n.label;
        return n.label.replace(/^\d+\.\s*/, "");
      })
      .attr("text-anchor", "middle")
      .attr("dy", (n) => {
        const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
        // 선택된 노드는 반경이 커졌으므로 텍스트 dy도 조정
        const r = isSelected ? nodeRadius(n.type) + 4 : nodeRadius(n.type);
        return n.type === "term" ? r + 13 : r + 14;
      })
      .attr("font-size", (n) => {
        const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
        if (isSelected) return 13; // 선택 시 폰트 확대
        if (n.type === "root") return 13;
        if (n.type === "scene") return 12;
        return 11;
      })
      .attr("font-weight", (n) => {
        const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
        return isSelected ? 700 : (n.type === "term" ? 400 : 700);
      })
      .attr("fill", (n) => {
        const isSelected = selectedTermId && (n.id === selectedTermId || n.data?.id === selectedTermId);
        return isSelected ? SELECTED_COLOR : nodeColor(n.type, false);
      })
      .attr("pointer-events", "none");

    simulation.on("tick", () => {
      // 위치 저장
      nodes.forEach((n) => {
        nodePositionsRef.current.set(n.id, { x: n.x, y: n.y });
      });

      linkSel
        .attr("x1", (l) => l.source.x)
        .attr("y1", (l) => l.source.y)
        .attr("x2", (l) => l.target.x)
        .attr("y2", (l) => l.target.y);
      nodeSel.attr("transform", (n) => `translate(${n.x},${n.y})`);
    });

    // 배경 클릭 시 Collapse
    svg.on("click", () => {
      setExpandedCategoryId(null);
    });

    simulation.on("end", () => {
      // 빠르게 안정화된 뒤에는 노드 위치를 고정해 흔들림을 줄인다.
      nodes.forEach((n) => {
        n.fx = n.x;
        n.fy = n.y;
      });

      // 최초 로드 시 전체 뷰 정렬
      if (prevPosMap.size === 0) {
        const bounds = g.node().getBBox();
        if (bounds.width > 0) {
          const scale = Math.min(0.85, Math.min(width / (bounds.width + 80), height / (bounds.height + 80)));
          const tx = (width - bounds.width * scale) / 2 - bounds.x * scale;
          const ty = (height - bounds.height * scale) / 2 - bounds.y * scale;
          svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
        }
      }
    });
  }, [treeData, focusedRootId, expandedCategoryId, selectedTermId, onSelectTerm]);

  useEffect(() => {
    draw();
    return () => simulationRef.current?.stop();
  }, [draw]);

  // ── 외부 selectedTermId 변화 감지 (사이드바 → 마인드맵 동기화) ──────
  // 무한 루프 방지: 내부 클릭 여부를 ref로 추적
  const internalClickRef = useRef(false);

  useEffect(() => {
    if (!selectedTermId) return;
    if (internalClickRef.current) {
      // 캔버스 내부 클릭은 이미 즉시 줌 처리됨 — 중복 실행 차단
      internalClickRef.current = false;
      return;
    }

    // treeData에서 해당 단어의 카테고리를 탐색
    let foundCatId = null;
    outer: for (const root of Object.values(treeData)) {
      for (const scene of Object.values(root.children || {})) {
        for (const cat of Object.values(scene.children || {})) {
          const found = Object.values(cat.children || {}).some(
            (t) => t.id === selectedTermId || t.data?.id === selectedTermId
          );
          if (found) { foundCatId = cat.id; break outer; }
        }
      }
    }
    if (!foundCatId) return;

    // 필요하면 카테고리 자동 확장 (draw 재실행 → 단어 노드 생성)
    if (expandedCategoryId !== foundCatId) {
      setExpandedCategoryId(foundCatId);
    }

    // draw 완료 + 시뮬레이션 안정화 후 줌 (1.0s 대기)
    pendingZoomTermRef.current = selectedTermId;
    const t = setTimeout(() => {
      if (pendingZoomTermRef.current !== selectedTermId) return;
      const pos = nodePositionsRef.current.get(selectedTermId);
      if (pos && centerOnNodeRef.current) {
        centerOnNodeRef.current(pos.x, pos.y, 1.8);
      }
      pendingZoomTermRef.current = null;
    }, 1000);
    return () => clearTimeout(t);
  // expandedCategoryId를 의존성에 넣지 않음 → setExpandedCategoryId가 effect를 재실행시키지 않도록
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTermId, treeData]);

  const handleReset = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    setExpandedCategoryId(null); // 시점 리셋 시 트리도 접기
    d3.select(svgEl).transition().duration(400).call(
      d3.zoom().transform,
      d3.zoomIdentity.translate(svgEl.clientWidth / 2, svgEl.clientHeight / 2).scale(0.5)
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%", background: "transparent" }} />

      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 6, zIndex: 10 }}>
        <button onClick={handleReset} className="card-glass" style={{ width: 36, height: 36, borderRadius: 8, color: "var(--text-primary)", border: "1px solid var(--border-color)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RefreshCcw size={14} />
        </button>
      </div>

      <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 10, background: "rgba(13,17,23,0.85)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4, fontWeight: 600 }}>Band 범위</div>
        {[
          { band: 1, label: "최상위 필수" },
          { band: 2, label: "핵심 중요" },
          { band: 3, label: "일반 활용" },
          { band: 4, label: "보조 표현" },
          { band: 5, label: "심화 어휘" },
          { band: null, label: "미산출" },
        ].map(({ band, label }) => (
          <div key={band} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: BAND_COLORS[band], border: "1px solid rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {band !== null ? `Band ${band}` : "—"} {label}
            </span>
          </div>
        ))}
      </div>

      {tooltip && (
        <div style={{ position: "fixed", left: tooltip.x + 12, top: tooltip.y - 10, background: "rgba(13,17,23,0.95)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "12px 16px", zIndex: 200, maxWidth: 280, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", pointerEvents: "none" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>{tooltip.word}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.5 }}>{tooltip.def || "—"}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tooltip.band !== null ? (
              <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: BAND_COLORS[tooltip.band] + "33", color: BAND_COLORS[tooltip.band], border: `1px solid ${BAND_COLORS[tooltip.band]}66` }}>Band {tooltip.band}</span>
            ) : (
              <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "rgba(110,118,129,0.15)", color: "#6e7681", border: "1px solid rgba(110,118,129,0.3)" }}>Band 미산출</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
