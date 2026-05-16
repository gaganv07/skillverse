import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { ApprovalStatusBadge } from "../components/ui/ApprovalStatusBadge";
import { formatRelativeTime } from "../lib/workflow";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingProjects, setPendingProjects] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewAction, setReviewAction] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, historyRes] = await Promise.all([
        api.get("/projects/review/pending"),
        api.get("/projects/review/history?limit=20")
      ]);
      setPendingProjects(pendingRes.data?.projects || []);
      setHistory(historyRes.data?.actions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (project, action) => {
    setReviewModal(project);
    setReviewAction(action);
    setReviewComment("");
  };

  const handleReview = async () => {
    if (!reviewModal || !reviewAction) return;
    setActionLoading(true);

    const endpointMap = {
      approved: "approve",
      rejected: "reject",
      revision: "request-revision"
    };

    try {
      const res = await api.patch(`/projects/${reviewModal._id}/${endpointMap[reviewAction]}`, {
        reviewComment
      });

      if (res.data?.success) {
        showToast(res.data.message);
        setPendingProjects((items) => items.filter((project) => project._id !== reviewModal._id));
        setReviewModal(null);
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Review failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { id: "pending", label: "Pending Review", count: pendingProjects.length },
    { id: "history", label: "Recent Decisions", count: history.length }
  ];

  return (
    <div>
      <PageHero
        badge="Teacher Review Workspace"
        title="Approve, reject, and coach project submissions"
        description={`Review pending student work from ${user?.schoolName || "your school"}, give actionable feedback, and keep the public project feed moderated.`}
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

      <section className="section-shell py-8">
        <div className="mb-8 flex gap-3 overflow-x-auto border-b border-slate-200 pb-4 dark:border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="glass-card py-16 text-center text-slate-400">Loading moderation workflow...</div>
        ) : (
          <>
            {activeTab === "pending" && (
              <div className="space-y-4">
                {pendingProjects.length === 0 ? (
                  <div className="glass-card py-16 text-center text-slate-400">No pending projects to review</div>
                ) : pendingProjects.map((project) => (
                  <div key={project._id} className="glass-card rounded-3xl p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                      <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 lg:w-36">
                        {project.media?.images?.[0] ? (
                          <img src={project.media.images[0]} alt={project.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link to={`/projects/${project._id}`} className="font-display text-xl font-semibold text-slate-900 hover:text-brand-600 dark:text-white">
                            {project.title}
                          </Link>
                          <ApprovalStatusBadge status={project.status} compact />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {project.student?.fullName} · {project.schoolName || project.student?.schoolName} · {project.category}
                        </p>
                        <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
                        <p className="mt-3 text-xs text-slate-400">Submitted {formatRelativeTime(project.submittedAt || project.createdAt)}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:w-[220px] lg:flex-col">
                        <button onClick={() => openReviewModal(project, "approved")} className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600">
                          Approve
                        </button>
                        <button onClick={() => openReviewModal(project, "revision")} className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600">
                          Request Revision
                        </button>
                        <button onClick={() => openReviewModal(project, "rejected")} className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="glass-card py-16 text-center text-slate-400">No review history yet</div>
                ) : history.map((entry) => (
                  <div key={entry._id} className="glass-card rounded-3xl p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900 dark:text-white">{entry.project?.title || "Project"}</p>
                          <ApprovalStatusBadge status={entry.toStatus} compact />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {entry.student?.fullName} · {entry.actor?.fullName} · {entry.actorRole}
                        </p>
                        {entry.comment && <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{entry.comment}</p>}
                      </div>
                      <p className="text-xs text-slate-400">{formatRelativeTime(entry.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {reviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReviewModal(null)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/60 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/95">
            <div className="flex items-center justify-between border-b border-slate-200/50 px-6 py-4 dark:border-slate-700/50">
              <h2 className="font-display text-lg font-bold">
                {reviewAction === "approved" ? "Approve Project" : reviewAction === "revision" ? "Request Revision" : "Reject Project"}
              </h2>
              <button onClick={() => setReviewModal(null)} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <p className="font-medium text-sm">{reviewModal.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">by {reviewModal.student?.fullName}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">
                  {reviewAction === "approved" ? "Comment (optional)" : "Feedback for student *"}
                </label>
                <textarea
                  rows="4"
                  className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder={reviewAction === "approved" ? "Great work. Ready for the public feed." : "Explain what needs to change before this can be approved."}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setReviewModal(null)} className="secondary-button px-4 py-2 text-sm">Cancel</button>
                <button
                  onClick={handleReview}
                  disabled={actionLoading || (reviewAction !== "approved" && !reviewComment.trim())}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition disabled:opacity-50 ${
                    reviewAction === "approved"
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : reviewAction === "revision"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-red-500 hover:bg-red-600"
                  }`}
                >
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
