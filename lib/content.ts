import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PROJECT_DIR = path.join(process.cwd(), "content", "projects");
const POST_DIR = path.join(process.cwd(), "content", "posts");

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
  content: string;
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
