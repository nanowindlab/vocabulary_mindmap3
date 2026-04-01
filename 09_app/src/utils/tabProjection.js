export function buildProjectedHierarchyForTab(item, tabId) {
  const categories = Array.isArray(item?.categories) ? item.categories : [];

  if (tabId === "meaning") {
    const meaningCategory = categories.find((category) => category?.type === "의미 범주")?.value || null;
    if (!meaningCategory) return null;
    const parts = meaningCategory.split(" > ").map((part) => part.trim()).filter(Boolean);
    const scene = parts[0] || "일반";
    const category = parts[parts.length - 1] || scene;
    return {
      root_id: "의미 범주",
      root_label: "의미 범주",
      root_en: "",
      scene,
      category,
      path_ko: ["의미 범주", scene, category].join(" > "),
      system: "의미 범주",
      root: scene,
    };
  }

  if (tabId === "situation") {
    const situationCategory = categories.find((category) => category?.type === "주제 및 상황 범주")?.value || null;
    if (!situationCategory) return null;
    return {
      root_id: "주제 및 상황 범주",
      root_label: "주제 및 상황 범주",
      root_en: "",
      scene: situationCategory,
      category: situationCategory,
      path_ko: ["주제 및 상황 범주", situationCategory, situationCategory].join(" > "),
      system: "주제 및 상황 범주",
      root: situationCategory,
    };
  }

  const wordGrade = item?.word_grade || "없음";
  const posLabel = item?.pos || item?.part_of_speech || "품사 없음";
  return {
    root_id: "미분류",
    root_label: "미분류",
    root_en: "",
    scene: wordGrade,
    category: posLabel,
    path_ko: ["미분류", wordGrade, posLabel].join(" > "),
    system: "미분류",
    root: wordGrade,
  };
}

export function projectItemWithTabHierarchy(item, tabId) {
  const hierarchy = buildProjectedHierarchyForTab(item, tabId);
  if (!hierarchy) return null;
  return {
    ...item,
    hierarchy,
  };
}

export function buildProjectedTabPayloads(items, transform = (item) => item) {
  const payloads = {
    meaning: [],
    situation: [],
    unclassified: [],
  };

  for (const item of items || []) {
    const meaningItem = projectItemWithTabHierarchy(item, "meaning");
    if (meaningItem) {
      payloads.meaning.push(transform(meaningItem, "meaning"));
    }

    const situationItem = projectItemWithTabHierarchy(item, "situation");
    if (situationItem) {
      payloads.situation.push(transform(situationItem, "situation"));
    }

    if (!meaningItem && !situationItem) {
      const unclassifiedItem = projectItemWithTabHierarchy(item, "unclassified");
      if (unclassifiedItem) {
        payloads.unclassified.push(transform(unclassifiedItem, "unclassified"));
      }
    }
  }

  return payloads;
}

export function buildTreeShellPayload(items = []) {
  const tree = {};

  for (const item of items) {
    const hierarchy = item?.hierarchy || {};
    const rootId = hierarchy.root_id;
    const sceneId = hierarchy.display_scene || hierarchy.scene || "일반";
    const categoryId = hierarchy.display_category || hierarchy.category || item?.pos || "기타";
    const rootNodeId = `root:${rootId}`;
    const sceneNodeId = `scene:${rootId}:${sceneId}`;
    const categoryNodeId = `category:${rootId}:${sceneId}:${categoryId}`;

    if (!rootId) continue;

    tree[rootNodeId] ||= {
      id: rootNodeId,
      type: "root",
      rootId,
      label: hierarchy.display_root_label || hierarchy.root_label || rootId,
      label_en: hierarchy.root_en || "",
      children: {},
    };

    tree[rootNodeId].children[sceneNodeId] ||= {
      id: sceneNodeId,
      type: "scene",
      rootId,
      sceneId,
      label: sceneId,
      children: {},
    };

    tree[rootNodeId].children[sceneNodeId].children[categoryNodeId] ||= {
      id: categoryNodeId,
      type: "category",
      rootId,
      sceneId,
      categoryId,
      label: categoryId,
      children: {},
      termCount: 0,
    };

    tree[rootNodeId].children[sceneNodeId].children[categoryNodeId].termCount += 1;
  }

  return tree;
}
