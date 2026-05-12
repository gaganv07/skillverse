import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const getStatusBadge = (status) => {
    switch(status) {
      case "upcoming": return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">Upcoming</span>;
      case "registration-open": return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">Registration Open</span>;
      case "ongoing": return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">Ongoing</span>;
      case "completed": return <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">Completed</span>;
      default: return null;
    }
  }

  return (
    <div>
      <PageHero
        badge="Events and competitions"
        title="Discover challenges that reward innovation, effort, and impact"
        description="Science fairs, innovation contests, hackathons, and engineering competitions can be published with banners, deadlines, registration, and winner announcements."
      />
      <section className="section-shell py-12">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading competitions...</div>
        ) : competitions.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {competitions.map((competition) => (
              <div key={competition._id} className="glass-card flex flex-col overflow-hidden hover:shadow-xl transition-shadow">
                {competition.banner ? (
                  <img src={competition.banner} alt={competition.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-brand-600 to-emerald-500" />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="badge">{competition.type}</span>
                    {getStatusBadge(competition.status)}
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2 text-slate-900 dark:text-white line-clamp-2">
                    {competition.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3 flex-1">
                    {competition.description}
                  </p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Registration:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {competition.registrationDeadline ? new Date(competition.registrationDeadline).toLocaleDateString() : "TBA"}
                      </span>
                    </div>
                    <Link to={`/competitions/${competition._id}`} className="primary-button w-full flex justify-center mt-4">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 glass-card">
            <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No active competitions</h3>
            <p className="mt-2">Check back later for exciting new challenges!</p>
          </div>
        )}
      </section>
    </div>
  );
}
