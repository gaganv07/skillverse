import { PageHero } from "../components/ui/PageHero";
import { ProjectCard } from "../components/ui/ProjectCard";
import { featuredProjects } from "../data/mockData";

export default function ProjectsPage() {
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
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
