import PageShell from "@/components/PageShell";

export default function AboutPage() {
  return (
    <PageShell>
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
    </PageShell>
  );
}
