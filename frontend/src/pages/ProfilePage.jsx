import { PageHero } from "../components/ui/PageHero";

export default function ProfilePage() {
  return (
    <div>
      <PageHero
        badge="Student profile"
        title="Professional student identity with projects, talents, and achievements"
        description="Each profile is designed like a next-generation educational portfolio with location, school, skills, achievements, social links, and verification state."
      />
      <section className="section-shell grid gap-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="glass-card p-8">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-400" />
          <h2 className="mt-5 font-display text-3xl font-bold">Asha M.</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Govt High School, Ballari</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ballari, Karnataka</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Robotics", "Public Speaking", "Problem Solving"].map((skill) => (
              <span key={skill} className="badge">{skill}</span>
            ))}
          </div>
        </aside>
        <div className="space-y-6">
          <div className="glass-card p-8">
            <h3 className="font-display text-2xl font-semibold">About</h3>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              Student innovator passionate about building low-cost solutions for agriculture and school communities.
            </p>
          </div>
          <div className="glass-card p-8">
            <h3 className="font-display text-2xl font-semibold">Achievements</h3>
            <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
              <li>District science fair finalist</li>
              <li>School innovation club lead</li>
              <li>Featured student speaker at youth summit</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
