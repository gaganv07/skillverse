import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "science",
    tags: "",
    demoLink: "",
    githubLink: ""
  });

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => {
        if (res.data?.success) {
          const p = res.data.project;
          setForm({
            title: p.title || "",
            description: p.description || "",
            category: p.category || "science",
            tags: p.tags?.join(", ") || "",
            demoLink: p.demoLink || "",
            githubLink: p.githubLink || ""
          });
        }
      })
      .catch(err => setError("Failed to load project details"))
      .finally(() => setInitialLoading(false));
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "skillverse/projects");
        
        const uploadRes = await api.post("/uploads", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        if (uploadRes.data?.success) {
          imageUrl = uploadRes.data.fileUrl;
        }
      }

      const projectData = {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        ...(imageUrl && { media: { images: [imageUrl] } })
      };

      const res = await api.put(`/projects/${id}`, projectData);
      
      if (res.data?.success) {
        navigate(`/projects/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-20 text-center">Loading project details...</div>;
  }

  return (
    <div>
      <PageHero
        badge="Edit Project"
        title="Update your innovation details"
        description="Modify your project details, images, and links to keep your portfolio up to date."
      />
      <section className="section-shell max-w-3xl py-8">
        <form onSubmit={handleSubmit} className="glass-card p-8 grid gap-6">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input required className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea required rows="4" className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                  <option value="science">Science</option>
                  <option value="coding">Coding</option>
                  <option value="robotics">Robotics</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="environment">Environment</option>
                  <option value="research">Research</option>
                  <option value="social-impact">Social Impact</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Cover Image (Leave blank to keep existing)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Live Demo URL</label>
                <input type="url" className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.demoLink} onChange={(e) => setForm({...form, demoLink: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub / Code Link</label>
                <input type="url" className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.githubLink} onChange={(e) => setForm({...form, githubLink: e.target.value})} />
              </div>
            </div>
          </div>

          <button disabled={loading} type="submit" className="primary-button w-full mt-4 flex items-center justify-center">
            {loading ? "Saving Changes..." : "Update Project"}
          </button>
        </form>
      </section>
    </div>
  );
}
