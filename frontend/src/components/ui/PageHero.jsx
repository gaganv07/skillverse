import { motion } from "framer-motion";

export function PageHero({ title, description, badge }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="section-shell py-8"
    >
      <div className="glass-card p-8 sm:p-10">
        {badge ? <span className="badge">{badge}</span> : null}
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
    </motion.section>
  );
}
