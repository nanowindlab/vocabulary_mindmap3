#!/usr/bin/env python3
from __future__ import annotations

import copy
import gzip
import json
from collections import Counter
from pathlib import Path


ROOT = Path("/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3")

SOURCE_BASE_JSON = ROOT / "vocab_dictionary" / "output" / "unified_live" / "kcenter_base.json"
SOURCE_BASE_GZ = ROOT / "vocab_dictionary" / "output" / "unified_live" / "kcenter_base.json.gz"
THIN_INDEX_GZ = ROOT / "vocab_dictionary" / "output" / "unified_live" / "kcenter_thin_index.json.gz"
FACET_PAYLOAD_GZ = ROOT / "vocab_dictionary" / "output" / "unified_live" / "kcenter_facet_payload.json.gz"
TOPIK_LINKAGE_GZ = ROOT / "vocab_dictionary" / "output" / "topik_stats_linkage" / "entry_topik_stats.json.gz"

LIVE_SEARCH_INDEX = ROOT / "09_app" / "public" / "data" / "live" / "APP_READY_SEARCH_INDEX.json"
LIVE_FACETS = ROOT / "09_app" / "public" / "data" / "live" / "APP_READY_FACETS.json"
LIVE_MEANING_TREE = ROOT / "09_app" / "public" / "data" / "live" / "APP_READY_MEANING_TREE.json"
LIVE_SITUATION_TREE = ROOT / "09_app" / "public" / "data" / "live" / "APP_READY_SITUATION_TREE.json"
LIVE_UNCLASSIFIED_TREE = ROOT / "09_app" / "public" / "data" / "live" / "APP_READY_UNCLASSIFIED_TREE.json"
LIVE_DETAIL_MAP = ROOT / "09_app" / "public" / "data" / "live" / "APP_READY_DETAIL_MAP.json"

REPORT_PATH = ROOT / "tmp_reports" / "subject_none_policy_report.json"

SITUATION_TYPE = "주제 및 상황 범주"
MEANING_TYPE = "의미 범주"
NONE_VALUE = "없음"


def load_json(path: Path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_gzip_json(path: Path):
    with gzip.open(path, "rt", encoding="utf-8") as f:
        return json.load(f)


def write_json(path: Path, payload) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write("\n")


def write_gzip_json(path: Path, payload) -> None:
    with gzip.open(path, "wt", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)


def is_subject_none(category: dict) -> bool:
    return category.get("type") == SITUATION_TYPE and category.get("value") == NONE_VALUE


def strip_subject_none(categories: list[dict] | None) -> list[dict]:
    return [copy.deepcopy(item) for item in (categories or []) if not is_subject_none(item)]


def classify_none_policy(base_payload: dict):
    duplicate_ids: set[str] = set()
    none_only_ids: set[str] = set()
    samples = {"duplicates": [], "none_only": []}

    for wrapper in base_payload.get("entries") or []:
        entry = wrapper.get("entry") or {}
        entry_id = str(entry.get("id"))
        categories = entry.get("categories") or []
        has_subject_none = any(is_subject_none(category) for category in categories)
        if not has_subject_none:
            continue
        has_meaning = any(category.get("type") == MEANING_TYPE for category in categories)
        if has_meaning:
            duplicate_ids.add(entry_id)
            if len(samples["duplicates"]) < 20:
                samples["duplicates"].append({"id": entry_id, "word": entry.get("word")})
        else:
            none_only_ids.add(entry_id)
            if len(samples["none_only"]) < 20:
                samples["none_only"].append({"id": entry_id, "word": entry.get("word")})

    return duplicate_ids, none_only_ids, samples


def build_topik_stats_map() -> dict[str, dict]:
    payload = load_gzip_json(TOPIK_LINKAGE_GZ)
    stats_map = {}
    for item in payload.get("matches") or []:
        stats_map[str(item.get("entry_id"))] = item.get("stats") or {}
    return stats_map


def build_original_language_type_map() -> dict[str, str]:
    payload = load_json(LIVE_SITUATION_TREE)
    language_map = {}
    for item in payload:
        entry_id = str(item.get("id"))
        language_type = item.get("original_language_type") or "안 밝힘"
        language_map[entry_id] = language_type
    return language_map


def patch_base_payload(base_payload: dict, none_only_ids: set[str]) -> dict:
    patched = copy.deepcopy(base_payload)
    next_entries = []
    for wrapper in patched.get("entries") or []:
        entry = wrapper.get("entry") or {}
        entry_id = str(entry.get("id"))
        entry["categories"] = strip_subject_none(entry.get("categories"))
        if entry_id in none_only_ids:
            continue
        next_entries.append(wrapper)
    patched["entries"] = next_entries
    patched["entry_count"] = len(next_entries)
    return patched


def patch_thin_index(thin_payload: dict, none_only_ids: set[str]) -> dict:
    patched = copy.deepcopy(thin_payload)
    next_entries = []
    for item in patched.get("entries") or []:
        entry = item.get("entry") or {}
        entry_id = str(entry.get("id"))
        entry["categories"] = strip_subject_none(entry.get("categories"))
        if entry_id in none_only_ids:
            continue
        next_entries.append(item)
    patched["entries"] = next_entries
    patched["entry_count"] = len(next_entries)
    return patched


def patch_detail_map(detail_payload: dict, none_only_ids: set[str]) -> dict:
    patched = copy.deepcopy(detail_payload)
    next_entries = {}
    for entry_id, entry in (patched.get("entries") or {}).items():
        if entry_id in none_only_ids:
            continue
        copied = copy.deepcopy(entry)
        copied["categories"] = strip_subject_none(copied.get("categories"))
        next_entries[entry_id] = copied
    patched["entries"] = next_entries
    patched["entry_count"] = len(next_entries)
    return patched


def build_search_hierarchy(categories: list[dict]) -> dict:
    first_situation = next(
        (item for item in categories if item.get("type") == SITUATION_TYPE and item.get("value")),
        None,
    )
    if first_situation:
        return {
            "system": "MM3",
            "root": SITUATION_TYPE,
            "category": first_situation["value"],
            "path_ko": f"{SITUATION_TYPE} > {first_situation['value']}",
            "scene": SITUATION_TYPE,
        }

    first_meaning = next(
        (item for item in categories if item.get("type") == MEANING_TYPE and item.get("value")),
        None,
    )
    if first_meaning:
        return {
            "system": "MM3",
            "root": MEANING_TYPE,
            "category": first_meaning["value"],
            "path_ko": f"{MEANING_TYPE} > {first_meaning['value']}",
            "scene": MEANING_TYPE,
        }

    return {
        "system": "MM3",
        "root": "미분류",
        "category": "미분류",
        "path_ko": "미분류 > 미분류",
        "scene": "미분류",
    }


def patch_search_index(search_payload, none_only_ids: set[str]):
    records = search_payload["records"] if isinstance(search_payload, dict) and "records" in search_payload else search_payload
    next_records = []
    for item in records:
        entry_id = str(item.get("id"))
        if entry_id in none_only_ids:
            continue
        copied = copy.deepcopy(item)
        copied["categories"] = strip_subject_none(copied.get("categories"))
        copied["hierarchy"] = build_search_hierarchy(copied.get("categories") or [])
        next_records.append(copied)
    if isinstance(search_payload, dict) and "records" in search_payload:
        patched = copy.deepcopy(search_payload)
        patched["records"] = next_records
        return patched
    return next_records


def patch_tree_payload(tree_payload: list[dict], drop_ids: set[str], none_only_ids: set[str]) -> list[dict]:
    next_items = []
    for item in tree_payload:
        entry_id = str(item.get("id"))
        if entry_id in drop_ids or entry_id in none_only_ids:
            continue
        copied = copy.deepcopy(item)
        copied["categories"] = strip_subject_none(copied.get("categories"))
        next_items.append(copied)
    return next_items


def decrement_option(options: list[dict], value: str, amount: int = 1) -> None:
    for option in options:
        if option.get("value") == value:
            option["count"] = max(0, int(option.get("count") or 0) - amount)
            return


def patch_facet_payload(facet_payload: dict, none_only_ids: set[str], base_payload: dict, stats_map: dict[str, dict], language_map: dict[str, str]) -> dict:
    patched = copy.deepcopy(facet_payload)
    patched["entry_count"] = max(0, int(patched.get("entry_count") or 0) - len(none_only_ids))
    base_map = {str(wrapper["entry"]["id"]): wrapper["entry"] for wrapper in base_payload.get("entries") or []}

    for entry_id in none_only_ids:
        entry = base_map.get(entry_id)
        if not entry:
            continue

        grade = entry.get("word_grade") or NONE_VALUE
        decrement_option(patched["facets"]["학습난이도"]["options"], grade)

        pos_list = entry.get("pos") or []
        pos_label = "품사 없음"
        if isinstance(pos_list, list) and pos_list:
            pos_label = " / ".join(pos_list)
        decrement_option(patched["facets"]["품사"]["options"], pos_label)

        language_type = language_map.get(entry_id) or (entry.get("original_language") or {}).get("type") or "안 밝힘"
        decrement_option(patched["facets"]["외국어 종류"]["options"], language_type)

        stats = stats_map.get(entry_id)
        if stats:
            patched["facets"]["TOPIK"]["match_count"] = max(0, int(patched["facets"]["TOPIK"]["match_count"] or 0) - 1)
            level_value = stats.get("level") or "Unrated"
            decrement_option(patched["facets"]["TOPIK"]["options"]["level"], level_value)
            band_value = str(stats.get("band")) if stats.get("band") is not None else "미기재"
            decrement_option(patched["facets"]["TOPIK"]["options"]["band"], band_value)

    return patched


def main() -> None:
    base_payload = load_json(SOURCE_BASE_JSON)
    thin_payload = load_gzip_json(THIN_INDEX_GZ)
    facet_payload = load_gzip_json(FACET_PAYLOAD_GZ)
    detail_payload = load_json(LIVE_DETAIL_MAP)
    search_payload = load_json(LIVE_SEARCH_INDEX)
    meaning_tree = load_json(LIVE_MEANING_TREE)
    situation_tree = load_json(LIVE_SITUATION_TREE)
    unclassified_tree = load_json(LIVE_UNCLASSIFIED_TREE)

    duplicate_ids, none_only_ids, samples = classify_none_policy(base_payload)
    stats_map = build_topik_stats_map()
    language_map = build_original_language_type_map()

    patched_base = patch_base_payload(base_payload, none_only_ids)
    patched_thin = patch_thin_index(thin_payload, none_only_ids)
    patched_detail = patch_detail_map(detail_payload, none_only_ids)
    patched_search = patch_search_index(search_payload, none_only_ids)
    patched_meaning = patch_tree_payload(meaning_tree, set(), none_only_ids)
    patched_situation = patch_tree_payload(situation_tree, duplicate_ids, none_only_ids)
    patched_unclassified = patch_tree_payload(unclassified_tree, set(), none_only_ids)
    patched_facet = patch_facet_payload(facet_payload, none_only_ids, base_payload, stats_map, language_map)

    write_json(SOURCE_BASE_JSON, patched_base)
    write_gzip_json(SOURCE_BASE_GZ, patched_base)
    write_gzip_json(THIN_INDEX_GZ, patched_thin)
    write_gzip_json(FACET_PAYLOAD_GZ, patched_facet)
    write_json(LIVE_DETAIL_MAP, patched_detail)
    write_json(LIVE_SEARCH_INDEX, patched_search)
    write_json(LIVE_MEANING_TREE, patched_meaning)
    write_json(LIVE_SITUATION_TREE, patched_situation)
    write_json(LIVE_UNCLASSIFIED_TREE, patched_unclassified)
    write_json(LIVE_FACETS, patched_facet)

    write_json(
        REPORT_PATH,
        {
            "duplicate_count": len(duplicate_ids),
            "none_only_count": len(none_only_ids),
            "duplicate_samples": samples["duplicates"],
            "none_only_samples": samples["none_only"],
            "patched_base_entry_count": patched_base["entry_count"],
            "patched_thin_entry_count": patched_thin["entry_count"],
            "patched_search_count": len(patched_search["records"] if isinstance(patched_search, dict) and "records" in patched_search else patched_search),
            "patched_situation_tree_count": len(patched_situation),
        },
    )

    print(
        json.dumps(
            {
                "status": "ok",
                "duplicate_count": len(duplicate_ids),
                "none_only_count": len(none_only_ids),
                "patched_base_entry_count": patched_base["entry_count"],
                "patched_thin_entry_count": patched_thin["entry_count"],
                "patched_situation_tree_count": len(patched_situation),
                "report_path": str(REPORT_PATH),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
