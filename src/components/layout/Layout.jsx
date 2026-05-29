import Header from "./Header";
import Sidebar from "./Sidebar";
import AIFinanceChatbot from "../AIFinanceChatbot";
import { DataContext } from "../../context/AppContextValue";
import { Outlet, useLocation } from "react-router-dom";
import React from "react";

const chatbotPages = {
  "/": "dashboard",
  "/budgets": "budgets",
  "/transaction": "transactions",
  "/insights": "insights",
};

export default function Layout() {
  const { transactions, currency } = React.useContext(DataContext);
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const chatbotPage = chatbotPages[normalizedPath];

  return (
    <div className="drawer lg:drawer-open text-white h-screen overflow-hidden">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col flex-1 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
        {chatbotPage && (
          <AIFinanceChatbot
            key={chatbotPage}
            transactions={transactions}
            currency={currency}
            page={chatbotPage}
          />
        )}
      </div> 
      <div className="drawer-side z-50">
        <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label> 
        <Sidebar />
      </div>
    </div>
  );
}
