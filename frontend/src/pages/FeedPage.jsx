import { useEffect, useState } from "react";
import { FeedCard } from "../components/ui/FeedCard";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts")
      .then((res) => {
        if (res.data?.success) {
          setPosts(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHero
        badge="Community & ideas"
        title="A social feed for innovation, curiosity, and collaboration"
        description="Students can share ideas, post updates, ask questions, and connect with peers and mentors in a constructive digital learning community."
      />
      <section className="section-shell grid gap-6 py-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <FeedCard key={post._id || post.id} post={post} />
            ))
          ) : (
            <div className="py-10 text-center text-slate-500 glass-card">
              <p>No posts yet in the community. Be the first to start a discussion!</p>
            </div>
          )}
        </div>
        <aside className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display text-2xl font-semibold">Trending ideas</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>Low-cost water conservation devices</li>
              <li>AI for local language learning support</li>
              <li>Plastic-free school campus initiatives</li>
            </ul>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-display text-2xl font-semibold">Recommended students</h3>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Based on science, coding, and environmental innovation interests.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
