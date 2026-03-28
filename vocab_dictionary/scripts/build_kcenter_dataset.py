#!/usr/bin/env python3
from __future__ import annotations

import argparse
import copy
import json
import math
import random
import re
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_JSON_DIR = BASE_DIR / "dict_download_json"
DEFAULT_API_XML_DIR = BASE_DIR / "output"
DEFAULT_OUTPUT_DIR = BASE_DIR / "output" / "unified"
API_VIEW_URL = "https://krdict.korean.go.kr/api/view"
API_KEY = "4ED835EC150A6B431DC3BBAB39C2B69D"

WORD_UNIT_REVERSE_LINKABLE = {"관용구", "속담"}
MANUAL_SUBWORD_LINK_OVERRIDES: dict[tuple[str, str, str], tuple[str, str]] = {
    ("36247", "그놈이 그놈이다", "관용구"): ("36247", "parent_entry"),
}
MANUAL_SENSE_OVERRIDES: dict[str, dict[int, dict[str, Any]]] = {
    "13959": {1: {"action": "match", "sense_order": 1}},
    "14066": {2: {"action": "match", "sense_order": 2}},
    "14325": {1: {"action": "match", "sense_order": 1}},
    "16451": {1: {"action": "match", "sense_order": 1}},
    "16738": {1: {"action": "match", "sense_order": 1}},
    "28954": {2: {"action": "append_api_sense"}},
    "49270": {1: {"action": "match", "sense_order": 1}},
    "49855": {3: {"action": "append_api_sense"}},
    "50552": {2: {"action": "match", "sense_order": 2}},
    "57258": {2: {"action": "match", "sense_order": 2}},
    "62512": {1: {"action": "match", "sense_order": 1}},
    "63652": {1: {"action": "match", "sense_order": 1}},
    "63744": {1: {"action": "match", "sense_order": 1}},
    "65121": {1: {"action": "match", "sense_order": 1}},
    "65175": {1: {"action": "match", "sense_order": 1}, 2: {"action": "match", "sense_order": 2}},
    "65312": {1: {"action": "match", "sense_order": 1}},
    "71482": {2: {"action": "match", "sense_order": 2}},
    "73269": {2: {"action": "append_api_sense"}},
    "74104": {3: {"action": "append_api_sense"}},
    "82136": {2: {"action": "match", "sense_order": 2}},
    "90815": {1: {"action": "match", "sense_order": 1}},
    "36974": {2: {"action": "append_api_sense"}},
    "63711": {2: {"action": "append_api_sense"}},
    "74949": {2: {"action": "append_api_sense"}},
    "85036": {2: {"action": "append_api_sense"}},
    "51586": {1: {"action": "match", "sense_order": 1}},
    "62540": {1: {"action": "match", "sense_order": 1}},
    "66961": {2: {"action": "match", "sense_order": 2}},
    "67195": {1: {"action": "match", "sense_order": 1}},
    "67196": {1: {"action": "match", "sense_order": 1}},
    "82837": {
        4: {"action": "match", "sense_order": 4},
        7: {"action": "match", "sense_order": 7},
    },
    "82937": {1: {"action": "match", "sense_order": 1}},
    "87792": {
        1: {"action": "match", "sense_order": 1},
        2: {"action": "match", "sense_order": 2},
        3: {"action": "append_api_sense"},
    },
    "86116": {
        1: {"action": "match", "sense_order": 1},
        2: {"action": "match", "sense_order": 2},
    },
    "90164": {
        1: {"action": "match", "sense_order": 1},
        2: {"action": "match", "sense_order": 2},
    },
}


def ensure_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def strip_text(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def classify_link_status(target_code: Any, valid_ids: set[str] | None = None) -> tuple[str, bool]:
    code = strip_text(target_code)
    if code == "0":
        return "unresolved_zero_code", True
    if not code:
        return "unresolved_no_target_code", False
    if valid_ids is None:
        return "unvalidated", False
    if code in valid_ids:
        return "resolved_internal", False
    return "unresolved_missing_entry", True


def collapse_ws(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def normalize_text(value: str | None) -> str:
    return collapse_ws(value)


def build_entry_word_index(record_by_id: dict[str, dict[str, Any]]) -> dict[str, list[str]]:
    index: dict[str, list[str]] = defaultdict(list)
    for entry_id, record in record_by_id.items():
        word = strip_text(record.get("entry", {}).get("word"))
        if not word:
            continue
        index[word].append(entry_id)
    return index


def build_explicit_related_form_target_index(record_by_id: dict[str, dict[str, Any]]) -> dict[str, set[str]]:
    index: dict[str, set[str]] = defaultdict(set)
    for entry_id, record in record_by_id.items():
        for form in record["entry"].get("related_forms", []):
            target_code = strip_text(form.get("target_code"))
            if not target_code or target_code == "0":
                continue
            if form.get("link_status") != "resolved_internal":
                continue
            index[entry_id].add(target_code)
    return index


def make_related_form_key(form: dict[str, Any]) -> tuple[str | None, str | None, str | None]:
    return (
        strip_text(form.get("type")),
        strip_text(form.get("word")),
        strip_text(form.get("target_code")),
    )


def related_form_group_key(form: dict[str, Any]) -> tuple[str | None, str | None, str | None]:
    return (
        strip_text(form.get("type")),
        strip_text(form.get("word")),
        strip_text(form.get("link_type")),
    )


def make_unresolved_related_form_placeholder(form: dict[str, Any]) -> dict[str, Any]:
    placeholder = copy.deepcopy(form)
    if strip_text(placeholder.get("link_type")):
        placeholder["target_code"] = None
        placeholder["link_status"] = "unresolved_no_target_code"
        placeholder["is_dangling"] = False
    else:
        placeholder["target_code"] = "0"
        placeholder["link_status"] = "unresolved_zero_code"
        placeholder["is_dangling"] = True
    return placeholder


def choose_related_form_backfill_targets(
    source_entry_id: str,
    candidate_ids: list[str],
    explicit_target_index: dict[str, set[str]],
) -> tuple[list[str], str | None]:
    direct = [candidate_id for candidate_id in candidate_ids if source_entry_id in explicit_target_index.get(candidate_id, set())]
    if direct:
        return direct, "reverse_explicit"

    unclaimed = [candidate_id for candidate_id in candidate_ids if not explicit_target_index.get(candidate_id)]
    if len(unclaimed) == 1:
        return unclaimed, "reverse_unclaimed_single"
    if len(unclaimed) > 1:
        return unclaimed, "reverse_unclaimed_multi"

    return [], None


def backfill_related_form_targets(record_by_id: dict[str, dict[str, Any]], report: dict[str, Any]) -> None:
    word_index = build_entry_word_index(record_by_id)
    explicit_target_index = build_explicit_related_form_target_index(record_by_id)
    backfill_counter: dict[str, int] = defaultdict(int)
    backfill_samples: list[dict[str, Any]] = []

    for entry_id, record in record_by_id.items():
        expanded_forms: list[dict[str, Any]] = []
        seen_keys: set[tuple[str | None, str | None, str | None]] = set()
        grouped_forms: dict[tuple[str | None, str | None, str | None], dict[str, Any]] = {}
        for form in record["entry"].get("related_forms", []):
            target_code = strip_text(form.get("target_code"))
            form_word = strip_text(form.get("word"))
            if form.get("link_status") == "resolved_internal" and target_code and target_code != "0":
                key = make_related_form_key(form)
                if key not in seen_keys:
                    expanded_forms.append(form)
                    seen_keys.add(key)
                continue
            if not form_word:
                key = make_related_form_key(form)
                if key not in seen_keys:
                    expanded_forms.append(form)
                    seen_keys.add(key)
                continue
            group_key = related_form_group_key(form)
            if group_key not in grouped_forms:
                grouped_forms[group_key] = copy.deepcopy(form)

        for form in grouped_forms.values():
            form_word = strip_text(form.get("word"))
            matches = [candidate_id for candidate_id in word_index.get(form_word, []) if candidate_id != entry_id]
            if not matches:
                key = make_related_form_key(form)
                if key not in seen_keys:
                    expanded_forms.append(form)
                    seen_keys.add(key)
                continue
            if len(matches) == 1:
                new_form = copy.deepcopy(form)
                new_form["target_code"] = matches[0]
                new_form["link_status"] = "resolved_exact_word_backfill"
                new_form["is_dangling"] = False
                key = make_related_form_key(new_form)
                if key not in seen_keys:
                    expanded_forms.append(new_form)
                    seen_keys.add(key)
                    backfill_counter["exact_related_forms"] += 1
                    if len(backfill_samples) < 200:
                        backfill_samples.append(
                        {
                            "entry_id": entry_id,
                            "entry_word": record["entry"].get("word"),
                            "related_form": form_word,
                            "resolved_target_code": matches[0],
                            "mode": "exact_single",
                            }
                        )
                continue
            chosen_targets, chosen_mode = choose_related_form_backfill_targets(entry_id, matches, explicit_target_index)
            if not chosen_targets:
                unresolved_form = make_unresolved_related_form_placeholder(form)
                key = make_related_form_key(unresolved_form)
                if key not in seen_keys:
                    expanded_forms.append(unresolved_form)
                    seen_keys.add(key)
                continue
            for candidate_id in chosen_targets:
                new_form = copy.deepcopy(form)
                new_form["target_code"] = candidate_id
                new_form["link_status"] = "resolved_multi_exact_word_backfill"
                new_form["is_dangling"] = False
                key = make_related_form_key(new_form)
                if key in seen_keys:
                    continue
                expanded_forms.append(new_form)
                seen_keys.add(key)
                backfill_counter["multi_related_forms"] += 1
                if len(backfill_samples) < 200:
                    backfill_samples.append(
                        {
                            "entry_id": entry_id,
                            "entry_word": record["entry"].get("word"),
                            "related_form": form_word,
                            "resolved_target_code": candidate_id,
                            "mode": chosen_mode,
                        }
                    )

        record["entry"]["related_forms"] = expanded_forms

    report["related_form_exact_backfill"] = {
        "exact_resolved_count": backfill_counter["exact_related_forms"],
        "multi_resolved_count": backfill_counter["multi_related_forms"],
        "samples": backfill_samples,
    }


def normalize_loose(value: str | None) -> str:
    if not value:
        return ""
    text = unicodedata.normalize("NFKC", value)
    text = collapse_ws(text)
    text = re.sub(r"[\"'“”‘’`·….,!?;:()\[\]{}<>]", "", text)
    text = re.sub(r"\s+", "", text)
    text = re.sub(r"(이다|다|것이다|이다\.|다\.)$", "", text)
    return text


def similarity(a: str | None, b: str | None) -> float:
    na = normalize_loose(a)
    nb = normalize_loose(b)
    if not na or not nb:
        return 0.0
    return SequenceMatcher(None, na, nb).ratio()


def contains_hanja(text: str | None) -> bool:
    if not text:
        return False
    return any("\u4e00" <= ch <= "\u9fff" for ch in text)


def unique_preserve_order(items: list[Any], key_fn) -> list[Any]:
    seen: set[Any] = set()
    result: list[Any] = []
    for item in items:
        key = key_fn(item)
        if key in seen:
            continue
        seen.add(key)
        result.append(item)
    return result


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def feat_items(node: Any) -> list[dict[str, Any]]:
    if not isinstance(node, dict):
        return []
    feats = ensure_list(node.get("feat"))
    return [feat for feat in feats if isinstance(feat, dict)]


def feat_values(node: Any, att: str) -> list[str]:
    values: list[str] = []
    for feat in feat_items(node):
        if feat.get("att") == att:
            text = strip_text(feat.get("val"))
            if text is not None:
                values.append(text)
    return values


def first_feat_value(node: Any, att: str) -> str | None:
    values = feat_values(node, att)
    return values[0] if values else None


def lemma_written_form(entry_node: Any) -> str | None:
    lemma = entry_node.get("Lemma") if isinstance(entry_node, dict) else None
    return first_feat_value(lemma or {}, "writtenForm")


def lexical_unit(entry_node: Any) -> str | None:
    return first_feat_value(entry_node, "lexicalUnit")


def text_of(elem: ET.Element | None, tag: str) -> str | None:
    if elem is None:
        return None
    child = elem.find(tag)
    if child is None:
        return None
    return strip_text("".join(child.itertext()))


def child_texts(elem: ET.Element | None, tag: str) -> list[str]:
    if elem is None:
        return []
    texts: list[str] = []
    for child in elem.findall(tag):
        text = strip_text("".join(child.itertext()))
        if text:
            texts.append(text)
    return texts


def make_record_meta(api_view_fetched: bool = False) -> dict[str, Any]:
    return {
        "schema_version": "v2.3",
        "source_status": {
            "json_present": True,
            "api_view_fetched": api_view_fetched,
        },
    }


def make_empty_entry_record(entry_id: str) -> dict[str, Any]:
    return {
        "meta": make_record_meta(api_view_fetched=False),
        "entry": {
            "id": entry_id,
            "word": None,
            "homonym_no": 0,
            "word_unit": None,
            "word_type": None,
            "pos": [],
            "word_grade": None,
            "annotation": None,
            "pronunciation": [],
            "original_language": {"type": None, "form": None},
            "conjugations": [],
            "categories": [],
            "senses": [],
            "subwords": [],
            "related_forms": [],
        },
    }


def parse_json_examples(sense_node: Any) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for example_node in ensure_list(sense_node.get("SenseExample")):
        ex_type = first_feat_value(example_node, "type")
        texts = feat_values(example_node, "example")
        texts = [normalize_text(text) for text in texts if normalize_text(text)]
        if not ex_type or not texts:
            continue
        result.append({"type": ex_type, "texts": texts})
    return result


def parse_json_translations(sense_node: Any) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for eq_node in ensure_list(sense_node.get("Equivalent")):
        language = first_feat_value(eq_node, "language")
        word = first_feat_value(eq_node, "lemma")
        definition = first_feat_value(eq_node, "definition")
        if not any([language, word, definition]):
            continue
        result.append(
            {
                "language": language,
                "word": word,
                "definition": definition,
            }
        )
    return result


def parse_json_related_terms(sense_node: Any) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for rel_node in ensure_list(sense_node.get("SenseRelation")):
        rel = {
            "type": first_feat_value(rel_node, "type"),
            "word": first_feat_value(rel_node, "lemma"),
            "target_code": first_feat_value(rel_node, "id"),
            "link_type": None,
            "link_status": "unvalidated",
            "is_dangling": False,
        }
        homonym_no = first_feat_value(rel_node, "homonymNumber")
        if homonym_no is not None:
            rel["homonym_no"] = homonym_no
        if rel["type"] or rel["word"] or rel["target_code"]:
            result.append(rel)
    return result


def parse_json_multimedia(sense_node: Any) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for media_node in ensure_list(sense_node.get("Multimedia")):
        media = {
            "type": first_feat_value(media_node, "type"),
            "label": first_feat_value(media_node, "label"),
            "url": first_feat_value(media_node, "url"),
        }
        if any(media.values()):
            result.append(media)
    return result


def parse_json_related_forms(entry_node: Any) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for form_node in ensure_list(entry_node.get("RelatedForm")):
        form = {
            "type": first_feat_value(form_node, "type"),
            "word": first_feat_value(form_node, "writtenForm"),
            "target_code": first_feat_value(form_node, "id"),
            "link_type": None,
            "link_status": "unvalidated",
            "is_dangling": False,
        }
        if any(form.values()):
            result.append(form)
    return result


def parse_json_word_forms(entry_node: Any) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    pronunciations: list[dict[str, Any]] = []
    conjugations: list[dict[str, Any]] = []
    for wf_node in ensure_list(entry_node.get("WordForm")):
        wf_type = first_feat_value(wf_node, "type")
        if wf_type == "발음":
            item = {
                "text": first_feat_value(wf_node, "pronunciation"),
                "sound_url": first_feat_value(wf_node, "sound"),
            }
            if item["text"] or item["sound_url"]:
                pronunciations.append(item)
            continue
        if wf_type != "활용":
            continue
        item = {
            "form": first_feat_value(wf_node, "writtenForm"),
            "pronunciation": first_feat_value(wf_node, "pronunciation"),
            "sound_url": first_feat_value(wf_node, "sound"),
            "abbreviation": None,
            "abbreviation_pronunciation": None,
            "abbreviation_sound_url": None,
        }
        abbrev_node = wf_node.get("FormRepresentation")
        if isinstance(abbrev_node, dict) and first_feat_value(abbrev_node, "type") == "준말":
            item["abbreviation"] = first_feat_value(abbrev_node, "writtenForm")
            item["abbreviation_pronunciation"] = first_feat_value(abbrev_node, "pronunciation")
            item["abbreviation_sound_url"] = first_feat_value(abbrev_node, "sound")
        if item["form"]:
            conjugations.append(item)
    return pronunciations, conjugations


def build_json_sense(entry_id: str, sense_node: Any, index: int, match_method: str = "json_seed") -> dict[str, Any]:
    sense_feats = feat_items(sense_node)
    return {
        "id": f"{entry_id}#sense-{index:03d}",
        "sense_order": index,
        "source_ids": {
            "json": strip_text(sense_node.get("val")),
            "api": None,
        },
        "definition": first_feat_value({"feat": sense_feats}, "definition"),
        "reference": first_feat_value({"feat": sense_feats}, "reference"),
        "annotation": first_feat_value({"feat": sense_feats}, "annotation"),
        "syntactic_annotation": first_feat_value({"feat": sense_feats}, "syntacticAnnotation"),
        "syntactic_patterns": feat_values({"feat": sense_feats}, "syntacticPattern"),
        "examples": parse_json_examples(sense_node),
        "translations": parse_json_translations(sense_node),
        "related_terms": parse_json_related_terms(sense_node),
        "multimedia": parse_json_multimedia(sense_node),
        "match_method": match_method,
    }


def build_json_subword(parent_entry_id: str, subword_node: Any, subword_index: int) -> dict[str, Any]:
    senses: list[dict[str, Any]] = []
    for sense_index, sense_node in enumerate(ensure_list(subword_node.get("Sense")), start=1):
        sense_feats = feat_items(sense_node)
        senses.append(
            {
                "definition": first_feat_value({"feat": sense_feats}, "definition"),
                "reference": first_feat_value({"feat": sense_feats}, "reference"),
                "syntactic_patterns": feat_values({"feat": sense_feats}, "syntacticPattern"),
                "examples": parse_json_examples(sense_node),
                "translations": parse_json_translations(sense_node),
                "source_ids": {
                    "json_row_group": parent_entry_id,
                    "json_sense": strip_text(sense_node.get("val")),
                },
                "subsense_order": sense_index,
            }
        )
    return {
        "text": lemma_written_form(subword_node),
        "unit": lexical_unit(subword_node),
        "source_type": "json_grouped",
        "link_target_code": None,
        "link_confidence": None,
        "senses": senses,
    }


def build_seed_from_json(json_dir: Path) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    entry_records: list[dict[str, Any]] = []
    translation_records: list[dict[str, Any]] = []
    json_files = sorted(json_dir.glob("*.json"))
    grouped_rows: dict[str, list[dict[str, Any]]] = defaultdict(list)
    json_row_count = 0
    for json_file in json_files:
        data = read_json(json_file)
        lexical_entries = data["LexicalResource"]["Lexicon"]["LexicalEntry"]
        for raw_entry in lexical_entries:
            entry_id = str(raw_entry.get("val"))
            grouped_rows[entry_id].append(raw_entry)
            json_row_count += 1

    grouped_subword_rows = 0
    duplicate_group_count = 0
    for entry_id, raw_entries in sorted(grouped_rows.items(), key=lambda item: int(item[0])):
        record = make_empty_entry_record(entry_id)
        entry = record["entry"]

        if len(raw_entries) > 1:
            duplicate_group_count += 1

        base_candidates = [raw for raw in raw_entries if lexical_unit(raw) == "단어"]
        base_entry = base_candidates[0] if base_candidates else raw_entries[0]

        entry["word"] = lemma_written_form(base_entry)
        homonym_no = first_feat_value(base_entry, "homonym_number")
        entry["homonym_no"] = int(homonym_no) if homonym_no is not None else 0
        entry["word_unit"] = lexical_unit(base_entry)
        entry["pos"] = unique_preserve_order(feat_values(base_entry, "partOfSpeech"), key_fn=lambda x: x)
        entry["word_grade"] = first_feat_value(base_entry, "vocabularyLevel")
        entry["annotation"] = first_feat_value(base_entry, "annotation")

        origin = first_feat_value(base_entry, "origin")
        entry["original_language"] = {
            "type": "한자" if contains_hanja(origin) else None,
            "form": origin,
        }
        entry["word_type"] = "한자어" if contains_hanja(origin) else None

        categories: list[dict[str, Any]] = []
        for value in feat_values(base_entry, "semanticCategory"):
            categories.append({"type": "의미 범주", "value": value})
        for value in feat_values(base_entry, "subjectCategiory"):
            categories.append({"type": "주제 및 상황 범주", "value": value})
        entry["categories"] = unique_preserve_order(
            categories,
            key_fn=lambda x: (normalize_text(x["type"]), normalize_text(x["value"])),
        )

        entry["pronunciation"], entry["conjugations"] = parse_json_word_forms(base_entry)
        entry["related_forms"] = parse_json_related_forms(base_entry)

        senses: list[dict[str, Any]] = []
        for index, sense_node in enumerate(ensure_list(base_entry.get("Sense")), start=1):
            sense = build_json_sense(entry_id, sense_node, index)
            senses.append(sense)
            if sense["translations"]:
                translation_records.append(
                    {
                        "sense_id": sense["id"],
                        "entry_id": entry_id,
                        "translations": copy.deepcopy(sense["translations"]),
                    }
                )
        entry["senses"] = senses

        subwords: list[dict[str, Any]] = []
        for raw_entry in raw_entries:
            if raw_entry is base_entry:
                continue
            unit = lexical_unit(raw_entry)
            if unit in WORD_UNIT_REVERSE_LINKABLE:
                grouped_subword_rows += 1
                subwords.append(build_json_subword(entry_id, raw_entry, len(subwords) + 1))
        entry["subwords"] = subwords
        entry_records.append(record)

    translation_records.sort(key=lambda record: record["sense_id"])
    report = {
        "json_file_count": len(json_files),
        "json_row_count": json_row_count,
        "entry_count": len(entry_records),
        "unique_target_code_count": len(entry_records),
        "duplicate_group_count": duplicate_group_count,
        "grouped_subword_row_count": grouped_subword_rows,
        "translation_record_count": len(translation_records),
    }
    return entry_records, translation_records, report


def parse_api_examples(parent: ET.Element | None) -> list[dict[str, Any]]:
    if parent is None:
        return []
    results: list[dict[str, Any]] = []
    current_dialogue: list[str] = []
    for ex_info in parent.findall("example_info"):
        ex_type = text_of(ex_info, "type")
        example = text_of(ex_info, "example")
        if not ex_type or not example:
            continue
        ex_type = normalize_text(ex_type)
        example = normalize_text(example)
        if ex_type == "대화":
            current_dialogue.append(example)
            continue
        if current_dialogue:
            results.append({"type": "대화", "texts": current_dialogue})
            current_dialogue = []
        results.append({"type": ex_type, "texts": [example]})
    if current_dialogue:
        results.append({"type": "대화", "texts": current_dialogue})
    return results


def parse_api_related_terms(sense_elem: ET.Element) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for rel_info in sense_elem.findall("rel_info"):
        item = {
            "type": text_of(rel_info, "type"),
            "word": text_of(rel_info, "word"),
            "target_code": text_of(rel_info, "link_target_code"),
            "link_type": text_of(rel_info, "link_type"),
            "link_status": "unvalidated",
            "is_dangling": False,
        }
        if any(item.values()):
            results.append(item)
    return results


def parse_api_related_forms(word_info: ET.Element) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for der_info in word_info.findall("der_info"):
        item = {
            "type": "파생어",
            "word": text_of(der_info, "word"),
            "target_code": text_of(der_info, "link_target_code"),
            "link_type": text_of(der_info, "link_type"),
            "link_status": "unvalidated",
            "is_dangling": False,
        }
        if any(item.values()):
            results.append(item)
    for ref_info in word_info.findall("ref_info"):
        item = {
            "type": "참고형",
            "word": text_of(ref_info, "word"),
            "target_code": text_of(ref_info, "link_target_code"),
            "link_type": text_of(ref_info, "link_type"),
            "link_status": "unvalidated",
            "is_dangling": False,
        }
        if any(item.values()):
            results.append(item)
    return results


def parse_api_conjugations(word_info: ET.Element) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for conju_info in word_info.findall("conju_info"):
        conj_info = conju_info.find("conjugation_info")
        abbreviation_info = conju_info.find("abbreviation_info")
        item = {
            "form": text_of(conj_info, "conjugation"),
            "pronunciation": None,
            "sound_url": None,
            "abbreviation": text_of(abbreviation_info, "abbreviation"),
            "abbreviation_pronunciation": None,
            "abbreviation_sound_url": None,
        }
        pronunciation_info = abbreviation_info.find("pronunciation_info") if abbreviation_info is not None else None
        if pronunciation_info is not None:
            item["abbreviation_pronunciation"] = text_of(pronunciation_info, "pronunciation")
            item["abbreviation_sound_url"] = text_of(pronunciation_info, "link")
        if item["form"] or item["abbreviation"]:
            results.append(item)
    return results


def parse_api_pronunciations(word_info: ET.Element) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for pron_info in word_info.findall("pronunciation_info"):
        item = {
            "text": text_of(pron_info, "pronunciation"),
            "sound_url": text_of(pron_info, "link"),
        }
        if item["text"] or item["sound_url"]:
            results.append(item)
    return results


def parse_api_categories(word_info: ET.Element) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for category_info in word_info.findall("category_info"):
        cat_type = text_of(category_info, "type")
        value = text_of(category_info, "written_form")
        if cat_type or value:
            results.append({"type": cat_type, "value": value})
    return results


def parse_api_subwords(word_info: ET.Element) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for sub_info in word_info.findall("subword_info"):
        item = {
            "text": text_of(sub_info, "subword"),
            "unit": normalize_text(text_of(sub_info, "subword_unit")),
            "source_type": "api_view",
            "link_target_code": None,
            "link_confidence": None,
            "senses": [],
        }
        for subsense in sub_info.findall("subsense_info"):
            item["senses"].append(
                {
                    "definition": text_of(subsense, "definition"),
                    "syntactic_patterns": child_texts(subsense, "pattern_info/pattern"),
                    "examples": parse_api_examples(subsense),
                    "translations": [],
                }
            )
        if item["text"] or item["senses"]:
            results.append(item)
    return results


def build_api_only_sense(entry_id: str, api_sense: dict[str, Any], inserted_at: int) -> dict[str, Any]:
    return {
        "id": f"{entry_id}#sense-{inserted_at:03d}",
        "sense_order": inserted_at,
        "source_ids": {
            "json": None,
            "api": f"{entry_id}:sense:{api_sense['source_api_index']:03d}",
        },
        "definition": api_sense.get("definition"),
        "reference": api_sense.get("reference"),
        "annotation": None,
        "syntactic_annotation": None,
        "syntactic_patterns": api_sense.get("syntactic_patterns", []),
        "examples": api_sense.get("examples", []),
        "translations": [],
        "related_terms": api_sense.get("related_terms", []),
        "multimedia": [],
        "match_method": "api_only",
        "match_confidence": 1.0,
    }


def reindex_entry_senses(entry: dict[str, Any]) -> None:
    for index, sense in enumerate(entry.get("senses", []), start=1):
        sense["sense_order"] = index
        sense["id"] = f"{entry['id']}#sense-{index:03d}"


def parse_api_entry(xml_path: Path) -> dict[str, Any] | None:
    root = ET.parse(xml_path).getroot()
    item = root.find("item")
    if item is None:
        return None
    target_code = text_of(item, "target_code")
    word_info = item.find("word_info")
    if not target_code or word_info is None:
        return None
    senses: list[dict[str, Any]] = []
    for index, sense_elem in enumerate(word_info.findall("sense_info"), start=1):
        senses.append(
            {
                "source_api_index": index,
                "definition": text_of(sense_elem, "definition"),
                "reference": text_of(sense_elem, "reference"),
                "syntactic_patterns": child_texts(sense_elem, "pattern_info/pattern"),
                "examples": parse_api_examples(sense_elem),
                "related_terms": parse_api_related_terms(sense_elem),
            }
        )
    return {
        "entry_id": target_code,
        "word": text_of(word_info, "word"),
        "homonym_no": text_of(word_info, "sup_no"),
        "word_unit": text_of(word_info, "word_unit"),
        "word_type": text_of(word_info, "word_type"),
        "pos": [text for text in child_texts(word_info, "pos") if text],
        "word_grade": text_of(word_info, "word_grade"),
        "pronunciation": parse_api_pronunciations(word_info),
        "original_language": {
            "type": text_of(word_info.find("original_language_info"), "language_type"),
            "form": text_of(word_info.find("original_language_info"), "original_language"),
        },
        "conjugations": parse_api_conjugations(word_info),
        "categories": parse_api_categories(word_info),
        "senses": senses,
        "subwords": parse_api_subwords(word_info),
        "related_forms": parse_api_related_forms(word_info),
        "xml_path": str(xml_path),
    }


@dataclass
class MatchResult:
    sense_index: int | None
    match_method: str | None
    confidence: float | None
    review_reason: str | None


def first_example_signature(sense: dict[str, Any]) -> str:
    for example in sense.get("examples", []):
        texts = example.get("texts") or []
        if texts:
            return normalize_loose(texts[0])
    return ""


def find_matching_sense(entry: dict[str, Any], api_sense: dict[str, Any], fuzzy_threshold: float) -> MatchResult:
    senses = entry["senses"]
    if not senses:
        return MatchResult(None, None, None, "no_seed_senses")

    api_def_norm = normalize_loose(api_sense.get("definition"))
    exact_candidates = [
        idx
        for idx, sense in enumerate(senses)
        if normalize_loose(sense.get("definition")) == api_def_norm and api_def_norm
    ]
    if len(exact_candidates) == 1:
        return MatchResult(exact_candidates[0], "definition_exact", 1.0, None)
    if len(exact_candidates) > 1:
        return MatchResult(None, None, None, "definition_exact_collision")

    api_patterns = {normalize_loose(pattern) for pattern in api_sense.get("syntactic_patterns", []) if normalize_loose(pattern)}
    api_example_sig = first_example_signature(api_sense)

    scored: list[tuple[float, int, bool, bool]] = []
    for idx, sense in enumerate(senses):
        score = similarity(api_sense.get("definition"), sense.get("definition"))
        pattern_match = bool(api_patterns) and api_patterns == {
            normalize_loose(pattern) for pattern in sense.get("syntactic_patterns", []) if normalize_loose(pattern)
        }
        example_match = api_example_sig and api_example_sig == first_example_signature(sense)
        scored.append((score, idx, pattern_match, bool(example_match)))
    scored.sort(reverse=True)

    if scored and scored[0][0] >= fuzzy_threshold:
        top_score, top_idx, top_pattern_match, top_example_match = scored[0]
        next_score = scored[1][0] if len(scored) > 1 else 0.0
        if math.isclose(top_score, next_score, rel_tol=0.0, abs_tol=0.02):
            return MatchResult(None, None, top_score, "fuzzy_collision")
        if not (top_pattern_match or top_example_match):
            if top_score >= 0.90 and (top_score - next_score) >= 0.15:
                return MatchResult(top_idx, "definition_fuzzy_relaxed", top_score, None)
            return MatchResult(None, None, top_score, "fuzzy_without_anchor")
        return MatchResult(top_idx, "definition_fuzzy", top_score, None)

    if api_patterns:
        pattern_candidates = [
            idx
            for idx, sense in enumerate(senses)
            if {
                normalize_loose(pattern) for pattern in sense.get("syntactic_patterns", []) if normalize_loose(pattern)
            } == api_patterns
        ]
        if len(pattern_candidates) == 1:
            return MatchResult(pattern_candidates[0], "pattern_exact", 1.0, None)
        if len(pattern_candidates) > 1:
            return MatchResult(None, None, None, "pattern_collision")

    if api_example_sig:
        example_candidates = [
            idx
            for idx, sense in enumerate(senses)
            if first_example_signature(sense) == api_example_sig
        ]
        if len(example_candidates) == 1:
            return MatchResult(example_candidates[0], "example_signature", 1.0, None)
        if len(example_candidates) > 1:
            return MatchResult(None, None, None, "example_collision")

    api_order = api_sense.get("source_api_index", 0) - 1
    if 0 <= api_order < len(senses):
        return MatchResult(api_order, "order_fallback", 0.5, None)

    return MatchResult(None, None, None, "no_match")


def merge_scalar(current: Any, incoming: Any, prefer_incoming: bool = True) -> Any:
    current = strip_text(current) if isinstance(current, str) or current is None else current
    incoming = strip_text(incoming) if isinstance(incoming, str) or incoming is None else incoming
    if current in (None, "", []):
        return incoming
    if incoming in (None, "", []):
        return current
    if current == incoming:
        return current
    if isinstance(current, str) and isinstance(incoming, str):
        if prefer_incoming and len(incoming) >= len(current):
            return incoming
        return current
    return incoming if prefer_incoming else current


def merge_list_of_dicts(existing: list[dict[str, Any]], incoming: list[dict[str, Any]], key_fn) -> list[dict[str, Any]]:
    merged = [copy.deepcopy(item) for item in existing]
    index = {key_fn(item): idx for idx, item in enumerate(merged)}
    for item in incoming:
        key = key_fn(item)
        if key not in index:
            merged.append(copy.deepcopy(item))
            index[key] = len(merged) - 1
            continue
        target = merged[index[key]]
        for field, value in item.items():
            if field not in target:
                target[field] = copy.deepcopy(value)
                continue
            if isinstance(value, list) and isinstance(target[field], list):
                target[field] = unique_preserve_order(
                    target[field] + copy.deepcopy(value),
                    key_fn=lambda x: json.dumps(x, ensure_ascii=False, sort_keys=True),
                )
            elif isinstance(value, dict) and isinstance(target[field], dict):
                for sub_field, sub_value in value.items():
                    target[field][sub_field] = merge_scalar(target[field].get(sub_field), sub_value)
            else:
                target[field] = merge_scalar(target[field], value)
    return merged


def merge_examples(existing: list[dict[str, Any]], incoming: list[dict[str, Any]]) -> list[dict[str, Any]]:
    def key_fn(item: dict[str, Any]) -> tuple[str, tuple[str, ...]]:
        texts = tuple(normalize_text(text) for text in item.get("texts", []) if normalize_text(text))
        return (normalize_text(item.get("type")) or "", texts)

    cleaned_existing = []
    for item in existing:
        cleaned_existing.append(
            {
                "type": normalize_text(item.get("type")),
                "texts": [normalize_text(text) for text in item.get("texts", []) if normalize_text(text)],
            }
        )
    cleaned_incoming = []
    for item in incoming:
        cleaned_incoming.append(
            {
                "type": normalize_text(item.get("type")),
                "texts": [normalize_text(text) for text in item.get("texts", []) if normalize_text(text)],
            }
        )
    return unique_preserve_order(cleaned_existing + cleaned_incoming, key_fn=key_fn)


def merge_patterns(existing: list[str], incoming: list[str]) -> list[str]:
    merged = [normalize_text(pattern) for pattern in existing if normalize_text(pattern)]
    merged.extend(normalize_text(pattern) for pattern in incoming if normalize_text(pattern))
    return unique_preserve_order(merged, key_fn=lambda x: normalize_loose(x))


def merge_categories(existing: list[dict[str, Any]], incoming: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return unique_preserve_order(
        existing + incoming,
        key_fn=lambda item: (normalize_text(item.get("type")), normalize_loose(item.get("value"))),
    )


def merge_pronunciations(existing: list[dict[str, Any]], incoming: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return merge_list_of_dicts(
        existing,
        incoming,
        key_fn=lambda item: (normalize_loose(item.get("text")), strip_text(item.get("sound_url"))),
    )


def merge_conjugations(existing: list[dict[str, Any]], incoming: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return merge_list_of_dicts(
        existing,
        incoming,
        key_fn=lambda item: normalize_loose(item.get("form")) or normalize_loose(item.get("abbreviation")),
    )


def merge_relations(existing: list[dict[str, Any]], incoming: list[dict[str, Any]]) -> list[dict[str, Any]]:
    def key_fn(item: dict[str, Any]) -> tuple[str, str, str]:
        return (
            normalize_text(item.get("type")) or "",
            normalize_loose(item.get("word")) or "",
            strip_text(item.get("target_code")) or "",
        )

    merged = merge_list_of_dicts(existing, incoming, key_fn=key_fn)
    fallback = {}
    for idx, item in enumerate(merged):
        fallback[(normalize_text(item.get("type")) or "", normalize_loose(item.get("word")) or "")] = idx
    for incoming_item in incoming:
        fallback_key = (
            normalize_text(incoming_item.get("type")) or "",
            normalize_loose(incoming_item.get("word")) or "",
        )
        if fallback_key not in fallback:
            continue
        target = merged[fallback[fallback_key]]
        for field in ("target_code", "link_type"):
            target[field] = merge_scalar(target.get(field), incoming_item.get(field))
    return merged


def merge_sense(seed_sense: dict[str, Any], api_sense: dict[str, Any], api_entry_id: str) -> None:
    api_index = api_sense["source_api_index"]
    seed_sense["source_ids"]["api"] = f"{api_entry_id}:sense:{api_index:03d}"
    seed_sense["definition"] = merge_scalar(seed_sense.get("definition"), api_sense.get("definition"))
    seed_sense["reference"] = merge_scalar(seed_sense.get("reference"), api_sense.get("reference"))
    seed_sense["syntactic_patterns"] = merge_patterns(
        seed_sense.get("syntactic_patterns", []),
        api_sense.get("syntactic_patterns", []),
    )
    seed_sense["examples"] = merge_examples(
        seed_sense.get("examples", []),
        api_sense.get("examples", []),
    )
    seed_sense["related_terms"] = merge_relations(
        seed_sense.get("related_terms", []),
        api_sense.get("related_terms", []),
    )


def apply_manual_override(entry: dict[str, Any], entry_id: str, api_sense: dict[str, Any]) -> tuple[bool, str]:
    override = MANUAL_SENSE_OVERRIDES.get(entry_id, {}).get(api_sense["source_api_index"])
    if not override:
        return False, ""
    action = override["action"]
    if action == "match":
        sense_order = override["sense_order"]
        if 1 <= sense_order <= len(entry["senses"]):
            target_sense = entry["senses"][sense_order - 1]
            merge_sense(target_sense, api_sense, api_entry_id=entry_id)
            target_sense["match_method"] = "manual_override_match"
            target_sense["match_confidence"] = 1.0
            return True, "manual_override_match"
    if action == "append_api_sense":
        insert_index = min(max(api_sense["source_api_index"] - 1, 0), len(entry["senses"]))
        entry["senses"].insert(insert_index, build_api_only_sense(entry_id, api_sense, inserted_at=insert_index + 1))
        reindex_entry_senses(entry)
        return True, "manual_override_append"
    return False, ""


def reverse_link_subwords(record_by_id: dict[str, dict[str, Any]], report: dict[str, Any], fuzzy_threshold: float) -> None:
    exact_index: dict[tuple[str, str], list[str]] = defaultdict(list)
    normalized_index: dict[tuple[str, str], list[str]] = defaultdict(list)
    grouped_subword_exact_index: dict[tuple[str, str], list[str]] = defaultdict(list)
    grouped_subword_normalized_index: dict[tuple[str, str], list[str]] = defaultdict(list)
    linkable_records: list[tuple[str, str, str]] = []

    for entry_id, record in record_by_id.items():
        entry = record["entry"]
        unit = normalize_text(entry.get("word_unit"))
        word = normalize_text(entry.get("word"))
        if unit not in WORD_UNIT_REVERSE_LINKABLE or not word:
            continue
        exact_index[(unit, word)].append(entry_id)
        normalized_index[(unit, normalize_loose(word))].append(entry_id)
        linkable_records.append((entry_id, unit, word))
    for entry_id, record in record_by_id.items():
        for subword in record["entry"].get("subwords", []):
            if subword.get("source_type") != "json_grouped":
                continue
            unit = normalize_text(subword.get("unit"))
            text = normalize_text(subword.get("text"))
            if not unit or not text:
                continue
            grouped_subword_exact_index[(unit, text)].append(entry_id)
            grouped_subword_normalized_index[(unit, normalize_loose(text))].append(entry_id)

    for record in record_by_id.values():
        for subword in record["entry"].get("subwords", []):
            if subword.get("source_type") == "json_grouped":
                report["subword_link"]["skipped_grouped_json"] += 1
                continue
            override_key = (
                record["entry"]["id"],
                normalize_text(subword.get("text")) or "",
                normalize_text(subword.get("unit")) or "",
            )
            if override_key in MANUAL_SUBWORD_LINK_OVERRIDES:
                target_code, confidence = MANUAL_SUBWORD_LINK_OVERRIDES[override_key]
                subword["link_target_code"] = target_code
                subword["link_confidence"] = confidence
                report["subword_link"]["exact"] += 1
                continue
            text = normalize_text(subword.get("text"))
            unit = normalize_text(subword.get("unit"))
            if not text or not unit:
                continue

            exact_matches = exact_index.get((unit, text), [])
            if len(exact_matches) == 1:
                subword["link_target_code"] = exact_matches[0]
                subword["link_confidence"] = "exact"
                report["subword_link"]["exact"] += 1
                continue
            if len(exact_matches) > 1:
                report["subword_link"]["ambiguous"] += 1
                report["review_queue"].append(
                    {
                        "type": "subword_ambiguous",
                        "entry_id": record["entry"]["id"],
                        "subword": subword.get("text"),
                        "matches": exact_matches,
                    }
                )
                continue

            grouped_exact_matches = grouped_subword_exact_index.get((unit, text), [])
            if len(grouped_exact_matches) == 1:
                subword["link_target_code"] = grouped_exact_matches[0]
                subword["link_confidence"] = "exact"
                report["subword_link"]["exact"] += 1
                continue
            if len(grouped_exact_matches) > 1:
                report["subword_link"]["ambiguous"] += 1
                report["review_queue"].append(
                    {
                        "type": "subword_grouped_ambiguous",
                        "entry_id": record["entry"]["id"],
                        "subword": subword.get("text"),
                        "matches": grouped_exact_matches,
                    }
                )
                continue

            normalized_matches = normalized_index.get((unit, normalize_loose(text)), [])
            if len(normalized_matches) == 1:
                subword["link_target_code"] = normalized_matches[0]
                subword["link_confidence"] = "normalized"
                report["subword_link"]["normalized"] += 1
                continue
            if len(normalized_matches) > 1:
                report["subword_link"]["ambiguous"] += 1
                report["review_queue"].append(
                    {
                        "type": "subword_ambiguous",
                        "entry_id": record["entry"]["id"],
                        "subword": subword.get("text"),
                        "matches": normalized_matches,
                    }
                )
                continue

            grouped_normalized_matches = grouped_subword_normalized_index.get((unit, normalize_loose(text)), [])
            if len(grouped_normalized_matches) == 1:
                subword["link_target_code"] = grouped_normalized_matches[0]
                subword["link_confidence"] = "normalized"
                report["subword_link"]["normalized"] += 1
                continue
            if len(grouped_normalized_matches) > 1:
                report["subword_link"]["ambiguous"] += 1
                report["review_queue"].append(
                    {
                        "type": "subword_grouped_ambiguous",
                        "entry_id": record["entry"]["id"],
                        "subword": subword.get("text"),
                        "matches": grouped_normalized_matches,
                    }
                )
                continue

            candidates: list[tuple[float, str]] = []
            for entry_id, candidate_unit, candidate_word in linkable_records:
                if candidate_unit != unit:
                    continue
                score = similarity(text, candidate_word)
                if score >= fuzzy_threshold:
                    candidates.append((score, entry_id))
            candidates.sort(reverse=True)
            if len(candidates) == 1 or (
                candidates and len(candidates) > 1 and not math.isclose(candidates[0][0], candidates[1][0], abs_tol=0.02)
            ):
                subword["link_target_code"] = candidates[0][1]
                subword["link_confidence"] = "fuzzy"
                report["subword_link"]["fuzzy"] += 1
                continue
            if candidates:
                report["subword_link"]["ambiguous"] += 1
                report["review_queue"].append(
                    {
                        "type": "subword_fuzzy_ambiguous",
                        "entry_id": record["entry"]["id"],
                        "subword": subword.get("text"),
                        "matches": [candidate_id for _, candidate_id in candidates[:5]],
                    }
                )
            else:
                report["subword_link"]["unmatched"] += 1


def validate_links(record_by_id: dict[str, dict[str, Any]], report: dict[str, Any]) -> None:
    valid_ids = set(record_by_id.keys())
    dangling_related_terms = 0
    dangling_related_forms = 0
    related_terms_status_counts: dict[str, int] = defaultdict(int)
    related_forms_status_counts: dict[str, int] = defaultdict(int)

    backfill_related_form_targets(record_by_id, report)

    for record in record_by_id.values():
        for sense in record["entry"].get("senses", []):
            for relation in sense.get("related_terms", []):
                status, is_dangling = classify_link_status(relation.get("target_code"), valid_ids)
                relation["link_status"] = status
                relation["is_dangling"] = is_dangling
                related_terms_status_counts[status] += 1
                if relation["is_dangling"]:
                    dangling_related_terms += 1
        for form in record["entry"].get("related_forms", []):
            status, is_dangling = classify_link_status(form.get("target_code"), valid_ids)
            form["link_status"] = status
            form["is_dangling"] = is_dangling
            related_forms_status_counts[status] += 1
            if form["is_dangling"]:
                dangling_related_forms += 1

    report["dangling"] = {
        "related_terms": dangling_related_terms,
        "related_forms": dangling_related_forms,
    }
    report["link_status_counts"] = {
        "related_terms": dict(related_terms_status_counts),
        "related_forms": dict(related_forms_status_counts),
    }


def rebuild_translation_records(entry_records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    translations: list[dict[str, Any]] = []
    for record in entry_records:
        entry_id = record["entry"]["id"]
        for sense in record["entry"].get("senses", []):
            if not sense.get("translations"):
                continue
            translations.append(
                {
                    "sense_id": sense["id"],
                    "entry_id": entry_id,
                    "translations": copy.deepcopy(sense["translations"]),
                }
            )
    translations.sort(key=lambda record: record["sense_id"])
    return translations


def merge_api_xml_into_records(
    entry_records: list[dict[str, Any]],
    api_xml_dir: Path,
    fuzzy_threshold: float,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    record_by_id = {record["entry"]["id"]: record for record in entry_records}
    report: dict[str, Any] = {
        "api_xml_files": [],
        "api_entries_processed": 0,
        "api_entries_merged": 0,
        "api_entries_created": 0,
        "sense_matches": defaultdict(int),
        "review_queue": [],
        "subword_link": {
            "exact": 0,
            "normalized": 0,
            "fuzzy": 0,
            "ambiguous": 0,
            "skipped_grouped_json": 0,
            "unmatched": 0,
        },
    }

    xml_files = sorted(api_xml_dir.glob("*.xml"))
    for xml_file in xml_files:
        parsed = parse_api_entry(xml_file)
        if parsed is None:
            continue
        report["api_xml_files"].append(str(xml_file))
        report["api_entries_processed"] += 1
        entry_id = parsed["entry_id"]
        if entry_id not in record_by_id:
            record_by_id[entry_id] = make_empty_entry_record(entry_id)
            report["api_entries_created"] += 1
        record = record_by_id[entry_id]
        entry = record["entry"]
        record["meta"]["source_status"]["api_view_fetched"] = True
        report["api_entries_merged"] += 1

        entry["word"] = merge_scalar(entry.get("word"), parsed.get("word"))
        parsed_homonym = parsed.get("homonym_no")
        if parsed_homonym is not None:
            entry["homonym_no"] = int(parsed_homonym)
        entry["word_unit"] = merge_scalar(entry.get("word_unit"), parsed.get("word_unit"))
        entry["word_type"] = merge_scalar(entry.get("word_type"), parsed.get("word_type"))
        entry["pos"] = unique_preserve_order(entry.get("pos", []) + parsed.get("pos", []), key_fn=lambda x: x)
        entry["word_grade"] = merge_scalar(entry.get("word_grade"), parsed.get("word_grade"))
        entry["pronunciation"] = merge_pronunciations(entry.get("pronunciation", []), parsed.get("pronunciation", []))
        entry["conjugations"] = merge_conjugations(entry.get("conjugations", []), parsed.get("conjugations", []))
        entry["categories"] = merge_categories(entry.get("categories", []), parsed.get("categories", []))
        entry["related_forms"] = merge_relations(entry.get("related_forms", []), parsed.get("related_forms", []))
        entry["original_language"]["type"] = merge_scalar(
            entry["original_language"].get("type"),
            parsed["original_language"].get("type"),
        )
        entry["original_language"]["form"] = merge_scalar(
            entry["original_language"].get("form"),
            parsed["original_language"].get("form"),
        )

        if not entry.get("senses") and parsed.get("senses"):
            for api_sense in parsed["senses"]:
                idx = api_sense["source_api_index"]
                entry["senses"].append(
                    {
                        "id": f"{entry_id}#sense-{idx:03d}",
                        "sense_order": idx,
                        "source_ids": {"json": None, "api": f"{entry_id}:sense:{idx:03d}"},
                        "definition": api_sense.get("definition"),
                        "reference": api_sense.get("reference"),
                        "annotation": None,
                        "syntactic_annotation": None,
                        "syntactic_patterns": api_sense.get("syntactic_patterns", []),
                        "examples": api_sense.get("examples", []),
                        "translations": [],
                        "related_terms": api_sense.get("related_terms", []),
                        "multimedia": [],
                        "match_method": "api_only",
                    }
                )
                report["sense_matches"]["api_only_created"] += 1
        else:
            for api_sense in parsed["senses"]:
                overridden, override_method = apply_manual_override(entry, entry_id, api_sense)
                if overridden:
                    report["sense_matches"][override_method] += 1
                    continue
                match = find_matching_sense(entry, api_sense, fuzzy_threshold=fuzzy_threshold)
                if match.sense_index is None:
                    report["review_queue"].append(
                        {
                            "type": "sense_match_failed",
                            "entry_id": entry_id,
                            "api_source_index": api_sense["source_api_index"],
                            "review_reason": match.review_reason,
                            "definition": api_sense.get("definition"),
                            "xml_path": parsed.get("xml_path"),
                        }
                    )
                    report["sense_matches"]["needs_review"] += 1
                    continue
                sense = entry["senses"][match.sense_index]
                merge_sense(sense, api_sense, api_entry_id=entry_id)
                sense["match_method"] = match.match_method
                if match.confidence is not None:
                    sense["match_confidence"] = round(match.confidence, 4)
                report["sense_matches"][match.match_method or "unknown"] += 1

        entry["subwords"] = merge_list_of_dicts(
            entry.get("subwords", []),
            parsed.get("subwords", []),
            key_fn=lambda item: (normalize_loose(item.get("text")), normalize_text(item.get("unit"))),
        )

    reverse_link_subwords(record_by_id, report, fuzzy_threshold=fuzzy_threshold)
    validate_links(record_by_id, report)
    merged_records = sorted(record_by_id.values(), key=lambda record: int(record["entry"]["id"]))
    report["sense_matches"] = dict(report["sense_matches"])
    report["entry_count"] = len(merged_records)
    return merged_records, report


def payload_for_entries(entry_records: list[dict[str, Any]], api_xml_merged: int) -> dict[str, Any]:
    return {
        "schema_version": "v2.3",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "entry_count": len(entry_records),
        "api_xml_merged": api_xml_merged,
        "entries": entry_records,
    }


def payload_for_translations(translation_records: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "schema_version": "v2.3",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "translation_record_count": len(translation_records),
        "records": translation_records,
    }


def payload_for_report(report: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(report)
    result["generated_at"] = datetime.now(timezone.utc).isoformat()
    result["schema_version"] = "v2.3"
    return result


def build_link_integrity_payload(entry_records: list[dict[str, Any]], merge_report: dict[str, Any]) -> dict[str, Any]:
    unmatched_subwords: list[dict[str, Any]] = []
    dangling_terms: list[dict[str, Any]] = []
    dangling_forms: list[dict[str, Any]] = []
    dangling_terms_link_type_counts: dict[str, int] = defaultdict(int)
    dangling_forms_link_type_counts: dict[str, int] = defaultdict(int)
    for record in entry_records:
        entry = record["entry"]
        entry_id = entry["id"]
        for subword in entry.get("subwords", []):
            if subword.get("source_type") == "api_view" and not subword.get("link_target_code"):
                unmatched_subwords.append(
                    {
                        "entry_id": entry_id,
                        "entry_word": entry.get("word"),
                        "subword": subword.get("text"),
                        "unit": subword.get("unit"),
                    }
                )
        for sense in entry.get("senses", []):
            for relation in sense.get("related_terms", []):
                if relation.get("is_dangling"):
                    dangling_terms_link_type_counts[str(relation.get("link_type"))] += 1
                    dangling_terms.append(
                        {
                            "entry_id": entry_id,
                            "entry_word": entry.get("word"),
                            "sense_id": sense.get("id"),
                            "relation_type": relation.get("type"),
                            "word": relation.get("word"),
                            "target_code": relation.get("target_code"),
                            "link_type": relation.get("link_type"),
                        }
                    )
        for form in entry.get("related_forms", []):
            if form.get("is_dangling"):
                dangling_forms_link_type_counts[str(form.get("link_type"))] += 1
                dangling_forms.append(
                    {
                        "entry_id": entry_id,
                        "entry_word": entry.get("word"),
                        "type": form.get("type"),
                        "word": form.get("word"),
                        "target_code": form.get("target_code"),
                        "link_type": form.get("link_type"),
                    }
                )
    return {
        "schema_version": "v2.3",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "unmatched_api_subwords": len(unmatched_subwords),
            "dangling_related_terms": len(dangling_terms),
            "dangling_related_forms": len(dangling_forms),
        },
        "policy": {
            "unmatched_api_subwords": "Keep visible as subwords but disable deep link unless a target_code is resolved.",
            "dangling_related_terms": "Treat as non-clickable relation chips or unresolved references, not hard navigation targets.",
            "dangling_related_forms": "Treat as unresolved related forms; display text but guard navigation.",
            "unresolved_zero_code": "Source provided target_code=0, so this relation should be handled as text-only and not as a resolvable internal link.",
            "resolved_exact_word_backfill": "If a related form word maps to exactly one different internal entry, backfill the target_code conservatively.",
            "resolved_multi_exact_word_backfill": "If multiple exact word matches exist, only keep source-consistent candidates: explicit reverse matches first, then uniquely unclaimed candidates, then truly unclaimed multi-targets for UI disambiguation.",
        },
        "dangling_link_type_counts": {
            "related_terms": dict(dangling_terms_link_type_counts),
            "related_forms": dict(dangling_forms_link_type_counts),
        },
        "link_status_counts": copy.deepcopy(merge_report.get("link_status_counts", {})),
        "unmatched_api_subwords": unmatched_subwords,
        "dangling_related_terms_sample": dangling_terms[:500],
        "dangling_related_forms_sample": dangling_forms[:500],
        "review_queue": copy.deepcopy(merge_report.get("review_queue", [])),
    }


def fetch_api_xml(
    source_entries_path: Path,
    output_dir: Path,
    grades: list[str] | None,
    limit: int | None,
    delay_seconds: float,
    jitter_seconds: float,
    max_retries: int,
    timeout_seconds: float,
    resume: bool,
) -> dict[str, Any]:
    seed_payload = read_json(source_entries_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    entries = seed_payload["entries"]
    selected: list[dict[str, Any]] = []
    for record in entries:
        grade = record["entry"].get("word_grade")
        if grades and grade not in grades:
            continue
        selected.append(record)
    if limit is not None:
        selected = selected[:limit]

    report = {
        "requested": len(selected),
        "downloaded": 0,
        "skipped_existing": 0,
        "failed": [],
        "fatal_error": None,
        "delay_seconds": delay_seconds,
        "jitter_seconds": jitter_seconds,
    }

    for idx, record in enumerate(selected, start=1):
        entry_id = record["entry"]["id"]
        dest = output_dir / f"view_{entry_id}.xml"
        if resume and dest.exists():
            report["skipped_existing"] += 1
            continue
        params = {
            "key": API_KEY,
            "method": "target_code",
            "q": entry_id,
        }
        url = f"{API_VIEW_URL}?{urllib.parse.urlencode(params)}"
        last_error: str | None = None
        for attempt in range(1, max_retries + 1):
            try:
                with urllib.request.urlopen(url, timeout=timeout_seconds) as response:
                    body = response.read()
                try:
                    root = ET.fromstring(body)
                except ET.ParseError:
                    root = None
                if root is not None and root.tag == "error":
                    error_code = strip_text(root.findtext("error_code"))
                    message = strip_text(root.findtext("message"))
                    last_error = f"attempt={attempt}: api_error code={error_code} message={message}"
                    if error_code in {"010", "020", "021"}:
                        report["fatal_error"] = {
                            "entry_id": entry_id,
                            "error_code": error_code,
                            "message": message,
                        }
                        break
                    time.sleep(delay_seconds * attempt)
                    continue
                dest.write_bytes(body)
                report["downloaded"] += 1
                last_error = None
                break
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as exc:
                last_error = f"attempt={attempt}: {exc}"
                sleep_seconds = delay_seconds * attempt
                time.sleep(sleep_seconds)
        if report["fatal_error"] is not None:
            report["failed"].append({"entry_id": entry_id, "error": last_error or str(report['fatal_error'])})
            break
        if last_error is not None:
            report["failed"].append({"entry_id": entry_id, "error": last_error})
        sleep_seconds = delay_seconds + random.uniform(0.0, max(jitter_seconds, 0.0))
        if idx < len(selected):
            time.sleep(sleep_seconds)
    return report


def run_pipeline(
    json_dir: Path,
    api_xml_dir: Path,
    output_dir: Path,
    fuzzy_threshold: float,
) -> dict[str, Any]:
    seed_entries, seed_translations, seed_report = build_seed_from_json(json_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    write_json(output_dir / "kcenter_base.seed.json", payload_for_entries(seed_entries, api_xml_merged=0))
    write_json(output_dir / "kcenter_translations.seed.json", payload_for_translations(seed_translations))

    merged_entries, merge_report = merge_api_xml_into_records(seed_entries, api_xml_dir, fuzzy_threshold=fuzzy_threshold)
    merged_translations = rebuild_translation_records(merged_entries)

    write_json(
        output_dir / "kcenter_base.json",
        payload_for_entries(merged_entries, api_xml_merged=merge_report["api_entries_merged"]),
    )
    write_json(
        output_dir / "kcenter_translations.json",
        payload_for_translations(merged_translations),
    )
    write_json(
        output_dir / "kcenter_merge_report.json",
        payload_for_report(
            {
                "seed": seed_report,
                "merge": merge_report,
            }
        ),
    )
    write_json(
        output_dir / "kcenter_link_integrity.json",
        build_link_integrity_payload(merged_entries, merge_report),
    )
    write_json(
        output_dir / "kcenter_review_queue.json",
        {
            "schema_version": "v2.3",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "review_queue": copy.deepcopy(merge_report.get("review_queue", [])),
        },
    )
    return {
        "seed": seed_report,
        "merge": merge_report,
        "output_dir": str(output_dir),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build the unified Korean Basic Dictionary dataset.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--json-dir", type=Path, default=DEFAULT_JSON_DIR)
    common.add_argument("--api-xml-dir", type=Path, default=DEFAULT_API_XML_DIR)
    common.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    common.add_argument("--fuzzy-threshold", type=float, default=0.90)

    run_parser = subparsers.add_parser("run", parents=[common], help="Build seed, merge API XML, and emit final outputs.")

    seed_parser = subparsers.add_parser("seed", parents=[common], help="Build JSON seed only.")

    merge_parser = subparsers.add_parser("merge", parents=[common], help="Merge API XML into an existing JSON seed.")
    merge_parser.add_argument("--seed-path", type=Path, default=None)

    fetch_parser = subparsers.add_parser("fetch-api", parents=[common], help="Fetch API XML with delay and resume support.")
    fetch_parser.add_argument("--seed-path", type=Path, default=None)
    fetch_parser.add_argument("--grades", nargs="*", default=None)
    fetch_parser.add_argument("--limit", type=int, default=None)
    fetch_parser.add_argument("--delay-seconds", type=float, default=0.10)
    fetch_parser.add_argument("--jitter-seconds", type=float, default=0.10)
    fetch_parser.add_argument("--max-retries", type=int, default=3)
    fetch_parser.add_argument("--timeout-seconds", type=float, default=20.0)
    fetch_parser.add_argument("--resume", action="store_true")

    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.command == "run":
        result = run_pipeline(
            json_dir=args.json_dir,
            api_xml_dir=args.api_xml_dir,
            output_dir=args.output_dir,
            fuzzy_threshold=args.fuzzy_threshold,
        )
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    if args.command == "seed":
        seed_entries, seed_translations, seed_report = build_seed_from_json(args.json_dir)
        args.output_dir.mkdir(parents=True, exist_ok=True)
        write_json(args.output_dir / "kcenter_base.seed.json", payload_for_entries(seed_entries, api_xml_merged=0))
        write_json(args.output_dir / "kcenter_translations.seed.json", payload_for_translations(seed_translations))
        print(json.dumps(seed_report, ensure_ascii=False, indent=2))
        return

    if args.command == "merge":
        seed_path = args.seed_path or (args.output_dir / "kcenter_base.seed.json")
        seed_payload = read_json(seed_path)
        merged_entries, merge_report = merge_api_xml_into_records(
            seed_payload["entries"],
            args.api_xml_dir,
            fuzzy_threshold=args.fuzzy_threshold,
        )
        merged_translations = rebuild_translation_records(merged_entries)
        args.output_dir.mkdir(parents=True, exist_ok=True)
        write_json(
            args.output_dir / "kcenter_base.json",
            payload_for_entries(merged_entries, api_xml_merged=merge_report["api_entries_merged"]),
        )
        write_json(
            args.output_dir / "kcenter_translations.json",
            payload_for_translations(merged_translations),
        )
        write_json(
            args.output_dir / "kcenter_merge_report.json",
            payload_for_report({"merge": merge_report}),
        )
        write_json(
            args.output_dir / "kcenter_link_integrity.json",
            build_link_integrity_payload(merged_entries, merge_report),
        )
        write_json(
            args.output_dir / "kcenter_review_queue.json",
            {
                "schema_version": "v2.3",
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "review_queue": copy.deepcopy(merge_report.get("review_queue", [])),
            },
        )
        print(json.dumps(merge_report, ensure_ascii=False, indent=2))
        return

    if args.command == "fetch-api":
        seed_path = args.seed_path or (args.output_dir / "kcenter_base.seed.json")
        report = fetch_api_xml(
            source_entries_path=seed_path,
            output_dir=args.api_xml_dir,
            grades=args.grades,
            limit=args.limit,
            delay_seconds=args.delay_seconds,
            jitter_seconds=args.jitter_seconds,
            max_retries=args.max_retries,
            timeout_seconds=args.timeout_seconds,
            resume=args.resume,
        )
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return


if __name__ == "__main__":
    main()
