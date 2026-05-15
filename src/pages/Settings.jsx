import { useState, useContext } from "react";
import Papa from "papaparse";
import { DataContext } from "../context/AppContext";
import { demoData } from "../data/demoData";
import { Database, FileUp, PlayCircle } from "lucide-react";

export default function CSVParser() {
  const { transactions, setTransactions } = useContext(DataContext);
  const [data, setData] = useState([]);

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

  return (
    <div className="max-w-4xl animate-in fade-in duration-700">
      <div className="premium-card p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Database size={120} />
        </div>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Database size={20} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Data Source</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
          <div className="form-control w-full max-w-sm">
            <label className="label mb-2 block">
              <span className="text-gray-400 font-semibold text-sm flex items-center gap-2">
                <FileUp size={16} />
                Upload CSV File
              </span>
            </label>
            <input
              type="file"
              accept=".csv"
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-500/10 file:text-emerald-400
                hover:file:bg-emerald-500/20 file:transition-colors
                border border-white/10 rounded-lg bg-black/20 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
              onChange={handleFile}
            />
          </div>
          
          <div className="hidden md:flex items-center">
            <span className="bg-white/5 text-gray-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Or</span>
          </div>
          
          <div className="w-full md:w-auto md:mt-7">
            <button
              className="premium-btn w-full md:w-auto"
              onClick={() => {
                setTransactions(demoData);
                localStorage.setItem("transactions", JSON.stringify(demoData));
              }}
            >
              <PlayCircle size={18} />
              Load Demo Data
            </button>
          </div>
        </div>
      </div>

      {data && data.length > 0 && (
        <div className="premium-card p-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Database size={16} className="text-teal-400" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">Raw Parsed Data</h2>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-xl p-6 max-h-96 overflow-y-auto custom-scrollbar shadow-inner">
            <pre className="text-xs text-emerald-400/80 font-mono leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
