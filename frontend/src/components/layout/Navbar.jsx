import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../providers/ThemeProvider";
import { useLanguage } from "../../providers/LanguageProvider";
import { useAuth, getRoleRedirect } from "../../providers/AuthProvider";

const publicLinks = [
  { to: "/projects", label: "Projects" },
  { to: "/competitions", label: "Events" },
  { to: "/leaderboards", label: "Leaderboards" }
];

function getDashboardLink(role) {
  if (role === "admin") return { to: "/admin-dashboard", label: "Dashboard" };
  if (role === "teacher") return { to: "/teacher-dashboard", label: "Dashboard" };
  return { to: "/feed", label: "Community" };
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navLinks = user
    ? [...publicLinks, getDashboardLink(user.role)]
    : publicLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="section-shell py-4">
        <div className="glass-card flex items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-700 dark:text-brand-200">
            <img src="/skillverse-logo.png" alt="SkillVerse Logo" className="h-8 w-8 object-cover rounded-md" />
            SkillVerse
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-slate-700 transition hover:text-brand-600 dark:text-slate-200"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-full border border-slate-300/60 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Kannada</option>
            </select>
            <button onClick={toggleTheme} className="secondary-button px-4 py-2 text-sm">
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:inline-block">
                  {user.fullName}
                </span>
                <button onClick={handleLogout} className="primary-button px-4 py-2 text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="primary-button px-4 py-2 text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
