import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";
import Transaction from "./pages/Transaction";
import Layout from "./components/layout/Layout";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="settings" element={<Settings />} />
            <Route path="transaction" element={<Transaction />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
