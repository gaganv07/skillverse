import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { ProjectCard } from "../components/ui/ProjectCard";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      // Pass the student ID or email to filter projects
      // Depending on the API design, this might be a specific endpoint
      api.get(`/projects?student=${user._id}`)
        .then((res) => {
          if (res.data?.success) {
            // Filter locally if backend doesn't support ?student query filter
            const myProjects = res.data.projects?.filter(p => 
              p.student?._id === user._id || p.student === user._id
            ) || [];
            setProjects(myProjects);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <div className="p-20 text-center">Loading your projects...</div>;
  }

  return (
    <div>
      <PageHero
        badge="My Projects"
        title="Manage your portfolio"
        description="View, edit, and track the performance of all your uploaded projects."
      />
      
      <section className="section-shell py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Uploaded ({projects.length})</h2>
          <Link to="/projects/new" className="primary-button">
            + Upload New Project
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id || project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="glass-card py-20 text-center">
            <h3 className="text-xl font-semibold mb-2">You haven't uploaded any projects yet.</h3>
            <p className="text-slate-500 mb-6">Share your first innovation with the community.</p>
            <Link to="/projects/new" className="primary-button">
              Upload Project
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
