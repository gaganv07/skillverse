import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

export default function UploadProjectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      
      // Upload image to Cloudinary if file selected
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

      // Create Project
      const projectData = {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        media: {
          images: imageUrl ? [imageUrl] : []
        }
      };

      const res = await api.post("/projects", projectData);
      
      if (res.data?.success) {
        navigate("/projects");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to upload project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHero
        badge="Upload Project"
        title="Share your innovation with the world"
        description="Upload your project details, images, and links to build your professional student portfolio."
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
              <input required className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Smart Water Irrigation System" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea required rows="4" className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Explain your project..." />
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
                <input className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} placeholder="IoT, Sensors, React" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cover Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Live Demo URL (Optional)</label>
                <input type="url" className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.demoLink} onChange={(e) => setForm({...form, demoLink: e.target.value})} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub / Code Link (Optional)</label>
                <input type="url" className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70" value={form.githubLink} onChange={(e) => setForm({...form, githubLink: e.target.value})} placeholder="https://github.com/..." />
              </div>
            </div>
          </div>

          <button disabled={loading} type="submit" className="primary-button w-full mt-4 flex items-center justify-center">
            {loading ? "Uploading Project..." : "Publish Project"}
          </button>
        </form>
      </section>
    </div>
  );
}
