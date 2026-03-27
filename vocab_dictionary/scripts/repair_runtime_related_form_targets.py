#!/usr/bin/env python3
from __future__ import annotations

import gzip
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path("/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3")
SOURCE_DIR = ROOT / "vocab_dictionary" / "output" / "unified_live"
LIVE_DIR = ROOT / "09_app" / "public" / "data" / "live"
TMP_REPORTS = ROOT / "tmp_reports"

SOURCE_BASE_GZ = SOURCE_DIR / "kcenter_base.json.gz"
SOURCE_BASE_JSON = SOURCE_DIR / "kcenter_base.json"
LINK_INTEGRITY_PATH = SOURCE_DIR / "kcenter_link_integrity.json"
REPORT_PATH = TMP_REPORTS / "related_form_target_repair_report.json"


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


def normalize_word(value):
    if value is None:
        return ""
    return str(value).strip()


def build_explicit_target_index_from_source(records):
    index = defaultdict(set)
    for record in records:
        entry = record.get("entry", {})
        entry_id = str(entry.get("id"))
        for form in entry.get("related_forms", []) or []:
            target_code = normalize_word(form.get("target_code"))
            if not target_code or target_code == "0":
                continue
            if form.get("link_status") != "resolved_internal":
                continue
            index[entry_id].add(target_code)
    return index


def choose_targets(source_entry_id, matches, explicit_target_index):
    direct = [candidate_id for candidate_id in matches if source_entry_id in explicit_target_index.get(candidate_id, set())]
    if direct:
        return direct, "reverse_explicit"
    unclaimed = [candidate_id for candidate_id in matches if not explicit_target_index.get(candidate_id)]
    if len(unclaimed) == 1:
        return unclaimed, "reverse_unclaimed_single"
    if len(unclaimed) > 1:
        return unclaimed, "reverse_unclaimed_multi"
    return [], None


def related_form_group_key(form):
    return (
        form.get("type"),
        normalize_word(form.get("word") or form.get("form") or form.get("label")),
        form.get("link_type"),
    )


def make_unresolved_placeholder(form):
    placeholder = dict(form)
    if normalize_word(placeholder.get("link_type")):
        placeholder["target_code"] = None
        placeholder["link_status"] = "unresolved_no_target_code"
        placeholder["is_dangling"] = False
    else:
        placeholder["target_code"] = "0"
        placeholder["link_status"] = "unresolved_zero_code"
        placeholder["is_dangling"] = True
    return placeholder


def patch_source_base(payload):
    records = payload.get("entries", [])
    word_to_ids = defaultdict(list)
    for record in records:
        entry = record.get("entry", {})
        word = normalize_word(entry.get("word"))
        if word:
            word_to_ids[word].append(str(entry.get("id")))
    explicit_target_index = build_explicit_target_index_from_source(records)

    counts = Counter()
    samples = []
    for record in records:
        entry = record.get("entry", {})
        entry_id = str(entry.get("id"))
        expanded = []
        seen = set()
        grouped = {}
        for form in entry.get("related_forms", []) or []:
            status = form.get("link_status")
            target_code = normalize_word(form.get("target_code"))
            word = normalize_word(form.get("word") or form.get("form") or form.get("label"))
            if status == "resolved_internal" and target_code and target_code != "0":
                key = (form.get("type"), word, target_code or None)
                if key not in seen:
                    expanded.append(form)
                    seen.add(key)
                continue
            if not word:
                key = (form.get("type"), word, target_code or None)
                if key not in seen:
                    expanded.append(form)
                    seen.add(key)
                continue
            group_key = related_form_group_key(form)
            if group_key not in grouped:
                grouped[group_key] = dict(form)

        for form in grouped.values():
            word = normalize_word(form.get("word") or form.get("form") or form.get("label"))
            target_code = normalize_word(form.get("target_code"))
            matches = [candidate_id for candidate_id in word_to_ids.get(word, []) if candidate_id != entry_id]
            if not matches:
                key = (form.get("type"), word, target_code or None)
                if key not in seen:
                    expanded.append(form)
                    seen.add(key)
                continue
            if len(matches) == 1:
                new_form = dict(form)
                new_form["target_code"] = matches[0]
                new_form["link_status"] = "resolved_exact_word_backfill"
                new_form["is_dangling"] = False
                key = (new_form.get("type"), word, new_form["target_code"])
                if key not in seen:
                    expanded.append(new_form)
                    seen.add(key)
                    counts["source_base_exact_resolved"] += 1
                    if len(samples) < 200:
                        samples.append(
                            {
                                "entry_id": entry_id,
                                "entry_word": entry.get("word"),
                                "related_form": word,
                                "resolved_target_code": matches[0],
                                "mode": "exact_single",
                            }
                        )
                continue
            chosen_targets, chosen_mode = choose_targets(entry_id, matches, explicit_target_index)
            if not chosen_targets:
                unresolved_form = make_unresolved_placeholder(form)
                unresolved_target = normalize_word(unresolved_form.get("target_code"))
                key = (unresolved_form.get("type"), word, unresolved_target or None)
                if key not in seen:
                    expanded.append(unresolved_form)
                    seen.add(key)
                continue
            for candidate_id in chosen_targets:
                new_form = dict(form)
                new_form["target_code"] = candidate_id
                new_form["link_status"] = "resolved_multi_exact_word_backfill"
                new_form["is_dangling"] = False
                key = (new_form.get("type"), word, new_form["target_code"])
                if key in seen:
                    continue
                expanded.append(new_form)
                seen.add(key)
                counts["source_base_multi_resolved"] += 1
                if len(samples) < 200:
                    samples.append(
                            {
                                "entry_id": entry_id,
                                "entry_word": entry.get("word"),
                                "related_form": word,
                                "resolved_target_code": candidate_id,
                                "mode": chosen_mode,
                            }
                        )
        entry["related_forms"] = expanded
    return counts, samples


def count_statuses_source(payload):
    counts = Counter()
    for record in payload.get("entries", []):
        for form in record.get("entry", {}).get("related_forms", []) or []:
            counts[form.get("link_status")] += 1
    return counts


def build_source_dangling_sample(payload, limit=500):
    samples = []
    count = 0
    for record in payload.get("entries", []):
        entry = record.get("entry", {})
        for form in entry.get("related_forms", []) or []:
            if not form.get("is_dangling"):
                continue
            count += 1
            if len(samples) < limit:
                samples.append(
                    {
                        "entry_id": str(entry.get("id")),
                        "entry_word": entry.get("word"),
                        "type": form.get("type"),
                        "word": form.get("word"),
                        "target_code": form.get("target_code"),
                        "link_type": form.get("link_type"),
                    }
                )
    return count, samples


def update_link_integrity(payload, link_integrity_payload):
    status_counts = count_statuses_source(payload)
    dangling_form_count, dangling_forms = build_source_dangling_sample(payload)
    link_integrity_payload["summary"]["dangling_related_forms"] = dangling_form_count
    link_integrity_payload.setdefault("link_status_counts", {})["related_forms"] = dict(status_counts)
    link_integrity_payload["dangling_related_forms_sample"] = dangling_forms
    link_integrity_payload.setdefault("policy", {})[
        "resolved_exact_word_backfill"
    ] = "If a related form word maps to exactly one different internal entry, backfill the target_code conservatively."
    link_integrity_payload.setdefault("policy", {})[
        "resolved_multi_exact_word_backfill"
    ] = "If a related form word maps to multiple internal entries with the same surface, keep all internal targets so the UI can disambiguate by POS and definition."
    return link_integrity_payload


def main() -> None:
    source_payload = load_gzip_json(SOURCE_BASE_GZ)
    link_integrity_payload = load_json(LINK_INTEGRITY_PATH)

    before_source = count_statuses_source(source_payload)

    source_counts, source_samples = patch_source_base(source_payload)

    after_source = count_statuses_source(source_payload)

    if SOURCE_BASE_JSON.exists():
        write_json(SOURCE_BASE_JSON, source_payload)
    write_gzip_json(SOURCE_BASE_GZ, source_payload)
    write_json(LINK_INTEGRITY_PATH, update_link_integrity(source_payload, link_integrity_payload))

    report = {
        "source_before": dict(before_source),
        "source_after": dict(after_source),
        "resolved_counts": dict(source_counts),
        "source_samples": source_samples[:50],
    }
    write_json(REPORT_PATH, report)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
