import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  featured: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  revision: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
};

export default function TeacherDashboardPage() {
  const { user: teacher } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [students, setStudents] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewAction, setReviewAction] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => { fetchData(); }, [teacher]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersRes = await api.get("/users");
      if (usersRes.data.success) {
        const schoolStudents = usersRes.data.users.filter(u =>
          u.role === "student" && u.schoolName === teacher?.schoolName
        );
        setStudents(schoolStudents);
      }
      const projectsRes = await api.get("/projects/review/pending");
      if (projectsRes.data.success) {
        const schoolProjects = projectsRes.data.projects.filter(p =>
          p.schoolName === teacher?.schoolName || p.student?.schoolName === teacher?.schoolName
        );
        setPendingProjects(schoolProjects);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStudent = async (id) => {
    try {
      const res = await api.patch(`/users/${id}/verify`);
      if (res.data.success) {
        setStudents(students.map(s => s._id === id ? { ...s, isVerified: res.data.user.isVerified } : s));
      }
    } catch (err) { console.error(err); }
  };

  const openReviewModal = (project, action) => {
    setReviewModal(project);
    setReviewAction(action);
    setReviewComment("");
  };

  const handleReview = async () => {
    if (!reviewModal || !reviewAction) return;
    setActionLoading(true);
    try {
      const res = await api.patch(`/projects/${reviewModal._id}/review`, {
        status: reviewAction,
        reviewComment
      });
      if (res.data?.success) {
        showToast(res.data.message);
        setPendingProjects(p => p.filter(x => x._id !== reviewModal._id));
        setReviewModal(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Review failed", "error");
    } finally { setActionLoading(false); }
  };

  const tabs = [
    { id: "pending", label: "Pending Review", count: pendingProjects.length, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "students", label: "My Students", count: students.length, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" }
  ];

  return (
    <div>
      <PageHero
        badge="Teacher Dashboard"
        title="Review, Approve & Mentor"
        description={`Manage student projects from ${teacher?.schoolName || "your school"}.`}
      />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-6 z-[200] max-w-sm rounded-2xl border px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-xl ${toast.type === "error" ? "border-red-200/60 bg-red-50/90 text-red-700 dark:border-red-500/20 dark:bg-red-900/80 dark:text-red-200" : "border-emerald-200/60 bg-emerald-50/90 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-900/80 dark:text-emerald-200"}`}>
          {toast.msg}
        </div>
      )}

      <section className="section-shell py-8">
        {/* Tabs */}
        <div className="flex gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === tab.id ? "bg-brand-600 text-white shadow-md shadow-brand-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} /></svg>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="glass-card py-16 text-center text-slate-400">Loading...</div>
        ) : (
          <>
            {activeTab === "pending" && (
              <div className="space-y-4">
                {pendingProjects.length === 0 ? (
                  <div className="glass-card py-16 text-center text-slate-400">No pending projects to review</div>
                ) : pendingProjects.map(project => (
                  <div key={project._id} className="glass-card p-5 flex flex-col md:flex-row md:items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-full md:w-28 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                      {project.media?.images?.[0] ? (
                        <img src={project.media.images[0]} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/projects/${project._id}`} className="font-semibold text-slate-900 dark:text-white hover:text-brand-600">{project.title}</Link>
                      <p className="text-xs text-slate-500 mt-0.5">{project.student?.fullName} • {project.student?.schoolName} • {project.category}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openReviewModal(project, "approved")} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Approve
                      </button>
                      <button onClick={() => openReviewModal(project, "revision")} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-md">
                        Revision
                      </button>
                      <button onClick={() => openReviewModal(project, "rejected")} className="inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors shadow-md">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "students" && (
              <div className="glass-card overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {students.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No students found for your school.</td></tr>
                    ) : students.map(s => (
                      <tr key={s._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{s.fullName}</td>
                        <td className="px-6 py-4 text-slate-500">{s.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.isVerified ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.isVerified ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {s.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleVerifyStudent(s._id)} className="text-brand-600 hover:underline font-medium text-sm">
                            {s.isVerified ? "Revoke" : "Verify"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReviewModal(null)} />
          <div className="relative w-full max-w-md glass-card p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
              <h2 className="font-display text-lg font-bold">
                {reviewAction === "approved" ? "Approve Project" : reviewAction === "revision" ? "Request Revision" : "Reject Project"}
              </h2>
              <button onClick={() => setReviewModal(null)} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                <p className="font-medium text-sm">{reviewModal.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">by {reviewModal.student?.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {reviewAction === "approved" ? "Comment (optional)" : "Feedback for student *"}
                </label>
                <textarea rows="3" className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                  placeholder={reviewAction === "approved" ? "Great work!" : "Please describe what needs to be changed..."}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setReviewModal(null)} className="secondary-button px-4 py-2 text-sm">Cancel</button>
                <button onClick={handleReview} disabled={actionLoading || (reviewAction !== "approved" && !reviewComment.trim())}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition disabled:opacity-50 ${reviewAction === "approved" ? "bg-emerald-500 hover:bg-emerald-600" : reviewAction === "revision" ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"}`}>
                  {actionLoading ? "Processing..." : reviewAction === "approved" ? "Approve" : reviewAction === "revision" ? "Request Revision" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
