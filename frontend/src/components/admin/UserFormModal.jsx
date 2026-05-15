import { useState, useEffect } from "react";

const DISTRICTS = ["Bangalore Urban","Bangalore Rural","Mysore","Mangalore","Hubli-Dharwad","Belgaum","Gulbarga","Bellary","Shimoga","Tumkur","Davangere","Raichur","Hassan","Udupi","Mandya","Kodagu","Chikmagalur","Other"];
const STATES = ["Karnataka","Andhra Pradesh","Tamil Nadu","Maharashtra","Goa","Kerala","Telangana","Other"];

const emptyForm = { fullName:"", email:"", password:"", role:"student", schoolName:"", district:"", state:"Karnataka" };

export default function UserFormModal({ isOpen, onClose, onSubmit, editUser, loading }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const isEdit = !!editUser;

  useEffect(() => {
    if (editUser) {
      setForm({ fullName: editUser.fullName||"", email: editUser.email||"", password:"", role: editUser.role||"student", schoolName: editUser.schoolName||"", district: editUser.district||"", state: editUser.state||"Karnataka" });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.fullName.trim()) return setError("Name is required");
    if (!form.email.trim()) return setError("Email is required");
    if (!isEdit && (!form.password || form.password.length < 6)) return setError("Password must be at least 6 characters");
    onSubmit(form);
  };

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setError(""); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg glass-card p-0 overflow-hidden" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
          <h2 className="font-display text-lg font-bold">{isEdit ? "Edit User" : "Create New User"}</h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-500/20 px-4 py-2.5 text-sm text-red-700 dark:text-red-300">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name *</label>
              <input className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" value={form.fullName} onChange={e=>set("fullName",e.target.value)} placeholder="Enter full name" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email *</label>
              <input type="email" className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="user@example.com" />
            </div>
            {!isEdit && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Password *</label>
                <input type="password" className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Min 6 characters" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Role *</label>
              <select className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none" value={form.role} onChange={e=>set("role",e.target.value)} disabled={isEdit && editUser?.role==="admin"}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">School / Institution</label>
              <input className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" value={form.schoolName} onChange={e=>set("schoolName",e.target.value)} placeholder="School name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">District</label>
              <select className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none" value={form.district} onChange={e=>set("district",e.target.value)}>
                <option value="">Select district</option>
                {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">State</label>
              <select className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none" value={form.state} onChange={e=>set("state",e.target.value)}>
                {STATES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="secondary-button px-5 py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="primary-button px-5 py-2.5 text-sm disabled:opacity-50">
              {loading ? <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</span> : isEdit ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
