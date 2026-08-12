import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import { useAuth } from "../../context/useAuth";
import FinnyPanel from "./FinnyPanel";
import { shouldShowFinny } from "../../lib/finnyGating";
import catIcon from "../../assets/icons8-cat-96.png";

const HIDDEN_ON_PATHS = ["/"]; 

export default function Finny() {
  const { transactions } = useContext(DataContext);
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (HIDDEN_ON_PATHS.includes(location.pathname)) {
    return null;
  }

  if (!shouldShowFinny(transactions?.length)) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Finny"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg flex items-center justify-center transition-opacity hover:opacity-90"
        style={{
          width: "64px",
          height: "64px",
          background: "#2b2b2b",
        }}
      >
        <img
          src={catIcon}
          alt="Finny"
          style={{ width: "44px", height: "44px", objectFit: "contain" }}
        />
      </button>
      <FinnyPanel isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />
    </>
  );
}
