import { motion } from "framer-motion";

export function PageHero({ title, description, badge }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="section-shell py-4 sm:py-8"
    >
      <div className="glass-card p-5 sm:p-8 md:p-10">
        {badge ? <span className="badge">{badge}</span> : null}
        <h1 className="mt-3 sm:mt-4 font-display text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
        <p className="mt-2 sm:mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
    </motion.section>
  );
}
