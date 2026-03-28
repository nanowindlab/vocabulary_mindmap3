#!/usr/bin/env python3
from __future__ import annotations

import gzip
import json
from collections import Counter, defaultdict
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path("/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3")
BASE_PATH = ROOT / "vocab_dictionary" / "output" / "unified_live" / "kcenter_base.json.gz"
XML_DIR = ROOT / "vocab_dictionary" / "output" / "api_xml_live"
REPORT_PATH = ROOT / "tmp_reports" / "related_form_target_audit.json"


def load_base():
    with gzip.open(BASE_PATH, "rt", encoding="utf-8") as f:
        return json.load(f)


def normalize(value):
    if value is None:
        return ""
    return str(value).strip()


def build_reverse_hint_map(entries):
    reverse_hints = {}
    for rec in entries:
        entry = rec["entry"]
        entry_id = str(entry["id"])
        hint_map = defaultdict(set)
        xml_path = XML_DIR / f"view_{entry_id}.xml"
        if xml_path.exists():
            root = ET.parse(xml_path).getroot()
            for node in root.findall(".//der_info") + root.findall(".//ref_info"):
                word = normalize(node.findtext("word"))
                target = normalize(node.findtext("link_target_code")) or None
                if word:
                    hint_map[word].add(target)
        reverse_hints[entry_id] = hint_map
    return reverse_hints


def main():
    payload = load_base()
    entries = payload["entries"]
    reverse_hints = build_reverse_hint_map(entries)
    status_counts = Counter()
    unresolved_buckets = Counter()
    samples = {
        "source_explicit_single": [],
        "source_explicit_multi": [],
        "source_ambiguous": [],
        "no_xml_hint": [],
    }

    for rec in entries:
        entry = rec["entry"]
        entry_id = str(entry["id"])
        for form in entry.get("related_forms", []) or []:
            status = normalize(form.get("link_status"))
            status_counts[status] += 1
            if not status.startswith("unresolved"):
                continue
            word = normalize(form.get("word"))
            hint_set = reverse_hints.get(entry_id, {}).get(word, set())
            explicit_targets = sorted([target for target in hint_set if target])
            if len(explicit_targets) == 1:
                unresolved_buckets["source_explicit_single"] += 1
                if len(samples["source_explicit_single"]) < 20:
                    samples["source_explicit_single"].append({
                        "entry_id": entry_id,
                        "entry_word": entry.get("word"),
                        "related_form": word,
                        "target": explicit_targets[0],
                    })
            elif len(explicit_targets) > 1:
                unresolved_buckets["source_explicit_multi"] += 1
                if len(samples["source_explicit_multi"]) < 20:
                    samples["source_explicit_multi"].append({
                        "entry_id": entry_id,
                        "entry_word": entry.get("word"),
                        "related_form": word,
                        "targets": explicit_targets,
                    })
            elif hint_set == {None}:
                unresolved_buckets["source_ambiguous"] += 1
                if len(samples["source_ambiguous"]) < 20:
                    samples["source_ambiguous"].append({
                        "entry_id": entry_id,
                        "entry_word": entry.get("word"),
                        "related_form": word,
                    })
            else:
                unresolved_buckets["no_xml_hint"] += 1
                if len(samples["no_xml_hint"]) < 20:
                    samples["no_xml_hint"].append({
                        "entry_id": entry_id,
                        "entry_word": entry.get("word"),
                        "related_form": word,
                    })

    report = {
        "status_counts": dict(status_counts),
        "unresolved_total": sum(count for key, count in status_counts.items() if key.startswith("unresolved")),
        "unresolved_buckets": dict(unresolved_buckets),
        "samples": samples,
    }
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(f"{json.dumps(report, ensure_ascii=False, indent=2)}\n", encoding="utf-8")
    print(json.dumps({"report_path": str(REPORT_PATH), **report}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
