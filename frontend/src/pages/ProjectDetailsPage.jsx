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
  const [newComment, setNewComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => {
        if (res.data?.success) {
          setProject(res.data.project);
          setComments(res.data.comments || []);
          // Check if bookmarked in a real scenario via API, 
          // or if project returns it
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert("Please log in to like this project.");
    try {
      const res = await api.post(`/projects/${id}/like`);
      if (res.data?.success) {
        setProject(res.data.project);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookmark = async () => {
    if (!user) return alert("Please log in to save this project.");
    try {
      const res = await api.post(`/bookmarks/toggle/${id}`);
      if (res.data?.success) {
        setIsBookmarked(res.data.isBookmarked);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async () => {
    try {
      await api.post(`/projects/${id}/share`);
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
      setProject(p => ({
        ...p,
        metrics: { ...p.metrics, shares: (p.metrics?.shares || 0) + 1 }
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to comment.");
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/projects/${id}/comments`, { content: newComment });
      if (res.data?.success) {
        // Optimistically add comment
        const comment = {
          ...res.data.comment,
          author: { fullName: user.fullName || "You" },
          createdAt: new Date().toISOString()
        };
        setComments([comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-20 text-center text-slate-500">Loading project details...</div>;
  }

  if (!project) {
    return <div className="p-20 text-center text-red-500">Project not found.</div>;
  }

  const imageUrl = project.media?.images?.[0] || "https://placehold.co/1200x600?text=No+Image";
  const isOwner = user?._id === project.student?._id || user?._id === project.student;
  const likedByMe = user && project.likedBy?.includes(user._id);

  return (
    <div className="mx-auto max-w-5xl py-8 px-4">
      <div className="glass-card overflow-hidden">
        <img src={imageUrl} alt={project.title} className="w-full h-[400px] object-cover" />
        
        <div className="p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="badge">{project.category}</span>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                {project.metrics?.views || 0}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isOwner && (
                <Link to={`/projects/${id}/edit`} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white mr-2">
                  Edit Project
                </Link>
              )}
              <button onClick={handleLike} className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${likedByMe ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/30' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                <svg className="w-5 h-5" fill={likedByMe ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span>{project.metrics?.likes || 0}</span>
              </button>
              <button onClick={handleBookmark} className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${isBookmarked ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                <span className="sr-only">Save</span>
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-4xl font-bold">{project.title}</h1>
              {project.isVerified && (
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              )}
            </div>
            {user && !isOwner && (
              <button 
                onClick={() => {
                  const reason = prompt("Reason for reporting (fake, inappropriate, spam, abuse):", "inappropriate");
                  if (reason) {
                    api.post("/reports", { targetType: "project", targetId: project._id, reason, description: "Reported from project page" })
                      .then(() => alert("Project reported."))
                      .catch(err => alert("Failed to report project."));
                  }
                }}
                className="text-xs font-bold text-slate-400 hover:text-red-600 uppercase tracking-wider transition-colors"
              >
                Flag Project
              </button>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300">
            <Link to={`/profile/${project.student?._id}`} className="flex items-center gap-2 hover:text-primary-600 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                {project.student?.fullName?.charAt(0) || "U"}
              </div>
              <span className="font-medium">{project.student?.fullName || "Anonymous"}</span>
            </Link>
            <span>•</span>
            <Link to={`/school/${project.schoolName}`} className="hover:text-primary-600 transition-colors">
              {project.schoolName || project.student?.schoolName}
            </Link>
          </div>

          <div className="mt-8 prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed">
            <p className="whitespace-pre-wrap">{project.description}</p>
          </div>

          {project.tags?.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(project.githubLink || project.demoLink) && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4">
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noreferrer" className="primary-button inline-flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Live Demo
                </a>
              )}
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 glass-card p-8">
        <h3 className="font-display text-2xl font-semibold mb-6">Discussion ({comments.length})</h3>
        
        {user ? (
          <form onSubmit={submitComment} className="mb-8 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center text-primary-700 font-bold">
              {user.fullName?.charAt(0)}
            </div>
            <div className="flex-1">
              <textarea 
                rows="2" 
                className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="Share your thoughts, ask a question, or provide constructive feedback..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button type="submit" disabled={!newComment.trim()} className="primary-button text-sm py-2 px-4">
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-3">Join the conversation to share your feedback.</p>
            <Link to="/login" className="primary-button inline-block text-sm py-2 px-4">Log in to comment</Link>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment, idx) => (
            <div key={comment._id || idx} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-600 font-bold">
                {comment.author?.fullName?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-sm">{comment.author?.fullName}</p>
                    <span className="text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
