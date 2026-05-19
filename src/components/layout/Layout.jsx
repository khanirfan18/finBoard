import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="drawer lg:drawer-open text-white min-h-screen bg-[#0A0A0A]">
      
      <input
        id="mobile-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      {/* Main Content */}
      <div className="drawer-content flex flex-col min-h-screen">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50">
        <label
          htmlFor="mobile-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <Sidebar />
      </div>
    </div>
  );
}