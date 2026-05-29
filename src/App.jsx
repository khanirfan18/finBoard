import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";
import Transaction from "./pages/Transaction";
import InsightsDashboard from "./pages/InsightsDashboard"; 
import Layout from "./components/layout/Layout";
import { AppContext } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import Modal from "./components/Modal";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <>
      <AuthProvider>
        <AppContext>
          <ModalProvider>
            <BrowserRouter>
              <Routes>
                {/* ── Public auth routes  */}
                <Route
                  path="/signin"
                  element={
                    <GuestRoute>
                      <SignIn />
                    </GuestRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <GuestRoute>
                      <SignUp />
                    </GuestRoute>
                  }
                />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* ── Protected routes  */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="budgets" element={<Budgets />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="transaction" element={<Transaction />} />
                  <Route path="insights" element={<InsightsDashboard />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <Modal />
          </ModalProvider>
        </AppContext>
      </AuthProvider>
    </>
  );
}