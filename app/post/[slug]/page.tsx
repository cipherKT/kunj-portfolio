import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { getPostBySlug, getAllPosts } from "@/lib/content";
import Sidebar from "@/components/Sidebar";
import CalloutBlockquote from "@/components/CalloutBlockquote";
import CodeBlock from "@/components/CodeBlock";

const markdownComponents: Components = {
  blockquote: CalloutBlockquote,
  pre: CodeBlock,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 py-10 md:px-12 md:py-16 max-w-3xl">
        <Link
          href="/"
          className="text-muted text-sm hover:text-fg transition-colors"
        >
          ← back
        </Link>

        <div className="mt-6 mb-8">
          <p className="text-dim text-xs uppercase tracking-wider mb-2">
            {post.category} · {formatDate(post.date)}
          </p>
          <h1 className="text-fg text-2xl font-medium mb-3">{post.title}</h1>
          <p className="text-muted text-sm leading-relaxed mb-3">
            {post.description}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
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
        <article className="article-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
