import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

const STATUS_STYLES = {
  pending:  { label: "Pending Review", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", dot: "bg-amber-500" },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", dot: "bg-emerald-500" },
  featured: { label: "Featured", color: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300", dot: "bg-purple-500" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300", dot: "bg-red-500" },
  revision: { label: "Needs Revision", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", dot: "bg-blue-500" },
  draft:    { label: "Draft", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", dot: "bg-slate-400" },
  disabled: { label: "Disabled", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", dot: "bg-slate-400" }
};

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

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter);

  const counts = {
    all: projects.length,
    pending: projects.filter(p => p.status === "pending").length,
    approved: projects.filter(p => p.status === "approved" || p.status === "featured").length,
    rejected: projects.filter(p => p.status === "rejected" || p.status === "revision").length
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: counts.all, color: "border-brand-500" },
            { label: "Pending", value: counts.pending, color: "border-amber-500" },
            { label: "Approved", value: counts.approved, color: "border-emerald-500" },
            { label: "Needs Action", value: counts.rejected, color: "border-red-500" }
          ].map((s,i) => (
            <div key={i} className={`glass-card p-4 border-l-4 ${s.color}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter + Upload */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "approved", label: "Approved" },
              { key: "featured", label: "Featured" },
              { key: "rejected", label: "Rejected" },
              { key: "revision", label: "Revision" }
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${filter === f.key ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"}`}>
                {f.label}
              </button>
            ))}
          </div>
          <Link to="/projects/new" className="primary-button text-sm px-4 py-2">+ Upload New</Link>
        </div>

        {/* Projects list */}
        {filtered.length === 0 ? (
          <div className="glass-card py-16 text-center">
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-slate-500 mb-4 text-sm">
              {filter === "all" ? "Upload your first innovation to get started." : `No ${filter} projects.`}
            </p>
            {filter === "all" && <Link to="/projects/new" className="primary-button text-sm">Upload Project</Link>}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(project => {
              const ss = STATUS_STYLES[project.status] || STATUS_STYLES.draft;
              const canResubmit = ["rejected", "revision"].includes(project.status);
              return (
                <div key={project._id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-24 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                    {project.media?.images?.[0] ? (
                      <img src={project.media.images[0]} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/projects/${project._id}`} className="font-medium text-slate-900 dark:text-white hover:text-brand-600 truncate">
                        {project.title}
                      </Link>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${ss.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                        {ss.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 capitalize">{project.category} • {new Date(project.createdAt).toLocaleDateString()}</p>

                    {/* Review feedback */}
                    {project.reviewComment && (
                      <div className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Teacher Feedback</p>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{project.reviewComment}</p>
                        {project.reviewedBy && (
                          <p className="mt-1 text-[10px] text-slate-400">— {project.reviewedBy.fullName} ({project.reviewedBy.role})</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {canResubmit && (
                      <Link to={`/projects/${project._id}/edit`} className="inline-flex items-center gap-1 rounded-xl bg-brand-500 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        Resubmit
                      </Link>
                    )}
                    <Link to={`/projects/${project._id}`} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800 transition-colors" title="View">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </Link>
                    <Link to={`/projects/${project._id}/edit`} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800 transition-colors" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
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
