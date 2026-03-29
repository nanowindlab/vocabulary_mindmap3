import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = process.cwd();
const BASE_PATH = path.join(ROOT, "..", "vocab_dictionary", "output", "unified_live", "kcenter_base.json.gz");
const SEARCH_INDEX_PATH = path.join(ROOT, "..", "09_app", "public", "data", "live", "APP_READY_SEARCH_INDEX.json");
const OUT_DIR = path.join(ROOT, "public", "data");

const FAMILY_CONFIG = {
  synonym: {
    label: "비슷한말",
    summary: "뜻이 가까운 말을 빠르게 비교합니다.",
    tone: "blue",
    relationTypes: ["유의어"],
  },
  antonym: {
    label: "반대말",
    summary: "대조가 분명한 말을 나란히 학습합니다.",
    tone: "orange",
    relationTypes: ["반대말"],
  },
  reference: {
    label: "참고어",
    summary: "완전 같은말은 아니지만 같이 보면 좋은 관계를 묶습니다.",
    tone: "green",
    relationTypes: ["참고어"],
  },
  honorific: {
    label: "높임말·낮춤말",
    summary: "사람과 상황에 따라 달라지는 말의 높낮이를 봅니다.",
    tone: "purple",
    relationTypes: ["높임말", "낮춤말"],
  },
  size: {
    label: "큰말·작은말",
    summary: "크고 작음의 짝을 한 흐름으로 봅니다.",
    tone: "purple",
    relationTypes: ["큰말", "작은말"],
  },
  intensity: {
    label: "센말·여린말",
    summary: "강하고 약한 표현 차이를 비교합니다.",
    tone: "purple",
    relationTypes: ["센말", "여린말"],
  },
  shortform: {
    label: "준말·본말",
    summary: "줄인말과 원형을 함께 봅니다.",
    tone: "purple",
    relationTypes: ["준말", "본말"],
  },
  derived: {
    label: "파생어·관련형",
    summary: "한 단어에서 가지처럼 뻗는 계열을 함께 봅니다.",
    tone: "red",
    relationTypes: ["파생어"],
  },
};

const ALLOWED_TRANSLATION_LANGUAGES = new Set(["영어", "몽골어"]);

const TYPE_TO_FAMILY = Object.fromEntries(
  Object.entries(FAMILY_CONFIG).flatMap(([familyId, config]) =>
    config.relationTypes.map((relationType) => [relationType, familyId]),
  ),
);

function gunzipJson(buffer) {
  return JSON.parse(zlib.gunzipSync(buffer).toString("utf8"));
}

function firstExampleText(entry) {
  for (const sense of entry.senses || []) {
    for (const example of sense.examples || []) {
      const texts = example?.texts || [];
      if (texts.length > 0) return texts.join(" ");
    }
  }
  return "";
}

function subgroupFromRow(row) {
  const categoryValue = row?.categories?.[0]?.value;
  if (typeof categoryValue === "string" && categoryValue.length > 0) {
    const parts = categoryValue.split(" > ").map((part) => part.trim()).filter(Boolean);
    return parts[parts.length - 1] || categoryValue;
  }
  const hierarchyCategory = row?.hierarchy?.category;
  if (typeof hierarchyCategory === "string" && hierarchyCategory.length > 0) {
    const parts = hierarchyCategory.split(" > ").map((part) => part.trim()).filter(Boolean);
    return parts[parts.length - 1] || hierarchyCategory;
  }
  return "기타";
}

function bucketFromRow(row) {
  const categoryValue = row?.categories?.[0]?.value;
  if (typeof categoryValue === "string" && categoryValue.length > 0) {
    const parts = categoryValue.split(" > ").map((part) => part.trim()).filter(Boolean);
    return parts[0] || "기타";
  }
  const hierarchyCategory = row?.hierarchy?.category;
  if (typeof hierarchyCategory === "string" && hierarchyCategory.length > 0) {
    const parts = hierarchyCategory.split(" > ").map((part) => part.trim()).filter(Boolean);
    return parts[0] || "기타";
  }
  return "기타";
}

function representativeDefinition(sourceRow, targetRows) {
  return (
    sourceRow?.def_ko ||
    targetRows.find((row) => row?.def_ko)?.def_ko ||
    "관계 학습을 위한 비교 카드입니다."
  );
}

function buildNote(rawTypes, targetRows) {
  if (rawTypes.includes("유의어")) return "뜻은 가깝지만 쓰는 장면과 뉘앙스가 조금씩 다릅니다.";
  if (rawTypes.includes("반대말")) return "대조가 분명한 짝을 한 화면에서 읽습니다.";
  if (rawTypes.includes("참고어")) return "한 장면에서 같이 보면 이해가 빨라지는 관계입니다.";
  if (rawTypes.includes("높임말") || rawTypes.includes("낮춤말")) return "사람과 상황에 따라 높낮이가 달라지는 표현입니다.";
  if (rawTypes.includes("큰말") || rawTypes.includes("작은말")) return "크기감과 묘사 강도가 어떻게 바뀌는지 봅니다.";
  if (rawTypes.includes("센말") || rawTypes.includes("여린말")) return "말의 세기와 질감 차이를 함께 봅니다.";
  if (rawTypes.includes("준말") || rawTypes.includes("본말")) return "줄인말과 원형을 함께 비교합니다.";
  if (rawTypes.includes("파생어")) return "한 단어에서 뻗어 나가는 계열을 묶어 봅니다.";
  return `${targetRows.length}개 관계어를 함께 비교합니다.`;
}

function toTermDetail(row, fallbackDefinition) {
  return {
    id: String(row.id),
    word: row.word,
    hint: row.def_ko || fallbackDefinition,
    definition: row.def_ko || fallbackDefinition,
    pos: row.pos || "",
    wordGrade: row.word_grade || "",
    hierarchyPath: row.hierarchy?.path_ko || "",
    categoryValue: row.categories?.[0]?.value || "",
    chunkId: row.chunk_id || "",
    routing: row.routing || "",
    representativeSenseId: row.representative_sense_id || "",
    translationSummary: row.translation_summary || [],
    topikBand: row.stats?.band ?? null,
    topikLevel: row.stats?.level || "",
  };
}

function uniqueTerms(sourceRow, targetRows) {
  const fallbackDefinition = representativeDefinition(sourceRow, targetRows);
  const items = [
    toTermDetail(sourceRow, fallbackDefinition),
    ...targetRows.map((row) => toTermDetail(row, fallbackDefinition)),
  ];

  const deduped = [];
  const seen = new Set();
  for (const item of items) {
    if (!item.word || seen.has(item.word)) continue;
    seen.add(item.word);
    deduped.push(item);
  }
  return deduped.slice(0, 4);
}

function compactClusterCards(cards) {
  const adjacency = new Map();
  const termById = new Map();
  const cardById = new Map();

  for (const card of cards) {
    cardById.set(card.id, card);
    const ids = card.terms.map((term) => term.id);
    for (const term of card.terms) {
      if (!termById.has(term.id)) termById.set(term.id, term);
      if (!adjacency.has(term.id)) adjacency.set(term.id, new Set());
    }
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        adjacency.get(ids[i]).add(ids[j]);
        adjacency.get(ids[j]).add(ids[i]);
      }
    }
  }

  const visited = new Set();
  const compacted = [];

  for (const termId of adjacency.keys()) {
    if (visited.has(termId)) continue;
    const stack = [termId];
    const componentTermIds = [];
    visited.add(termId);
    while (stack.length > 0) {
      const current = stack.pop();
      componentTermIds.push(current);
      for (const next of adjacency.get(current) || []) {
        if (visited.has(next)) continue;
        visited.add(next);
        stack.push(next);
      }
    }

    const componentTerms = componentTermIds
      .map((id) => termById.get(id))
      .filter(Boolean)
      .sort((a, b) => a.word.localeCompare(b.word, "ko"));

    if (componentTerms.length < 2) continue;

    const sourceCards = cards.filter((card) =>
      card.terms.some((term) => componentTermIds.includes(term.id)),
    );
    const firstCard = sourceCards[0];
    const rawTypes = [...new Set(sourceCards.flatMap((card) => card.rawTypes || []))];
    const allChunkIds = [...new Set(sourceCards.flatMap((card) => card.compareTarget?.chunkIds || []))];
    const allSenseIds = [...new Set(sourceCards.flatMap((card) => card.compareTarget?.representativeSenseIds || []))];
    const allRouting = [...new Set(sourceCards.flatMap((card) => card.compareTarget?.routing || []))];

    const previewTerms = componentTerms.slice(0, 4);
    const title =
      componentTerms.length > 4
        ? `${previewTerms.map((term) => term.word).join(" · ")} 외 ${componentTerms.length - 4}`
        : previewTerms.map((term) => term.word).join(" · ");

    compacted.push({
      ...firstCard,
      id: `cluster-${firstCard.id}`,
      rawTypes,
      title,
      terms: componentTerms,
      compareTarget: {
        ...firstCard.compareTarget,
        termIds: componentTerms.map((term) => term.id),
        chunkIds: allChunkIds,
        representativeSenseIds: allSenseIds,
        routing: allRouting,
      },
    });
  }

  return compacted.sort((a, b) => a.title.localeCompare(b.title, "ko"));
}

async function main() {
  const [baseBuffer, searchIndexText] = await Promise.all([
    fs.readFile(BASE_PATH),
    fs.readFile(SEARCH_INDEX_PATH, "utf8"),
  ]);

  const baseData = gunzipJson(baseBuffer);
  const searchRows = JSON.parse(searchIndexText);
  const searchIndexById = new Map(searchRows.map((row) => [String(row.id), row]));

  const familyBuckets = new Map(
    Object.entries(FAMILY_CONFIG).map(([familyId, config]) => [
      familyId,
      {
        id: familyId,
        label: config.label,
        summary: config.summary,
        tone: config.tone,
        groups: new Map(),
      },
    ]),
  );

  for (const wrapper of baseData.entries) {
    const entry = wrapper?.entry;
    if (!entry?.id) continue;

    const sourceId = String(entry.id);
    const sourceRow = searchIndexById.get(sourceId);
    if (!sourceRow) continue;

    const groupedRelations = new Map();
    for (const sense of entry.senses || []) {
      for (const relation of sense.related_terms || []) {
        const relationType = relation?.type;
        const familyId = TYPE_TO_FAMILY[relationType];
        if (!familyId) continue;
        if (!groupedRelations.has(familyId)) groupedRelations.set(familyId, []);
        groupedRelations.get(familyId).push(relation);
      }
    }

    for (const relation of entry.related_forms || []) {
      const relationType = relation?.type;
      const familyId = TYPE_TO_FAMILY[relationType];
      if (!familyId) continue;
      if (relationType !== "파생어") continue;
      if (!groupedRelations.has(familyId)) groupedRelations.set(familyId, []);
      groupedRelations.get(familyId).push(relation);
    }

    for (const [familyId, relations] of groupedRelations.entries()) {
      const targetRows = relations
        .map((relation) => searchIndexById.get(String(relation?.target_code || "")))
        .filter(Boolean);
      if (targetRows.length === 0) continue;

      const subgroupLabel = subgroupFromRow(sourceRow);
      const bucketLabel = bucketFromRow(sourceRow);
      const familyBucket = familyBuckets.get(familyId);
      if (!familyBucket.groups.has(subgroupLabel)) {
        familyBucket.groups.set(subgroupLabel, {
          id: subgroupLabel,
          label: subgroupLabel,
          bucketLabel,
          cards: [],
        });
      }

      const groupBucket = familyBucket.groups.get(subgroupLabel);
      const terms = uniqueTerms(sourceRow, targetRows);
      if (terms.length < 2) continue;

      const rawTypes = [...new Set(relations.map((relation) => relation?.type).filter(Boolean))];
      groupBucket.cards.push({
        id: `${familyId}-${sourceId}`,
        rawTypes,
        title: terms.map((term) => term.word).join(" · "),
        note: buildNote(rawTypes, targetRows),
        example: firstExampleText(entry) || "대표 예문이 아직 연결되지 않았습니다.",
        definition: representativeDefinition(sourceRow, targetRows),
        sourceId,
        subgroup: subgroupLabel,
        terms: terms.map((term) => ({
          ...term,
          hint: term.hint || representativeDefinition(sourceRow, targetRows),
        })),
        compareTarget: {
          family: familyBucket.label,
          subgroup: subgroupLabel,
          termIds: terms.map((term) => term.id),
          chunkIds: [sourceRow.chunk_id, ...targetRows.map((row) => row.chunk_id)].filter(Boolean),
          representativeSenseIds: [sourceRow.representative_sense_id, ...targetRows.map((row) => row.representative_sense_id)].filter(Boolean),
          routing: [sourceRow.routing, ...targetRows.map((row) => row.routing)].filter(Boolean),
        },
      });
    }
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  const bootstrap = [];

  for (const family of familyBuckets.values()) {
      const groups = [...family.groups.values()]
      .map((group) => ({
        ...group,
        cards: compactClusterCards(group.cards)
          .slice(0, 24),
      }))
      .filter((group) => group.cards.length > 0)
      .sort((a, b) => b.cards.length - a.cards.length || a.label.localeCompare(b.label, "ko"));

    if (groups.length === 0) continue;

    const familyPayload = {
      id: family.id,
      label: family.label,
      summary: family.summary,
      tone: family.tone,
      bucketCount: new Set(groups.map((group) => group.bucketLabel)).size,
      groupCount: groups.length,
      cardCount: groups.reduce((sum, group) => sum + group.cards.length, 0),
      groups,
    };

    bootstrap.push({
      id: family.id,
      label: family.label,
      summary: family.summary,
      tone: family.tone,
      bucketCount: familyPayload.bucketCount,
      groupCount: familyPayload.groupCount,
      cardCount: familyPayload.cardCount,
      previewGroups: groups.slice(0, 3).map((group) => group.label),
      dataUrl: `/data/relation-family-${family.id}.json`,
    });

    await fs.writeFile(
      path.join(OUT_DIR, `relation-family-${family.id}.json`),
      JSON.stringify(familyPayload, null, 2),
      "utf8",
    );
  }

  await fs.writeFile(
    path.join(OUT_DIR, "relation-bootstrap.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        familyCount: bootstrap.length,
        families: bootstrap,
      },
      null,
      2,
    ),
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
