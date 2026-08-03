import Sidebar from "@/components/Sidebar";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

function formatDate(datestr: string): string {
  return new Date(datestr).toLocaleDateString("en-US", {
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
      <main className="flex-1 px-6 px-10 md:px-12 md:py-16 max-w-3xl">
        <Link
          href="/"
          className="text-muted text-sm hover:text-fg transition-colors"
        >
          ← back
        </Link>

        <div className="mt-6 mb-8">
          <p className="text-dim text-xs uppercase tracking-wider mb-2">
            {post.category} • {formatDate(post.date)}
          </p>
          <h1 className="text-fg text-2x1 font-medium mb-3">{post.title}</h1>
          <p className="text-muted text-sm leading-relaxed">
            {post.description}
          </p>
        </div>

        <article className="article-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
