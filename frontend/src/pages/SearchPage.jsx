import { PageHero } from "../components/ui/PageHero";

export default function SearchPage() {
  return (
    <div>
      <PageHero
        badge="Advanced search"
        title="Discover talent by name, school, district, state, skill, and category"
        description="Search is designed to help organizers, teachers, and mentors quickly find students and projects with high future potential."
      />
      <section className="section-shell py-8">
        <div className="glass-card grid gap-4 p-6 md:grid-cols-3">
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Student name" />
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="School or district" />
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Skill or category" />
        </div>
      </section>
    </div>
  );
}
