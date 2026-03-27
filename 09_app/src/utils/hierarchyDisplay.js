import { getSituationCanonicalGroup } from "./situationTaxonomy";

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

export function isSituationRepeatedHierarchy(hierarchy = {}) {
  if (!isSituationHierarchy(hierarchy)) return false;
  if (isSituationNoneHierarchy(hierarchy)) return false;
  return Boolean(hierarchy.scene) && Boolean(hierarchy.category) && hierarchy.scene === hierarchy.category;
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

export function normalizeHierarchyForDisplay({ hierarchy = {}, pos, wordGrade }) {
  const rawPath = hierarchy.path_ko || "";
  const pathSegments = typeof hierarchy.path_ko === "string"
    ? hierarchy.path_ko.split(" > ").map((part) => part.trim()).filter(Boolean)
    : [];
  const derivedRoot = hierarchy.root || pathSegments[0] || null;
  const derivedScene = pathSegments.length >= 3
    ? pathSegments[1]
    : pathSegments.length === 2
      ? pathSegments[1]
      : (hierarchy.scene || derivedRoot || "일반");
  const derivedCategory = pathSegments.length >= 3
    ? pathSegments[pathSegments.length - 1]
    : (hierarchy.category || pos || "기타");
  const rootId = hierarchy.root_id || derivedRoot || hierarchy.scene || hierarchy.system || null;
  const rootLabel = hierarchy.root_label || derivedRoot || rootId || "";
  const rawScene = hierarchy.root_id ? (hierarchy.scene || derivedScene || "일반") : derivedScene;
  const rawCategory = hierarchy.root_id ? (hierarchy.category || pos || "기타") : derivedCategory;
  const { scene, category } = normalizeHierarchyBuckets({
    rootId,
    scene: rawScene,
    category: rawCategory,
    pos: pos || "품사 없음",
    wordGrade: wordGrade || "없음",
  });
  const hierarchyForDisplay = {
    ...hierarchy,
    root_id: rootId,
    root_label: rootLabel,
    root_en: hierarchy.root_en || "",
    scene,
    category,
    raw_scene: rawScene,
    raw_category: rawCategory,
    raw_path_ko: rawPath || `${rootLabel} > ${rawScene} > ${rawCategory}`,
  };
  const hierarchyDisplay = buildHierarchyDisplay({
    hierarchy: hierarchyForDisplay,
    pos: pos || "품사 없음",
    wordGrade: wordGrade || "없음",
  });

  return {
    ...hierarchyForDisplay,
    display_root_label: hierarchyDisplay.displayRootLabel,
    display_scene: hierarchyDisplay.displayScene,
    display_category: hierarchyDisplay.displayCategory,
    display_path_ko: hierarchyDisplay.displayPathKo,
    context_kind: hierarchyDisplay.contextKind,
    helper_title: hierarchyDisplay.helperTitle,
    helper_description: hierarchyDisplay.helperDescription,
    path_ko: hierarchyDisplay.displayPathKo,
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
        "특정 장면보다 일반 의미와 쓰임을 먼저 보면 됩니다.",
    };
  }

  if (isSituationHierarchy(hierarchy)) {
    const rawLeaf = hierarchy.raw_category || hierarchy.category || hierarchy.scene || "";
    const canonicalGroup = getSituationCanonicalGroup(rawLeaf);
    if (canonicalGroup) {
      return {
        displayRootLabel: "주제 및 상황",
        displayScene: canonicalGroup,
        displayCategory: rawLeaf,
        displayPathKo: ["주제 및 상황", canonicalGroup, rawLeaf].filter(Boolean).join(" > "),
        contextKind: "situation_canonical",
        helperTitle: null,
        helperDescription: null,
      };
    }
  }

  if (isSituationRepeatedHierarchy(hierarchy)) {
    return {
      displayRootLabel: "주제 및 상황",
      displayScene: hierarchy.scene || "",
      displayCategory: "어휘 목록",
      displayPathKo: ["주제 및 상황", hierarchy.scene || ""].filter(Boolean).join(" > "),
      contextKind: "situation_repeated_collapsed",
      helperTitle: null,
      helperDescription: null,
    };
  }

  if (isUnclassifiedHierarchy(hierarchy)) {
    const kind = isFunctionalUnclassifiedPos(hierarchy.category || pos)
      ? "unclassified_functional"
      : "unclassified_content";

    const displayScene = formatUnclassifiedCategory(hierarchy.category, pos);
    const displayCategory = formatUnclassifiedScene(hierarchy.scene, wordGrade);

    return {
      displayRootLabel: "분류 밖 항목",
      displayScene,
      displayCategory,
      displayPathKo: [
        "분류 밖 항목",
        displayScene,
        displayCategory,
      ].join(" > "),
      contextKind: kind,
      helperTitle: kind === "unclassified_functional" ? "문법 기능 중심 항목" : "분류 밖 일반 어휘",
      helperDescription:
        kind === "unclassified_functional"
          ? "이 영역에서는 학습난이도보다 품사와 형태 기준을 먼저 보면 됩니다."
          : "이 영역에서는 상황 분류보다 품사와 학습난이도 기준을 먼저 보면 됩니다.",
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
