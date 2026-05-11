import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { useAuth } from "../providers/AuthProvider";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(form);
    navigate("/feed");
  };

  return (
    <div>
      <div className="flex justify-center pt-12 pb-4">
        <img src="/logo.jpg" alt="SkillVerse Logo" className="w-24 h-24 object-cover rounded-2xl shadow-xl border-4 border-white dark:border-slate-800" />
      </div>
      <PageHero badge="Authentication" title="Login to SkillVerse" description="Students, teachers, and admins can securely access their dashboards and portfolios." />
      <section className="section-shell max-w-2xl py-8">
        <form onSubmit={handleSubmit} className="glass-card space-y-5 p-8">
          <input className="w-full rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className="w-full rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <button className="primary-button w-full">Login</button>
        </form>
      </section>
    </div>
  );
}
