import { Link, useLocation } from "react-router-dom";
import finbGif from "../../assets/finboard.gif";

import {
  LayoutDashboard,
  PiggyBank,
  ArrowLeftRight,
  BarChart2,
  Settings,
  Target,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { name: "Home", to: "/", icon: LayoutDashboard },
    { name: "Budgets", to: "/budgets", icon: PiggyBank },
    { name: "Goals", to: "/goals", icon: Target },
    { name: "Transactions", to: "/transaction", icon: ArrowLeftRight },
    { name: "Insights", to: "/insights", icon: BarChart2 },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <div className="theme-sidebar w-64 flex flex-col h-full shrink-0">
      
      {/* Logo */}
      <div className="flex flex-col items-center justify-center p-8 gap-3"
        style={{ borderBottom: "1px solid var(--color-fin-border)" }}>
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl blur-xl opacity-40"
            style={{ background: "var(--color-fin-accent-soft)" }} />
          <img
            className="relative w-20 h-20 object-cover rounded-2xl"
            style={{ border: "1px solid var(--color-fin-border-hover)", boxShadow: "0 0 24px var(--color-fin-shadow-accent)" }}
            src={finbGif}
            alt="finboard icon"
          />
        </div>
        <span
          className="text-2xl text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(135deg, var(--color-fin-accent) 0%, var(--color-fin-accent-strong) 100%)",
            fontFamily: "'Righteous', 'Bungee', cursive",
            filter: "drop-shadow(0 2px 8px var(--color-fin-shadow-accent))"
          }}
        >
          FINBOARD
        </span>
        <span className="fin-badge">Personal Finance</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1 py-6 px-3 gap-1 overflow-y-auto">
        <p className="fin-section-title px-3 mb-4">Navigation</p>
        {links.map((link) => {
          const isActive = path === link.to;
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => {
                const drawer = document.getElementById('mobile-drawer');
                if (drawer) drawer.checked = false;
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "text-[var(--color-fin-text)]"
                  : "text-[var(--color-fin-muted)] hover:text-[var(--color-fin-text)]"
              }`}
              style={isActive ? {
                background: "linear-gradient(135deg, var(--color-fin-accent-soft) 0%, transparent 100%)",
                border: "1px solid color-mix(in srgb, var(--color-fin-accent) 25%, transparent)",
                boxShadow: "0 4px 16px var(--color-fin-shadow-accent)"
              } : {
                background: "transparent",
                border: "1px solid transparent",
              }}
            >
              <Icon
                size={18}
                className={isActive ? "text-[var(--color-fin-accent)]" : "text-[var(--color-fin-muted)]"}
              />
              {link.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-fin-accent)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 flex flex-col gap-2" style={{ borderTop: "1px solid var(--color-fin-border)" }}>
        
          <a href="https://github.com/khanirfan18"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider text-[var(--color-fin-muted)] hover:text-[var(--color-fin-text)] transition-all duration-200"
          style={{ border: "1px solid var(--color-fin-border)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          GITHUB
        </a>
        
          <a href="https://irfandev.me"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider text-[var(--color-fin-muted)] hover:text-[var(--color-fin-text)] transition-all duration-200"
          style={{ border: "1px solid var(--color-fin-border)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          PORTFOLIO
        </a>
      </div>
    </div>
  );
}
