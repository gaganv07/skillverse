import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../providers/ThemeProvider";
import { useLanguage } from "../../providers/LanguageProvider";
import { useAuth } from "../../providers/AuthProvider";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/talents", label: "Talents" },
  { to: "/feed", label: "Community" },
  { to: "/competitions", label: "Events" },
  { to: "/leaderboards", label: "Leaderboards" }
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="section-shell py-4">
        <div className="glass-card flex items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-700 dark:text-brand-200">
            <img src="/logo.jpg" alt="SkillVerse Logo" className="h-8 w-8 object-cover rounded-md" />
            SkillVerse
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
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
              <button onClick={logout} className="primary-button px-4 py-2 text-sm">
                Logout
              </button>
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
