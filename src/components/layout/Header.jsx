import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
    await signOut();
    navigate("/signin");
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
      className="h-16 flex items-center px-4 md:px-8 shrink-0 gap-4 w-full z-40"
      style={{
        background: "rgba(10,10,10,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      <label htmlFor="mobile-drawer"
        className="p-2 cursor-pointer rounded-lg transition-colors lg:hidden"
        style={{ color: "#FF6B00" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </label>

      <div className="flex flex-col">
        <h1 className="text-base font-bold text-white tracking-wide leading-tight">
          {getPageTitle()}
        </h1>
        <p className="text-xs text-gray-500 leading-tight">{getPageSubtitle()}</p>
      </div>

      {/* ── Profile section ──────────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-3 relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="profile-trigger"
          id="profile-menu-btn"
        >
          {/* Avatar */}
          <div className="profile-avatar">
            {initials}
          </div>
          {/* Name (hidden on mobile) */}
          <span className="profile-name hidden md:block">{displayName}</span>
          <ChevronDown
            size={14}
            className="profile-chevron hidden md:block"
            style={{
              transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              color: "#666",
            }}
          />
        </button>

        {/* Dropdown */}
        {profileOpen && (
          <div className="profile-dropdown animate-in">
            {/* User info */}
            <div className="profile-dropdown-header">
              <div className="profile-avatar profile-avatar--lg">
                {initials}
              </div>
              <div className="profile-dropdown-info">
                <span className="profile-dropdown-name">{displayName}</span>
                <span className="profile-dropdown-email">{displayEmail}</span>
              </div>
            </div>

            <div className="profile-dropdown-divider" />

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="profile-dropdown-item profile-dropdown-item--danger"
              id="signout-btn"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}