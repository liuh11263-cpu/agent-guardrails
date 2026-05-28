export type FrontmatterValue = string | string[] | boolean | number | null;
export type FrontmatterData = Record<string, FrontmatterValue>;

export type ParsedFrontmatter = {
  data: FrontmatterData;
  body: string;
};

export type MarkdownSection = {
  title: string;
  content: string;
};

function parseScalar(value: string): FrontmatterValue {
  const trimmed = value.trim();

  if (!trimmed) return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => String(parseScalar(item)))
      .filter(Boolean);
  }

  const unquoted = trimmed.match(/^["'](.*)["']$/);
  if (unquoted) return unquoted[1];

  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric) && /^-?\d+(\.\d+)?$/.test(trimmed)) {
    return numeric;
  }

  return trimmed;
}

export function parseFrontmatter(source: string): ParsedFrontmatter {
  if (!source.startsWith("---")) {
    return { data: {}, body: source };
  }

  const end = source.indexOf("\n---", 3);

  if (end === -1) {
    return { data: {}, body: source };
  }

  const frontmatter = source.slice(3, end).trim();
  const body = source.slice(end + 4).replace(/^\s*\n/, "");
  const data: FrontmatterData = {};
  let activeArrayKey: string | null = null;

  for (const line of frontmatter.split(/\r?\n/)) {
    const arrayItem = line.match(/^\s*-\s+(.*)$/);

    if (arrayItem && activeArrayKey) {
      const current = data[activeArrayKey];
      const nextValue = parseScalar(arrayItem[1]);
      data[activeArrayKey] = Array.isArray(current)
        ? [...current, String(nextValue)]
        : [String(nextValue)];
      continue;
    }

    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!keyValue) {
      activeArrayKey = null;
      continue;
    }

    const [, key, rawValue] = keyValue;

    if (!rawValue.trim()) {
      data[key] = [];
      activeArrayKey = key;
      continue;
    }

    data[key] = parseScalar(rawValue);
    activeArrayKey = null;
  }

  return { data, body };
}

export function parseMarkdownSections(body: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection | null = null;

  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)$/);

    if (heading) {
      if (current) {
        sections.push({
          title: current.title,
          content: current.content.trim()
        });
      }

      current = {
        title: heading[1].trim(),
        content: ""
      };
      continue;
    }

    if (current) {
      current.content += `${line}\n`;
    }
  }

  if (current) {
    sections.push({
      title: current.title,
      content: current.content.trim()
    });
  }

  return sections;
}

export function extractFirstFencedCode(markdown: string): string {
  const match = markdown.match(/```[A-Za-z0-9_-]*\n([\s\S]*?)```/);
  return match ? match[1].trim() : markdown.trim();
}
