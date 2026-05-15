import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../providers/ThemeProvider";
import { useLanguage } from "../../providers/LanguageProvider";
import { useAuth } from "../../providers/AuthProvider";
import NotificationDropdown from "./NotificationDropdown";

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
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  const navLinks = user
    ? [...publicLinks, getDashboardLink(user.role)]
    : publicLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="section-shell py-2 sm:py-4">
        <div className="glass-card flex items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-brand-700 dark:text-brand-200 sm:text-xl shrink-0">
            <img src="/skillverse-logo.png" alt="SkillVerse" className="h-7 w-7 sm:h-8 sm:w-8 object-cover rounded-md" />
            <span className="hidden xs:inline">SkillVerse</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}
                className={({ isActive }) => `text-sm font-medium transition hover:text-brand-600 dark:hover:text-brand-400 ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-700 dark:text-slate-200"}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Language — hide on small mobile */}
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="hidden sm:block rounded-full border border-slate-300/60 bg-white/70 px-2.5 py-1.5 text-xs sm:text-sm dark:border-slate-700 dark:bg-slate-900/70">
              <option>English</option><option>Hindi</option><option>Kannada</option>
            </select>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors" title="Toggle theme">
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              )}
            </button>

            {/* Notifications (logged in only) */}
            {user && <NotificationDropdown />}

            {/* Auth button — desktop */}
            {user ? (
              <button onClick={handleLogout} className="hidden sm:inline-flex primary-button px-4 py-2 text-sm">
                Logout
              </button>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex primary-button px-4 py-2 text-sm">
                Login
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle menu">
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-y-auto">
            <div className="p-5 pt-20 space-y-1">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to}
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${isActive ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                >
                  {link.label}
                </NavLink>
              ))}

              {user && (
                <NavLink to="/my-projects"
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${isActive ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                >
                  My Projects
                </NavLink>
              )}

              {user && (
                <NavLink to="/notifications"
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${isActive ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                >
                  Notifications
                </NavLink>
              )}

              <div className="border-t border-slate-200 dark:border-slate-700 my-3" />

              {/* Language selector */}
              <div className="px-4 py-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300/60 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900/70">
                  <option>English</option><option>Hindi</option><option>Kannada</option>
                </select>
              </div>

              <div className="px-4 pt-3">
                {user ? (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{user.fullName}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full primary-button py-3 text-sm">Logout</button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full primary-button py-3 text-sm block text-center">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
