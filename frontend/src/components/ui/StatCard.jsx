export function StatCard({ value, label }) {
  return (
    <div className="glass-card p-6">
      <p className="font-display text-3xl font-bold text-brand-700 dark:text-brand-200">{value}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}
