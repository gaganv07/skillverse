import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { ApprovalStatusBadge } from "../components/ui/ApprovalStatusBadge";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?._id) {
      api.get("/projects/me/all")
        .then((res) => {
          if (res.data?.success) setProjects(res.data.projects || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const filtered = filter === "all" ? projects : projects.filter((project) => project.status === filter);

  const counts = {
    all: projects.length,
    pending: projects.filter((project) => project.status === "pending").length,
    approved: projects.filter((project) => ["approved", "featured"].includes(project.status)).length,
    rejected: projects.filter((project) => ["rejected", "revision"].includes(project.status)).length
  };

  if (loading) {
    return <div className="p-20 text-center text-slate-400">Loading your projects...</div>;
  }

  return (
    <div>
      <PageHero
        badge="My Projects"
        title="Track & Manage Your Work"
        description="Monitor approval status, view teacher feedback, and resubmit projects."
      />

      <section className="section-shell max-w-5xl py-8">
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total", value: counts.all, color: "border-brand-500" },
            { label: "Pending", value: counts.pending, color: "border-amber-500" },
            { label: "Approved", value: counts.approved, color: "border-emerald-500" },
            { label: "Needs Action", value: counts.rejected, color: "border-red-500" }
          ].map((stat) => (
            <div key={stat.label} className={`glass-card border-l-4 p-4 ${stat.color}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "approved", label: "Approved" },
              { key: "featured", label: "Featured" },
              { key: "rejected", label: "Rejected" },
              { key: "revision", label: "Revision" }
            ].map((entry) => (
              <button
                key={entry.key}
                onClick={() => setFilter(entry.key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === entry.key
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <Link to="/projects/new" className="primary-button px-4 py-2 text-sm">+ Upload New</Link>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card py-16 text-center">
            <h3 className="mb-2 text-lg font-semibold">No projects found</h3>
            <p className="mb-4 text-sm text-slate-500">
              {filter === "all" ? "Upload your first innovation to get started." : `No ${filter} projects.`}
            </p>
            {filter === "all" && <Link to="/projects/new" className="primary-button text-sm">Upload Project</Link>}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((project) => {
              const canResubmit = ["rejected", "revision"].includes(project.status);

              return (
                <div key={project._id} className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:w-24">
                    {project.media?.images?.[0] ? (
                      <img src={project.media.images[0]} alt={project.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Link to={`/projects/${project._id}`} className="truncate font-medium text-slate-900 hover:text-brand-600 dark:text-white">
                        {project.title}
                      </Link>
                      <ApprovalStatusBadge status={project.status} compact />
                    </div>
                    <p className="text-xs capitalize text-slate-500">
                      {project.category} · {new Date(project.createdAt).toLocaleDateString()}
                    </p>

                    {project.reviewComment && (
                      <div className="mt-2 rounded-lg border border-slate-200/50 bg-slate-50 px-3 py-2 dark:border-slate-700/50 dark:bg-slate-800/50">
                        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Teacher Feedback</p>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{project.reviewComment}</p>
                        {project.reviewedBy && (
                          <p className="mt-1 text-[10px] text-slate-400">from {project.reviewedBy.fullName} ({project.reviewedBy.role})</p>
                        )}
                      </div>
                    )}

                    {project.reviewComments?.length > 1 && (
                      <p className="mt-2 text-[11px] text-slate-400">Workflow events recorded: {project.reviewComments.length}</p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {canResubmit && (
                      <Link to={`/projects/${project._id}/edit`} className="inline-flex items-center gap-1 rounded-xl bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        Resubmit
                      </Link>
                    )}
                    <Link to={`/projects/${project._id}`} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800" title="View">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </Link>
                    <Link to={`/projects/${project._id}/edit`} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Link>
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
