import { DataContext } from "../context/AppContext";
import React from "react";
import categorize from "../components/utils/categorize";
export default function Budgets() {
  const [budgets, setBudgets] = React.useState({});
  const { transactions } = React.useContext(DataContext);

  const spending = transactions
    ?.filter((t) => Number(t.Amount) < 0)
    .reduce((acc, item) => {
      const category = categorize(item.Description);
      acc[category] = (acc[category] || 0) + Math.abs(Number(item.Amount));
      return acc;
    }, {});
  const categories = Object.keys(spending || {});
  return transactions && categories.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {categories.map((category) => (
        <div key={category} className="retro-card p-6 flex flex-col">
          <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-[#FF6B00]">{category}</h2>
          
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Spent</span>
            <span className="text-2xl font-black">₹{spending[category].toLocaleString()}</span>
          </div>

          <div className="mt-auto space-y-4">
            <input
              type="number"
              placeholder="Set limit"
              className="retro-input p-3 w-full"
              value={budgets[category] || ""}
              onChange={(e) =>
                setBudgets({ ...budgets, [category]: Number(e.target.value) })
              }
            />
            {budgets[category] && (
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  <span>₹{spending[category].toLocaleString()}</span>
                  <span>Limit: ₹{budgets[category].toLocaleString()}</span>
                </div>
                <progress
                  className={`progress w-full h-3 rounded-none [&::-webkit-progress-bar]:bg-[#1a1a1a] ${
                    spending[category] > budgets[category]
                      ? "[&::-webkit-progress-value]:bg-[#FF6B6B]"
                      : "[&::-webkit-progress-value]:bg-[#FF6B00]"
                  }`}
                  value={spending[category]}
                  max={budgets[category]}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="retro-card p-12 flex flex-col items-center max-w-md text-center border-[#FF6B00]/30 shadow-[0_0_20px_rgba(255,107,0,0.1)]">
        <div className="w-16 h-16 bg-[#FF6B00]/10 flex items-center justify-center rounded-full mb-6 text-[#FF6B00]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <h2 className="text-2xl font-black tracking-wider text-white mb-2 uppercase">No Budgets Yet</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">We need transaction data to compute categories so you can set budgets.</p>
        <button 
          onClick={() => window.location.href='/settings'} 
          className="retro-btn"
        >
          Configure Settings
        </button>
      </div>
    </div>
  );
}
