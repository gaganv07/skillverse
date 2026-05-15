export function Footer() {
  return (
    <footer className="relative z-10 mt-10 sm:mt-20 border-t border-slate-200/60 py-6 sm:py-10 dark:border-slate-800">
      <div className="section-shell flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <p className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white">SkillVerse</p>
          <p className="text-xs sm:text-sm">Empowering innovative government school students across India.</p>
        </div>
        <div className="flex justify-center gap-5 text-xs sm:text-sm">
          <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
          <a href="#stories" className="hover:text-brand-600 transition-colors">Stories</a>
          <a href="#testimonials" className="hover:text-brand-600 transition-colors">Testimonials</a>
        </div>
      </div>
    </footer>
  );
}
