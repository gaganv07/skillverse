import { useEffect, useState } from "react";
import { PageHero } from "../components/ui/PageHero";
import { ProjectCard } from "../components/ui/ProjectCard";
import { api } from "../lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects")
      .then((res) => {
        if (res.data?.success) {
          setProjects(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHero
        badge="Project showcase"
        title="Showcase innovations with professional clarity"
        description="Projects can include images, video demos, PDFs, team details, category metadata, and links to GitHub or live demos."
      />
      <section className="section-shell py-8">
        <div className="glass-card mb-8 grid gap-4 p-5 md:grid-cols-4">
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Search by title" />
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="School" />
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="District" />
          <select className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70">
            <option>All Categories</option>
            <option>Science</option>
            <option>Coding</option>
            <option>Agriculture</option>
          </select>
        </div>
        {projects.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id || project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500">
            <p>No projects found yet. Be the first to add one!</p>
          </div>
        )}
      </section>
    </div>
  );
}
