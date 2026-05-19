import React from 'react'
import { DataContext, ThemeContext } from './contexts';

const THEME_COLORS = {
  dark: {
    bg: "#0A0A0A",
    card: "#111111",
    surface: "#1A1A1A",
    border: "#1F1F1F",
    text: "#FFFFFF",
    muted: "#9CA3AF",
    subtle: "#6B7280",
    chartGrid: "#2A2A2A",
    chartTick: "#888888",
    tooltipText: "#E0E0E0",
    hover: "rgba(255, 255, 255, 0.05)"
  },
  light: {
    bg: "#F7F4EF",
    card: "#FFFFFF",
    surface: "#EEE7DC",
    border: "#D8CFC1",
    text: "#1E1A16",
    muted: "#5E554B",
    subtle: "#7F7468",
    chartGrid: "#D8CFC1",
    chartTick: "#6F665C",
    tooltipText: "#1E1A16",
    hover: "rgba(255, 107, 0, 0.08)"
  }
};

export function AppContext({children}){
  const [transactions, setTransactions] = React.useState(JSON.parse(localStorage.getItem( 'transactions'))|| [])
  const [theme, setTheme] = React.useState(() => localStorage.getItem("theme") || "dark");

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: THEME_COLORS[theme] }}>
      <DataContext.Provider value={{transactions,setTransactions}}>
        {children}
      </DataContext.Provider>
    </ThemeContext.Provider>
  )
}
