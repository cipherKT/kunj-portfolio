import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PROJECT_DIR = path.join(process.cwd(), "content", "projects");
const POST_DIR = path.join(process.cwd(), "content", "posts");
const CANVASES_DIR = path.join(process.cwd(), "content", "canvas");

export interface Project {
  title: string;
  slug: string;
  tags: string[];
  date: string;
  description: string;
  repo: string;
  content: string;
}

export interface Post {
  title: string;
  slug: string;
  tags: string[];
  date: string;
  category: string;
  description: string;
  format: "markdown" | "canvas";
  content: string;
}

export interface JsonCanvasNode {
  id: string;
  type: "text" | "file" | "link" | "group";
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  file?: string;
  url?: string;
  label?: string;
  color?: string;
}

export interface JsonCanvasEdge {
  id: string;
  fromNode: string;
  fromSide?: string;
  toNode: string;
  toSide?: string;
  label?: string;
}

export interface CanvasData {
  nodes: JsonCanvasNode[];
  edges: JsonCanvasEdge[];
}

function readMarkdownFiles<T>(dir: string): T[] {
  if (!fs.existsSync(PROJECT_DIR)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  return files.map((filename) => {
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");

    const { data, content } = matter(raw);
    return { ...(data as object), content } as T;
  });
}

export function getAllProjects(): Project[] {
  return readMarkdownFiles<Project>(PROJECT_DIR).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getAllPosts(): Post[] {
  return readMarkdownFiles<Post>(POST_DIR).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getCanvasBySlug(slug: string): CanvasData | undefined {
  const filePath = path.join(CANVASES_DIR, `${slug}.canvas`);
  console.log("loading cavas....")
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf-8");
  console.log("loading raw....")
  return JSON.parse(raw) as CanvasData;
}
