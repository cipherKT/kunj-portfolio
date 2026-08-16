import PageShell from "@/components/PageShell";
import { getAllProjects } from "@/lib/content";
import Link from "next/link";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <PageShell>
      <p className="text-dim text-xs uppercase tracking-wider mb-6">
        All Projects
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="border border-border rounded-lg p-5 hover:border-dim transition-colors"
          >
            <p className="text-fg text-sm mb-1.5 ">{project.title}</p>
            <p className="text-dim text-xs  mb-3">{project.tags}</p>
            <p className="text-muted text-xs leading-relaxed">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
