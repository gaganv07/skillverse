import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, getRoleRedirect } from "../providers/AuthProvider";

// SVG Eye Icons (inline to avoid external dependencies)
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-400 dark:text-slate-500">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-400 dark:text-slate-500">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user, authError, clearError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  // If user is already logged in, redirect based on role
  useEffect(() => {
    if (user) {
      navigate(getRoleRedirect(user.role), { replace: true });
    }
  }, [user, navigate]);

  // Sync auth errors to local error state
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  // Clear errors when user modifies input
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (localError) {
      setLocalError("");
      clearError();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");
    clearError();

    // Client-side validation
    if (!form.email.trim()) {
      setLocalError("Please enter your email address");
      return;
    }

    if (!form.password) {
      setLocalError("Please enter your password");
      return;
    }

    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(form);

      if (result.success && result.user) {
        const redirectPath = getRoleRedirect(result.user.role);
        navigate(redirectPath, { replace: true });
      } else {
        setLocalError(result.message || "Login failed. Please try again.");
      }
    } catch {
      setLocalError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-400/8 rounded-full blur-3xl" style={{ animation: "pulse 4s ease-in-out infinite" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-brand-300/5 to-indigo-300/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-brand-400/30 to-indigo-400/30 blur-lg" />
          <img
            src="/skillverse-logo.png"
            alt="SkillVerse Logo"
            className="relative w-20 h-20 object-cover rounded-2xl shadow-xl border-2 border-white/50 dark:border-slate-700/50"
          />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
          Sign in to access your SkillVerse dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="glass-card p-8 sm:p-10">
          {/* Error Alert */}
          {localError && (
            <div
              id="login-error-alert"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200/60 bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-900/20 dark:text-red-300"
              role="alert"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  id="login-email"
                  className="w-full rounded-2xl border border-slate-300/80 bg-white/70 pl-12 pr-4 py-3.5 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field with Toggle */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="login-password"
                  className="w-full rounded-2xl border border-slate-300/80 bg-white/70 pl-12 pr-12 py-3.5 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                  disabled={isSubmitting}
                />
                {/* Password Visibility Toggle Button */}
                <button
                  id="toggle-password-visibility"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-400/30 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-button"
              type="submit"
              className="primary-button w-full py-4 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-brand-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerIcon />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/50" />
            <span className="text-xs text-slate-400 dark:text-slate-500">Institutional Access</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/50" />
          </div>

          {/* Info note */}
          <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            SkillVerse accounts are managed by your institution.
            <br />
            Contact your teacher or admin for access.
          </p>
        </div>

        {/* Security footer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <LockIcon />
          <span>Secured with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}
