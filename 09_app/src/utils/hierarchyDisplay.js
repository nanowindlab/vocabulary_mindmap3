const FUNCTIONAL_UNCLASSIFIED_POS = new Set([
  "어미",
  "조사",
  "접사",
  "보조 동사",
  "보조 형용사",
]);

export function toPosLabel(pos) {
  if (Array.isArray(pos)) return pos.join(" / ");
  return pos || "품사 없음";
}

export function isFunctionalUnclassifiedPos(pos) {
  return FUNCTIONAL_UNCLASSIFIED_POS.has(toPosLabel(pos));
}

export function isUnclassifiedHierarchy(hierarchy = {}) {
  const markers = [
    hierarchy.root_id,
    hierarchy.root_label,
    hierarchy.root,
    hierarchy.system,
  ];
  return markers.includes("미분류") || (hierarchy.path_ko || "").startsWith("미분류");
}

export function isSituationHierarchy(hierarchy = {}) {
  const markers = [
    hierarchy.root_id,
    hierarchy.root_label,
    hierarchy.root,
    hierarchy.system,
  ];
  return markers.includes("주제 및 상황 범주") || (hierarchy.path_ko || "").startsWith("주제 및 상황 범주");
}

export function isSituationNoneHierarchy(hierarchy = {}) {
  if (!isSituationHierarchy(hierarchy)) return false;
  const rawPath = hierarchy.raw_path_ko || hierarchy.path_ko || "";
  return (
    hierarchy.scene === "없음" ||
    hierarchy.category === "없음" ||
    rawPath === "주제 및 상황 범주 > 없음" ||
    rawPath.startsWith("주제 및 상황 범주 > 없음 > 없음")
  );
}

export function normalizeHierarchyBuckets({ rootId, scene, category, pos, wordGrade }) {
  if (rootId !== "미분류") {
    return {
      scene,
      category,
    };
  }

  return {
    scene: scene && scene !== "미분류" ? scene : (wordGrade || "없음"),
    category: category && category !== "미분류" ? category : toPosLabel(pos),
  };
}

function formatUnclassifiedScene(scene, wordGrade) {
  const source = scene && scene !== "미분류" ? scene : (wordGrade || "없음");
  return source === "없음" ? "학습난이도 미기재" : `학습난이도 · ${source}`;
}

function formatUnclassifiedCategory(category, pos) {
  const source = category && category !== "미분류" ? category : toPosLabel(pos);
  if (!source || source === "품사 없음") return "품사 미기재";
  return `품사 · ${source}`;
}

export function buildHierarchyDisplay({ hierarchy = {}, pos, wordGrade }) {
  const rootLabel =
    hierarchy.root_label ||
    hierarchy.root ||
    hierarchy.root_id ||
    hierarchy.system ||
    "";
  const rawPath =
    hierarchy.raw_path_ko ||
    hierarchy.path_ko ||
    [rootLabel, hierarchy.scene, hierarchy.category].filter(Boolean).join(" > ");

  if (isSituationNoneHierarchy(hierarchy)) {
    return {
      displayRootLabel: "주제 및 상황",
      displayScene: "상황 미지정",
      displayCategory: "일반 어휘",
      displayPathKo: "주제 및 상황 > 상황 미지정 > 일반 어휘",
      contextKind: "situation_none",
      helperTitle: "상황 미지정",
      helperDescription:
        "이 항목은 특정 장면 하나보다 일반 의미로 익히는 편이 적절한 어휘입니다. 상황 탐색보다 의미·관계·예문을 먼저 보는 편이 맞습니다.",
    };
  }

  if (isUnclassifiedHierarchy(hierarchy)) {
    const kind = isFunctionalUnclassifiedPos(hierarchy.category || pos)
      ? "unclassified_functional"
      : "unclassified_content";

    return {
      displayRootLabel: "분류 밖 항목",
      displayScene: formatUnclassifiedScene(hierarchy.scene, wordGrade),
      displayCategory: formatUnclassifiedCategory(hierarchy.category, pos),
      displayPathKo: [
        "분류 밖 항목",
        formatUnclassifiedScene(hierarchy.scene, wordGrade),
        formatUnclassifiedCategory(hierarchy.category, pos),
      ].join(" > "),
      contextKind: kind,
      helperTitle: kind === "unclassified_functional" ? "문법/형태 항목" : "분류 미기재 어휘",
      helperDescription:
        kind === "unclassified_functional"
          ? "이 항목은 특정 상황보다 문법 기능이나 형태 변화로 익히는 편이 적절합니다. 현재 `분류 밖 항목` 영역에서 `학습난이도`와 `품사` 기준으로 보조 탐색합니다."
          : "이 항목은 의미/상황 분류가 비어 있는 일반 어휘입니다. 현재 `분류 밖 항목` 영역에서 `학습난이도`와 `품사` 기준으로 보조 탐색합니다.",
    };
  }

  return {
    displayRootLabel: rootLabel,
    displayScene: hierarchy.scene || "",
    displayCategory: hierarchy.category || "",
    displayPathKo: hierarchy.path_ko || rawPath,
    contextKind: null,
    helperTitle: null,
    helperDescription: null,
  };
}
