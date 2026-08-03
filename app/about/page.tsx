import Sidebar from "@/components/Sidebar";

export default function AboutPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 px-6 py-10 md:px-12 md:py-16 max-w-3xl">
        <p className="text-dim text-xs uppercase tracking-wider mb-6">About</p>

        <div className="article-content">
          <p>
            I&apos;m Kunj(cipherKT/r00t3d_kt) a security researcher focused on bug bounty hunting, CTF
            competitions, and building offensive tooling. I spend most of my
            time doing recon, chasing web app vulnerabilities, and writing
            about what I find.
          </p>

          <h2>What I do</h2>
          <p>
            Currently hunting on private and public bug bounty programs,
            competing in CTFs with a focus on web exploitation, and building
            small tools to speed up recon and enumeration workflows.
          </p>

          <h2>Get in touch</h2>
          <p>
            Best way to reach me is over email or on GitHub: links are in the
            sidebar.
          </p>
        </div>
      </main>
    </div>
  );
}
