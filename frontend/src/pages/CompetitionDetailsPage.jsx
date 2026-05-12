import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export default function CompetitionDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    fetchCompetition();
  }, [id]);

  const fetchCompetition = async () => {
    try {
      const res = await api.get(`/competitions/${id}`);
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProjects = async () => {
    try {
      const res = await api.get("/projects/my-projects");
      if (res.data?.success) {
        setMyProjects(res.data.projects);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async () => {
    if (!user) return alert("Please log in to register.");
    setActionLoading(true);
    try {
      const res = await api.post(`/registrations/${id}`);
      if (res.data?.success) {
        alert("Successfully registered!");
        fetchCompetition();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to register");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return alert("Please select a project.");
    
    setActionLoading(true);
    try {
      const res = await api.post(`/submissions/competition/${id}`, { projectId: selectedProjectId });
      if (res.data?.success) {
        alert("Project submitted successfully!");
        setShowSubmitModal(false);
        fetchCompetition();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit project");
    } finally {
      setActionLoading(false);
    }
  };

  const openSubmitModal = () => {
    fetchMyProjects();
    setShowSubmitModal(true);
  };

  if (loading) return <div className="p-20 text-center text-slate-500">Loading competition details...</div>;
  if (!data?.competition) return <div className="p-20 text-center text-red-500">Competition not found.</div>;

  const { competition, stats, userState } = data;

  const isStudent = user?.role === "student";

  return (
    <div>
      {/* Hero Banner */}
      <div className="h-64 w-full relative bg-slate-900">
        {competition.banner ? (
          <img src={competition.banner} alt="Banner" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-800 to-indigo-900 opacity-80" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span className="badge mb-4">{competition.type}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white max-w-4xl">{competition.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section className="glass-card p-8">
            <h2 className="font-display text-2xl font-bold mb-4">About the Event</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {competition.description}
            </p>
          </section>

          {(competition.rules?.length > 0 || competition.eligibility?.length > 0) && (
            <section className="glass-card p-8">
              {competition.eligibility?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3">Eligibility</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                    {competition.eligibility.map((el, i) => <li key={i}>{el}</li>)}
                  </ul>
                </div>
              )}
              {competition.rules?.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3">Rules & Guidelines</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                    {competition.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                  </ul>
                </div>
              )}
            </section>
          )}

          {competition.prizes?.length > 0 && (
            <section className="glass-card p-8">
              <h2 className="font-display text-2xl font-bold mb-4 text-amber-600 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Prizes & Awards
              </h2>
              <ul className="space-y-3">
                {competition.prizes.map((prize, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-medium">
                    <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      {i + 1}
                    </span>
                    {prize}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="glass-card p-6 border-t-4 border-brand-500">
            <h3 className="font-bold text-lg mb-4">Event Status</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold uppercase text-brand-600">{competition.status}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Registration Closes</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {competition.registrationDeadline ? new Date(competition.registrationDeadline).toLocaleDateString() : "TBA"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Registrations</span>
                <span className="font-medium">{stats?.registrationsCount || 0}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-slate-500">Submissions</span>
                <span className="font-medium">{stats?.submissionsCount || 0}</span>
              </div>
            </div>

            {isStudent && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                {!userState.isRegistered ? (
                  <button 
                    onClick={handleRegister} 
                    disabled={actionLoading || competition.status === "completed"}
                    className="primary-button w-full"
                  >
                    {actionLoading ? "Registering..." : "Register Now"}
                  </button>
                ) : !userState.hasSubmitted ? (
                  <div className="text-center">
                    <p className="text-green-600 font-medium mb-3 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Registered
                    </p>
                    <button 
                      onClick={openSubmitModal}
                      disabled={actionLoading || competition.status === "completed"}
                      className="w-full py-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors"
                    >
                      Submit Project
                    </button>
                  </div>
                ) : (
                  <div className="text-center bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-900">
                    <p className="text-green-700 dark:text-green-400 font-bold mb-1">Project Submitted</p>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      Status: {userState.submission.status.replace("_", " ")}
                    </p>
                    {userState.submission.awardedRank !== "none" && (
                      <p className="mt-2 text-brand-600 font-bold uppercase">
                        Award: {userState.submission.awardedRank}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            {!user && (
              <div className="mt-6">
                <Link to="/login" className="primary-button w-full flex justify-center">Log in to participate</Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="font-display text-2xl font-bold mb-4">Submit Project</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Select one of your existing projects to submit to this competition.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
                {myProjects.length === 0 ? (
                  <div className="text-center p-4 bg-slate-100 rounded-lg">
                    <p className="text-slate-600">You don't have any projects yet.</p>
                    <Link to="/projects/new" className="text-brand-600 font-medium hover:underline mt-2 inline-block">Create a Project First</Link>
                  </div>
                ) : (
                  myProjects.map(p => (
                    <label key={p._id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${selectedProjectId === p._id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      <input 
                        type="radio" 
                        name="project" 
                        value={p._id} 
                        checked={selectedProjectId === p._id}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-bold block">{p.title}</span>
                        <span className="text-sm text-slate-500">{p.category}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
              
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowSubmitModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!selectedProjectId || actionLoading}
                  className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? "Submitting..." : "Submit to Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
