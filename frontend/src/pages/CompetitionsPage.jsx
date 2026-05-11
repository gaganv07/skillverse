import { PageHero } from "../components/ui/PageHero";

const competitions = [
  { title: "Karnataka Student Science Fair", date: "June 2026", type: "Science Fair" },
  { title: "Rural Innovators Hackathon", date: "July 2026", type: "Hackathon" },
  { title: "Young Talent Video Challenge", date: "August 2026", type: "Talent Event" }
];

export default function CompetitionsPage() {
  return (
    <div>
      <PageHero
        badge="Events and competitions"
        title="Discover challenges that reward talent, effort, and impact"
        description="Science fairs, innovation contests, hackathons, and talent competitions can be published with banners, deadlines, registration, and winner announcements."
      />
      <section className="section-shell grid gap-6 py-8 md:grid-cols-3">
        {competitions.map((competition) => (
          <div key={competition.title} className="glass-card p-6">
            <span className="badge">{competition.type}</span>
            <h3 className="mt-4 font-display text-2xl font-semibold">{competition.title}</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{competition.date}</p>
            <button className="primary-button mt-6 w-full">Register</button>
          </div>
        ))}
      </section>
    </div>
  );
}
