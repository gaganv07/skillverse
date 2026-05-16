export const PROJECT_CATEGORIES = [
  { value: "science", label: "Science" },
  { value: "technology", label: "Technology" },
  { value: "agriculture", label: "Agriculture" },
  { value: "robotics", label: "Robotics" },
  { value: "environment", label: "Environment" },
  { value: "engineering", label: "Engineering" },
  { value: "ai-coding", label: "AI & Coding" },
  { value: "research", label: "Research" },
  { value: "sustainability", label: "Sustainability" },
  { value: "innovation", label: "Innovation" }
];

export const PROJECT_STATUS_META = {
  pending: {
    label: "Pending Review",
    shortLabel: "Pending",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500"
  },
  approved: {
    label: "Approved",
    shortLabel: "Approved",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    dot: "bg-emerald-500"
  },
  rejected: {
    label: "Rejected",
    shortLabel: "Rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    dot: "bg-red-500"
  },
  featured: {
    label: "Featured",
    shortLabel: "Featured",
    color: "bg-gradient-to-r from-purple-100 to-amber-100 text-purple-700 dark:from-purple-500/15 dark:to-amber-500/15 dark:text-amber-200",
    dot: "bg-amber-400"
  },
  revision: {
    label: "Revision Requested",
    shortLabel: "Revision",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    dot: "bg-blue-500"
  },
  disabled: {
    label: "Removed",
    shortLabel: "Removed",
    color: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-500"
  },
  draft: {
    label: "Draft",
    shortLabel: "Draft",
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    dot: "bg-slate-400"
  }
};

export const NOTIFICATION_META = {
  project_approved: {
    label: "Project Approved",
    category: "workflow",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  },
  project_rejected: {
    label: "Project Rejected",
    category: "workflow",
    color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    iconColor: "text-red-500",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
  },
  project_featured: {
    label: "Project Featured",
    category: "workflow",
    color: "bg-gradient-to-r from-purple-100 to-amber-100 text-purple-700 dark:from-purple-500/15 dark:to-amber-500/15 dark:text-amber-200",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  },
  project_revision: {
    label: "Revision Requested",
    category: "feedback",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
  },
  teacher_feedback: {
    label: "Teacher Feedback",
    category: "feedback",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    iconColor: "text-sky-500",
    iconBg: "bg-sky-100 dark:bg-sky-900/30",
    icon: "M7 8h10M7 12h6m-8 8l3.586-3.586A2 2 0 0110 15h7a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2h1v3z"
  },
  competition_announcement: {
    label: "Competition",
    category: "competition",
    color: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
    iconColor: "text-fuchsia-500",
    iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
    icon: "M11 17a1 1 0 102 0v-5a1 1 0 10-2 0v5zm1-12a9 9 0 100 18 9 9 0 000-18z"
  },
  admin_announcement: {
    label: "Announcement",
    category: "announcement",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
  },
  announcement: {
    label: "Announcement",
    category: "announcement",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
  },
  system: {
    label: "System",
    category: "system",
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    iconColor: "text-slate-500",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  }
};

export function getProjectStatusMeta(status) {
  return PROJECT_STATUS_META[status] || PROJECT_STATUS_META.draft;
}

export function getNotificationMeta(type) {
  return NOTIFICATION_META[type] || NOTIFICATION_META.system;
}

export function formatRelativeTime(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}
