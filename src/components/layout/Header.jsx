import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    const title = path.replace("/", "");
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const getPageSubtitle = () => {
    const path = location.pathname;
    if (path === "/") return "Your financial overview";
    if (path === "/budgets") return "Track your spending limits";
    if (path === "/transaction") return "All your transactions";
    if (path === "/insights") return "Spending analytics";
    if (path === "/settings") return "Configure your preferences";
    return "";
  };

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

      <div className="ml-auto flex items-center gap-3">

      </div>
    </header>
  );
}