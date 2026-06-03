import { useState, useContext } from "react";
import Papa from "papaparse";
import { DataContext, CURRENCIES } from "../context/AppContext";
import { demoData } from "../data/demoData";
import { normalizeTransactions } from "../lib/transactionNormalizer";
import { format } from "date-fns";
import { useModal } from "../context/ModalContext";
import { Database, Upload, PenLine, Coins, AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";

// =========================
// REUSABLE SECTION COMPONENT
// =========================
const Section = ({ title, subtitle, icon: Icon, children, right, className = "" }) => (
  <div className={`fin-card p-6 md:p-8 flex flex-col gap-6 ${className}`}>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-3 rounded-xl bg-[#111] border border-[#222] text-[#FF6B00]">
            <Icon size={24} />
          </div>
        )}
        <div className="space-y-1 mt-1">
          <h2 className="text-xl font-black uppercase tracking-widest text-[#FF6B00]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right && <div>{right}</div>}
    </div>
    <div className="w-full">
      {children}
    </div>
  </div>
);

// Category options matching the app's category system
const CATEGORIES = [
  "Food",
  "Shopping",
  "Bills",
  "Health",
  "Transport",
  "Entertainment",
  "Education",
  "Travel",
  "Other",
];

export default function Settings() {
  const {
    transactions,
    setTransactions,
    currency,
    updateCurrency,
    addTransaction
  } = useContext(DataContext);

  const { showModal } = useModal();

  const [showManualEntry, setShowManualEntry] = useState(true);
  const [importMode, setImportMode] = useState("replace");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [manualTransaction, setManualTransaction] = useState({
    Date: format(new Date(), "dd/MM/yyyy"),
    Description: "",
    Amount: "",
    Category: "Other",
  });

  // =========================
  // CSV IMPORT
  // =========================
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const parsedData = (results.data || []).filter(
          (row) => row?.Date && row?.Description && row?.Amount
        );

        if (parsedData.length === 0) {
          setLoading(false);
          showModal({
            type: "alert",
            message: "The uploaded CSV is empty or invalid.",
          });
          return;
        }

        const requiredKeys = ["Date", "Description", "Amount", "Category"];
        const hasAllKeys = requiredKeys.every((key) => key in parsedData[0]);

        if (!hasAllKeys) {
          setLoading(false);
          showModal({
            type: "alert",
            message:
              "Invalid CSV format. Required: Date, Description, Amount, Category.",
          });
          return;
        }

        const mapped = parsedData.map((item) => ({
          Date: item.Date,
          Description: item.Description,
          Amount: item.Amount,
          Category: item.Category,
          Currency: currency,
          source: 'csv',
        }));

        const normalizedData = normalizeTransactions(mapped, { currency, source: 'csv' });

        const updatedData =
          importMode === "append"
            ? [...(transactions || []), ...normalizedData]
            : normalizedData;

        setTransactions(updatedData);
        localStorage.setItem("transactions", JSON.stringify(updatedData));

        setLoading(false);
        setSuccessMessage("CSV Imported Successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      },

      error: () => {
        setLoading(false);
        showModal({
          type: "alert",
          message: "Failed to parse CSV file.",
        });
      },
    });

    e.target.value = "";
  };

  // =========================
  // MANUAL ENTRY
  // =========================
  const handleManualSubmit = (e) => {
    e.preventDefault();

    if (
      !manualTransaction.Date ||
      !manualTransaction.Description ||
      !manualTransaction.Amount
    ) {
      showModal({ type: "alert", message: "Please fill all fields" });
      return;
    }

    const newTransaction = {
      Date: manualTransaction.Date,
      Description: manualTransaction.Description,
      Amount: transactionType === "expense"
        ? -Math.abs(Number(manualTransaction.Amount))
        : Math.abs(Number(manualTransaction.Amount)),
      category: manualTransaction.Category,
      Currency: currency,
      source: 'manual',
    };

    addTransaction(newTransaction);

    setManualTransaction({
      Date: format(new Date(), "dd/MM/yyyy"),
      Description: "",
      Amount: "",
      Category: "Other",
    });

    setSuccessMessage("Transaction Added!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const clearAllData = () => {
    showModal({
      type: "confirm",
      message: "Are you sure you want to clear all data? This action cannot be undone.",
      onConfirm: () => {
        setTransactions([]);
        localStorage.removeItem("transactions");
        setSuccessMessage("All Data Cleared!");
        setTimeout(() => setSuccessMessage(""), 3000);
      },
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in">

      {successMessage && (
        <div className="rounded-xl border border-[#00C49F]/30 bg-[#111] px-6 py-4 flex items-center gap-3 text-sm font-bold tracking-wide text-[#00C49F] shadow-lg shadow-[#00C49F]/10 sticky top-4 z-50 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          {successMessage}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-lg text-[#FF6B00]" />
        </div>
      )}

      {/* DATA SOURCE */}
      <Section
        title="Data Source"
        subtitle="Upload CSV or load demo financial data to populate your dashboard"
        icon={Database}
        right={
          <div className="flex overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#111]">
            {["replace", "append"].map((mode) => (
              <button
                key={mode}
                onClick={() => setImportMode(mode)}
                className={`h-10 px-6 text-xs font-bold uppercase transition-all ${
                  importMode === mode
                    ? "bg-[#FF6B00] text-[whitesmoke]"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <input
              type="file"
              accept=".csv"
              onChange={handleFile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Upload CSV"
            />
            <div className="retro-card flex flex-col items-center justify-center p-8 border-dashed border-2 border-[#2a2a2a] group-hover:border-[#FF6B00]/50 transition-colors h-full text-center">
              <Upload size={32} className="text-gray-400 group-hover:text-[#FF6B00] transition-colors mb-4" />
              <p className="text-sm font-bold uppercase tracking-wider text-gray-300">Upload CSV File</p>
              <p className="text-xs text-gray-500 mt-2">Click or drag & drop</p>
            </div>
          </div>

          <div className="retro-card flex flex-col items-center justify-center p-8 border-dashed border-2 border-transparent h-full text-center space-y-4">
            <p className="text-sm font-bold text-gray-300">Don't have a CSV ready?</p>
            <p className="text-xs text-gray-500 mb-2">Populate your dashboard with realistic demo data to explore all features.</p>
            <button
                onClick={() => {
                  const mapped = demoData.map((d) => ({ ...d, source: 'demo' }));
                  const normalized = normalizeTransactions(mapped, { currency, source: 'demo' });

                  const updated = importMode === "append" ? [...(transactions || []), ...normalized] : normalized;

                  setTransactions(updated);
                  localStorage.setItem("transactions", JSON.stringify(updated));
                  setSuccessMessage("Demo Data Loaded!");
                  setTimeout(() => setSuccessMessage(""), 3000);
                }}
              className="retro-btn w-full max-w-[240px]"
            >
              Load Demo Data
            </button>
          </div>
        </div>
      </Section>

      {/* MANUAL ENTRY */}
      <Section
        title="Manual Entry"
        subtitle="Quickly add new transactions manually"
        icon={PenLine}
        right={
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="h-10 px-5 rounded-lg border border-[#2a2a2a] bg-[#111] text-xs font-bold uppercase text-gray-300 hover:text-white hover:border-[#FF6B00]/50 transition-colors"
          >
            {showManualEntry ? "Hide Form" : "Show Form"}
          </button>
        }
      >
        {showManualEntry && (
          <form onSubmit={handleManualSubmit} className="space-y-6 pt-2">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* DATE */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={
                    manualTransaction.Date
                      ? manualTransaction.Date.split("/").reverse().join("-")
                      : ""
                  }
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const [year, month, day] = e.target.value.split("-");
                    setManualTransaction({
                      ...manualTransaction,
                      Date: `${day}/${month}/${year}`,
                    });
                  }}
                  className="retro-input w-full p-4"
                />
              </div>

              {/* CATEGORY */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Category
                </label>
                <select
                  value={manualTransaction.Category}
                  onChange={(e) =>
                    setManualTransaction({
                      ...manualTransaction,
                      Category: e.target.value,
                    })
                  }
                  className="retro-input w-full p-4"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter description"
                  value={manualTransaction.Description}
                  onChange={(e) =>
                    setManualTransaction({
                      ...manualTransaction,
                      Description: e.target.value,
                    })
                  }
                  className="retro-input w-full p-4"
                />
              </div>

              {/* AMOUNT TYPE TOGGLE */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Transaction Type
                </label>
                <div className="flex rounded-lg overflow-hidden border border-[#2a2a2a] h-[54px]">
                  <button
                    type="button"
                    onClick={() => setTransactionType("expense")}
                    className={`flex-1 text-sm font-bold uppercase tracking-wider transition-colors ${
                      transactionType === "expense"
                        ? "bg-[#FF6B6B] text-white border-r border-[#2a2a2a]"
                        : "bg-[#111] text-gray-400 hover:text-white border-r border-[#2a2a2a]"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType("income")}
                    className={`flex-1 text-sm font-bold uppercase tracking-wider transition-colors ${
                      transactionType === "income"
                        ? "bg-[#00C49F] text-white"
                        : "bg-[#111] text-gray-400 hover:text-white"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* AMOUNT VALUE */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 font-medium">
                    {currency?.symbol || "$"}
                  </div>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={manualTransaction.Amount}
                    onChange={(e) =>
                      setManualTransaction({
                        ...manualTransaction,
                        Amount: e.target.value,
                      })
                    }
                    className="retro-input w-full p-4 pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#2a2a2a]">
              <button
                type="submit"
                className="retro-btn w-full md:w-auto md:min-w-[200px]"
              >
                Add Transaction
              </button>
            </div>
          </form>
        )}
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CURRENCY */}
        <Section 
          title="Currency Settings" 
          subtitle="Set your preferred display currency"
          icon={Coins}
        >
          <div className="space-y-4">
            <select
              value={currency?.code || ""}
              onChange={(e) => {
                const selected = CURRENCIES.find((c) => c.code === e.target.value);
                if (selected) updateCurrency(selected);
              }}
              className="retro-input w-full p-4"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} — {c.name}
                </option>
              ))}
            </select>
          </div>
        </Section>

        {/* DANGER ZONE */}
        <Section 
          title="Danger Zone" 
          subtitle="Irreversible destructive actions"
          icon={AlertTriangle}
          className="border-[#FF6B6B]/20 hover:border-[#FF6B6B]/40"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
            <div>
              <h3 className="font-bold text-red-500 mb-1">Clear All Transactions</h3>
              <p className="text-xs text-gray-400">Permanently delete all your financial data.</p>
            </div>
            <button
              type="button"
              onClick={clearAllData}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-6 py-3 text-sm font-black uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 size={16} />
              Clear Data
            </button>
          </div>
        </Section>
      </div>

      {/* OVERVIEW */}
      {transactions?.length > 0 && (
        <div className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest pt-4">
          Total Transactions Recorded: <span className="text-[#FF6B00]">{transactions.length}</span>
        </div>
      )}
    </div>
  );
}
