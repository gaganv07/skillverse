import { useState, useEffect } from "react";
import { PageHero } from "../components/ui/PageHero";
import { ProjectCard } from "../components/ui/ProjectCard";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export default function TeacherDashboardPage() {
  const { user: teacher } = useAuth();
  const [activeTab, setActiveTab] = useState("students");
  
  const [students, setStudents] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [teacher]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch students from the same school
      const usersRes = await api.get("/users");
      if (usersRes.data.success) {
        // Mock filtering by school if backend doesn't support query filters yet
        const schoolStudents = usersRes.data.users.filter(u => 
          u.role === "student" && u.schoolName === teacher?.schoolName
        );
        setStudents(schoolStudents);
      }

      // Fetch pending projects
      const projectsRes = await api.get("/projects?status=pending");
      if (projectsRes.data.success) {
        // Filter projects belonging to students in the teacher's school
        const schoolProjects = projectsRes.data.projects.filter(p => 
          p.schoolName === teacher?.schoolName || p.student?.schoolName === teacher?.schoolName
        );
        setPendingProjects(schoolProjects);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStudent = async (id) => {
    try {
      const res = await api.patch(`/users/${id}/verify`);
      if (res.data.success) {
        setStudents(students.map(s => s._id === id ? { ...s, isVerified: res.data.user.isVerified } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveProject = async (id) => {
    try {
      const res = await api.patch(`/projects/${id}/verify`, { status: "approved" });
      if (res.data.success) {
        setPendingProjects(pendingProjects.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectProject = async (id) => {
    try {
      const res = await api.patch(`/projects/${id}/verify`, { status: "rejected" });
      if (res.data.success) {
        setPendingProjects(pendingProjects.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <PageHero
        badge="Teacher dashboard"
        title="Mentor, verify, rate, and elevate student potential"
        description={`Manage and verify students from ${teacher?.schoolName || "your school"}.`}
      />

      <section className="section-shell py-8">
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button 
            className={`pb-4 px-2 font-medium border-b-2 transition-colors ${activeTab === "students" ? "border-brand-600 text-brand-600 dark:text-brand-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"}`}
            onClick={() => setActiveTab("students")}
          >
            My Students ({students.length})
          </button>
          <button 
            className={`pb-4 px-2 font-medium border-b-2 transition-colors ${activeTab === "projects" ? "border-brand-600 text-brand-600 dark:text-brand-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"}`}
            onClick={() => setActiveTab("projects")}
          >
            Pending Projects ({pendingProjects.length})
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-500">Loading data...</div>
        ) : (
          <>
            {activeTab === "students" && (
              <div className="glass-card overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">Student Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {students.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No students found for your school.</td></tr>
                    ) : (
                      students.map(student => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.fullName}</td>
                          <td className="px-6 py-4 text-slate-500">{student.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${student.isVerified ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                              {student.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleVerifyStudent(student._id)} 
                              className="text-brand-600 hover:underline font-medium"
                            >
                              {student.isVerified ? 'Revoke Verification' : 'Verify Student'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="grid gap-6 lg:grid-cols-3">
                {pendingProjects.length === 0 ? (
                  <div className="col-span-3 py-20 text-center text-slate-500 glass-card">
                    No pending projects require your approval.
                  </div>
                ) : (
                  pendingProjects.map(project => (
                    <div key={project._id} className="relative">
                      <ProjectCard project={project} />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => handleApproveProject(project._id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg transition-colors">
                          Approve
                        </button>
                        <button onClick={() => handleRejectProject(project._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
