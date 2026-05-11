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
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await register(form);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred during registration.");
    }
  };

  return (
    <div>
      <div className="relative">
        {/* Karnataka Flag Decoration */}
        <div className="absolute right-4 top-4 md:right-8 md:top-8 flex flex-col items-center gap-2">
          <div 
            className="w-16 h-10 rounded shadow-md border border-slate-200 dark:border-slate-800"
            style={{ background: "linear-gradient(to bottom, #FFC107 50%, #D32F2F 50%)" }}
            title="Karnataka Flag"
          ></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Namma Karnataka</span>
        </div>
        <PageHero badge="Join SkillVerse" title="Create a profile that reflects science and future potential" description="Students and teachers can join the ecosystem with a polished, role-aware onboarding flow." />
      </div>
      <section className="section-shell max-w-3xl py-8">
        <form onSubmit={handleSubmit} className="glass-card grid gap-5 p-8 md:grid-cols-2">
          {error && (
            <div className="md:col-span-2 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <input required className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <input required className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Email" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Please enter a valid email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input required minLength={6} className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Password (min 6 characters)" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <select className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <input required className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="School name" value={form.schoolName} onChange={(event) => setForm({ ...form, schoolName: event.target.value })} />
          <input required className="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="District" value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })} />
          <input required className="md:col-span-2 rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="State" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} />
          <button type="submit" className="primary-button md:col-span-2">Create account</button>
        </form>
      </section>
    </div>
  );
}
