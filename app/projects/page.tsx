import Sidebar from "@/components/Sidebar";
import { getAllProjects } from "@/lib/content";
import Link from "next/link";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 py-10 md:px-12 md:py-16 max-w-3xl">
        <p className="text-dim text-xs uppercase tracking-wider mb-6">
          All Projects
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/project/${project.slug}`}
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
      </main>
    </div>
  );
}
