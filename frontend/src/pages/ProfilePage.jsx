import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { ProjectCard } from "../components/ui/ProjectCard";
import { api } from "../lib/api";

export default function ProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no ID is provided, maybe we handle viewing my own profile or redirect
    if (!id) return;
    
    api.get(`/profiles/student/${id}`)
      .then(res => {
        if (res.data?.success) {
          setData(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-20 text-center">Loading profile...</div>;
  }

  if (!data?.user) {
    return <div className="p-20 text-center text-red-500">Profile not found.</div>;
  }

  const { user, profile, projects } = data;

  return (
    <div>
      {/* Banner */}
      <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 relative">
        {profile?.banner ? (
          <img src={profile.banner} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-emerald-500 opacity-80" />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-12">
        <section className="grid gap-8 lg:grid-cols-[1fr_2.5fr]">
          {/* Sidebar */}
          <aside className="glass-card p-8 h-fit">
            <div className="h-32 w-32 rounded-3xl bg-white border-4 border-white shadow-lg overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-500 to-emerald-400 flex items-center justify-center text-white text-4xl font-bold">
                  {user.fullName.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex items-center gap-2">
              <h2 className="font-display text-3xl font-bold">{user.fullName}</h2>
              {user.isVerified && (
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              )}
            </div>
            {profile?.headline && <p className="text-lg font-medium text-slate-700 dark:text-slate-200 mt-1">{profile.headline}</p>}
            
            <div className="mt-4 space-y-2">
              <Link to={`/school/${user.schoolName}`} className="text-primary-600 font-medium hover:underline flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                {user.schoolName || "No School Listed"}
              </Link>
              <p className="text-slate-500 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {user.district && user.state ? `${user.district}, ${user.state}` : "Location not specified"}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {(user.skills?.length > 0 ? user.skills : ["React", "JavaScript", "Problem Solving"]).map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Social Links</h3>
                <div className="flex gap-3">
                  {user.socialLinks.github && (
                    <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#0A66C2] transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => {
                  const reason = prompt("Reason for reporting (fake, inappropriate, spam, abuse):", "spam");
                  if (reason) {
                    api.post("/reports", { targetType: "user", targetId: user._id, reason, description: "Reported from profile" })
                      .then(() => alert("User reported."))
                      .catch(err => alert("Failed to report user."));
                  }
                }}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
              >
                Flag / Report User
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-8 mt-12 lg:mt-0 lg:pt-24">
            
            {user.bio && (
              <div className="glass-card p-8">
                <h3 className="font-display text-2xl font-semibold mb-4">About</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  {user.bio}
                </p>
              </div>
            )}

            {profile?.achievements?.length > 0 && (
              <div className="glass-card p-8">
                <h3 className="font-display text-2xl font-semibold mb-6">Achievements</h3>
                <div className="space-y-6">
                  {profile.achievements.map((ach, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{ach.title}</h4>
                        <p className="text-sm text-slate-500">{ach.issuer} {ach.year && `• ${ach.year}`}</p>
                        {ach.description && <p className="mt-2 text-slate-600 dark:text-slate-300">{ach.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl font-semibold">Portfolio ({projects?.length || 0})</h3>
              </div>
              
              {projects?.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {projects.map((project) => (
                    <ProjectCard key={project._id} project={{...project, student: user}} />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center text-slate-500">
                  <p>No projects uploaded yet.</p>
                </div>
              )}
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
