export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <span className="badge">{eyebrow}</span>
      <h2 className="section-title mt-4">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      )}
    </div>
  );
}
