"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  MarkerType,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { CanvasData } from "@/lib/content";

function TextNode({ data }: NodeProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 text-sm text-muted overflow-auto w-full h-full">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="article-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {(data.text as string) ?? ""}
        </ReactMarkdown>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

function FileNode({ data }: NodeProps) {
  const file = data.file as string;
  const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(file);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden w-full h-full">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={file} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="p-4 text-xs text-muted break-all">{file}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

function LinkNode({ data }: NodeProps) {
  const url = data.url as string;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center bg-surface border border-border rounded-lg p-4 text-xs text-fg hover:border-dim transition-colors w-full h-full text-center break-all"
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      {url}
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </a>
  );
}

function GroupNode({ data }: NodeProps) {
  return (
    <div className="w-full h-full border border-dashed border-border rounded-lg">
      {data.label ? (
        <div className="text-muted text-sm font-medium px-3 py-2">{data.label as string}</div>
      ) : null}
    </div>
  );
}

const nodeTypes = {
  text: TextNode,
  file: FileNode,
  link: LinkNode,
  group: GroupNode,
};

export default function CanvasViewer({ data }: { data: CanvasData }) {
  const nodes: Node[] = useMemo(
    () =>
      data.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: { x: n.x, y: n.y },
        style: {
          width: n.width,
          height: n.height,
          ...(n.type === "group" ? { pointerEvents: "none" as const } : {}),
        },
        data: {
          text: n.text,
          file: n.file,
          url: n.url,
          label: n.label,
        },
        zIndex: n.type === "group" ? -1 : 0,
        draggable: n.type !== "group",
        selectable: n.type !== "group",
      })),
    [data.nodes]
  );

  const edges: Edge[] = useMemo(
    () =>
      data.edges.map((e) => ({
        id: e.id,
        source: e.fromNode,
        target: e.toNode,
        label: e.label,
        style: { stroke: "var(--muted)", strokeWidth: 1.5 },
        labelStyle: { fill: "var(--muted)", fontSize: 13, fontWeight: 500 },
        labelBgStyle: { fill: "var(--bg)" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "var(--muted)",
        },
      })),
    [data.edges],
  );

  return (
    <div className="w-full h-[75vh] border border-border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
      >
        <Background color="var(--border)" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
