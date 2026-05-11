export function ProjectCard({ project }) {
  return (
    <article className="glass-card overflow-hidden">
      <img src={project.image} alt={project.title} className="h-52 w-full object-cover" />
      <div className="p-5">
        <p className="badge">{project.category}</p>
        <h3 className="mt-4 font-display text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.school}</p>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span>{project.likes} likes</span>
          <button className="text-brand-600 dark:text-brand-300">View project</button>
        </div>
      </div>
    </article>
  );
}
