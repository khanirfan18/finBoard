import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, User, Settings } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);

    const signedOut = await signOut();

    if (signedOut) {
      navigate("/signin");
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "Dashboard";
    const title = path.replace("/", "");
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const getPageSubtitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "Your financial overview";
    if (path === "/budgets") return "Track your spending limits";
    if (path === "/transaction") return "All your transactions";
    if (path === "/insights") return "Spending analytics";
    if (path === "/settings") return "Configure your preferences";
    if (path === "/profile") return "View and manage your profile";
    if (path === "/preferences") return "Customize your experience";
    return "";
  };

  // Extract display name and email from Supabase user
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="theme-header h-16 flex items-center px-4 md:px-8 shrink-0 gap-4 w-full z-40"
      style={{
        backdropFilter: "blur(12px)",
      }}
    >
      <label htmlFor="mobile-drawer"
        className="theme-icon-button p-2 cursor-pointer rounded-lg transition-colors lg:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </label>

      <div className="flex flex-col">
        <h1 className="text-base font-bold text-[var(--color-fin-text)] tracking-wide leading-tight">
          {getPageTitle()}
        </h1>
        <p className="text-xs text-[var(--color-fin-muted)] leading-tight">{getPageSubtitle()}</p>
      </div>

      {/* ── Auth / Profile section ─────────────────────────────────── */}
      <div className="flex items-center gap-3 relative ml-auto" ref={dropdownRef}>
        {!user ? (
          <>
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="text-sm font-semibold text-[var(--color-fin-muted)] hover:text-[var(--color-fin-text)] transition-colors px-2 py-1.5"
              id="guest-signin-btn"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-sm font-bold px-3 py-1.5 rounded-lg text-[var(--color-fin-text)] transition-colors"
              style={{
                background: "var(--color-fin-accent-soft)",
                border: "1px solid color-mix(in srgb, var(--color-fin-accent) 35%, transparent)",
              }}
              id="guest-signup-btn"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="profile-trigger"
              id="profile-menu-btn"
            >
              <div className="profile-avatar">
                {initials}
              </div>
              <span className="profile-name hidden md:block">{displayName}</span>
              <ChevronDown
                size={14}
                className="profile-chevron hidden md:block"
                style={{
                  transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  color: "var(--color-fin-muted)",
                }}
              />
            </button>

            {profileOpen && (
              <div className="profile-dropdown animate-in">
                <div className="h-1 w-full rounded-t-xl mb-3"
                  style={{ background: "linear-gradient(90deg, var(--color-fin-accent), #f97316)" }} />

                <div className="profile-dropdown-header">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--color-fin-accent), #f97316)" }}>
                    {initials}
                  </div>
                  <div className="profile-dropdown-info">
                    <span className="profile-dropdown-name">{displayName}</span>
                    <span className="profile-dropdown-email">{displayEmail}</span>
                  </div>
                </div>

                <div className="profile-dropdown-divider" />

                <button
                  onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                  className="profile-dropdown-item flex items-center gap-3 group"
                >
                  <div className="p-1.5 rounded-lg bg-[var(--color-fin-accent)]/10 group-hover:bg-[var(--color-fin-accent)]/20 transition-colors">
                    <User size={14} className="text-[var(--color-fin-accent)]" />
                  </div>
                  View Profile
                </button>

                <button
                  onClick={() => { setProfileOpen(false); navigate("/preferences"); }}
                  className="profile-dropdown-item flex items-center gap-3 group"
                >
                  <div className="p-1.5 rounded-lg bg-blue-400/10 group-hover:bg-blue-400/20 transition-colors">
                    <Settings size={14} className="text-blue-400" />
                  </div>
                  Preferences
                </button>

                <div className="profile-dropdown-divider" />

                <button
                  onClick={handleSignOut}
                  className="profile-dropdown-item profile-dropdown-item--danger flex items-center gap-3 group"
                  id="signout-btn"
                >
                  <div className="p-1.5 rounded-lg bg-red-400/10 group-hover:bg-red-400/20 transition-colors">
                    <LogOut size={14} className="text-red-400" />
                  </div>
                  Sign out
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
