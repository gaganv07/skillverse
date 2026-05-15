import { useState, useEffect } from "react";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";
import UserManagementPanel from "../components/admin/UserManagementPanel";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (activeTab !== "users") fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === "analytics") {
        const res = await api.get("/admin/analytics");
        if (res.data?.success) setAnalytics(res.data.analytics);
      } else if (tab === "moderation") {
        const res = await api.get("/admin/reports");
        if (res.data?.success) setReports(res.data.reports);
      } else if (tab === "verification") {
        const res = await api.get("/admin/verifications");
        if (res.data?.success) setVerifications(res.data.requests);
      } else if (tab === "logs") {
        const res = await api.get("/admin/logs");
        if (res.data?.success) setLogs(res.data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateUser = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/moderate`, { isActive: !isActive });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (id, status) => {
    try {
      await api.patch(`/admin/reports/${id}/resolve`, { status, adminNotes: "Resolved from dashboard" });
      fetchData("moderation");
    } catch (err) {
      console.error(err);
    }
  };

  const handleProcessVerification = async (id, status) => {
    try {
      await api.patch(`/admin/verifications/${id}/process`, { status, adminNotes: "Processed from dashboard" });
      fetchData("verification");
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: "analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { id: "users", label: "User Management", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "moderation", label: "Moderation", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" },
    { id: "verification", label: "Verification", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "logs", label: "Activity Logs", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }
  ];

  return (
    <div>
      <PageHero
        badge="Enterprise Command Center"
        title="Admin Dashboard"
        description="Manage users, moderate content, process verifications, and monitor platform activity."
      />

      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 sm:mb-8 border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4 overflow-x-auto -mx-1 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d={tab.icon}/></svg>
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "users" ? (
          <UserManagementPanel />
        ) : loading ? (
          <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Loading {activeTab} data...
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "analytics" && analytics && (
              <>
                <div className="grid gap-3 sm:gap-6 grid-cols-2 md:grid-cols-4">
                  {[
                    { label: "Total Students", value: analytics.overview.totalStudents, color: "border-emerald-500" },
                    { label: "Total Schools", value: analytics.overview.totalSchools, color: "border-blue-500" },
                    { label: "Total Projects", value: analytics.overview.totalProjects, color: "border-purple-500" },
                    { label: "Competitions", value: analytics.overview.totalCompetitions, color: "border-amber-500" },
                    { label: "Verified Users", value: analytics.overview.verifiedUsers, color: "border-brand-500" }
                  ].map((stat, i) => (
                    <div key={i} className={`glass-card p-4 sm:p-6 border-t-4 ${stat.color}`}>
                      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
                      <p className="mt-1 sm:mt-2 font-display text-2xl sm:text-4xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="glass-card p-4 sm:p-6 mt-4 sm:mt-8">
                  <h3 className="font-display text-lg sm:text-xl font-bold mb-4 sm:mb-6">Trending Technologies & Categories</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    {analytics.categories?.map((cat, i) => (
                      <div key={i} className="bg-slate-100 dark:bg-slate-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl flex items-center justify-between min-w-[140px] sm:min-w-[200px]">
                        <span className="font-medium capitalize">{cat._id}</span>
                        <span className="badge">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "moderation" && (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Target</th>
                      <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {reports.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No reports to review</td></tr>
                    ) : reports.map(r => (
                      <tr key={r._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4 capitalize font-medium">{r.targetType}</td>
                        <td className="px-6 py-4">
                          <div className="capitalize text-red-600 font-medium">{r.reason}</div>
                          <div className="text-slate-500 truncate max-w-xs">{r.description}</div>
                        </td>
                        <td className="px-6 py-4 capitalize">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === "resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                          {r.status === "pending" && (
                            <>
                              <button onClick={() => handleResolveReport(r._id, "resolved")} className="text-green-600 font-medium hover:underline text-sm">Resolve</button>
                              <button onClick={() => handleResolveReport(r._id, "dismissed")} className="text-slate-500 font-medium hover:underline text-sm">Dismiss</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}

            {activeTab === "verification" && (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Requested By</th>
                      <th className="px-4 sm:px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Target Type</th>
                      <th className="px-4 sm:px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {verifications.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No verification requests</td></tr>
                    ) : verifications.map(v => (
                      <tr key={v._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 sm:px-6 py-4 font-medium">{v.requestedBy?.fullName}</td>
                        <td className="px-4 sm:px-6 py-4 capitalize">{v.targetType}</td>
                        <td className="px-4 sm:px-6 py-4 capitalize">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${v.status === "approved" ? "bg-green-100 text-green-700" : v.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{v.status}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right flex justify-end gap-3">
                          {v.status === "pending" && (
                            <>
                              <button onClick={() => handleProcessVerification(v._id, "approved")} className="text-green-600 font-medium hover:underline text-sm">Approve</button>
                              <button onClick={() => handleProcessVerification(v._id, "rejected")} className="text-red-600 font-medium hover:underline text-sm">Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Timestamp</th>
                      <th className="px-4 sm:px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Admin</th>
                      <th className="px-4 sm:px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Action</th>
                      <th className="px-4 sm:px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {logs.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No activity logs yet</td></tr>
                    ) : logs.map(log => (
                      <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 sm:px-6 py-4 text-slate-500 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="px-4 sm:px-6 py-4 font-medium">{log.admin?.fullName}</td>
                        <td className="px-4 sm:px-6 py-4 font-mono text-xs">{log.action}</td>
                        <td className="px-4 sm:px-6 py-4 capitalize text-slate-500">{log.targetModel}</td>
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
