import { useState, useContext } from "react";
import Papa from "papaparse";
import { DataContext, CURRENCIES } from "../context/AppContext";
import { demoData } from "../data/demoData";
import { format } from "date-fns";
import { useModal } from "../context/ModalContext";

const categoryIcons = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛒",
  Salary: "💰",
  Bills: "📄",
  Entertainment: "🎬",
  Health: "🏥",
};
export default function CSVParser() {
  const {
    transactions,
    setTransactions,
    currency,
    updateCurrency,
  } = useContext(DataContext);

  const { showModal } = useModal();

  const [data, setData] = useState([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [importMode, setImportMode] = useState("replace"); // 'replace' or 'append'

  // Loading + Success states
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Manual entry form state
  const [manualTransaction, setManualTransaction] = useState({
    Date: format(new Date(), "dd/MM/yyyy"),
    Description: "",
    Amount: "",
  });

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      showModal({ type: 'alert', message: "Please upload a valid CSV file." });
      e.target.value = null;
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setLoading(false);
          showModal({ type: 'alert', message: "The uploaded CSV file is empty." });
          return;
        }

        const requiredKeys = ["Date", "Description", "Amount", "Category"];
        const firstRow = results.data[0];
        const hasAllKeys = requiredKeys.every(key => key in firstRow);

        if (!hasAllKeys) {
          setLoading(false);
          showModal({ 
            type: 'alert', 
            message: "Invalid CSV format. Required columns: Date, Description, Amount, Category." 
          });
          return;
        }

        setTimeout(() => {
          const newData = importMode === "append" && transactions && transactions.length > 0 
            ? [...transactions, ...results.data]
            : results.data;

          setData(newData);

          localStorage.setItem(
            "transactions",
            JSON.stringify(newData)
          );

          setTransactions(newData);

          setLoading(false);

          setSuccessMessage("Data loaded successfully!");

          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        }, 1200);
      },

      error: () => {
        setLoading(false);
        showModal({ type: 'alert', message: "Failed to parse CSV file." });
      },
    });

    e.target.value = "";
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();

    if (
      !manualTransaction.Description ||
      !manualTransaction.Amount
    ) {
      showModal({ type: 'alert', message: "Please fill in all fields" });
      return;
    }

    const newTransaction = {
      Date: manualTransaction.Date,
      Description: manualTransaction.Description,
      Amount: manualTransaction.Amount,
      Currency: currency,
    };

    const updatedTransactions = [
      ...(transactions || []),
      newTransaction,
    ];

    setTransactions(updatedTransactions);

    localStorage.setItem(
      "transactions",
      JSON.stringify(updatedTransactions)
    );

    setManualTransaction({
      Date: format(new Date(), "dd/MM/yyyy"),
      Description: "",
      Amount: "",
    });

    setSuccessMessage("Transaction added successfully!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;

    if (dateValue) {
      const [year, month, day] = dateValue.split("-");

      setManualTransaction({
        ...manualTransaction,
        Date: `${day}/${month}/${year}`,
      });
    }
  };

  const getCurrentDateForInput = () => {
    const [day, month, year] =
      manualTransaction.Date.split("/");

    return `${year}-${month}-${day}`;
  };

  const clearAllData = () => {
    showModal({
      type: 'confirm',
      message: "Are you sure you want to delete all transactions? This cannot be undone.",
      onConfirm: () => {
        setTransactions([]);
        setData([]);

        localStorage.removeItem("transactions");

        setSuccessMessage(
          "All transactions deleted successfully!"
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    });
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-500 space-y-6">

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="alert alert-success shadow-lg">
          <span>{successMessage}</span>
        </div>
      )}

      {/* LOADING SPINNER */}
      {loading && (
        <div className="flex justify-center">
          <div className="flex items-center gap-3 bg-[#111111] border border-[#1F1F1F] px-6 py-4">
            <span className="loading loading-spinner loading-md text-[#FF6B00]"></span>

            <span className="text-gray-300 font-semibold uppercase tracking-wider text-sm">
              Parsing CSV file...
            </span>
          </div>
        </div>
      )}

      {/* DATA SOURCE */}
      <div className="retro-card p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest">
            Data Source
          </h2>
          
          {transactions && transactions.length > 0 && (
            <div className="flex bg-[#111111] border border-[#1F1F1F] p-1">
              <button 
                onClick={() => setImportMode("replace")}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${importMode === 'replace' ? 'bg-[#FF6B00] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Replace
              </button>
              <button 
                onClick={() => setImportMode("append")}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${importMode === 'append' ? 'bg-[#FF6B00] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Append
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-400 font-bold uppercase tracking-wider text-xs">
                Upload CSV File
              </span>
            </label>

            <input
              type="file"
              accept=".csv"
              className="file-input file-input-bordered bg-[#111111] border-[#1F1F1F] text-gray-300 w-full rounded-none focus:border-[#FF6B00] outline-none hover:border-[#FF6B00]/50 transition-colors file:bg-[#FF6B00] file:text-black file:border-none file:uppercase file:font-bold file:px-4"
              onChange={handleFile}
            />
          </div>

          <div className="hidden md:flex items-center text-gray-600 font-black uppercase text-sm">
            Or
          </div>

          <div className="w-full md:w-auto md:mt-7">
            <button
              className="retro-btn w-full md:w-auto flex items-center justify-center gap-2"
              onClick={() => {
                const newData = importMode === "append" && transactions && transactions.length > 0
                  ? [...transactions, ...demoData]
                  : demoData;

                setTransactions(newData);

                localStorage.setItem(
                  "transactions",
                  JSON.stringify(newData)
                );

                setSuccessMessage(
                  "Demo data loaded successfully!"
                );

                setTimeout(() => {
                  setSuccessMessage("");
                }, 3000);
              }}
            >
              Load Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* MANUAL ENTRY */}
      <div className="retro-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest">
            Manual Entry
          </h2>

          <button
            onClick={() =>
              setShowManualEntry(!showManualEntry)
            }
            className="text-sm text-gray-400 hover:text-[#FF6B00] uppercase tracking-wider font-bold transition-colors"
          >
            {showManualEntry
              ? "Hide Form"
              : "Add Transaction"}
          </button>
        </div>

        {showManualEntry && (
          <form
            onSubmit={handleManualSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
                  Date
                </label>

                <input
                  type="date"
                  value={getCurrentDateForInput()}
                  onChange={handleDateChange}
                  className="retro-input p-3 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
                  Description
                </label>

                <input
                  type="text"
                  placeholder="e.g., Swiggy Food Order"
                  value={manualTransaction.Description}
                  onChange={(e) =>
                    setManualTransaction({
                      ...manualTransaction,
                      Description: e.target.value,
                    })
                  }
                  className="retro-input p-3 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
                  Amount
                </label>

                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., -450 or 5000"
                  value={manualTransaction.Amount}
                  onChange={(e) =>
                    setManualTransaction({
                      ...manualTransaction,
                      Amount: e.target.value,
                    })
                  }
                  className="retro-input p-3 w-full"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="retro-btn"
              >
                Add Transaction
              </button>

              <button
                type="button"
                onClick={clearAllData}
                className="px-6 py-3 bg-red-500 text-white font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </form>
        )}
      </div>

      {/* CURRENCY SETTINGS */}
      <div className="retro-card p-8">
        <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest mb-6">
          Currency Settings
        </h2>

        <div className="max-w-sm">
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
            Select Currency
          </label>

          <select
            value={currency.code}
            onChange={(e) => {
              const selected = CURRENCIES.find(
                (c) => c.code === e.target.value
              );

              if (selected) {
                updateCurrency(selected);
              }
            }}
            className="retro-input p-3 w-full"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} — {c.name} ({c.code})
              </option>
            ))}
          </select>

          <p className="text-xs text-gray-400 mt-3">
            Currently using:
            <span className="text-[#FF6B00] font-bold ml-1">
              {currency.symbol} {currency.name}
            </span>
          </p>
        </div>
      </div>

      {/* DATA MANAGEMENT */}
      {transactions && transactions.length > 0 && (
        <div className="retro-card p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest">
                Data Management
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Total Transactions:
                <span className="text-white font-bold ml-1">
                  {transactions.length}
                </span>
              </p>
            </div>

            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-[#FF6B6B] text-white font-bold uppercase tracking-wider text-sm hover:bg-[#FF5252] transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>
      )}

      {/* RAW DATA */}
      {data && data.length > 0 && (
        <div className="retro-card p-8">
          <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest mb-6">
            Raw Parsed Data
          </h2>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-400 font-mono">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}