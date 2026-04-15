import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <>
      <Header />
      <div className="flex flex-row h-screen">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
}
