"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiGithub, SiMarkdown, SiX } from "@icons-pack/react-simple-icons";
import { Mail } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "posts" },
  { href: "/projects", label: "projects" },
  { href: "/about", label: "about" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-1/4 md:min-h-screen md:sticky md:top-0 flex flex-col border-b md:border-b-0 md:border-r border-border">
      {/* top half — photo + bio */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 border-b border-border text-center">
        <div
          className="w-22 h-22 rounded-full bg-fg mb-4"
          style={{ width: 88, height: 88 }}
        />
        <h1 className="text-fg text-base font-medium mb-1.5">Kunj Thakkar</h1>
        <p className="text-muted text-sm leading-relaxed max-w-[220px]">
          Aspiring security researcher interested in hacking and cybersecurity.
        </p>
        <div className="flex gap-4 mt-4 text-muted ">
          <a
            href="https://github.com/cipherKT"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Github"
            className="hover:text-fg transition-colors"
          >
            <SiGithub size={17} />
          </a>
          <a
            href="https://x.com/r00t3d_kt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-fg transition-colors"
          >
            <SiX size={17} />
          </a>
          <a
            href="mailto:kunjthakkar555@gmail.com"
            aria-label="Email"
            className="hover:text-fg transition-colors"
          >
            <Mail size={17} strokeWidth={1.75} />
          </a>
        </div>
      </div>

      {/* bottom half — nav + resume */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-1">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <a
          href="/resume.pdf"
          download
          className="mt-3 px-3 py-2.5 rounded-full border border-border text-fg text-sm text-center hover:border-muted transition-colors"
        >
          resume
        </a>
      </div>
    </aside>
  );
}
