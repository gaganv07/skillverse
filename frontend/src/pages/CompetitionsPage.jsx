import { useEffect, useState } from "react";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/competitions")
      .then((res) => {
        if (res.data?.success) {
          setCompetitions(res.data.competitions || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHero
        badge="Events and competitions"
        title="Discover challenges that reward innovation, effort, and impact"
        description="Science fairs, innovation contests, hackathons, and engineering competitions can be published with banners, deadlines, registration, and winner announcements."
      />
      <section className="section-shell py-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading competitions...</div>
        ) : competitions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {competitions.map((competition) => (
              <div key={competition._id} className="glass-card p-6">
                <span className="badge">{competition.type}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold">{competition.title}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{new Date(competition.date).toLocaleDateString()}</p>
                <button className="primary-button mt-6 w-full">Register</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No active competitions at the moment. Check back later!
          </div>
        )}
      </section>
    </div>
  );
}
