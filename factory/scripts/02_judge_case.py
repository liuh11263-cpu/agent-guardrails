"""Placeholder for judging generated Debug Case drafts."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    print(f"Future step: score {ROOT / 'data' / 'generated.json'}.")


if __name__ == "__main__":
    main()
