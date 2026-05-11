import { FeedCard } from "../components/ui/FeedCard";
import { PageHero } from "../components/ui/PageHero";
import { feedPosts } from "../data/mockData";

export default function FeedPage() {
  return (
    <div>
      <PageHero
        badge="Community & ideas"
        title="A social feed for innovation, curiosity, and collaboration"
        description="Students can share ideas, post updates, ask questions, and connect with peers and mentors in a constructive digital learning community."
      />
      <section className="section-shell grid gap-6 py-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {feedPosts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
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
