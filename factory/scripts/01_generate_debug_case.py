"""Placeholder for generating Debug Case drafts from seeds."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    print(f"Future step: read {ROOT / 'data' / 'seeds.json'} and generate drafts.")


if __name__ == "__main__":
    main()
