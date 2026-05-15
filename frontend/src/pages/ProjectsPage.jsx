import { useEffect, useState, useCallback } from "react";
import { PageHero } from "../components/ui/PageHero";
import { ProjectCard } from "../components/ui/ProjectCard";
import { api } from "../lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("trending"); // trending, featured, recent
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProjects = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      }
      const currentPage = reset ? 1 : page;
      const res = await api.get("/projects", {
        params: {
          tab,
          title: search,
          category: category !== "All Categories" ? category : "",
          page: currentPage,
          limit: 12
        }
      });
      if (res.data?.success) {
        const newProjects = res.data.projects || res.data.data; // fallback for older structure if needed
        if (reset) {
          setProjects(newProjects);
        } else {
          setProjects(prev => [...prev, ...newProjects]);
        }
        setHasMore(newProjects.length === 12);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [tab, search, category, page]);

  useEffect(() => {
    // Debounce search slightly
    const timeout = setTimeout(() => {
      fetchProjects(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [tab, search, category]);

  useEffect(() => {
    if (page > 1) {
      fetchProjects(false);
    }
  }, [page]);

  const tabs = [
    { id: "trending", label: "Trending" },
    { id: "featured", label: "Featured" },
    { id: "recent", label: "Recent" }
  ];

  return (
    <div>
      <PageHero
        badge="Project Feed"
        title="Discover the latest innovations"
        description="Explore groundbreaking projects from students across the region."
      />
      <section className="section-shell py-4 sm:py-8">
        
        {/* Filters and Search */}
        <div className="glass-card mb-4 sm:mb-8 grid gap-3 sm:gap-4 p-3 sm:p-5 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <input 
              className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900/70 md:w-64" 
              placeholder="Search by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900/70"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="science">Science</option>
              <option value="technology">Technology</option>
              <option value="agriculture">Agriculture</option>
              <option value="robotics">Robotics</option>
              <option value="environment">Environment</option>
              <option value="engineering">Engineering</option>
              <option value="ai-coding">AI & Coding</option>
              <option value="research">Research</option>
              <option value="sustainability">Sustainability</option>
              <option value="innovation">Innovation</option>
            </select>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
            {tabs.map(t => (
              <button 
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === t.id 
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {loading && projects.length === 0 ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button 
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card py-20 text-center text-slate-500">
            <p>No projects found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
