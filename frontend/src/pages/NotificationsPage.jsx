import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";
import { formatRelativeTime, getNotificationMeta } from "../lib/workflow";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "workflow", label: "Workflow" },
  { value: "feedback", label: "Feedback" },
  { value: "competition", label: "Competitions" },
  { value: "announcement", label: "Announcements" }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications(filter);
  }, [filter]);

  const fetchNotifications = async (activeFilter) => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (activeFilter === "unread") {
        params.unreadOnly = true;
      } else if (activeFilter !== "all") {
        params.category = activeFilter;
      }
      const res = await api.get("/notifications", { params });
      if (res.data?.success) setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    } catch {}
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((items) => items.map((item) => item._id === id ? { ...item, read: true } : item));
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((items) => items.filter((item) => item._id !== id));
    } catch {}
  };

  return (
    <div>
      <PageHero badge="Notifications" title="Stay Updated" description="Project approvals, teacher feedback, competition updates, and platform announcements in one place." />
      <section className="section-shell max-w-5xl py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((entry) => (
              <button
                key={entry.value}
                onClick={() => setFilter(entry.value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === entry.value
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <button onClick={handleMarkAllRead} className="text-xs font-medium text-brand-600 hover:underline">Mark all read</button>
        </div>

        {loading ? (
          <div className="glass-card py-16 text-center text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="glass-card py-16 text-center text-slate-400">No notifications to show</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const meta = getNotificationMeta(notification.type);
              return (
                <div
                  key={notification._id}
                  className={`glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-start ${
                    notification.read ? "" : "ring-1 ring-brand-300/30 dark:ring-brand-500/20"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.iconBg}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${meta.iconColor}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={meta.icon} />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.color}`}>{meta.label}</span>
                      {!notification.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                      <span className="text-[11px] text-slate-400">{formatRelativeTime(notification.createdAt)}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</p>
                    {notification.message && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{notification.message}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          onClick={() => handleMarkRead(notification._id)}
                          className="text-xs font-semibold text-brand-600 hover:underline"
                        >
                          {notification.actionLabel || "Open"}
                        </Link>
                      )}
                      {!notification.read && (
                        <button onClick={() => handleMarkRead(notification._id)} className="text-xs font-medium text-slate-500 hover:text-brand-600">
                          Mark as read
                        </button>
                      )}
                      <button onClick={() => handleDelete(notification._id)} className="text-xs font-medium text-slate-500 hover:text-red-600">
                        Delete
                      </button>
                    </div>
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
