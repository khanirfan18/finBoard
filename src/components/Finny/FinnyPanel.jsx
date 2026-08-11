export default function FinnyPanel({ isOpen, onClose, user }) {
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
      <div className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Finny</h2>
          <button onClick={onClose} aria-label="Close Finny" className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        {!user ? (
          <p>Please sign in first to use Finny.</p>
        ) : (
          // Out of scope for this issue: chatbot Q&A flow / AI integration.
          <p>Finny is ready. (Chatbot experience coming soon.)</p>
        )}
      </div>
    </div>
  );
}