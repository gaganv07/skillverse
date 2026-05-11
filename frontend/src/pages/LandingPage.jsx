import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../providers/LanguageProvider";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";
import { ProjectCard } from "../components/ui/ProjectCard";
import { api } from "../lib/api";

export default function LandingPage() {
  const { t } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [trendingTalents, setTrendingTalents] = useState([]);

  useEffect(() => {
    // Fetch real data from backend
    api.get("/projects").then((res) => {
      if (res.data?.success) {
        setFeaturedProjects(res.data.projects?.slice(0, 3) || []);
      }
    }).catch(console.error);

    api.get("/talents").then((res) => {
      if (res.data?.success) {
        setTrendingTalents(res.data.talents?.slice(0, 3) || []);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="section-shell relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <span className="badge border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
              India's first talent discovery network for government schools
            </span>
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Showcase. Innovate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-cyan-500">Inspire.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            A centralized platform empowering students to build portfolios, display science projects, publish talent reels, and connect with mentors and opportunities.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/projects" className="primary-button text-lg px-8 py-4">Explore Projects</Link>
            <Link to="/login" className="secondary-button text-lg px-8 py-4">Student Login</Link>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      </section>

      <section className="section-shell py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="grid gap-8 md:grid-cols-3 text-center">
          <div className="glass-card p-8">
            <div className="w-14 h-14 mx-auto bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-3">Project Portfolios</h3>
            <p className="text-slate-600 dark:text-slate-400">Upload your science, coding, and innovation projects with videos and documentation.</p>
          </div>
          <div className="glass-card p-8">
            <div className="w-14 h-14 mx-auto bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-3">Talent Reels</h3>
            <p className="text-slate-600 dark:text-slate-400">Share your creative talents, arts, and performances with the community.</p>
          </div>
          <div className="glass-card p-8">
            <div className="w-14 h-14 mx-auto bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-3">Verified Recognition</h3>
            <p className="text-slate-600 dark:text-slate-400">Get discovered by teachers and mentors. Earn certificates and badges for your work.</p>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section id="features" className="section-shell py-14">
          <SectionHeader
            eyebrow="Featured student projects"
            title="Built for problem solvers, dreamers, makers, and creators"
            description="Students can present science models, startup ideas, creative portfolios, coding work, environmental projects, and talent reels in a polished public presence."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      {trendingTalents.length > 0 && (
        <section className="section-shell py-14">
          <SectionHeader
            eyebrow="Trending talents"
            title="A stage for talent beyond textbooks"
            description="From singing and drawing to leadership and coding, talent can be showcased with reels, likes, comments, and share-ready presentation."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {trendingTalents.map((talent) => (
              <div key={talent._id} className="glass-card p-6">
                <h3 className="font-display text-2xl font-semibold">{talent.title}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{talent.student?.fullName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{talent.student?.schoolName}</p>
                <p className="mt-6 text-brand-600 dark:text-brand-300">{talent.metrics?.likes || 0} community likes</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section-shell py-20 border-t border-slate-200 dark:border-slate-800 text-center">
        <h2 className="font-display text-4xl font-bold mb-6">Ready to showcase your potential?</h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          Contact your teacher or school administrator to get your verified student account and start uploading your projects.
        </p>
        <Link to="/login" className="primary-button text-lg px-8 py-4 inline-flex items-center gap-2">
          Access Your Dashboard
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </section>
    </div>
  );
}
