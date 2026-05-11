import { PageHero } from "../components/ui/PageHero";

export default function TeacherDashboardPage() {
  return (
    <div>
      <PageHero
        badge="Teacher dashboard"
        title="Mentor, verify, rate, and elevate student potential"
        description="Teachers can review profiles, verify students, approve submissions, mentor learners, and recommend top talent for school and district opportunities."
      />
      <section className="section-shell grid gap-6 py-8 md:grid-cols-3">
        {[
          "Verify students",
          "Review project submissions",
          "Add mentor notes",
          "Approve talent uploads",
          "Recommend students",
          "Track progress by class"
        ].map((item) => (
          <div key={item} className="glass-card p-6">
            <h3 className="font-display text-xl font-semibold">{item}</h3>
          </div>
        ))}
      </section>
    </div>
  );
}
