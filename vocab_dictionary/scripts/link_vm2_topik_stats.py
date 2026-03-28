#!/usr/bin/env python3
from __future__ import annotations

import argparse
import gzip
import json
import math
import re
import unicodedata
from collections import defaultdict
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any


DEFAULT_VM2_SEARCH_INDEX = Path(
    "/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap2/09_app/public/data/live/APP_READY_SEARCH_INDEX.json"
)
BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_KCENTER_BASE = BASE_DIR / "output" / "unified_live" / "kcenter_base.json.gz"
DEFAULT_OUTPUT_DIR = BASE_DIR / "output" / "topik_stats_linkage"


POS_MAP = {
    "일반명사": "명사",
    "고유명사": "명사",
    "대명사": "대명사",
    "수사": "수사",
    "동사": "동사",
    "형용사": "형용사",
    "부사": "부사",
    "일반부사": "부사",
    "관형사": "관형사",
    "감탄사": "감탄사",
    "조사": "조사",
    "보조사": "조사",
    "접속조사": "조사",
    "의존명사": "명사",
}


def normalize_ws(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def normalize_loose(value: str | None) -> str:
    text = unicodedata.normalize("NFKC", normalize_ws(value))
    text = re.sub(r"[\"'“”‘’`·….,!?;:()\[\]{}<>]", "", text)
    text = re.sub(r"\s+", "", text)
    return text


def normalize_pos(value: str | None) -> str:
    text = normalize_ws(value)
    return POS_MAP.get(text, text)


def similarity(a: str | None, b: str | None) -> float:
    na = normalize_loose(a)
    nb = normalize_loose(b)
    if not na or not nb:
        return 0.0
    return SequenceMatcher(None, na, nb).ratio()


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def read_json_gz(path: Path) -> Any:
    with gzip.open(path, "rt", encoding="utf-8") as f:
        return json.load(f)


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def write_json_gz(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(path, "wt", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


@dataclass
class Vm2Item:
    term_id: str
    word: str
    pos: str
    definition: str
    stats: dict[str, Any]


def build_vm2_items(search_index: list[dict[str, Any]]) -> list[Vm2Item]:
    items: list[Vm2Item] = []
    for row in search_index:
        items.append(
            Vm2Item(
                term_id=row["id"],
                word=normalize_ws(row.get("word")),
                pos=normalize_pos(row.get("pos")),
                definition=normalize_ws(row.get("def_ko")),
                stats=row.get("stats") or {},
            )
        )
    return items


def collect_entry_definitions(entry_record: dict[str, Any]) -> list[str]:
    entry = entry_record.get("entry", {})
    definitions = [normalize_ws(sense.get("definition")) for sense in entry.get("senses", []) if normalize_ws(sense.get("definition"))]
    if definitions:
        return definitions
    for subword in entry.get("subwords", []):
        for sense in subword.get("senses", []):
            definition = normalize_ws(sense.get("definition"))
            if definition:
                definitions.append(definition)
    return definitions


def pick_match(entry_record: dict[str, Any], candidates: list[Vm2Item]) -> tuple[Vm2Item | None, str, float]:
    entry = entry_record["entry"]
    definitions = collect_entry_definitions(entry_record)
    if not candidates:
        return None, "no_candidate", 0.0

    if len(candidates) == 1:
        candidate = candidates[0]
        best = max((similarity(defn, candidate.definition) for defn in definitions), default=0.0)
        method = "single_pos" if best < 0.999 else "exact_definition"
        return candidate, method, best

    exact_definition_hits: list[Vm2Item] = []
    definition_set = {normalize_loose(defn) for defn in definitions if normalize_loose(defn)}
    for candidate in candidates:
        if normalize_loose(candidate.definition) in definition_set:
            exact_definition_hits.append(candidate)
    if len(exact_definition_hits) == 1:
        return exact_definition_hits[0], "exact_definition", 1.0

    scored: list[tuple[float, Vm2Item]] = []
    for candidate in candidates:
        score = max((similarity(defn, candidate.definition) for defn in definitions), default=0.0)
        scored.append((score, candidate))
    scored.sort(key=lambda item: item[0], reverse=True)
    top_score, top_candidate = scored[0]
    second_score = scored[1][0] if len(scored) > 1 else 0.0
    if top_score >= 0.93 and (top_score - second_score) >= 0.03:
        return top_candidate, "fuzzy_definition", top_score
    return None, "ambiguous", top_score


def build_linkage(vm2_items: list[Vm2Item], entry_records: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    by_word: dict[str, list[Vm2Item]] = defaultdict(list)
    for item in vm2_items:
        by_word[normalize_loose(item.word)].append(item)

    matches: list[dict[str, Any]] = []
    summary = {
        "total_entries": len(entry_records),
        "matched": 0,
        "unmatched": 0,
        "method_counts": defaultdict(int),
        "confidence_counts": defaultdict(int),
        "samples": {
            "matched": [],
            "unmatched": [],
        },
    }

    for record in entry_records:
        entry = record["entry"]
        word = normalize_ws(entry.get("word"))
        pos_list = [normalize_pos(pos) for pos in entry.get("pos", []) if normalize_pos(pos)]
        candidates = by_word.get(normalize_loose(word), [])
        if pos_list:
            pos_filtered = [item for item in candidates if item.pos in pos_list]
            if pos_filtered:
                candidates = pos_filtered

        match, method, score = pick_match(record, candidates)
        if match is not None:
            if method == "exact_definition":
                confidence = "high"
            elif method == "fuzzy_definition":
                confidence = "medium" if score < 0.97 else "high"
            elif method == "single_pos":
                confidence = "medium" if score >= 0.45 else "low"
            else:
                confidence = "low"
            summary["matched"] += 1
            summary["method_counts"][method] += 1
            summary["confidence_counts"][confidence] += 1
            result = {
                "entry_id": entry["id"],
                "word": entry.get("word"),
                "pos": entry.get("pos", []),
                "matched_term_id": match.term_id,
                "match_method": method,
                "confidence": confidence,
                "definition_similarity": round(score, 4),
                "stats": match.stats,
            }
            matches.append(result)
            if len(summary["samples"]["matched"]) < 20:
                summary["samples"]["matched"].append(result)
            continue

        summary["unmatched"] += 1
        summary["method_counts"][method] += 1
        if len(summary["samples"]["unmatched"]) < 20:
            summary["samples"]["unmatched"].append(
                {
                    "entry_id": entry["id"],
                    "word": entry.get("word"),
                    "pos": entry.get("pos", []),
                    "candidate_count": len(candidates),
                    "top_similarity": round(score, 4),
                }
            )

    summary["match_rate"] = round(summary["matched"] / summary["total_entries"], 6) if summary["total_entries"] else 0.0
    summary["method_counts"] = dict(sorted(summary["method_counts"].items()))
    summary["confidence_counts"] = dict(sorted(summary["confidence_counts"].items()))
    return matches, summary


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Link vocabulary_mindmap2 TOPIK stats onto mindmap3 dictionary entries.")
    parser.add_argument("--vm2-search-index", type=Path, default=DEFAULT_VM2_SEARCH_INDEX)
    parser.add_argument("--kcenter-base", type=Path, default=DEFAULT_KCENTER_BASE)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    vm2_search_index = read_json(args.vm2_search_index)
    vm2_items = build_vm2_items(vm2_search_index)

    kcenter_base = read_json_gz(args.kcenter_base)
    entry_records = kcenter_base["entries"]

    matches, summary = build_linkage(vm2_items, entry_records)

    payload = {
        "generated_at": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "source": {
            "vm2_search_index": str(args.vm2_search_index),
            "kcenter_base": str(args.kcenter_base),
        },
        "match_count": len(matches),
        "matches": matches,
    }

    write_json_gz(args.output_dir / "entry_topik_stats.json.gz", payload)
    write_json(args.output_dir / "summary.json", summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
