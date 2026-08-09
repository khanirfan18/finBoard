import { Link, useLocation } from "react-router-dom";
import finbGif from "../../assets/finboard.gif";
import { useAuth } from "../../context/useAuth";

import {
  LayoutDashboard,
  PiggyBank,
  ArrowLeftRight,
  BarChart2,
  Settings,
  Target,
  CircleHelp,
  Lock,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  const links = [
    { name: "Home", to: "/", icon: LayoutDashboard },
    { name: "Budgets", to: "/budgets", icon: PiggyBank, requiresAuth: true },
    { name: "Goals", to: "/goals", icon: Target, requiresAuth: true },
    { name: "Transactions", to: "/transaction", icon: ArrowLeftRight },
    { name: "Insights", to: "/insights", icon: BarChart2 },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <div className="theme-sidebar w-64 flex flex-col h-screen shrink-0">
      {/* Logo */}
      <div
        className="flex flex-col items-center justify-center px-4 py-4 md:px-6 md:py-5 gap-2 shrink-0"
        style={{ borderBottom: "1px solid var(--color-fin-border)" }}
      >
        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl blur-xl opacity-40"
            style={{ background: "var(--color-fin-accent-soft)" }}
          />
          <img
            className="relative w-12 h-12 md:w-14 md:h-14 object-cover rounded-xl"
            style={{
              border: "1px solid var(--color-fin-border-hover)",
              boxShadow: "0 0 24px var(--color-fin-shadow-accent)",
            }}
            src={finbGif}
            alt="finboard icon"
          />
        </div>
        <span
          className="text-lg md:text-xl text-transparent bg-clip-text"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--color-fin-accent) 0%, var(--color-fin-accent-strong) 100%)",
            fontFamily: "'Righteous', 'Bungee', cursive",
            filter: "drop-shadow(0 2px 8px var(--color-fin-shadow-accent))",
          }}
        >
          FINBOARD
        </span>
        <span className="fin-badge">Personal Finance</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col py-3 px-3 gap-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = path === link.to;
          const Icon = link.icon;
          const isLocked = Boolean(link.requiresAuth && !user);

          return (
            <Link
              key={link.to}
              to={link.to}
              title={isLocked ? "Create an account to use Budgets and Goals." : undefined}
              onClick={() => {
                const drawer = document.getElementById("mobile-drawer");
                if (drawer) drawer.checked = false;
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "text-[var(--color-fin-text)]"
                  : "text-[var(--color-fin-muted)] hover:text-[var(--color-fin-text)]"
              }`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, var(--color-fin-accent-soft) 0%, transparent 100%)",
                      border:
                        "1px solid color-mix(in srgb, var(--color-fin-accent) 25%, transparent)",
                      boxShadow: "0 4px 16px var(--color-fin-shadow-accent)",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                    }
              }
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-[var(--color-fin-accent)]"
                    : "text-[var(--color-fin-muted)]"
                }
              />
              {link.name}
              {isLocked && (
                <Lock
                  size={14}
                  className="ml-auto text-[var(--color-fin-muted)]"
                  aria-label="Requires account"
                />
              )}
              {!isLocked && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-fin-accent)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Help Center replaces old Portfolio/Footer item */}
      <div
        className="p-3 flex flex-col gap-2 shrink-0 mt-auto"
        style={{ borderTop: "1px solid var(--color-fin-border)" }}
      >
        <Link
          to="/help"
          onClick={() => {
            const drawer = document.getElementById("mobile-drawer");
            if (drawer) drawer.checked = false;
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider text-[var(--color-fin-muted)] hover:text-[var(--color-fin-text)] transition-all duration-200"
          style={{ border: "1px solid var(--color-fin-border)" }}
        >
          <CircleHelp size={16} />
          HELP CENTER
        </Link>
      </div>
    </div>
  );
}