export function FeedCard({ post }) {
  return (
    <article className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{post.author}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{post.role}</p>
        </div>
        <span className="badge">{post.tags[0]}</span>
      </div>
      <p className="mt-4 leading-7 text-slate-700 dark:text-slate-200">{post.content}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex gap-6 text-sm text-slate-500 dark:text-slate-400">
        <span>{post.likes} likes</span>
        <span>{post.comments} comments</span>
      </div>
    </article>
  );
}
