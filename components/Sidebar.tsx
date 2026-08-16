"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { Mail, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebar } from "./sidebar-context";

const NAV_LINKS = [
  { href: "/", label: "posts" },
  { href: "/projects", label: "projects" },
  { href: "/about", label: "about" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <>
      <button
        onClick={toggle}
        aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
        className="fixed top-4 left-4 z-50 text-muted hover:text-fg transition-colors bg-bg border border-border rounded-md p-1.5"
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      <aside
        className={`${
          collapsed ? "hidden" : "flex"
        } w-full md:w-1/4 md:h-screen md:sticky md:top-0 md:self-start flex-col border-b md:border-b-0 md:border-r border-border`}
      >
        {/* top half — photo + bio (unchanged, keep your existing JSX here) */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 border-b border-border text-center">
          <Image
            src="/avatar.svg"
            alt="Kunj Thakkar"
            width={140}
            height={140}
            className="w-[140px] h-[140px] aspect-square rounded-full object-cover mb-4 shrink-0"
            style={{ objectPosition: "center 20%" }}
            priority
          />
          <h1 className="text-fg text-base font-medium mb-1.5">Kunj Thakkar</h1>
          <p className="text-muted text-sm leading-relaxed max-w-[220px]">
            Aspiring security researcher interested in hacking and cybersecurity.
          </p>
          <div className="flex gap-4 mt-4 text-muted">
            <a href="https://github.com/kunj" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-fg transition-colors">
              <SiGithub size={17} />
            </a>
            <a href="https://twitter.com/kunj" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-fg transition-colors">
              <SiX size={16} />
            </a>
            <a href="mailto:kunj@example.com" aria-label="Email" className="hover:text-fg transition-colors">
              <Mail size={17} strokeWidth={1.75} />
            </a>
          </div>
        </div>

        {/* bottom half — nav + resume (unchanged) */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
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
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-3 py-2.5 rounded-full border border-border text-dim text-sm text-center hover:text-fg hover:border-dim transition-colors"
          >
            resume
          </a>
        </div>
      </aside>
    </>
  );
}
