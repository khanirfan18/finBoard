import { useState, useContext } from "react";
import Papa from "papaparse";
import { DataContext, CURRENCIES } from "../context/AppContext";
import { demoData } from "../data/demoData";
import { format } from "date-fns";
import { useModal } from "../context/ModalContext";

// =========================
// REUSABLE SECTION COMPONENT
// =========================
const Section = ({
  title,
  subtitle,
  children,
  right,
}) => (
  <div className="w-full rounded-[32px] border border-[#1F1F1F] bg-[#0B0B0B] p-6 md:p-8 transition-all duration-300 hover:border-[#FF6B00]/40 hover:shadow-[0_0_40px_rgba(255,107,0,0.06)]">

    {/* HEADER */}
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

      <div className="space-y-2">
        <h2 className="text-[28px] font-black uppercase tracking-[0.22em] text-[#FF6B00]">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {right}
    </div>

    {children}
  </div>
);

export default function Settings() {
  const { transactions, setTransactions, currency, updateCurrency } =
    useContext(DataContext);

  const { showModal } = useModal();

  const [showManualEntry, setShowManualEntry] =
    useState(true);

  const [importMode, setImportMode] =
    useState("replace");

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [manualTransaction, setManualTransaction] =
    useState({
      Date: format(new Date(), "yyyy-MM-dd"),
      Description: "",
      Amount: "",
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
        const parsedData = results.data || [];

        const updatedData =
          importMode === "append"
            ? [...(transactions || []), ...parsedData]
            : parsedData;

        setTransactions(updatedData);

        localStorage.setItem(
          "transactions",
          JSON.stringify(updatedData)
        );

        setLoading(false);

        setSuccessMessage(
          "CSV Imported Successfully!"
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
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
      !manualTransaction.Description ||
      !manualTransaction.Amount
    ) {
      showModal({
        type: "alert",
        message: "Please fill all fields",
      });

      return;
    }

    const updatedTransactions = [
      ...(transactions || []),

      {
        ...manualTransaction,
        Currency: currency.code,
      },
    ];

    setTransactions(updatedTransactions);

    localStorage.setItem(
      "transactions",
      JSON.stringify(updatedTransactions)
    );

    setManualTransaction({
      Date: format(new Date(), "yyyy-MM-dd"),
      Description: "",
      Amount: "",
    });

    setSuccessMessage("Transaction Added!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // =========================
  // CLEAR DATA
  // =========================
  const clearAllData = () => {
    showModal({
      type: "confirm",

      message:
        "Are you sure you want to clear all data?",

      onConfirm: () => {
        setTransactions([]);

        localStorage.removeItem("transactions");

        setSuccessMessage("All Data Cleared!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] px-4 py-6 md:px-8">

      {/* MAIN CONTAINER */}
      <div className="w-full space-y-6">

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="rounded-2xl border border-[#FF6B00]/40 bg-[#111] px-5 py-4 text-sm font-bold uppercase tracking-wide text-[#FF6B00] animate-pulse">
            {successMessage}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-2">
            <span className="loading loading-spinner loading-lg text-[#FF6B00]" />
          </div>
        )}

        {/* ========================= */}
        {/* DATA SOURCE */}
        {/* ========================= */}
        <Section
          title="Data Source"
          subtitle="Upload CSV or load demo financial data"
          right={
            <div className="flex overflow-hidden rounded-xl border border-[#222]">

              {["replace", "append"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setImportMode(mode)}
                  className={`px-5 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                    importMode === mode
                      ? "bg-[#FF6B00] text-black"
                      : "bg-[#111] text-gray-400 hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-6 items-end">

            {/* FILE INPUT */}
            <div className="space-y-3">

              <label className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Upload CSV File
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={handleFile}
                className="file-input w-full rounded-xl border border-[#222] bg-[#111] text-white"
              />
            </div>

            {/* LOAD DEMO BUTTON */}
            <button
              onClick={() => {
                const updatedData =
                  importMode === "append"
                    ? [
                        ...(transactions || []),
                        ...demoData,
                      ]
                    : demoData;

                setTransactions(updatedData);

                localStorage.setItem(
                  "transactions",
                  JSON.stringify(updatedData)
                );

                setSuccessMessage(
                  "Demo Data Loaded!"
                );

                setTimeout(() => {
                  setSuccessMessage("");
                }, 3000);
              }}
              className="h-[52px] rounded-xl bg-[#FF6B00] px-8 text-sm font-black uppercase tracking-wide text-black transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              Load Demo Data
            </button>
          </div>
        </Section>

        {/* ========================= */}
        {/* MANUAL ENTRY */}
        {/* ========================= */}
        <Section
          title="Manual Entry"
          subtitle="Add transactions manually"
          right={
            <button
              onClick={() =>
                setShowManualEntry(
                  !showManualEntry
                )
              }
              className="rounded-xl border border-[#222] px-5 py-2 text-sm font-semibold uppercase tracking-wide text-gray-400 transition-all duration-300 hover:border-[#FF6B00]/40 hover:text-[#FF6B00]"
            >
              {showManualEntry
                ? "Hide Form"
                : "Show Form"}
            </button>
          }
        >
          {showManualEntry && (
            <form
              onSubmit={handleManualSubmit}
              className="space-y-6"
            >

              {/* INPUT GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* DATE */}
                <div className="space-y-2">

                  <label className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    Date
                  </label>

                  <input
                    type="date"
                    value={manualTransaction.Date}
                    onChange={(e) =>
                      setManualTransaction({
                        ...manualTransaction,
                        Date: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#222] bg-[#111] p-4 text-white outline-none transition-all duration-300 focus:border-[#FF6B00]/40"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-2">

                  <label className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    Description
                  </label>

                  <input
                    type="text"
                    placeholder="Enter description"
                    value={
                      manualTransaction.Description
                    }
                    onChange={(e) =>
                      setManualTransaction({
                        ...manualTransaction,
                        Description: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#222] bg-[#111] p-4 text-white outline-none transition-all duration-300 focus:border-[#FF6B00]/40"
                  />
                </div>

                {/* AMOUNT */}
                <div className="space-y-2">

                  <label className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    Amount
                  </label>

                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={manualTransaction.Amount}
                    onChange={(e) =>
                      setManualTransaction({
                        ...manualTransaction,
                        Amount: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#222] bg-[#111] p-4 text-white outline-none transition-all duration-300 focus:border-[#FF6B00]/40"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-4 pt-2">

                <button className="rounded-xl bg-[#FF6B00] px-7 py-3 font-black uppercase tracking-wide text-black transition-all duration-300 hover:scale-[1.03] active:scale-95">
                  Add Transaction
                </button>

                <button
                  type="button"
                  onClick={clearAllData}
                  className="rounded-xl border border-red-500/40 px-7 py-3 font-black uppercase tracking-wide text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
                >
                  Clear Data
                </button>
              </div>
            </form>
          )}
        </Section>

        {/* ========================= */}
        {/* CURRENCY SETTINGS */}
        {/* ========================= */}
        <Section
          title="Currency Settings"
          subtitle="Choose your preferred currency"
        >
          <div className="max-w-md space-y-3">

            <label className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Select Currency
            </label>

            <select
              value={currency?.code || ""}
              onChange={(e) => {
                const selected =
                  CURRENCIES.find(
                    (c) =>
                      c.code === e.target.value
                  );

                if (selected) {
                  updateCurrency(selected);
                }
              }}
              className="w-full rounded-xl border border-[#222] bg-[#111] p-4 text-white outline-none transition-all duration-300 focus:border-[#FF6B00]/40"
            >
              {CURRENCIES.map((c) => (
                <option
                  key={c.code}
                  value={c.code}
                >
                  {c.symbol} — {c.name}
                </option>
              ))}
            </select>

            <p className="text-sm text-gray-500">
              Currently using:

              <span className="ml-2 font-semibold text-[#FF6B00]">
                {currency?.symbol}{" "}
                {currency?.name}
              </span>
            </p>
          </div>
        </Section>

        {/* ========================= */}
        {/* DATA OVERVIEW */}
        {/* ========================= */}
        {transactions?.length > 0 && (
          <Section
            title="Data Overview"
            subtitle="Quick overview of imported transactions"
          >
            <div className="flex flex-wrap items-center gap-3">

              <span className="text-gray-400">
                Total Transactions:
              </span>

              <span className="rounded-xl border border-[#222] bg-[#111] px-4 py-2 font-bold text-white">
                {transactions.length}
              </span>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}