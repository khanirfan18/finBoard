import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useAuth } from "../../context/useAuth";
import FinnyPanel from "./FinnyPanel";
import { shouldShowFinny } from "../../lib/finnyGating";

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
        className="fixed z-50 rounded-full shadow-lg px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        style={{
          bottom: "5.5rem", 
          right: "1.5rem",
          background: "var(--color-fin-accent, #f97316)",
        }}
      >
        Finny
      </button>
      <FinnyPanel isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />
    </>
  );
}
