import React from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../context/AppContext";
import categorize from "../components/utils/categorize";

export default function Transaction() {
  const { transactions } = React.useContext(DataContext);
  return transactions && transactions.length > 0 ? (
    <div className="retro-card overflow-x-auto animate-in fade-in duration-500">
      <table className="table w-full border-collapse">
        <thead>
          <tr className="bg-[#111111] text-[#FF6B00] border-b border-[#1F1F1F] uppercase tracking-widest text-sm">
            <th className="py-4 px-6 font-bold">Date</th>
            <th className="py-4 px-6 font-bold">Description</th>
            <th className="py-4 px-6 font-bold text-right">Amount</th>
            <th className="py-4 px-6 font-bold">Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((data, i) => (
            <tr key={i} className="border-b border-[#1F1F1F]/50 hover:bg-[#1a1a1a] transition-colors">
              <td className="py-4 px-6 text-gray-400 whitespace-nowrap">{data.Date}</td>
              <td className="py-4 px-6 font-medium max-w-sm truncate" title={data.Description}>{data.Description}</td>
              <td className={`py-4 px-6 font-black text-right whitespace-nowrap ${Number(data.Amount) > 0 ? 'text-[#00C49F]' : 'text-white'}`}>
                {Number(data.Amount) > 0 ? '+' : ''}{data.Amount}
              </td>
              <td className="py-4 px-6">
                <span className="bg-[#1F1F1F] text-gray-300 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm border border-[#2a2a2a]">
                  {categorize(data.Description)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="retro-card p-12 flex flex-col items-center max-w-md text-center border-[#FF6B00]/30 shadow-[0_0_20px_rgba(255,107,0,0.1)]">
        <div className="w-16 h-16 bg-[#FF6B00]/10 flex items-center justify-center rounded-full mb-6 text-[#FF6B00]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </div>
        <h2 className="text-2xl font-black tracking-wider text-white mb-2 uppercase">No Transactions</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">No transactions found. Upload your data to view the history.</p>
        <Link 
          to='/settings' 
          className="retro-btn"
        >
          Configure Settings
        </Link>
      </div>
    </div>
  );
}
