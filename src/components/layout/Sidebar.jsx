import { Link, useLocation } from "react-router-dom";
import { 
  Activity, 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  Settings, 
  Briefcase 
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { name: "Dashboard", to: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Budgets", to: "/budgets", icon: <Wallet size={20} /> },
    { name: "Transactions", to: "/transaction", icon: <ArrowRightLeft size={20} /> },
    { name: "Settings", to: "/settings", icon: <Settings size={20} /> }
  ];

  return (
    <div className="w-72 bg-[#06080A]/95 backdrop-blur-xl border-r border-white/5 flex flex-col h-full shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-50">
      <div className="flex flex-col items-center justify-center p-8 gap-4 border-b border-white/5 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] z-10">
          <Activity className="text-emerald-400 w-8 h-8" />
        </div>
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight z-10">
          FinBoard
        </span>
      </div>

      <nav className="flex flex-col flex-1 py-6 px-4 gap-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = path === link.to || (path === "/" && link.to === "/");
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => {
                const drawer = document.getElementById('mobile-drawer');
                if(drawer) drawer.checked = false;
              }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/5 text-emerald-400 shadow-sm border border-emerald-500/20"
                  : "text-gray-400 hover:text-gray-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={`transition-colors duration-300 ${isActive ? "text-emerald-400" : "text-gray-500"}`}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 flex justify-center gap-6 mt-auto">
        <a 
          href="https://github.com/khanirfan18" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 border border-transparent hover:border-emerald-500/20 shadow-sm"
          title="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        <a 
          href="#" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 border border-transparent hover:border-emerald-500/20 shadow-sm"
          title="Portfolio"
        >
          <Briefcase size={18} />
        </a>
      </div>
    </div>
  );
}
