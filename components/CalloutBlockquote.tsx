import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

const CALLOUT_TYPES: Record<string, { label: string; className: string }> = {
  info: { label: "Info", className: "callout-info" },
  note: { label: "Note", className: "callout-note" },
  tip: { label: "Tip", className: "callout-tip" },
  warning: { label: "Warning", className: "callout-warning" },
  caution: { label: "Caution", className: "callout-caution" },
  important: { label: "Important", className: "callout-important" },
};

const MARKER = /^\[!(info|note|tip|warning|caution|important)\]/i;

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function stripMarker(node: ReactNode, done: { current: boolean }): ReactNode {
  if (done.current) return node;
  if (typeof node === "string") {
    const match = node.match(/^\[!(?:info|note|tip|warning|caution|important)\]\s*(.*)$/i);
    if (match) {
      done.current = true;
      return match[1];
    }
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((n) => stripMarker(n, done));
  }
  if (isValidElement(node)) {
    const props = (node.props ?? {}) as { children?: ReactNode };
    return cloneElement(
      node as ReactElement<{ children?: ReactNode }>,
      props,
      stripMarker(props.children, done),
    );
  }
  return node;
}

export default function CalloutBlockquote({
  children,
}: {
  children?: ReactNode;
}) {
  const list = Array.isArray(children) ? children : [children];
  let match: RegExpMatchArray | null = null;
  for (const child of list) {
    match = extractText(child).match(MARKER);
    if (match) break;
  }

  if (!match) {
    return <blockquote>{children}</blockquote>;
  }

  const type = match[1].toLowerCase();
  const config = CALLOUT_TYPES[type] ?? CALLOUT_TYPES.info;
  const body = stripMarker(children, { current: false });
  const paragraphs = Array.isArray(body)
    ? body.filter((n) => extractText(n).trim() !== "")
    : body;

  return (
    <div className={`callout ${config.className}`}>
      <p className="callout-label">{config.label}</p>
      {paragraphs}
    </div>
  );
}
