"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/content/projects";
import { ProjectCard } from "@/components/project-card";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.title, p.description, p.category, ...p.stack].join(" ").toLowerCase().includes(q)
    );
  }, [projects, query]);

  return (
    <div>
      <div className="relative max-w-sm">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
          className="w-full rounded-full border border-border bg-bg-elevated px-4 py-2.5 text-sm text-fg outline-none placeholder:text-fg-faint focus-visible:border-accent"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-fg-muted">No projects match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} delay={(i % 2) * 90} />
          ))}
        </div>
      )}
    </div>
  );
}
