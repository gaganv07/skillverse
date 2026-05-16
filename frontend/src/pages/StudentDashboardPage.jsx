import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { ApprovalStatusBadge } from "../components/ui/ApprovalStatusBadge";
import { getNotificationMeta, formatRelativeTime } from "../lib/workflow";
import { api } from "../lib/api";

function StatCard({ label, value, accent }) {
  return (
    <div className={`glass-card border-l-4 p-4 ${accent}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

export default function StudentDashboardPage() {
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        const [projectsRes, notificationsRes] = await Promise.all([
          api.get("/projects/me/all"),
          api.get("/notifications?limit=5")
        ]);

        if (!ignore) {
          setProjects(projectsRes.data?.projects || []);
          setNotifications(notificationsRes.data?.notifications || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadDashboard();
    return () => { ignore = true; };
  }, []);

  const stats = useMemo(() => ({
    total: projects.length,
    pending: projects.filter((project) => project.status === "pending").length,
    approved: projects.filter((project) => ["approved", "featured"].includes(project.status)).length,
    actionNeeded: projects.filter((project) => ["rejected", "revision"].includes(project.status)).length
  }), [projects]);

  const latestProjects = projects.slice(0, 4);
  const latestActionProject = projects.find((project) => ["rejected", "revision"].includes(project.status));

  return (
    <div>
      <PageHero
        badge="Student Dashboard"
        title="Track every project through review"
        description="Monitor approval progress, read teacher feedback, and resubmit confidently when revisions are requested."
      />

      <section className="section-shell py-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total Projects" value={stats.total} accent="border-brand-500" />
          <StatCard label="Pending Review" value={stats.pending} accent="border-amber-500" />
          <StatCard label="Approved" value={stats.approved} accent="border-emerald-500" />
          <StatCard label="Needs Action" value={stats.actionNeeded} accent="border-red-500" />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <div className="glass-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Recent project activity</h2>
                  <p className="mt-1 text-sm text-slate-500">Approval status, teacher review feedback, and resubmission readiness.</p>
                </div>
                <Link to="/my-projects" className="text-sm font-semibold text-brand-600 hover:underline">
                  View all projects
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400">Loading project workflow...</div>
              ) : latestProjects.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-slate-500">No projects uploaded yet.</p>
                  <Link to="/projects/new" className="primary-button mt-4 inline-flex px-4 py-2 text-sm">
                    Upload your first project
                  </Link>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {latestProjects.map((project) => (
                    <div key={project._id} className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/70 dark:bg-slate-900/60">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link to={`/projects/${project._id}`} className="truncate font-semibold text-slate-900 hover:text-brand-600 dark:text-white">
                            {project.title}
                          </Link>
                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {project.category} · updated {formatRelativeTime(project.updatedAt)}
                          </p>
                        </div>
                        <ApprovalStatusBadge status={project.status} compact />
                      </div>

                      {project.reviewComment && (
                        <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/90 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-800/60">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Latest feedback</p>
                          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{project.reviewComment}</p>
                          {project.reviewedBy && (
                            <p className="mt-2 text-xs text-slate-400">From {project.reviewedBy.fullName} · {project.reviewedBy.role}</p>
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Link to={`/projects/${project._id}`} className="text-sm font-semibold text-brand-600 hover:underline">
                          Open project
                        </Link>
                        {["rejected", "revision"].includes(project.status) && (
                          <Link to={`/projects/${project._id}/edit`} className="inline-flex rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-700">
                            Resubmit for review
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {latestActionProject && (
              <div className="glass-card p-5 sm:p-6">
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Action needed</h2>
                <p className="mt-1 text-sm text-slate-500">One of your projects is waiting on changes before it can go live.</p>
                <div className="mt-4 rounded-3xl border border-red-200/70 bg-red-50/80 p-4 dark:border-red-500/20 dark:bg-red-900/20">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{latestActionProject.title}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{latestActionProject.reviewComment || "Review the feedback and resubmit."}</p>
                    </div>
                    <ApprovalStatusBadge status={latestActionProject.status} compact />
                  </div>
                  <Link to={`/projects/${latestActionProject._id}/edit`} className="mt-4 inline-flex rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">
                    Update and resubmit
                  </Link>
                </div>
              </div>
            )}

            <div className="glass-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Notification center</h2>
                  <p className="mt-1 text-sm text-slate-500">Approvals, feedback, announcements, and competition updates.</p>
                </div>
                <Link to="/notifications" className="text-sm font-semibold text-brand-600 hover:underline">
                  Open all
                </Link>
              </div>

              {loading ? (
                <div className="py-10 text-center text-slate-400">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="py-10 text-center text-slate-400">No notifications yet</div>
              ) : (
                <div className="mt-4 space-y-3">
                  {notifications.map((notification) => {
                    const meta = getNotificationMeta(notification.type);
                    return (
                      <Link
                        key={notification._id}
                        to={notification.actionUrl || "/notifications"}
                        className={`block rounded-2xl border px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md ${
                          notification.read
                            ? "border-slate-200/70 bg-white/70 dark:border-slate-700/70 dark:bg-slate-900/50"
                            : "border-brand-200/80 bg-brand-50/70 dark:border-brand-500/30 dark:bg-brand-900/15"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.color}`}>{meta.label}</span>
                          {!notification.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                        {notification.message && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{notification.message}</p>}
                        <p className="mt-2 text-[11px] text-slate-400">{formatRelativeTime(notification.createdAt)}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
