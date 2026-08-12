import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { isFinnyAuthorized } from "../../lib/finnyGating";
import gatooGif from "../../assets/gatooo.webp";
import finnnGif from "../../assets/finnn.gif";

export default function FinnyPanel({ isOpen, onClose, user }) {
  const panelRef = useRef(null);
  const authorized = isFinnyAuthorized(user);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="Finny"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 outline-none"
        style={{
          background: "var(--color-fin-surface, #14161a)",
          border: "1px solid rgba(249, 115, 22, 0.15)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Finny</h2>
          <button
            onClick={onClose}
            aria-label="Close Finny"
            className="rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>

        {!authorized ? (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <p className="font-medium">
              Finny is Arriving Shortly, sign in to use.
            </p>
            <img
              src={gatooGif}
              alt="Finny arriving soon"
              style={{ width: "96px", height: "96px", objectFit: "contain" }}
            />
            <div className="flex gap-2 mt-1">
              <Link
                to="/signin"
                className="rounded-md px-4 py-2 font-semibold text-white text-center transition-opacity hover:opacity-90"
                style={{ background: "var(--color-fin-accent, #f97316)" }}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-md px-4 py-2 font-semibold text-center border transition-colors hover:bg-white/5"
                style={{
                  borderColor: "var(--color-fin-accent, #f97316)",
                  color: "var(--color-fin-accent, #f97316)",
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <p className="font-medium">Finny is Arriving faster than u think :)</p>
            <img
              src={finnnGif}
              alt="Finny"
              style={{ width: "96px", height: "96px", objectFit: "contain" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
