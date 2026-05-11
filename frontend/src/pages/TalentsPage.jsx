import { PageHero } from "../components/ui/PageHero";
import { trendingTalents } from "../data/mockData";

export default function TalentsPage() {
  return (
    <div>
      <PageHero
        badge="Talent reels"
        title="Celebrate talent with a portfolio that moves"
        description="Students can upload talent videos, gather likes and comments, and create a creative identity alongside project work."
      />
      <section className="section-shell grid gap-6 py-8 md:grid-cols-3">
        {trendingTalents.map((talent) => (
          <div key={talent.name} className="glass-card p-6">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-brand-500 via-cyan-500 to-emerald-400" />
            <h3 className="mt-5 font-display text-2xl font-semibold">{talent.name}</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{talent.student}</p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span>{talent.likes} likes</span>
              <button className="text-brand-600 dark:text-brand-300">Play reel</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
