import { useState, useContext } from "react";
import Papa from "papaparse";
import { DataContext, CURRENCIES } from "../context/AppContext";
import { demoData } from "../data/demoData";
import { format } from "date-fns";

export default function CSVParser() {
  const { transactions, setTransactions, currency, updateCurrency } = useContext(DataContext);
  const [data, setData] = useState([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  // Manual entry form state
  const [manualTransaction, setManualTransaction] = useState({
    Date: format(new Date(), "dd/MM/yyyy"),
    Description: "",
    Amount: ""
  });

  const handleFile = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        localStorage.setItem("transactions", JSON.stringify(results.data));
        setTransactions(results.data);
      },
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    
    if (!manualTransaction.Description || !manualTransaction.Amount) {
      alert("Please fill in all fields");
      return;
    }

    const newTransaction = {
      Date: manualTransaction.Date,
      Description: manualTransaction.Description,
      Amount: manualTransaction.Amount
    };

    const updatedTransactions = [...(transactions || []), newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    // Reset form
    setManualTransaction({
      Date: format(new Date(), "dd/MM/yyyy"),
      Description: "",
      Amount: ""
    });

    alert("Transaction added successfully!");
  };

  const handleDateChange = (e) => {
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const dateValue = e.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split('-');
      setManualTransaction({
        ...manualTransaction,
        Date: `${day}/${month}/${year}`
      });
    }
  };

  const getCurrentDateForInput = () => {
    // Convert from DD/MM/YYYY to YYYY-MM-DD for input
    const [day, month, year] = manualTransaction.Date.split('/');
    return `${year}-${month}-${day}`;
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to delete all transactions? This cannot be undone.")) {
      setTransactions([]);
      setData([]);
      localStorage.removeItem("transactions");
      alert("All transactions deleted successfully!");
    }
  };

  const exportToCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions available to export!");
      return;
    }
    
    // Convert JSON transactions array back to CSV string
    const csv = Papa.unparse(transactions);
    
    // Create download link and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `finboard_transactions_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="max-w-4xl animate-in fade-in duration-500 space-y-6">
      {/* Data Source Section */}
      <div className="retro-card p-8">
        <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest mb-6">Data Source</h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-400 font-bold uppercase tracking-wider text-xs">Upload CSV File</span>
            </label>
            <input
              type="file"
              accept=".csv"
              className="file-input file-input-bordered bg-[#111111] border-[#1F1F1F] text-gray-300 w-full rounded-none focus:border-[#FF6B00] outline-none hover:border-[#FF6B00]/50 transition-colors file:bg-[#FF6B00] file:text-black file:border-none file:uppercase file:font-bold file:px-4"
              onChange={handleFile}
            />
          </div>
          
          <div className="hidden md:flex items-center text-gray-600 font-black uppercase text-sm">Or</div>
          
          <div className="w-full md:w-auto md:mt-7">
            <button
              className="retro-btn w-full md:w-auto flex items-center justify-center gap-2"
              onClick={() => {
                setTransactions(demoData);
                localStorage.setItem("transactions", JSON.stringify(demoData));
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Load Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* Manual Entry Section */}
      <div className="retro-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest">Manual Entry</h2>
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="text-sm text-gray-400 hover:text-[#FF6B00] uppercase tracking-wider font-bold transition-colors"
          >
            {showManualEntry ? "Hide Form" : "Add Transaction"}
          </button>
        </div>

        {showManualEntry && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date */}
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

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Swiggy Food Order"
                  value={manualTransaction.Description}
                  onChange={(e) => setManualTransaction({...manualTransaction, Description: e.target.value})}
                  className="retro-input p-3 w-full"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
                  Amount (use - for expenses)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., -450 or 5000"
                  value={manualTransaction.Amount}
                  onChange={(e) => setManualTransaction({...manualTransaction, Amount: e.target.value})}
                  className="retro-input p-3 w-full"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="retro-btn">
                Add Transaction
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setManualTransaction({
                    Date: format(new Date(), "dd/MM/yyyy"),
                    Description: "",
                    Amount: ""
                  });
                }}
                className="px-6 py-3 bg-[#1F1F1F] text-gray-300 font-bold uppercase tracking-wider hover:bg-[#2a2a2a] transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#1F1F1F]">
              <p className="text-xs text-gray-400 mb-2">
                <span className="text-[#FF6B00] font-bold">💡 Tips:</span>
              </p>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>Use negative amounts for expenses (e.g., -450)</li>
                <li>Use positive amounts for income (e.g., 5000)</li>
                <li>Include keywords in description for auto-categorization (e.g., "Swiggy", "Uber", "Salary")</li>
              </ul>
            </div>
          </form>
        )}
      </div>

      {/* Currency Settings Section */}
<div className="retro-card p-8">
  <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest mb-6">Currency Settings</h2>
  <div className="max-w-sm">
    <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
      Select Currency
    </label>
    <select
      value={currency.code}
      onChange={(e) => {
        const selected = CURRENCIES.find(c => c.code === e.target.value);
        if (selected) updateCurrency(selected);
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
      Currently using: <span className="text-[#FF6B00] font-bold">{currency.symbol} {currency.name}</span>
    </p>
  </div>
</div> 
      {/* Data Management Section */}
      {transactions && transactions.length > 0 && (
        <div className="retro-card p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest">Data Management</h2>
              <p className="text-gray-400 text-sm mt-2">
                Total Transactions: <span className="text-white font-bold">{transactions.length}</span>
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={exportToCSV}
                className="retro-btn py-2 text-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Export CSV
              </button>
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-[#FF6B6B] text-white font-bold uppercase tracking-wider text-sm hover:bg-[#FF5252] transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="retro-card p-8">
          <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest mb-6">Raw Parsed Data</h2>
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
