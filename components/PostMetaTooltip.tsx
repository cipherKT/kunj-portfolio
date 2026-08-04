"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

interface PostMetaTooltipProps {
  category: string;
  date: string;
  tags?: string[];
  description: string;
}

export default function PostMetaTooltip({
  category,
  date,
  tags,
  description,
}: PostMetaTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Post details"
        className="text-muted hover:text-fg transition-colors bg-bg border border-border rounded-md p-1.5"
      >
        <Info size={16} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-surface border border-border rounded-lg p-4 text-left">
          <p className="text-dim text-xs uppercase tracking-wider mb-2">
            {category} ·{" "}
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-muted text-xs leading-relaxed mb-3">
            {description}
          </p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-block text-xs text-fg border border-border rounded-full px-3 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
