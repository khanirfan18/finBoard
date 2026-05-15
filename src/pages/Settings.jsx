import { useState, useContext } from "react";
import Papa from "papaparse";
import { DataContext } from "../context/AppContext";
import { demoData } from "../data/demoData";
export default function CSVParser() {
  const { transactions, setTransactions } = useContext(DataContext);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const hasTransactions = transactions?.length > 0;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        localStorage.setItem("transactions", JSON.stringify(results.data));
        setTransactions(results.data);
        setMessage("Data loaded successfully!");
      },
    });
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      "Clear all saved transaction data? This cannot be undone.",
    );

    if (!confirmed) return;

    localStorage.removeItem("transactions");
    setTransactions([]);
    setData([]);
    setMessage("Transaction data cleared. You can upload a new CSV anytime.");
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <div className="retro-card p-8 mb-8">
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
                setMessage("Demo data loaded successfully!");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Load Demo Data
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="retro-card border-[#FF6B00] p-4 mb-8 text-sm font-bold uppercase tracking-wider text-[#FFB266]">
          {message}
        </div>
      )}

      <div className="retro-card p-8 mb-8">
        <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest mb-4">
          Reset Data
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Clear saved transactions from this browser and start fresh with a new
          CSV file.
        </p>
        <button
          className="w-full md:w-auto border border-red-500 px-6 py-3 font-bold uppercase text-red-300 transition-colors hover:bg-red-500 hover:text-black disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-600 disabled:hover:bg-transparent"
          onClick={handleClearData}
          disabled={!hasTransactions}
        >
          Clear Data
        </button>
      </div>

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
