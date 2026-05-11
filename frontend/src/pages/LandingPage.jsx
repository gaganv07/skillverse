import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../components/ui/SectionHeader";
import { ProjectCard } from "../components/ui/ProjectCard";
import { api } from "../lib/api";

export default function LandingPage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    // Fetch real data from backend
    api.get("/projects").then((res) => {
      if (res.data?.success) {
        setFeaturedProjects(res.data.projects?.slice(0, 3) || []);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="section-shell relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <span className="badge border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
              India's premier student innovation portal for government schools
            </span>
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Empowering Students Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-cyan-500">Science & Innovation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            A centralized platform showcasing student projects, research, and real-world skills. Explore innovations in technology, agriculture, engineering, and environmental sustainability.
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
            <h3 className="font-display text-xl font-bold mb-3">Scientific Research</h3>
            <p className="text-slate-600 dark:text-slate-400">Discover science fair models, academic research, and breakthrough experiments uploaded directly by students.</p>
          </div>
          <div className="glass-card p-8">
            <div className="w-14 h-14 mx-auto bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-3">AI, Tech & Coding</h3>
            <p className="text-slate-600 dark:text-slate-400">Explore real-world software applications, robotics systems, and coding projects tackling modern problems.</p>
          </div>
          <div className="glass-card p-8">
            <div className="w-14 h-14 mx-auto bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-3">Agriculture & Environment</h3>
            <p className="text-slate-600 dark:text-slate-400">Review innovations in smart agriculture, climate change mitigation, and environmental sustainability.</p>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section id="features" className="section-shell py-14">
          <SectionHeader
            eyebrow="Featured student projects"
            title="Built for problem solvers, makers, and innovators"
            description="Students present science models, AI solutions, engineering prototypes, and agricultural systems in a polished, institutional format."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      <section className="section-shell py-20 border-t border-slate-200 dark:border-slate-800 text-center">
        <h2 className="font-display text-4xl font-bold mb-6">Ready to showcase your research?</h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          Contact your teacher or school administrator to get your verified student account and start uploading your STEM projects.
        </p>
        <Link to="/login" className="primary-button text-lg px-8 py-4 inline-flex items-center gap-2">
          Access Your Dashboard
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </section>
    </div>
  );
}
