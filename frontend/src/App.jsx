import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import ProjectsPage from "./pages/ProjectsPage";
import UploadProjectPage from "./pages/UploadProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import EditProjectPage from "./pages/EditProjectPage";
import TalentsPage from "./pages/TalentsPage";
import ProfilePage from "./pages/ProfilePage";
import CompetitionsPage from "./pages/CompetitionsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import SearchPage from "./pages/SearchPage";
import MessagesPage from "./pages/MessagesPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/talents" element={<TalentsPage />} />
        <Route path="/leaderboards" element={<LeaderboardPage />} />

        {/* Protected Routes (Any authenticated user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/projects/new" element={<UploadProjectPage />} />
          <Route path="/projects/:id/edit" element={<EditProjectPage />} />
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/students/:id" element={<ProfilePage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Route>

        {/* Role-based Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["teacher", "admin"]} />}>
          <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
