import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

const TYPE_ICONS = {
  project_approved: { color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  project_rejected: { color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
  project_featured: { color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  project_revision: { color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  announcement: { color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
  system: { color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
};

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Poll unread count every 30s
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      if (res.data?.success) setUnreadCount(res.data.unreadCount);
    } catch {}
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications?limit=10");
      if (res.data?.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(n => n.map(x => ({ ...x, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(n => n.map(x => x._id === id ? { ...x, read: true } : x));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleOpen} className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors" title="Notifications">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 sm:absolute sm:inset-auto sm:right-0 sm:top-12 z-[80] sm:w-[360px] sm:max-h-[480px] overflow-hidden sm:rounded-2xl border-0 sm:border border-slate-200/60 bg-white/98 sm:bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/98 sm:dark:bg-slate-900/95">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-3 pt-14 sm:pt-3">
            <h3 className="font-display text-sm font-bold">Notifications</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs font-medium text-brand-600 hover:underline">Mark all read</button>
              )}
              <button onClick={() => setOpen(false)} className="sm:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          <div className="max-h-[calc(100vh-140px)] sm:max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">No notifications yet</div>
            ) : notifications.map(n => {
              const typeStyle = TYPE_ICONS[n.type] || TYPE_ICONS.system;
              return (
                <div key={n._id} className={`flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${!n.read ? "bg-brand-50/30 dark:bg-brand-900/10" : ""}`}>
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${typeStyle.bg}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${typeStyle.color}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={typeStyle.icon} />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                      {n.title}
                    </p>
                    {n.message && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</p>}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{timeAgo(n.createdAt)}</span>
                      {!n.read && (
                        <button onClick={() => handleMarkRead(n._id)} className="text-[10px] font-medium text-brand-600 hover:underline">Mark read</button>
                      )}
                    </div>
                  </div>
                  {n.actionUrl && (
                    <Link to={n.actionUrl} onClick={() => { handleMarkRead(n._id); setOpen(false); }} className="mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <Link to="/notifications" onClick={() => setOpen(false)} className="block border-t border-slate-200/50 dark:border-slate-700/50 px-4 py-2.5 text-center text-xs font-medium text-brand-600 hover:bg-slate-50 dark:hover:bg-slate-800/40">
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
}
