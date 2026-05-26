import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    const title = path.replace("/", "");
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <header className="h-16 border-b border-fin-border bg-fin-card flex items-center px-4 md:px-8 shrink-0 gap-4 transition-all duration-300 w-full z-40">
      <label htmlFor="mobile-drawer" className="p-2 cursor-pointer hover:bg-[#1a1a1a] rounded-md transition-colors lg:hidden text-[#FF6B00]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </label>
      <h1 className="text-xl font-bold tracking-wider text-white uppercase truncate">
        {getPageTitle()}
      </h1>
    </header>
  );
}
