import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard Overview";
    const title = path.replace("/", "");
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <header className="h-20 border-b border-white/5 bg-[#06080A]/80 backdrop-blur-md flex items-center px-6 md:px-10 shrink-0 gap-6 transition-all duration-300 w-full z-40 shadow-sm sticky top-0">
      <label htmlFor="mobile-drawer" className="p-2.5 cursor-pointer hover:bg-white/10 rounded-xl transition-colors lg:hidden text-emerald-400 border border-transparent hover:border-emerald-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
      </label>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white truncate">
          {getPageTitle()}
        </h1>
        <p className="text-xs text-gray-500 font-medium hidden md:block mt-0.5">Welcome back to your financial command center</p>
      </div>
      
      {/* Optional: Add a subtle user profile avatar or notification bell placeholder on the right if needed, but keeping it minimal for now. */}
      <div className="ml-auto flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-sm font-bold shadow-lg shadow-emerald-500/20">
          FB
        </div>
      </div>
    </header>
  );
}
