#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
from collections import Counter
from pathlib import Path


ROOT = Path("/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3")
SOURCE_BASE_PATH = ROOT / "vocab_dictionary" / "output" / "unified_live" / "kcenter_base.json"
DETAIL_MAP_PATH = ROOT / "09_app" / "public" / "data" / "live" / "APP_READY_DETAIL_MAP.json"
REPORT_PATH = ROOT / "tmp_reports" / "runtime_detail_fidelity_repair_report.json"


def load_json(path: Path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write_json(path: Path, payload) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write("\n")


def count_example_texts(entry: dict) -> int:
    total = 0
    for sense in entry.get("senses") or []:
        for example in sense.get("examples") or []:
            total += len(example.get("texts") or [])
    return total


def count_relation_rows(entry: dict) -> int:
    total = 0
    for sense in entry.get("senses") or []:
        total += len(sense.get("related_terms") or [])
    return total


def build_source_entry_map(payload: dict) -> dict[str, dict]:
    source_map: dict[str, dict] = {}
    for wrapper in payload.get("entries") or []:
        entry = wrapper.get("entry") or {}
        entry_id = entry.get("id")
        if entry_id is None:
            continue
        source_map[str(entry_id)] = entry
    return source_map


def merge_entry(source_entry: dict, runtime_entry: dict | None) -> dict:
    repaired = copy.deepcopy(source_entry)
    if not runtime_entry:
        return repaired

    for key, value in runtime_entry.items():
        if key not in repaired:
            repaired[key] = copy.deepcopy(value)
    return repaired


def main() -> None:
    source_payload = load_json(SOURCE_BASE_PATH)
    detail_payload = load_json(DETAIL_MAP_PATH)

    source_entries = build_source_entry_map(source_payload)
    runtime_entries = detail_payload.get("entries") or {}

    counts = Counter()
    samples = []

    repaired_entries = {}
    for entry_id, source_entry in source_entries.items():
        runtime_entry = runtime_entries.get(entry_id)
        before_example_count = count_example_texts(runtime_entry or {})
        before_relation_count = count_relation_rows(runtime_entry or {})
        after_example_count = count_example_texts(source_entry)
        after_relation_count = count_relation_rows(source_entry)

        repaired_entries[entry_id] = merge_entry(source_entry, runtime_entry)
        counts["source_entries"] += 1

        if runtime_entry is None:
            counts["inserted_entries"] += 1
            if len(samples) < 100:
                samples.append(
                    {
                        "entry_id": entry_id,
                        "word": source_entry.get("word"),
                        "mode": "inserted",
                        "example_text_count_after": after_example_count,
                        "relation_count_after": after_relation_count,
                    }
                )
            continue

        if before_example_count != after_example_count:
            counts["entries_with_example_count_change"] += 1
        if before_relation_count != after_relation_count:
            counts["entries_with_relation_count_change"] += 1
        if runtime_entry != repaired_entries[entry_id]:
            counts["updated_entries"] += 1
            if len(samples) < 100:
                samples.append(
                    {
                        "entry_id": entry_id,
                        "word": source_entry.get("word"),
                        "mode": "updated",
                        "example_text_count_before": before_example_count,
                        "example_text_count_after": after_example_count,
                        "relation_count_before": before_relation_count,
                        "relation_count_after": after_relation_count,
                    }
                )

    detail_payload["entries"] = repaired_entries
    write_json(DETAIL_MAP_PATH, detail_payload)
    write_json(
        REPORT_PATH,
        {
            "source_entries": counts["source_entries"],
            "updated_entries": counts["updated_entries"],
            "inserted_entries": counts["inserted_entries"],
            "entries_with_example_count_change": counts["entries_with_example_count_change"],
            "entries_with_relation_count_change": counts["entries_with_relation_count_change"],
            "samples": samples,
        },
    )

    print(
        json.dumps(
            {
                "status": "ok",
                "source_entries": counts["source_entries"],
                "updated_entries": counts["updated_entries"],
                "inserted_entries": counts["inserted_entries"],
                "entries_with_example_count_change": counts["entries_with_example_count_change"],
                "entries_with_relation_count_change": counts["entries_with_relation_count_change"],
                "report_path": str(REPORT_PATH),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
