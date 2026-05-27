import { Link, useLocation } from "react-router-dom";
import finbGif from "../../assets/finb.gif";
import { LayoutDashboard, PiggyBank, ArrowLeftRight, BarChart2, Settings } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { name: "Home", to: "/", icon: LayoutDashboard },
    { name: "Budgets", to: "/budgets", icon: PiggyBank },
    { name: "Transactions", to: "/transaction", icon: ArrowLeftRight },
    { name: "Insights", to: "/insights", icon: BarChart2 },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 flex flex-col h-full shrink-0"
      style={{ background: "linear-gradient(180deg, #0D0D0D 0%, #080808 100%)", borderRight: "1px solid #1a1a1a" }}>
      
      {/* Logo */}
      <div className="flex flex-col items-center justify-center p-8 gap-3"
        style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl blur-xl opacity-40"
            style={{ background: "rgba(255,107,0,0.4)" }} />
          <img
            className="relative w-20 h-20 object-cover rounded-2xl"
            style={{ border: "1px solid rgba(255,107,0,0.3)", boxShadow: "0 0 24px rgba(255,107,0,0.25)" }}
            src={finbGif}
            alt="finboard icon"
          />
        </div>
        <span
          className="text-2xl text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(135deg, #FF6B00 0%, #FF8C00 50%, #FFA500 100%)",
            fontFamily: "'Righteous', 'Bungee', cursive",
            filter: "drop-shadow(0 2px 8px rgba(255,107,0,0.4))"
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
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-200"
              }`}
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(255,107,0,0.15) 0%, rgba(255,107,0,0.05) 100%)",
                border: "1px solid rgba(255,107,0,0.25)",
                boxShadow: "0 4px 16px rgba(255,107,0,0.08)"
              } : {
                background: "transparent",
                border: "1px solid transparent",
              }}
            >
              <Icon
                size={18}
                className={isActive ? "text-[#FF6B00]" : "text-gray-600"}
              />
              {link.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 flex flex-col gap-2" style={{ borderTop: "1px solid #1a1a1a" }}>
        
          <a href="https://github.com/khanirfan18"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider text-gray-500 hover:text-white transition-all duration-200"
          style={{ border: "1px solid #1a1a1a" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          GITHUB
        </a>
        
          <a href="https://irfandev.me"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider text-gray-500 hover:text-white transition-all duration-200"
          style={{ border: "1px solid #1a1a1a" }}
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