import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function Layout() {
  const { authError, clearAuthError } = useAuth();

  return (
    <div className="drawer lg:drawer-open theme-shell h-screen overflow-hidden">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col flex-1 h-screen overflow-hidden">
        <Header />
        {authError && (
          <div className="px-4 md:px-8 pt-4">
            <div className="auth-alert auth-alert--error" role="alert" aria-live="polite">
              <span>⚠</span>
              <span>{authError}</span>
              <button onClick={clearAuthError} className="auth-alert-close" aria-label="Dismiss auth error">
                ✕
              </button>
            </div>
          </div>
        )}
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
