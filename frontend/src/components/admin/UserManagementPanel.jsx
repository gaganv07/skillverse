import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";
import UserFormModal from "./UserFormModal";
import ResetPasswordModal from "./ResetPasswordModal";

const ROLE_COLORS = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  teacher: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  mentor: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
};

export default function UserManagementPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ page:1, pages:1, total:0 });
  const [toast, setToast] = useState(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [resetPwUser, setResetPwUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null), 3500); };

  const fetchUsers = useCallback(async (page=1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit:15 });
      if (search.trim()) params.set("search", search.trim());
      if (roleFilter!=="all") params.set("role", roleFilter);
      if (statusFilter!=="all") params.set("status", statusFilter);
      const res = await api.get(`/admin/users?${params}`);
      if (res.data?.success) {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast(err.response?.data?.message||"Failed to load users","error");
    } finally { setLoading(false); }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(1); }, [fetchUsers]);

  const handleCreateUser = async (form) => {
    setActionLoading(true);
    try {
      const res = await api.post("/admin/users", form);
      if (res.data?.success) { showToast(res.data.message); setShowCreateModal(false); fetchUsers(1); }
    } catch (err) { showToast(err.response?.data?.message||"Failed to create user","error"); }
    finally { setActionLoading(false); }
  };

  const handleUpdateUser = async (form) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/admin/users/${editUser._id}`, form);
      if (res.data?.success) { showToast(res.data.message); setEditUser(null); fetchUsers(pagination.page); }
    } catch (err) { showToast(err.response?.data?.message||"Failed to update user","error"); }
    finally { setActionLoading(false); }
  };

  const handleResetPassword = async (id, newPassword) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/admin/users/${id}/reset-password`, { newPassword });
      if (res.data?.success) { showToast(res.data.message); setResetPwUser(null); }
    } catch (err) { showToast(err.response?.data?.message||"Failed to reset password","error"); }
    finally { setActionLoading(false); }
  };

  const handleToggleStatus = async (user) => {
    try {
      const res = await api.patch(`/admin/users/${user._id}/status`);
      if (res.data?.success) { showToast(res.data.message); fetchUsers(pagination.page); }
    } catch (err) { showToast(err.response?.data?.message||"Failed to update status","error"); }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm) return;
    setActionLoading(true);
    try {
      const res = await api.delete(`/admin/users/${deleteConfirm._id}`);
      if (res.data?.success) { showToast(res.data.message); setDeleteConfirm(null); fetchUsers(pagination.page); }
    } catch (err) { showToast(err.response?.data?.message||"Failed to delete user","error"); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-6 z-[200] max-w-sm rounded-2xl border px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-xl transition-all ${toast.type==="error" ? "border-red-200/60 bg-red-50/90 text-red-700 dark:border-red-500/20 dark:bg-red-900/80 dark:text-red-200" : "border-emerald-200/60 bg-emerald-50/90 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-900/80 dark:text-emerald-200"}`}>
          {toast.msg}
        </div>
      )}

      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="w-full rounded-xl border border-slate-300/80 bg-white/70 pl-10 pr-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select className="rounded-xl border border-slate-300/80 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
          <select className="rounded-xl border border-slate-300/80 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-white" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <button onClick={()=>setShowCreateModal(true)} className="primary-button px-5 py-2.5 text-sm gap-2 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create User
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>{pagination.total} total users</span>
        <span>•</span>
        <span>Page {pagination.page} of {pagination.pages || 1}</span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">User</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Role</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden md:table-cell">School</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2"><svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Loading users...</div>
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-16 text-center text-slate-400">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {u.fullName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white truncate">{u.fullName || "—"}</div>
                        <div className="text-xs text-slate-500 truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_COLORS[u.role]||"bg-slate-100 text-slate-600"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-slate-500 dark:text-slate-400 text-xs">{u.schoolName || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${u.isActive !== false ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive !== false ? "bg-emerald-500" : "bg-red-500"}`}/>
                      {u.isActive !== false ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={()=>setEditUser(u)} title="Edit" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={()=>setResetPwUser(u)} title="Reset Password" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      </button>
                      {u.role !== "admin" && (
                        <>
                          <button onClick={()=>handleToggleStatus(u)} title={u.isActive !== false ? "Disable" : "Enable"} className={`rounded-lg p-2 transition-colors ${u.isActive !== false ? "text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20" : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20"}`}>
                            {u.isActive !== false ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                          </button>
                          <button onClick={()=>setDeleteConfirm(u)} title="Delete" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-700/50 px-6 py-3">
            <button onClick={()=>fetchUsers(pagination.page-1)} disabled={pagination.page<=1} className="secondary-button px-4 py-2 text-xs disabled:opacity-40">Previous</button>
            <span className="text-xs text-slate-500">Page {pagination.page} of {pagination.pages}</span>
            <button onClick={()=>fetchUsers(pagination.page+1)} disabled={pagination.page>=pagination.pages} className="secondary-button px-4 py-2 text-xs disabled:opacity-40">Next</button>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm glass-card p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-red-600">Delete User</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Permanently delete <strong>{deleteConfirm.fullName}</strong> ({deleteConfirm.email})? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={()=>setDeleteConfirm(null)} className="secondary-button px-4 py-2 text-sm">Cancel</button>
              <button onClick={handleDeleteUser} disabled={actionLoading} className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-600 transition disabled:opacity-50">
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <UserFormModal isOpen={showCreateModal} onClose={()=>setShowCreateModal(false)} onSubmit={handleCreateUser} editUser={null} loading={actionLoading} />
      <UserFormModal isOpen={!!editUser} onClose={()=>setEditUser(null)} onSubmit={handleUpdateUser} editUser={editUser} loading={actionLoading} />
      <ResetPasswordModal isOpen={!!resetPwUser} onClose={()=>setResetPwUser(null)} onSubmit={handleResetPassword} user={resetPwUser} loading={actionLoading} />
    </div>
  );
}
