#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
from collections import Counter
from pathlib import Path


ROOT = Path("/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3")
SOURCE_BASE_PATH = ROOT / "vocab_dictionary" / "output" / "unified_live" / "kcenter_base.json"
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


def main() -> None:
    source_payload = load_json(SOURCE_BASE_PATH)

    source_entries = build_source_entry_map(source_payload)

    counts = Counter()
    samples = []

    for entry_id, source_entry in source_entries.items():
        after_example_count = count_example_texts(source_entry)
        after_relation_count = count_relation_rows(source_entry)
        counts["source_entries"] += 1
        if len(samples) < 100:
            samples.append(
                {
                    "entry_id": entry_id,
                    "word": source_entry.get("word"),
                    "example_text_count_source": after_example_count,
                    "relation_count_source": after_relation_count,
                }
            )
    write_json(
        REPORT_PATH,
        {
            "source_entries": counts["source_entries"],
            "detail_map_write_removed": True,
            "samples": samples,
        },
    )

    print(
        json.dumps(
            {
                "status": "ok",
                "source_entries": counts["source_entries"],
                "detail_map_write_removed": True,
                "report_path": str(REPORT_PATH),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
