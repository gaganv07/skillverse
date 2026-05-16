import { Link } from "react-router-dom";
import { ApprovalStatusBadge } from "./ApprovalStatusBadge";

export function ProjectCard({ project }) {
  const imageUrl = project.media?.images?.[0] || "https://placehold.co/600x400?text=No+Image";

  return (
    <article className="glass-card overflow-hidden flex flex-col">
      <img src={imageUrl} alt={project.title} className="h-40 sm:h-52 w-full object-cover" loading="lazy" />
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-2">
          <p className="badge self-start">{project.category}</p>
          {project.status && <ApprovalStatusBadge status={project.status} compact />}
        </div>
        <h3 className="mt-2 sm:mt-4 font-display text-base sm:text-xl font-semibold line-clamp-2">{project.title}</h3>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 truncate">{project.schoolName || project.student?.schoolName}</p>
        <div className="mt-auto pt-3 sm:pt-5 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-500">{project.metrics?.likes || 0} likes</span>
          <Link to={`/projects/${project._id || project.id}`} className="text-brand-600 dark:text-brand-300 font-semibold hover:underline">
            View project
          </Link>
        </div>
      </div>
    </article>
  );
}
