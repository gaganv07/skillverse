import { PageHero } from "../components/ui/PageHero";

export default function MessagesPage() {
  return (
    <div>
      <PageHero
        badge="Chat system"
        title="Direct messaging between students, teachers, and mentors"
        description="A lightweight conversation system enables encouragement, guidance, collaboration requests, and event follow-ups."
      />
      <section className="section-shell grid gap-6 py-8 lg:grid-cols-[0.35fr_0.65fr]">
        <div className="glass-card p-6">
          <h3 className="font-display text-2xl font-semibold">Conversations</h3>
          <div className="mt-5 space-y-3">
            {["Mentor Priya", "Teacher Arun", "Innovation Club"].map((name) => (
              <div key={name} className="rounded-2xl bg-white/40 p-4 dark:bg-slate-900/40">{name}</div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="h-80 rounded-3xl bg-white/40 p-4 dark:bg-slate-900/40">
            Conversation preview
          </div>
        </div>
      </section>
    </div>
  );
}
