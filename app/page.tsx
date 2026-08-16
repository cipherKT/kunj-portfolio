import Link from "next/link";
import { getAllProjects, getAllPosts } from "@/lib/content";

import PageShell from "@/components/PageShell";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const projects = getAllProjects();
  const posts = getAllPosts();

  return (
    <PageShell>
      <section className="mb-12">
        <p className="text-dim text-xs uppercase tracking-wider mb-4">
          Pinned projects
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="border border-border rounded-lg p-4 hover:border-dim transition-colors"
            >
              <p className="text-fg text-sm mb-1.5">{project.title}</p>
              <p className="text-muted text-xs">{project.tags}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <p className="text-dim text-xs uppercase tracking-wider mb-4">Writing</p>
        <div>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/post/${post.slug}`}
              className="flex gap-4 items-center py-4 border-t border-border first:border-t-0 group"
            >
              <div className="w-14 h-14 bg-surface-2 rounded-md flex-shrink-0" />
              <div>
                <p className="text-fg text-sm mb-1 group-hover:text-muted transition-colors">
                  {post.title}
                </p>
                <p className="text-dim text-xs">
                  {post.category} · {formatDate(post.date)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}