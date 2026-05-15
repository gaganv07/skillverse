import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

const TYPE_STYLES = {
  project_approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  project_rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300" },
  project_featured: { label: "Featured", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  project_revision: { label: "Revision", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" },
  announcement: { label: "Announcement", color: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300" },
  system: { label: "System", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications?limit=50");
      if (res.data?.success) setNotifications(res.data.notifications);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(n => n.map(x => ({ ...x, read: true })));
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(n => n.filter(x => x._id !== id));
    } catch {}
  };

  const filtered = filter === "all" ? notifications
    : filter === "unread" ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  return (
    <div>
      <PageHero badge="Notifications" title="Stay Updated" description="Track project approvals, feedback, and platform announcements." />
      <section className="section-shell max-w-4xl py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "unread", "project_approved", "project_rejected", "project_featured", "announcement"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"}`}>
                {f === "all" ? "All" : f === "unread" ? `Unread` : (TYPE_STYLES[f]?.label || f)}
              </button>
            ))}
          </div>
          <button onClick={handleMarkAllRead} className="text-xs font-medium text-brand-600 hover:underline">Mark all read</button>
        </div>

        {loading ? (
          <div className="glass-card py-16 text-center text-slate-400">Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card py-16 text-center text-slate-400">No notifications to show</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => {
              const style = TYPE_STYLES[n.type] || TYPE_STYLES.system;
              return (
                <div key={n._id} className={`glass-card flex items-start gap-4 p-4 transition-all ${!n.read ? "ring-1 ring-brand-300/30 dark:ring-brand-500/20" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.color}`}>{style.label}</span>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                      <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{n.title}</p>
                    {n.message && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.message}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {n.actionUrl && (
                      <Link to={n.actionUrl} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800 transition-colors" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                      </Link>
                    )}
                    <button onClick={() => handleDelete(n._id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
