import { Link, useLocation } from "react-router-dom";

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
          src="src/assets/finb.gif"
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
    </div>
  );
}
