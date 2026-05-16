import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { formatRelativeTime, getNotificationMeta } from "../../lib/workflow";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
      const res = await api.get("/notifications?limit=8");
      if (res.data?.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((items) => items.map((item) => ({ ...item, read: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch {}
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((items) => items.map((item) => item._id === id ? { ...item, read: true } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleOpen} className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" title="Notifications">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] overflow-hidden sm:absolute sm:right-0 sm:top-12 sm:inset-auto sm:w-[380px] sm:rounded-3xl sm:border sm:border-slate-200/60 sm:bg-white/95 sm:shadow-2xl sm:backdrop-blur-xl dark:sm:border-slate-700/60 dark:sm:bg-slate-900/95">
          <div className="h-full bg-white/98 dark:bg-slate-900/98 sm:h-auto sm:bg-transparent sm:dark:bg-transparent">
            <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3 pt-14 dark:border-slate-700/60 sm:pt-3">
              <div>
                <h3 className="font-display text-sm font-bold">Notifications</h3>
                <p className="mt-0.5 text-xs text-slate-500">{unreadCount} unread</p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs font-medium text-brand-600 hover:underline">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-140px)] overflow-y-auto px-3 py-3 sm:max-h-[420px]">
              {loading ? (
                <div className="py-8 text-center text-sm text-slate-400">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">No notifications yet</div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => {
                    const meta = getNotificationMeta(notification.type);
                    return (
                      <div
                        key={notification._id}
                        className={`rounded-2xl border px-3 py-3 transition ${
                          notification.read
                            ? "border-slate-200/60 bg-white/80 dark:border-slate-700/60 dark:bg-slate-900/60"
                            : "border-brand-200/80 bg-brand-50/70 shadow-sm dark:border-brand-500/20 dark:bg-brand-900/15"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.iconBg}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 ${meta.iconColor}`}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={meta.icon} />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.color}`}>{meta.label}</span>
                              {!notification.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                            </div>
                            <p className={`mt-2 text-sm ${notification.read ? "text-slate-700 dark:text-slate-200" : "font-semibold text-slate-900 dark:text-white"}`}>
                              {notification.title}
                            </p>
                            {notification.message && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{notification.message}</p>}
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                              <span className="text-[11px] text-slate-400">{formatRelativeTime(notification.createdAt)}</span>
                              {!notification.read && (
                                <button onClick={() => handleMarkRead(notification._id)} className="text-[11px] font-medium text-brand-600 hover:underline">
                                  Mark read
                                </button>
                              )}
                              {notification.actionUrl && (
                                <Link
                                  to={notification.actionUrl}
                                  onClick={() => {
                                    handleMarkRead(notification._id);
                                    setOpen(false);
                                  }}
                                  className="text-[11px] font-medium text-brand-600 hover:underline"
                                >
                                  {notification.actionLabel || "Open"}
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Link to="/notifications" onClick={() => setOpen(false)} className="block border-t border-slate-200/60 px-4 py-3 text-center text-xs font-medium text-brand-600 hover:bg-slate-50 dark:border-slate-700/60 dark:hover:bg-slate-800/40">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
