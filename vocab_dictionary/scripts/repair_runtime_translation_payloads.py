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
DETAIL_MAP_PATH = LIVE_DIR / "APP_READY_DETAIL_MAP.json"
TRANSLATIONS_PATH = SOURCE_DIR / "kcenter_translations.json.gz"

TARGET_LANGUAGES = ["영어", "몽골어", "아랍어", "중국어", "베트남어", "타이어"]


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


def repair_detail_map(translation_map: dict[str, list[dict]]) -> Counter:
    payload = load_json(DETAIL_MAP_PATH)
    entries = payload["entries"]
    lang_counter = Counter()

    for entry in entries.values():
        for sense in entry.get("senses") or []:
            source_translations = translation_map.get(sense.get("id"), [])
            if source_translations:
                sense["translations"] = build_translation_summary(source_translations)
                for item in source_translations:
                    lang_counter[item["language"]] += 1

    write_json(DETAIL_MAP_PATH, payload)
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
    print(f"source_sense_ids={len(translation_map):,}")

    detail_counts = repair_detail_map(translation_map)
    search_counts = repair_search_index(translation_map)
    meaning_counts = repair_list_payload(MEANING_TREE_PATH, translation_map)
    situation_counts = repair_list_payload(SITUATION_TREE_PATH, translation_map)
    unclassified_counts = repair_list_payload(UNCLASSIFIED_TREE_PATH, translation_map)

    print("detail_term_counts", detail_counts)
    print("search_term_counts", search_counts)
    print("meaning_term_counts", meaning_counts)
    print("situation_term_counts", situation_counts)
    print("unclassified_term_counts", unclassified_counts)


if __name__ == "__main__":
    main()
