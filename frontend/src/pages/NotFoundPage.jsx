import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section-shell py-24">
      <div className="glass-card p-10 text-center">
        <h1 className="font-display text-5xl font-bold">404</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">This page could not be found.</p>
        <Link to="/" className="primary-button mt-6">Go home</Link>
      </div>
    </section>
  );
}
