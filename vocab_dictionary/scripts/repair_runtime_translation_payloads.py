#!/usr/bin/env python3
from __future__ import annotations

import json
import gzip
from collections import Counter
from pathlib import Path


ROOT = Path("/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3")
LIVE_DIR = ROOT / "09_app/public/data/live"
SOURCE_DIR = ROOT / "vocab_dictionary/output/unified_live"

SEARCH_INDEX_PATH = LIVE_DIR / "APP_READY_SEARCH_INDEX.json"
MEANING_TREE_PATH = LIVE_DIR / "APP_READY_MEANING_TREE.json"
SITUATION_TREE_PATH = LIVE_DIR / "APP_READY_SITUATION_TREE.json"
UNCLASSIFIED_TREE_PATH = LIVE_DIR / "APP_READY_UNCLASSIFIED_TREE.json"
CHUNK_GLOB = "APP_READY_CHUNK_RICH_*.json"
TRANSLATIONS_PATH = SOURCE_DIR / "kcenter_translations.json.gz"
SOURCE_BASE_PATH = SOURCE_DIR / "kcenter_base.json.gz"

TARGET_LANGUAGES = [
    "영어",
    "몽골어",
    "아랍어",
    "중국어",
    "베트남어",
    "타이어",
    "일본어",
    "프랑스어",
    "스페인어",
    "러시아어",
    "인도네시아어",
]


def load_json(path: Path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write_json(path: Path, payload) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write("\n")


def load_source_translation_map() -> dict[str, list[dict]]:
    with gzip.open(TRANSLATIONS_PATH, "rt", encoding="utf-8") as f:
        payload = json.load(f)

    translation_map: dict[str, list[dict]] = {}
    for record in payload["records"]:
        filtered = [
            {
                "language": item.get("language"),
                "word": item.get("word"),
                "definition": item.get("definition"),
            }
            for item in (record.get("translations") or [])
            if item.get("language") in TARGET_LANGUAGES
        ]
        filtered.sort(key=lambda item: TARGET_LANGUAGES.index(item["language"]))
        translation_map[record["sense_id"]] = filtered
    return translation_map


def load_source_subword_map() -> dict[str, dict[tuple[str, str], dict]]:
    with gzip.open(SOURCE_BASE_PATH, "rt", encoding="utf-8") as f:
        payload = json.load(f)

    subword_map: dict[str, dict[tuple[str, str], dict]] = {}
    for record in payload.get("entries", []):
        entry = record.get("entry") or {}
        entry_id = entry.get("id")
        if not entry_id:
            continue
        current: dict[tuple[str, str], dict] = {}
        for subword in entry.get("subwords") or []:
            key = (
                subword.get("text") or "",
                subword.get("unit") or "",
            )
            current[key] = subword
        subword_map[str(entry_id)] = current
    return subword_map


def build_translation_summary(sense_translations: list[dict]) -> list[dict]:
    return [
        {
            "language": item.get("language"),
            "word": item.get("word"),
            "definition": item.get("definition"),
        }
        for item in sense_translations
    ]


def english_definition(translations: list[dict]) -> str | None:
    english = next((item for item in translations if item.get("language") == "영어"), None)
    return english.get("definition") if english else None


def repair_subwords(entry: dict, subword_map: dict[str, dict[tuple[str, str], dict]], lang_counter: Counter) -> None:
    source_subwords = subword_map.get(str(entry.get("id")), {})
    for subword in entry.get("subwords") or []:
        key = (
            subword.get("text") or "",
            subword.get("unit") or "",
        )
        source_subword = source_subwords.get(key)
        if not source_subword:
            continue

        source_senses = source_subword.get("senses") or []
        source_sense_map = {}
        for source_sense in source_senses:
            source_key = (
                (source_sense.get("source_ids") or {}).get("json_sense"),
                source_sense.get("subsense_order"),
            )
            source_sense_map[source_key] = source_sense

        for index, sense in enumerate(subword.get("senses") or [], start=1):
            lookup_key = (
                (sense.get("source_ids") or {}).get("json_sense"),
                sense.get("subsense_order") or index,
            )
            source_sense = source_sense_map.get(lookup_key)
            if not source_sense and len(source_senses) >= index:
                source_sense = source_senses[index - 1]
            if not source_sense:
                continue
            source_translations = [
                {
                    "language": item.get("language"),
                    "word": item.get("word"),
                    "definition": item.get("definition"),
                }
                for item in (source_sense.get("translations") or [])
                if item.get("language") in TARGET_LANGUAGES
            ]
            source_translations.sort(key=lambda item: TARGET_LANGUAGES.index(item["language"]))
            if source_translations:
                sense["translations"] = build_translation_summary(source_translations)
                for item in source_translations:
                    lang_counter[item["language"]] += 1


def repair_entry_senses(entry: dict, translation_map: dict[str, list[dict]], lang_counter: Counter) -> None:
    for sense in entry.get("senses") or []:
        source_translations = translation_map.get(sense.get("id"), [])
        if source_translations:
            sense["translations"] = build_translation_summary(source_translations)
            for item in source_translations:
                lang_counter[item["language"]] += 1


def repair_rich_chunks(translation_map: dict[str, list[dict]], subword_map: dict[str, dict[tuple[str, str], dict]]) -> Counter:
    lang_counter = Counter()
    for chunk_path in sorted(LIVE_DIR.glob(CHUNK_GLOB)):
        payload = load_json(chunk_path)
        for entry in payload.values():
            repair_entry_senses(entry, translation_map, lang_counter)
            repair_subwords(entry, subword_map, lang_counter)
        write_json(chunk_path, payload)
    return lang_counter


def repair_list_payload(path: Path, translation_map: dict[str, list[dict]]) -> Counter:
    items = load_json(path)
    lang_counter = Counter()

    for item in items:
        sense_id = item.get("representative_sense_id")
        source_translations = translation_map.get(sense_id, [])
        if source_translations:
            item["translation_summary"] = build_translation_summary(source_translations)
            item["def_en"] = english_definition(source_translations)
            for lang in {t["language"] for t in source_translations}:
                lang_counter[lang] += 1
        else:
            item["translation_summary"] = []
            item["def_en"] = None

    write_json(path, items)
    return lang_counter


def repair_search_index(translation_map: dict[str, list[dict]]) -> Counter:
    payload = load_json(SEARCH_INDEX_PATH)
    records = payload["records"] if isinstance(payload, dict) and "records" in payload else payload
    lang_counter = Counter()

    for item in records:
        sense_id = item.get("representative_sense_id")
        source_translations = translation_map.get(sense_id, [])
        if source_translations:
            item["translation_summary"] = build_translation_summary(source_translations)
            item["def_en"] = english_definition(source_translations)
            for lang in {t["language"] for t in source_translations}:
                lang_counter[lang] += 1
        else:
            item["translation_summary"] = []
            item["def_en"] = None

    write_json(SEARCH_INDEX_PATH, payload)
    return lang_counter


def main() -> None:
    translation_map = load_source_translation_map()
    subword_map = load_source_subword_map()
    print(f"source_sense_ids={len(translation_map):,}")

    search_counts = repair_search_index(translation_map)
    chunk_counts = repair_rich_chunks(translation_map, subword_map)
    meaning_counts = repair_list_payload(MEANING_TREE_PATH, translation_map)
    situation_counts = repair_list_payload(SITUATION_TREE_PATH, translation_map)
    unclassified_counts = repair_list_payload(UNCLASSIFIED_TREE_PATH, translation_map)

    print("chunk_term_counts", chunk_counts)
    print("search_term_counts", search_counts)
    print("meaning_term_counts", meaning_counts)
    print("situation_term_counts", situation_counts)
    print("unclassified_term_counts", unclassified_counts)


if __name__ == "__main__":
    main()
