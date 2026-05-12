import { useState, useEffect } from "react";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === "analytics") {
        const res = await api.get("/admin/analytics");
        if (res.data?.success) setAnalytics(res.data.analytics);
      } else if (tab === "users") {
        const res = await api.get("/users");
        if (res.data?.success) setUsers(res.data.users);
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
      fetchData("users");
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

  return (
    <div>
      <PageHero
        badge="Enterprise Command Center"
        title="Admin Analytics & Moderation System"
        description="Oversee platform health, moderate content, process verifications, and audit activity logs."
      />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          {["analytics", "moderation", "verification", "users", "logs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${activeTab === tab ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading {activeTab} data...</div>
        ) : (
          <div className="space-y-6">
            {activeTab === "analytics" && analytics && (
              <>
                <div className="grid gap-6 md:grid-cols-4">
                  {[
                    { label: "Total Students", value: analytics.overview.totalStudents },
                    { label: "Total Schools", value: analytics.overview.totalSchools },
                    { label: "Total Projects", value: analytics.overview.totalProjects },
                    { label: "Competitions", value: analytics.overview.totalCompetitions },
                    { label: "Verified Users", value: analytics.overview.verifiedUsers }
                  ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 border-t-4 border-brand-500">
                      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
                      <p className="mt-2 font-display text-4xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
                
                <div className="glass-card p-6 mt-8">
                  <h3 className="font-display text-xl font-bold mb-6">Trending Technologies & Categories</h3>
                  <div className="flex flex-wrap gap-4">
                    {analytics.categories?.map((cat, i) => (
                      <div key={i} className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-xl flex items-center justify-between min-w-[200px]">
                        <span className="font-medium capitalize">{cat._id}</span>
                        <span className="badge">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <div className="glass-card overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {users.map(u => (
                      <tr key={u._id}>
                        <td className="px-6 py-4">
                          <div className="font-medium">{u.fullName}</div>
                          <div className="text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 capitalize"><span className="badge">{u.role}</span></td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {u.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleModerateUser(u._id, u.isActive)} className="text-sm font-medium text-brand-600 hover:underline">
                            {u.isActive ? 'Disable' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "moderation" && (
              <div className="glass-card overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">Target</th>
                      <th className="px-6 py-4 font-medium">Reason</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {reports.map(r => (
                      <tr key={r._id}>
                        <td className="px-6 py-4 capitalize font-medium">{r.targetType}</td>
                        <td className="px-6 py-4">
                          <div className="capitalize text-red-600 font-medium">{r.reason}</div>
                          <div className="text-slate-500 truncate max-w-xs">{r.description}</div>
                        </td>
                        <td className="px-6 py-4 capitalize">
                           <span className={`badge ${r.status === 'resolved' ? 'bg-green-100' : 'bg-amber-100'}`}>{r.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                          {r.status === "pending" && (
                            <>
                              <button onClick={() => handleResolveReport(r._id, "resolved")} className="text-green-600 font-medium hover:underline">Resolve</button>
                              <button onClick={() => handleResolveReport(r._id, "dismissed")} className="text-slate-500 font-medium hover:underline">Dismiss</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "verification" && (
              <div className="glass-card overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">Requested By</th>
                      <th className="px-6 py-4 font-medium">Target Type</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {verifications.map(v => (
                      <tr key={v._id}>
                        <td className="px-6 py-4 font-medium">{v.requestedBy?.fullName}</td>
                        <td className="px-6 py-4 capitalize">{v.targetType}</td>
                        <td className="px-6 py-4 capitalize">
                          <span className={`badge ${v.status === 'approved' ? 'bg-green-100' : v.status === 'rejected' ? 'bg-red-100' : 'bg-amber-100'}`}>{v.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                          {v.status === "pending" && (
                            <>
                              <button onClick={() => handleProcessVerification(v._id, "approved")} className="text-green-600 font-medium hover:underline">Approve</button>
                              <button onClick={() => handleProcessVerification(v._id, "rejected")} className="text-red-600 font-medium hover:underline">Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="glass-card overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">Timestamp</th>
                      <th className="px-6 py-4 font-medium">Admin</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                      <th className="px-6 py-4 font-medium">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {logs.map(log => (
                      <tr key={log._id}>
                        <td className="px-6 py-4 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium">{log.admin?.fullName}</td>
                        <td className="px-6 py-4 font-mono text-xs">{log.action}</td>
                        <td className="px-6 py-4 capitalize text-slate-500">{log.targetModel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
