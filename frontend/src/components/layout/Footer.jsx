export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-slate-200/60 py-10 dark:border-slate-800">
      <div className="section-shell flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">SkillVerse</p>
          <p>Empowering talented government school students across India.</p>
        </div>
        <div className="flex gap-5">
          <a href="#features">Features</a>
          <a href="#stories">Stories</a>
          <a href="#testimonials">Testimonials</a>
        </div>
      </div>
    </footer>
  );
}
