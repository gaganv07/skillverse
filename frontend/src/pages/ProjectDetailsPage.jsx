import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => {
        if (res.data?.success) {
          setProject(res.data.project);
          setComments(res.data.comments || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await api.post(`/projects/${id}/like`);
      if (res.data?.success) {
        setProject(res.data.project);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-20 text-center">Loading project...</div>;
  }

  if (!project) {
    return <div className="p-20 text-center text-red-500">Project not found.</div>;
  }

  const imageUrl = project.media?.images?.[0] || "https://placehold.co/1200x600?text=No+Image";
  const isOwner = user?._id === project.student?._id || user?._id === project.student;

  return (
    <div className="mx-auto max-w-5xl py-8 px-4">
      <div className="glass-card overflow-hidden">
        <img src={imageUrl} alt={project.title} className="w-full h-[400px] object-cover" />
        
        <div className="p-8">
          <div className="flex items-center justify-between">
            <span className="badge">{project.category}</span>
            <div className="flex items-center gap-4">
              {isOwner && (
                <Link to={`/projects/${id}/edit`} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white">
                  Edit Project
                </Link>
              )}
              <button onClick={handleLike} className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-3 py-1.5 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                <span>{project.metrics?.likes || 0}</span>
              </button>
            </div>
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold">{project.title}</h1>
          
          <div className="mt-4 flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-200"></div>
              <span className="font-medium">{project.student?.fullName || "Anonymous"}</span>
            </div>
            <span>•</span>
            <span>{project.schoolName || project.student?.schoolName}</span>
          </div>

          <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{project.description}</p>
          </div>

          {project.tags?.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(project.githubLink || project.demoLink) && (
            <div className="mt-8 flex gap-4">
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noreferrer" className="primary-button">
                  View Live Demo
                </a>
              )}
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  GitHub Repository
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 glass-card p-8">
        <h3 className="font-display text-2xl font-semibold mb-6">Discussion ({comments.length})</h3>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
              <div>
                <p className="font-medium">{comment.author?.fullName}</p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{comment.content}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-slate-500">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </div>
  );
}
