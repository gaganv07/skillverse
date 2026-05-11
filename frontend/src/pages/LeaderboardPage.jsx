import { PageHero } from "../components/ui/PageHero";
import { leaderboardData } from "../data/mockData";

export default function LeaderboardPage() {
  return (
    <div>
      <PageHero
        badge="Leaderboards"
        title="Recognition through transparent rankings and community momentum"
        description="Track top students, most liked projects, best-performing schools, talent stars, and innovation leaders."
      />
      <section className="section-shell grid gap-6 py-8 md:grid-cols-2">
        <div className="glass-card p-8">
          <h3 className="font-display text-2xl font-semibold">Top Students</h3>
          <div className="mt-5 space-y-4">
            {leaderboardData.students.map((student) => (
              <div key={student.name} className="flex items-center justify-between rounded-2xl bg-white/40 p-4 dark:bg-slate-900/40">
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{student.school}</p>
                </div>
                <span className="badge">{student.score}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-8">
          <h3 className="font-display text-2xl font-semibold">Best Schools</h3>
          <div className="mt-5 space-y-4">
            {leaderboardData.schools.map((school) => (
              <div key={school.name} className="flex items-center justify-between rounded-2xl bg-white/40 p-4 dark:bg-slate-900/40">
                <p className="font-semibold">{school.name}</p>
                <span className="badge">{school.score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
