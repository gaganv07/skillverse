import { useState, useEffect } from "react";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, projects: 0, talents: 0, competitions: 0 });
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ fullName: "", email: "", password: "", role: "student" });
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.get("/users"),
        api.get("/admin/stats")
      ]);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (statsRes.data.success) setStats(statsRes.data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError("");
    try {
      const res = await api.post("/auth/register", createForm);
      if (res.data.success) {
        setIsModalOpen(false);
        setCreateForm({ fullName: "", email: "", password: "", role: "student" });
        fetchData(); // refresh list
      }
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/users/${id}/status`);
      if (res.data.success) {
        setUsers(users.map(u => u._id === id ? { ...u, isActive: res.data.user.isActive } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (id) => {
    try {
      const res = await api.patch(`/users/${id}/verify`);
      if (res.data.success) {
        setUsers(users.map(u => u._id === id ? { ...u, isVerified: res.data.user.isVerified } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <PageHero
        badge="Admin command center"
        title="Manage the ecosystem with analytics, moderation, and announcements"
        description="Admins can oversee users, projects, talents, competitions, certificates, moderation workflows, and featured content."
      />
      
      <section className="section-shell grid gap-6 py-8 md:grid-cols-4">
        {[
          { label: "Users", value: stats.users },
          { label: "Projects", value: stats.projects },
          { label: "Talents", value: stats.talents },
          { label: "Competitions", value: stats.competitions }
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-3 font-display text-4xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="section-shell py-4">
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between gap-4 items-center">
            <h2 className="text-xl font-display font-semibold">User Management</h2>
            <button onClick={() => setIsModalOpen(true)} className="primary-button text-sm px-4 py-2">
              + Create User
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex gap-4 flex-wrap">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm flex-grow max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-y border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-medium">User Details</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Verification</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{user.fullName}</div>
                        <div className="text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge capitalize">{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleToggleStatus(user._id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${user.isActive !== false ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}
                        >
                          {user.isActive !== false ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleVerify(user._id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${user.isVerified ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}
                        >
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold">Create New User</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {createError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{createError}</div>}
              
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent" value={createForm.fullName} onChange={e => setCreateForm({...createForm, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent" value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Temporary Password</label>
                <input required minLength="6" type="password" className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent" value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent" value={createForm.role} onChange={e => setCreateForm({...createForm, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 px-4 rounded-xl border border-slate-300 font-medium">Cancel</button>
                <button type="submit" className="flex-1 primary-button">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
