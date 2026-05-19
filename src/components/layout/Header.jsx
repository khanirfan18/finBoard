import { useLocation } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";
import React from "react";
import { ThemeContext } from "../../context/contexts";

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const isDark = theme === "dark";
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    const title = path.replace("/", "");
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <header className="h-16 border-b border-fin-border bg-fin-card flex items-center px-4 md:px-8 shrink-0 gap-4 transition-all duration-300 w-full z-40">
      <label htmlFor="mobile-drawer" className="p-2 cursor-pointer hover:bg-fin-surface rounded-md transition-colors lg:hidden text-fin-orange" title="Open menu">
        <Menu size={24} strokeWidth={3} />
      </label>
      <h1 className="text-xl font-bold tracking-wider text-fin-text uppercase truncate">
        {getPageTitle()}
      </h1>
      <button
        type="button"
        onClick={toggleTheme}
        className="ml-auto inline-flex h-10 w-10 items-center justify-center border border-fin-border bg-fin-bg text-fin-orange transition-all hover:border-fin-orange hover:bg-fin-surface focus:outline-none focus:ring-2 focus:ring-fin-orange/40"
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        title={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
