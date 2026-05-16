import { useState, useEffect } from "react";
import { PageHero } from "../components/ui/PageHero";
import { ApprovalStatusBadge } from "../components/ui/ApprovalStatusBadge";
import { formatRelativeTime } from "../lib/workflow";
import { api } from "../lib/api";
import UserManagementPanel from "../components/admin/UserManagementPanel";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [moderationHistory, setModerationHistory] = useState([]);
  const [announcement, setAnnouncement] = useState({
    title: "",
    message: "",
    roles: ["student", "teacher", "admin"],
    type: "admin_announcement"
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (activeTab !== "users") fetchData(activeTab);
  }, [activeTab]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === "analytics") {
        const res = await api.get("/admin/analytics");
        if (res.data?.success) setAnalytics(res.data.analytics);
      } else if (tab === "moderation") {
        const [reportsRes, pendingRes, historyRes] = await Promise.all([
          api.get("/admin/reports"),
          api.get("/projects/review/pending"),
          api.get("/projects/review/history?limit=20")
        ]);
        if (reportsRes.data?.success) setReports(reportsRes.data.reports);
        if (pendingRes.data?.success) setPendingProjects(pendingRes.data.projects);
        if (historyRes.data?.success) setModerationHistory(historyRes.data.actions);
      } else if (tab === "verification") {
        const res = await api.get("/admin/verifications");
        if (res.data?.success) setVerifications(res.data.requests);
      } else if (tab === "logs") {
        const res = await api.get("/admin/logs");
        if (res.data?.success) setLogs(res.data.logs);
      } else if (tab === "announcements") {
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (id, status) => {
    try {
      await api.patch(`/admin/reports/${id}/resolve`, { status, adminNotes: "Resolved from admin dashboard" });
      fetchData("moderation");
    } catch (error) {
      console.error(error);
    }
  };

  const handleProcessVerification = async (id, status) => {
    try {
      await api.patch(`/admin/verifications/${id}/process`, { status, adminNotes: "Processed from admin dashboard" });
      fetchData("verification");
    } catch (error) {
      console.error(error);
    }
  };

  const handleProjectAction = async (projectId, action, reviewComment = "") => {
    const endpointMap = {
      approve: "approve",
      reject: "reject",
      revision: "request-revision",
      feature: "feature",
      remove: "remove"
    };

    try {
      await api.patch(`/projects/${projectId}/${endpointMap[action]}`, { reviewComment });
      showToast(`Project ${action} action completed`);
      fetchData("moderation");
    } catch (error) {
      showToast(error.response?.data?.message || "Project moderation failed", "error");
    }
  };

  const handleSendAnnouncement = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post("/admin/announcements", announcement);
      showToast(`Announcement sent to ${res.data?.count || 0} users`);
      setAnnouncement({
        title: "",
        message: "",
        roles: ["student", "teacher", "admin"],
        type: "admin_announcement"
      });
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send announcement", "error");
    }
  };

  const tabs = [
    { id: "analytics", label: "Analytics" },
    { id: "users", label: "User Management" },
    { id: "moderation", label: "Project Workflow" },
    { id: "verification", label: "Verification" },
    { id: "announcements", label: "Announcements" },
    { id: "logs", label: "Activity Logs" }
  ];

  return (
    <div>
      <PageHero
        badge="Operational Command Center"
        title="Admin Dashboard"
        description="Override approvals, feature standout projects, remove inappropriate content, send announcements, and monitor workflow history."
      />

      {toast && (
        <div className={`fixed right-6 top-24 z-[200] max-w-sm rounded-2xl border px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-xl ${
          toast.type === "error"
            ? "border-red-200/60 bg-red-50/90 text-red-700 dark:border-red-500/20 dark:bg-red-900/80 dark:text-red-200"
            : "border-emerald-200/60 bg-emerald-50/90 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-900/80 dark:text-emerald-200"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-8">
        <div className="mb-4 flex gap-2 overflow-x-auto border-b border-slate-200 pb-3 dark:border-slate-800 sm:mb-8 sm:pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap transition-all sm:px-4 sm:py-2.5 sm:text-sm ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "users" ? (
          <UserManagementPanel />
        ) : loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Loading {activeTab} data...
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "analytics" && analytics && (
              <>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5 sm:gap-6">
                  {[
                    { label: "Total Students", value: analytics.overview.totalStudents, color: "border-emerald-500" },
                    { label: "Total Schools", value: analytics.overview.totalSchools, color: "border-blue-500" },
                    { label: "Total Projects", value: analytics.overview.totalProjects, color: "border-purple-500" },
                    { label: "Competitions", value: analytics.overview.totalCompetitions, color: "border-amber-500" },
                    { label: "Verified Users", value: analytics.overview.verifiedUsers, color: "border-brand-500" }
                  ].map((stat) => (
                    <div key={stat.label} className={`glass-card border-t-4 p-4 sm:p-6 ${stat.color}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">{stat.label}</p>
                      <p className="mt-1 font-display text-2xl font-bold sm:mt-2 sm:text-4xl">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="glass-card p-4 sm:p-6">
                  <h3 className="mb-4 font-display text-lg font-bold sm:text-xl">Top project categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {analytics.categories?.map((category) => (
                      <div key={category._id} className="flex min-w-[180px] items-center justify-between rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                        <span className="font-medium capitalize">{category._id}</span>
                        <span className="badge">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "moderation" && (
              <>
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="glass-card p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Pending project approvals</h3>
                        <p className="mt-1 text-sm text-slate-500">Admin overrides, featuring, and moderation actions for the public feed.</p>
                      </div>
                      <span className="badge">{pendingProjects.length} waiting</span>
                    </div>

                    <div className="mt-5 space-y-4">
                      {pendingProjects.length === 0 ? (
                        <div className="py-10 text-center text-slate-400">No pending projects right now.</div>
                      ) : pendingProjects.map((project) => (
                        <div key={project._id} className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700/70 dark:bg-slate-900/60">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-slate-900 dark:text-white">{project.title}</p>
                                <ApprovalStatusBadge status={project.status} compact />
                              </div>
                              <p className="mt-1 text-sm text-slate-500">{project.student?.fullName} · {project.schoolName || project.student?.schoolName} · {project.category}</p>
                              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 lg:w-[250px]">
                              <button onClick={() => handleProjectAction(project._id, "approve")} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600">Approve</button>
                              <button onClick={() => handleProjectAction(project._id, "feature")} className="rounded-xl bg-gradient-to-r from-purple-500 to-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90">Feature</button>
                              <button onClick={() => handleProjectAction(project._id, "revision", "Please address the review issues and resubmit.")} className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600">Revision</button>
                              <button onClick={() => handleProjectAction(project._id, "reject", "This submission does not meet approval requirements yet.")} className="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600">Reject</button>
                              <button onClick={() => handleProjectAction(project._id, "remove", "Removed by admin moderation.")} className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600">Remove</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-5 sm:p-6">
                    <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Moderation history</h3>
                    <p className="mt-1 text-sm text-slate-500">Recent approval overrides, feature decisions, and workflow actions.</p>
                    <div className="mt-5 space-y-3">
                      {moderationHistory.length === 0 ? (
                        <div className="py-10 text-center text-slate-400">No workflow history yet.</div>
                      ) : moderationHistory.map((entry) => (
                        <div key={entry._id} className="rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-900/60">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-slate-900 dark:text-white">{entry.project?.title}</p>
                            <ApprovalStatusBadge status={entry.toStatus} compact />
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{entry.actor?.fullName} · {entry.actorRole} · {formatRelativeTime(entry.createdAt)}</p>
                          {entry.comment && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.comment}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="border-b border-slate-200/50 px-5 py-4 dark:border-slate-700/50">
                    <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Abuse and moderation reports</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                      <thead className="border-b border-slate-200/50 bg-slate-50/80 dark:border-slate-700/50 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Target</th>
                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Reason</th>
                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {reports.length === 0 ? (
                          <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No reports to review</td></tr>
                        ) : reports.map((report) => (
                          <tr key={report._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4 font-medium capitalize">{report.targetType}</td>
                            <td className="px-6 py-4">
                              <div className="font-medium capitalize text-red-600">{report.reason}</div>
                              <div className="max-w-xs truncate text-slate-500">{report.description}</div>
                            </td>
                            <td className="px-6 py-4 capitalize">
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${report.status === "resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{report.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {report.status === "pending" && (
                                <div className="flex justify-end gap-3">
                                  <button onClick={() => handleResolveReport(report._id, "resolved")} className="text-sm font-medium text-green-600 hover:underline">Resolve</button>
                                  <button onClick={() => handleResolveReport(report._id, "dismissed")} className="text-sm font-medium text-slate-500 hover:underline">Dismiss</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === "verification" && (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-left text-sm">
                    <thead className="border-b border-slate-200/50 bg-slate-50/80 dark:border-slate-700/50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Requested By</th>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Target Type</th>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Status</th>
                        <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {verifications.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No verification requests</td></tr>
                      ) : verifications.map((verification) => (
                        <tr key={verification._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-4 py-4 font-medium sm:px-6">{verification.requestedBy?.fullName}</td>
                          <td className="px-4 py-4 capitalize sm:px-6">{verification.targetType}</td>
                          <td className="px-4 py-4 capitalize sm:px-6">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              verification.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : verification.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}>{verification.status}</span>
                          </td>
                          <td className="px-4 py-4 text-right sm:px-6">
                            {verification.status === "pending" && (
                              <div className="flex justify-end gap-3">
                                <button onClick={() => handleProcessVerification(verification._id, "approved")} className="text-sm font-medium text-green-600 hover:underline">Approve</button>
                                <button onClick={() => handleProcessVerification(verification._id, "rejected")} className="text-sm font-medium text-red-600 hover:underline">Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "announcements" && (
              <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <form onSubmit={handleSendAnnouncement} className="glass-card p-5 sm:p-6">
                  <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Broadcast notification</h3>
                  <p className="mt-1 text-sm text-slate-500">Send admin or competition announcements directly into the notification center.</p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Title</label>
                      <input value={announcement.title} onChange={(event) => setAnnouncement((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" required />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Message</label>
                      <textarea value={announcement.message} onChange={(event) => setAnnouncement((current) => ({ ...current, message: event.target.value }))} rows="5" className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" required />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Notification type</label>
                      <select value={announcement.type} onChange={(event) => setAnnouncement((current) => ({ ...current, type: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70">
                        <option value="admin_announcement">Admin announcement</option>
                        <option value="competition_announcement">Competition announcement</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Recipients</label>
                      <div className="flex flex-wrap gap-2">
                        {["student", "teacher", "admin"].map((role) => {
                          const selected = announcement.roles.includes(role);
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setAnnouncement((current) => ({
                                ...current,
                                roles: selected ? current.roles.filter((item) => item !== role) : [...current.roles, role]
                              }))}
                              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {role}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <button type="submit" className="primary-button w-full py-3 text-sm">Send notification</button>
                  </div>
                </form>

                <div className="glass-card p-5 sm:p-6">
                  <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Recommended uses</h3>
                  <div className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
                      <p className="font-semibold text-slate-900 dark:text-white">Project workflow notices</p>
                      <p className="mt-1">Use project moderation actions for approvals, rejections, featuring, and revision requests so students get direct clickable updates.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
                      <p className="font-semibold text-slate-900 dark:text-white">Competition announcements</p>
                      <p className="mt-1">Use the competition type for registration reminders, deadline changes, and publishing event results.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
                      <p className="font-semibold text-slate-900 dark:text-white">Admin announcements</p>
                      <p className="mt-1">Use platform-wide announcements for maintenance windows, policy updates, and school ecosystem notices.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-left text-sm">
                    <thead className="border-b border-slate-200/50 bg-slate-50/80 dark:border-slate-700/50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Timestamp</th>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Admin</th>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Action</th>
                        <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {logs.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No activity logs yet</td></tr>
                      ) : logs.map((log) => (
                        <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-4 py-4 text-xs text-slate-500 sm:px-6">{new Date(log.createdAt).toLocaleString()}</td>
                          <td className="px-4 py-4 font-medium sm:px-6">{log.admin?.fullName}</td>
                          <td className="px-4 py-4 font-mono text-xs sm:px-6">{log.action}</td>
                          <td className="px-4 py-4 capitalize text-slate-500 sm:px-6">{log.targetModel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
