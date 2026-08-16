"use client";

import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useSidebar } from "./sidebar-context";

export default function PageShell({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main
        className={`flex-1 px-6 py-10 md:px-12 md:py-16 transition-[max-width] duration-200 ${
          collapsed ? "max-w-none" : "max-w-3xl"
        }`}
      >
        {children}
      </main>
    </div>
  );
}