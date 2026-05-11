import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { useAuth } from "../providers/AuthProvider";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    schoolName: "",
    district: "",
    state: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register(form);
    navigate("/feed");
  };

  return (
    <div>
      <PageHero badge="Join SkillVerse" title="Create a profile that reflects talent and future potential" description="Students and teachers can join the ecosystem with a polished, role-aware onboarding flow." />
      <section className="section-shell max-w-3xl py-8">
        <form onSubmit={handleSubmit} className="glass-card grid gap-5 p-8 md:grid-cols-2">
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <select className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="School name" value={form.schoolName} onChange={(event) => setForm({ ...form, schoolName: event.target.value })} />
          <input className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="District" value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })} />
          <input className="md:col-span-2 rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="State" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} />
          <button className="primary-button md:col-span-2">Create account</button>
        </form>
      </section>
    </div>
  );
}
