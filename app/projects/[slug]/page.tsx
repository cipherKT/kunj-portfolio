import { getAllProjects, getProjectBySlug } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 py-10 md:px-12 md:py-16 max-w-3xl">
        <Link
          href="/"
          className="text-mutated text-sm hover:text-fg transition-colors"
        >
          ← back
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-fg text-2xl font-medium mb-3">{project.title}</h1>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="inline-block text-xs text-fg border border-border rounded-full px-3 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="text-muted text-sm leading-relaxed mb-4">
            {project.description}
          </p>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg text-sm border borderborder-border rounded-full px-4 py-1.5 inline-block hover:border-dim transition-colors"
            >
              View on GitHub
            </a>
          )}
        </div>

        <article className="article-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
