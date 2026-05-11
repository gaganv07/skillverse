import { useEffect, useState } from "react";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

export default function LeaderboardPage() {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    // We can fetch from a leaderboard route or fallback to empty state
    // Let's assume we have a leaderboard route. If not, this handles gracefully.
    api.get("/leaderboard")
      .then((res) => {
        if (res.data?.success) {
          setStudents(res.data.data?.students || []);
          setSchools(res.data.data?.schools || []);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHero
        badge="Leaderboards"
        title="Recognition through transparent rankings and community momentum"
        description="Track top students, most liked projects, best-performing schools, engineering stars, and innovation leaders."
      />
      <section className="section-shell grid gap-6 py-8 md:grid-cols-2">
        <div className="glass-card p-8">
          <h3 className="font-display text-2xl font-semibold">Top Students</h3>
          <div className="mt-5 space-y-4">
            {students.length > 0 ? students.map((student) => (
              <div key={student.name || student._id} className="flex items-center justify-between rounded-2xl bg-white/40 p-4 dark:bg-slate-900/40">
                <div>
                  <p className="font-semibold">{student.name || student.fullName}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{student.school || student.schoolName}</p>
                </div>
                <span className="badge">{student.score || student.points || 0}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-4">No top students ranked yet.</p>
            )}
          </div>
        </div>
        <div className="glass-card p-8">
          <h3 className="font-display text-2xl font-semibold">Best Schools</h3>
          <div className="mt-5 space-y-4">
            {schools.length > 0 ? schools.map((school) => (
              <div key={school.name || school._id} className="flex items-center justify-between rounded-2xl bg-white/40 p-4 dark:bg-slate-900/40">
                <p className="font-semibold">{school.name}</p>
                <span className="badge">{school.score || school.points || 0}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-4">No schools ranked yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
