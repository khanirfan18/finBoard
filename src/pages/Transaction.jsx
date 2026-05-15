import React from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../context/AppContext";
import categorize from "../components/utils/categorize";
import { ArrowRightLeft } from "lucide-react";

export default function Transaction() {
  const { transactions } = React.useContext(DataContext);
  return transactions && transactions.length > 0 ? (
    <div className="premium-card overflow-hidden animate-in fade-in duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 border-b border-white/10 text-xs uppercase tracking-wider font-semibold">
              <th className="py-5 px-6">Date</th>
              <th className="py-5 px-6">Description</th>
              <th className="py-5 px-6 text-right">Amount</th>
              <th className="py-5 px-6">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions?.filter(data => data && data.Date && data.Description && data.Amount).map((data, i) => {
              const amount = Number(data.Amount);
              const isPositive = amount > 0;
              
              return (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6 text-gray-400 whitespace-nowrap text-sm font-medium">{data.Date}</td>
                  <td className="py-4 px-6 text-gray-200 font-medium max-w-sm truncate group-hover:text-white transition-colors" title={data.Description}>
                    {data.Description}
                  </td>
                  <td className={`py-4 px-6 font-bold text-right whitespace-nowrap ${isPositive ? 'text-emerald-400' : 'text-gray-100'}`}>
                    {isPositive ? '+' : ''}{amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
                      {categorize(data.Description)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-in fade-in duration-700">
      <div className="premium-card p-12 flex flex-col items-center max-w-md text-center border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center rounded-2xl mb-6 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/30">
          <ArrowRightLeft size={32} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">No Transactions</h2>
        <p className="text-gray-400 mb-8 leading-relaxed text-sm">No transactions found. Upload your data to view the history.</p>
        <Link 
          to='/settings' 
          className="premium-btn"
        >
          Configure Settings
        </Link>
      </div>
    </div>
  );
}
