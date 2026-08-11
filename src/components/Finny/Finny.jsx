import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useAuth } from "../../context/useAuth";
import FinnyPanel from "./FinnyPanel";

const MIN_TRANSACTIONS_TO_SHOW = 5;

export default function Finny() {
  const { transactions } = useContext(DataContext);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const hasMinTransactions = (transactions?.length || 0) > MIN_TRANSACTIONS_TO_SHOW;

  if (!hasMinTransactions) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Finny"
        className="fixed bottom-6 right-6 z-50 btn btn-primary rounded-full shadow-lg px-5 py-3"
      >
        Finny
      </button>
      <FinnyPanel isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />
    </>
  );
}