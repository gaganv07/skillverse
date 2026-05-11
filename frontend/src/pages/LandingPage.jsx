import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../providers/LanguageProvider";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";
import { ProjectCard } from "../components/ui/ProjectCard";
import { api } from "../lib/api";

const successStories = [
  { name: "Meghana", text: "SkillVerse helped my science fair project reach mentors and district judges." },
  { name: "Arjun", text: "I built a portfolio that made my school recognize my robotics work." }
];

const testimonials = [
  { author: "Science Teacher, Bengaluru Rural", quote: "This gives students the digital confidence and visibility they deserve." },
  { author: "Innovation Mentor, Karnataka", quote: "A strong bridge between talent in classrooms and real-world opportunities." }
];

export default function LandingPage() {
  const { t } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [trendingTalents, setTrendingTalents] = useState([]);

  useEffect(() => {
    // Fetch real data from backend
    api.get("/projects").then((res) => {
      if (res.data?.success) {
        setFeaturedProjects(res.data.data.slice(0, 3));
      }
    }).catch(console.error);

    api.get("/talents").then((res) => {
      if (res.data?.success) {
        setTrendingTalents(res.data.data.slice(0, 3));
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="pb-16">
      <section className="section-shell py-12 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge">Digital identity for school innovators</span>
            <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
              Where Government School Students Showcase Innovation & Talent
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              SkillVerse helps students publish projects, talents, achievements, and future-ready ideas in a platform built to unlock recognition, mentorship, and opportunity.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/projects" className="primary-button">
                {t.heroCta}
              </Link>
              <Link to="/register" className="secondary-button">
                Create Student Profile
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatCard value="25K+" label="Students empowered" />
              <StatCard value="4.2K+" label="Projects showcased" />
              <StatCard value="1.1K+" label="Schools connected" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6"
          >
            <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Featured Profile</p>
              <h2 className="mt-4 font-display text-3xl font-bold">Rural Innovator Portfolio</h2>
              <p className="mt-4 text-slate-300">
                Projects, reels, certificates, mentor recommendations, and district-level rankings in one beautiful student identity.
              </p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-brand-100">Innovation Track</p>
                  <p className="mt-2 text-xl font-semibold">Smart Water Alert System</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-brand-100">Talent Track</p>
                  <p className="mt-2 text-xl font-semibold">Public Speaking Reel</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="section-shell py-14">
        <SectionHeader
          eyebrow="Featured student projects"
          title="Built for problem solvers, dreamers, makers, and creators"
          description="Students can present science models, startup ideas, creative portfolios, coding work, environmental projects, and talent reels in a polished public presence."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="section-shell py-14">
        <SectionHeader
          eyebrow="Trending talents"
          title="A stage for talent beyond textbooks"
          description="From singing and drawing to leadership and coding, talent can be showcased with reels, likes, comments, and share-ready presentation."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {trendingTalents.map((talent) => (
            <div key={talent.name} className="glass-card p-6">
              <h3 className="font-display text-2xl font-semibold">{talent.name}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{talent.student}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{talent.school}</p>
              <p className="mt-6 text-brand-600 dark:text-brand-300">{talent.likes} community likes</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stories" className="section-shell py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-card p-8">
            <SectionHeader
              eyebrow="Success stories"
              title="Recognition that reaches beyond the classroom"
              description="Students gain a visible journey of innovation, confidence, and growth that teachers, mentors, schools, and event organizers can trust."
            />
          </div>
          <div className="grid gap-5">
            {successStories.map((story) => (
              <div key={story.name} className="glass-card p-6">
                <h3 className="font-semibold">{story.name}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{story.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="section-shell py-14">
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by educators, mentors, and innovation champions"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <div key={item.author} className="glass-card p-8">
              <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">“{item.quote}”</p>
              <p className="mt-5 font-semibold text-brand-700 dark:text-brand-300">{item.author}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
