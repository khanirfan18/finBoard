import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useAuth } from "../../context/useAuth";
import FinnyPanel from "./FinnyPanel";
import { shouldShowFinny } from "../../lib/finnyGating";
import catIcon from "../../assets/icons8-cat-96.png";

export default function Finny() {
  const { transactions } = useContext(DataContext);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!shouldShowFinny(transactions?.length)) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Finny"
        className="fixed z-50 rounded-full shadow-lg flex items-center justify-center transition-opacity hover:opacity-90"
        style={{
          bottom: "8rem", 
          right: "1.5rem",
          width: "56px",
          height: "56px",
          background: "#2b2b2b",
        }}
      >
        <img
          src={catIcon}
          alt="Finny"
          style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />
      </button>
      <FinnyPanel isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />
    </>
  );
}
