#!/usr/bin/env python3
"""Retorna o próximo ID sequencial para itens do backlog ágil em Epicos/."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


def find_epicos_root() -> Path:
    cwd = Path.cwd()
    for base in [cwd, *cwd.parents]:
        if (base / ".cursor" / "skills" / "processo-agil").is_dir():
            return base / "Epicos"
        if (base / "Epicos").is_dir():
            return base / "Epicos"
    return cwd / "Epicos"


def latest_version_number(epicos: Path) -> int:
    best = 0
    if epicos.is_dir():
        for d in epicos.iterdir():
            m = re.match(r"^V(\d+)$", d.name, re.IGNORECASE)
            if m:
                best = max(best, int(m.group(1)))
    return best


def resolve_version(epicos: Path, versao: int, create: bool = False) -> Path | None:
    num = versao if versao > 0 else latest_version_number(epicos)
    if num == 0:
        num = 1
    vdir = epicos / f"V{num}"
    if vdir.is_dir():
        return vdir
    if create:
        vdir.mkdir(parents=True, exist_ok=True)
        return vdir
    return None


def find_epic_dir(vdir: Path, epic_num: int) -> Path | None:
    prefix = f"E{epic_num:02d}-"
    for d in vdir.iterdir():
        if d.is_dir() and d.name.upper().startswith(prefix.upper()):
            return d
    return None


def type_dir(parent: Path, subfolder: str) -> Path:
    path = parent / subfolder
    path.mkdir(parents=True, exist_ok=True)
    return path


def max_from_names(names: list[str], pattern: re.Pattern[str]) -> int:
    best = 0
    for name in names:
        m = pattern.search(name)
        if m:
            best = max(best, int(m.group(1)))
    return best


def next_epic_id(vdir: Path) -> str:
    nums = []
    for d in vdir.iterdir():
        if d.is_dir():
            m = re.match(r"^E(\d{2})-", d.name, re.IGNORECASE)
            if m:
                nums.append(int(m.group(1)))
    return f"E{(max(nums, default=0) + 1):02d}"


def next_investigacao_id(vdir: Path) -> str:
    ts_dir = type_dir(vdir, "TROUBLESHOOTING")
    files = [p.name for p in ts_dir.glob("INV*.md")]
    n = max_from_names(files, re.compile(r"^INV(\d{2})-", re.IGNORECASE))
    return f"INV{(n + 1):02d}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Próximo ID do backlog ágil")
    parser.add_argument(
        "--tipo",
        required=True,
        choices=["epico", "feat", "story", "task", "bug", "investigacao"],
    )
    parser.add_argument("--versao", type=int, default=0, help="0 = versão mais nova")
    parser.add_argument("--epico", type=int, help="Número do épico (ex.: 1 para E01)")
    args = parser.parse_args()

    epicos = find_epicos_root()

    if args.tipo == "investigacao":
        vdir = resolve_version(epicos, args.versao, create=True)
        if vdir is None:
            print("erro: não foi possível resolver versão", file=sys.stderr)
            return 1
        print(next_investigacao_id(vdir))
        return 0

    if args.tipo == "epico":
        vdir = resolve_version(epicos, args.versao, create=True)
        if vdir is None:
            print("erro: versão não encontrada", file=sys.stderr)
            return 1
        print(next_epic_id(vdir))
        return 0

    if args.epico is None:
        print("erro: --epico obrigatório para este tipo", file=sys.stderr)
        return 1

    vdir = resolve_version(epicos, args.versao)
    if vdir is None:
        print("erro: versão não encontrada", file=sys.stderr)
        return 1

    epic_dir = find_epic_dir(vdir, args.epico)
    if epic_dir is None:
        print(f"erro: épico E{args.epico:02d} não encontrado", file=sys.stderr)
        return 1

    if args.tipo == "feat":
        files = [p.name for p in type_dir(epic_dir, "FEAT").glob("FEAT*.md")]
        n = max_from_names(files, re.compile(r"^FEAT(\d{2})-", re.IGNORECASE))
        print(f"FEAT{(n + 1):02d}")
        return 0

    if args.tipo == "story":
        files = [p.name for p in type_dir(epic_dir, "STORY").glob("S*.md")]
        n = max_from_names(files, re.compile(r"^S(\d{2})-", re.IGNORECASE))
        print(f"S{(n + 1):02d}")
        return 0

    if args.tipo == "task":
        files = [p.name for p in type_dir(epic_dir, "TASK").glob("T*.md")]
        n = max_from_names(files, re.compile(r"^T(\d{2})-", re.IGNORECASE))
        print(f"T{(n + 1):02d}")
        return 0

    if args.tipo == "bug":
        files = [p.name for p in type_dir(epic_dir, "BUG").glob("F*.md")]
        n = max_from_names(files, re.compile(r"^F(\d{2})-", re.IGNORECASE))
        print(f"E{args.epico:02d}-F{(n + 1):02d}")
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
