import { useEffect, useState } from "react";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

export default function TalentsPage() {
  const [talents, setTalents] = useState([]);

  useEffect(() => {
    api.get("/talents")
      .then((res) => {
        if (res.data?.success) {
          setTalents(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHero
        badge="Talent reels"
        title="Celebrate talent with a portfolio that moves"
        description="Students can upload talent videos, gather likes and comments, and create a creative identity alongside project work."
      />
      <section className="section-shell py-8">
        {talents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {talents.map((talent) => (
              <div key={talent._id || talent.name} className="glass-card p-6">
                <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-brand-500 via-cyan-500 to-emerald-400" />
                <h3 className="mt-5 font-display text-2xl font-semibold">{talent.title || talent.name}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{talent.user?.fullName || talent.student}</p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span>{talent.likes?.length || talent.likes || 0} likes</span>
                  <button className="text-brand-600 dark:text-brand-300">Play reel</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500">
            <p>No talent reels posted yet. Share your skills with the community!</p>
          </div>
        )}
      </section>
    </div>
  );
}
