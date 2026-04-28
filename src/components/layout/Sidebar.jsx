import { Link, useLocation } from "react-router-dom";
import finbGif from "../../assets/finb.gif";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { name: "HOME", to: "/" },
    { name: "BUDGETS", to: "/budgets" },
    { name: "TRANSACTIONS", to: "/transaction" },
    { name: "SETTINGS", to: "/settings" }
  ];

  return (
    <div className="w-64 bg-fin-card border-r border-fin-border flex flex-col h-full shrink-0 shadow-2xl lg:shadow-none">
      <div className="flex flex-col items-center justify-center p-8 gap-4 border-b border-fin-border bg-[#0A0A0A]">
        <img
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border border-[#FF6B00]/40 shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all duration-300"
          src={finbGif}
          alt="finboard icon"
        />
        <span 
          className="text-3xl text-transparent bg-clip-text bg-gradient-to-b from-[#FF6B00] to-[#FF8C00] text-center"
          style={{ fontFamily: "'Righteous', 'Bungee', cursive", filter: "drop-shadow(3px 3px 0px #1F1F1F)" }}
        >
          FINBOARD
        </span>
      </div>

      <nav className="flex flex-col flex-1 py-8 px-4 gap-2 overflow-y-auto">
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
              className={`px-4 py-3 text-sm font-bold tracking-widest transition-all duration-200 border-l-4 ${
                isActive
                  ? "border-[#FF6B00] bg-[#1a1a1a] text-[#FF6B00]"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-[#1a1a1a] hover:border-[#FF6B00]/50"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Icons Section */}
      <div className="p-6 border-t border-[#1F1F1F] flex justify-center gap-6 mt-auto bg-[#0A0A0A]">
        {/* GitHub Link */}
        <a 
          href="https://github.com/khanirfan18" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-400 hover:text-[#FF6B00] transition-colors hover:scale-110"
          title="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        
        {/* Portfolio Link - Opens in a new tab */}
        <a 
          href="#" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-400 hover:text-[#FF6B00] transition-colors hover:scale-110"
          title="Portfolio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}
