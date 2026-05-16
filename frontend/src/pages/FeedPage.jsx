import { useEffect, useState } from "react";
import { FeedCard } from "../components/ui/FeedCard";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/posts")
      .then((res) => {
        if (res.data?.success) {
          setPosts(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHero
        badge="Community & ideas"
        title="A social feed for innovation, curiosity, and collaboration"
        description="Students can share ideas, post updates, ask questions, and connect with peers and mentors in a constructive digital learning community."
      />
      <section className="section-shell py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {loading ? (
            <div className="glass-card py-12 text-center text-slate-400">Loading community posts...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => <FeedCard key={post._id || post.id} post={post} />)
          ) : (
            <div className="glass-card py-12 text-center text-slate-500">
              <p>No posts yet in the community. Be the first to start a discussion.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
