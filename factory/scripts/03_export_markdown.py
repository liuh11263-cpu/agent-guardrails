"""Placeholder for exporting approved Debug Cases to Markdown."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    print(f"Future step: export {ROOT / 'data' / 'approved.json'} to content/debug.")


if __name__ == "__main__":
    main()
