import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import Transaction from "./pages/Transaction";
import InsightsDashboard from "./pages/InsightsDashboard"; 
import Layout from "./components/layout/Layout";
import { AppContext } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalProvider";
import { ThemeProvider } from "./context/ThemeContext";
import Modal from "./components/Modal";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import { isConfigured, configErrorMessage } from "./lib/supabaseClient";

function ConfigError() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '40px auto', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
      <h1 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '1rem' }}>Configuration Error</h1>
      <p style={{ marginBottom: '1rem' }}>{configErrorMessage}</p>
      <div style={{ background: '#1e293b', color: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>To fix this:</p>
        <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Create a <code>.env</code> file in the root of the project</li>
          <li>Add your Supabase URL and Anon Key</li>
          <li>Restart the development server</li>
        </ol>
      </div>
    </div>
  );
}

export default function App() {
  if (!isConfigured) {
    return <ConfigError />;
  }

  return (
    <>
      <ThemeProvider>
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
                  <Route path="goals" element={<Goals />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <Modal />
          </ModalProvider>
        </AppContext>
      </AuthProvider>
      </ThemeProvider>
    </>
  );
}