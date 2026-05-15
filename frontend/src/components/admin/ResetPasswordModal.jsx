import { useState } from "react";

export default function ResetPasswordModal({ isOpen, onClose, onSubmit, user, loading }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || password.length < 6) { setError("Password must be at least 6 characters"); return; }
    onSubmit(user._id, password);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm glass-card p-0 overflow-hidden" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
          <h2 className="font-display text-lg font-bold">Reset Password</h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Set a new password for <strong className="text-slate-800 dark:text-white">{user.fullName}</strong></p>
          {error && <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-500/20 px-4 py-2.5 text-sm text-red-700 dark:text-red-300">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">New Password</label>
            <input type="password" className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" value={password} onChange={e=>{setPassword(e.target.value);setError("");}} placeholder="Min 6 characters" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="secondary-button px-5 py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="primary-button px-5 py-2.5 text-sm disabled:opacity-50">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
