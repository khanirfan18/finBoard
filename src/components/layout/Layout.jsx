import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="drawer lg:drawer-open text-white h-screen overflow-hidden">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col flex-1 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div> 
      <div className="drawer-side z-50">
        <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label> 
        <Sidebar />
      </div>
    </div>
  );
}
