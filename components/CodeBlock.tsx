"use client";

import { useRef, useState, type ReactNode } from "react";

export default function CodeBlock({ children }: { children?: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = (preRef.current?.textContent ?? "").replace(/\n+$/, "");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block relative">
      <button
        onClick={copy}
        aria-label="Copy code"
        className="absolute top-2 right-2 z-10 text-xs border border-border rounded-md px-2 py-1 bg-surface-2 text-muted hover:text-fg hover:border-dim transition-colors"
      >
        {copied ? "copied" : "copy"}
      </button>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}
