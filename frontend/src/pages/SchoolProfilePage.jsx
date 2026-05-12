import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { ProjectCard } from "../components/ui/ProjectCard";

export default function SchoolProfilePage() {
  const { id } = useParams(); // id is school name or actual ID based on implementation
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // In our simple implementation, school ID or name can be passed.
  // We'll search by school name if id isn't an object id, but let's assume we fetch projects directly for simplicity
  useEffect(() => {
    // If backend uses /api/v1/projects?schoolName=...
    api.get(`/projects?schoolName=${encodeURIComponent(id)}`)
      .then((res) => {
        if (res.data?.success) {
          setData({
            school: {
              name: id,
              district: res.data.projects?.[0]?.student?.district || "Unknown District",
              state: res.data.projects?.[0]?.student?.state || "Unknown State"
            },
            projects: res.data.projects
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center text-slate-500">Loading school profile...</div>;

  const school = data?.school || { name: id };
  const projects = data?.projects || [];

  return (
    <div>
      <div className="bg-brand-900 pt-20 pb-16 text-white text-center">
        <h1 className="font-display text-4xl font-bold">{school.name}</h1>
        <p className="mt-2 text-brand-200 text-lg">
          {school.district}, {school.state}
        </p>
        <div className="mt-6 flex justify-center gap-6">
          <div className="text-center">
            <span className="block text-3xl font-bold text-white">{projects.length}</span>
            <span className="text-brand-300 text-sm">Projects</span>
          </div>
          <div className="text-center">
            <span className="block text-3xl font-bold text-white">
              {new Set(projects.map(p => p.student?._id)).size}
            </span>
            <span className="text-brand-300 text-sm">Innovators</span>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-display text-2xl font-bold mb-8">Innovations from this School</h2>
        {projects.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="glass-card py-20 text-center text-slate-500">
            <p>No innovations published from this school yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
