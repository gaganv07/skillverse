import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import ProjectsPage from "./pages/ProjectsPage";
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/talents" element={<TalentsPage />} />
        <Route path="/students/:id" element={<ProfilePage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="/leaderboards" element={<LeaderboardPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
