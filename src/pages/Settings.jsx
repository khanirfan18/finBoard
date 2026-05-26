import { useState, useContext } from "react";
import Papa from "papaparse";
import { DataContext, CURRENCIES } from "../context/AppContext";
import { demoData } from "../data/demoData";
import { format } from "date-fns";
import { useModal } from "../context/ModalContext";

export default function Settings() {
  const {
    transactions,
    setTransactions,
    currency,
    updateCurrency,
  } = useContext(DataContext);

  const { showModal } = useModal();

  const [showManualEntry, setShowManualEntry] = useState(true);
  const [importMode, setImportMode] = useState("replace");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [manualTransaction, setManualTransaction] = useState({
    Date: format(new Date(), "yyyy-MM-dd"),
    Description: "",
    Amount: "",
  });

  // CSV IMPORT
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const parsedData = results.data || [];

        const newData =
          importMode === "append"
            ? [...(transactions || []), ...parsedData]
            : parsedData;

        setTransactions(newData);

        localStorage.setItem(
          "transactions",
          JSON.stringify(newData)
        );

        setLoading(false);

        setSuccessMessage("CSV Imported Successfully!");

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

  // MANUAL ENTRY
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

  // CLEAR DATA
  const clearAllData = () => {
    showModal({
      type: "confirm",
      message: "Are you sure you want to clear all data?",

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
      <div className="max-w-6xl mx-auto space-y-8">

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="border border-[#FF6B00] bg-[#111111] px-5 py-4 text-sm font-semibold uppercase tracking-wider text-[#FF6B00]">
            {successMessage}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-[#FF6B00]"></span>
          </div>
        )}

        {/* DATA SOURCE */}
        <div className="rounded-xl border border-[#1F1F1F] bg-[#0D0D0D] p-6 md:p-8">

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#FF6B00]">
                Data Source
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Upload CSV or load demo financial data
              </p>
            </div>

            <div className="flex overflow-hidden rounded-lg border border-[#222222]">

              <button
                onClick={() => setImportMode("replace")}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  importMode === "replace"
                    ? "bg-[#FF6B00] text-black"
                    : "bg-[#111111] text-gray-400"
                }`}
              >
                Replace
              </button>

              <button
                onClick={() => setImportMode("append")}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  importMode === "append"
                    ? "bg-[#FF6B00] text-black"
                    : "bg-[#111111] text-gray-400"
                }`}
              >
                Append
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto]">

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Upload CSV File
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={handleFile}
                className="file-input file-input-bordered w-full border-[#222222] bg-[#111111] text-white"
              />
            </div>

            <button
              className="h-[48px] rounded-lg bg-[#FF6B00] px-6 font-bold uppercase tracking-wider text-black transition-all hover:scale-[1.02]"
              onClick={() => {
                const newData =
                  importMode === "append"
                    ? [...(transactions || []), ...demoData]
                    : demoData;

                setTransactions(newData);

                localStorage.setItem(
                  "transactions",
                  JSON.stringify(newData)
                );

                setSuccessMessage("Demo Data Loaded!");

                setTimeout(() => {
                  setSuccessMessage("");
                }, 3000);
              }}
            >
              Load Demo Data
            </button>
          </div>
        </div>

        {/* MANUAL ENTRY */}
        <div className="rounded-xl border border-[#1F1F1F] bg-[#0D0D0D] p-6 md:p-8">

          <div className="mb-8 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#FF6B00]">
                Manual Entry
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add transactions manually
              </p>
            </div>

            <button
              onClick={() =>
                setShowManualEntry(!showManualEntry)
              }
              className="text-sm font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-[#FF6B00]"
            >
              {showManualEntry ? "Hide Form" : "Show Form"}
            </button>
          </div>

          {showManualEntry && (
            <form
              onSubmit={handleManualSubmit}
              className="space-y-6"
            >

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
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
                    className="w-full rounded-lg border border-[#222222] bg-[#111111] p-3 text-white outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                    Description
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Swiggy Order"
                    value={manualTransaction.Description}
                    onChange={(e) =>
                      setManualTransaction({
                        ...manualTransaction,
                        Description: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#222222] bg-[#111111] p-3 text-white outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                    Amount
                  </label>

                  <input
                    type="number"
                    placeholder="-450 or 5000"
                    value={manualTransaction.Amount}
                    onChange={(e) =>
                      setManualTransaction({
                        ...manualTransaction,
                        Amount: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#222222] bg-[#111111] p-3 text-white outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">

                <button
                  type="submit"
                  className="rounded-lg bg-[#FF6B00] px-6 py-3 font-bold uppercase tracking-wider text-black transition-all hover:scale-[1.02]"
                >
                  Add Transaction
                </button>

                <button
                  type="button"
                  onClick={clearAllData}
                  className="rounded-lg border border-red-500 px-6 py-3 font-bold uppercase tracking-wider text-red-400 transition-all hover:bg-red-500 hover:text-white"
                >
                  Clear Data
                </button>
              </div>

              <div className="rounded-lg border border-[#1A1A1A] bg-[#080808] p-4 text-sm leading-7 text-gray-500">
                <p>• Use negative amounts for expenses</p>
                <p>• Use positive amounts for income</p>
                <p>• Add proper descriptions for tracking</p>
              </div>
            </form>
          )}
        </div>

        {/* CURRENCY SETTINGS */}
        <div className="rounded-xl border border-[#FF6B00] bg-[#0D0D0D] p-6 md:p-8">

          <h2 className="mb-6 text-2xl font-black uppercase tracking-[0.2em] text-[#FF6B00]">
            Currency Settings
          </h2>

          <div className="max-w-md">

            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Select Currency
            </label>

            <select
              value={currency?.code || ""}
              onChange={(e) => {
                const selected = CURRENCIES.find(
                  (c) => c.code === e.target.value
                );

                if (selected) {
                  updateCurrency(selected);
                }
              }}
              className="w-full rounded-lg border border-[#222222] bg-[#111111] p-3 text-white outline-none focus:border-[#FF6B00]"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} — {c.name}
                </option>
              ))}
            </select>

            <p className="mt-4 text-sm text-gray-400">
              Currently Using:
              <span className="ml-2 font-bold text-[#FF6B00]">
                {currency?.symbol} {currency?.name}
              </span>
            </p>
          </div>
        </div>

        {/* TRANSACTION COUNT */}
        {transactions && transactions.length > 0 && (
          <div className="rounded-xl border border-[#1F1F1F] bg-[#0D0D0D] p-6">

            <h2 className="mb-3 text-xl font-black uppercase tracking-[0.2em] text-[#FF6B00]">
              Data Overview
            </h2>

            <p className="text-gray-400">
              Total Transactions:
              <span className="ml-2 font-bold text-white">
                {transactions.length}
              </span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}