import { PageHero } from "../components/ui/PageHero";

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHero
        badge="Admin command center"
        title="Manage the ecosystem with analytics, moderation, and announcements"
        description="Admins can oversee users, projects, talents, competitions, certificates, moderation workflows, and featured content."
      />
      <section className="section-shell grid gap-6 py-8 md:grid-cols-4">
        {[
          { label: "Users", value: "24,580" },
          { label: "Projects", value: "4,280" },
          { label: "Talents", value: "2,910" },
          { label: "Competitions", value: "84" }
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-3 font-display text-4xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
