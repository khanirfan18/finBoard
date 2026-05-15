import { DataContext } from "../context/AppContext";
import React from "react";
import { Link } from "react-router-dom";
import categorize from "../components/utils/categorize";
import { Target, AlertCircle, TrendingUp } from "lucide-react";

export default function Budgets() {
  const [budgets, setBudgets] = React.useState({});
  const { transactions } = React.useContext(DataContext);

  const spending = transactions
    ?.filter((t) => t && t.Amount && t.Description && Number(t.Amount) < 0)
    .reduce((acc, item) => {
      const category = categorize(item.Description);
      acc[category] = (acc[category] || 0) + Math.abs(Number(item.Amount));
      return acc;
    }, {});
  const categories = Object.keys(spending || {});

  return transactions && categories.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      {categories.map((category) => {
        const isOverBudget = budgets[category] && spending[category] > budgets[category];
        const progressPercentage = budgets[category] ? Math.min((spending[category] / budgets[category]) * 100, 100) : 0;
        
        return (
          <div key={category} className={`premium-card p-6 flex flex-col transition-all duration-300 ${isOverBudget ? 'border-rose-500/50 shadow-[0_4px_20px_rgba(244,63,94,0.1)]' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold tracking-wide text-gray-100 flex items-center gap-2">
                <Target size={18} className={isOverBudget ? "text-rose-400" : "text-emerald-400"} />
                {category}
              </h2>
              {isOverBudget && (
                <div className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold">
                  <AlertCircle size={12} />
                  OVER
                </div>
              )}
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-sm text-gray-500 font-medium">Spent</span>
              <span className={`text-2xl font-bold tracking-tight ${isOverBudget ? 'text-rose-400' : 'text-white'}`}>
                ₹{spending[category].toLocaleString()}
              </span>
            </div>

            <div className="mt-auto space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">₹</span>
                </div>
                <input
                  type="number"
                  placeholder="Set budget limit"
                  className="premium-input p-3 pl-8 w-full text-sm"
                  value={budgets[category] || ""}
                  onChange={(e) =>
                    setBudgets({ ...budgets, [category]: Number(e.target.value) })
                  }
                />
              </div>
              {budgets[category] && (
                <div className="pt-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                    <span className={isOverBudget ? 'text-rose-400' : ''}>₹{spending[category].toLocaleString()}</span>
                    <span>Limit: ₹{budgets[category].toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-800/50 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${isOverBudget ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-in fade-in duration-700">
      <div className="premium-card p-12 flex flex-col items-center max-w-md text-center border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center rounded-2xl mb-6 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/30">
          <TrendingUp size={32} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">No Budgets Yet</h2>
        <p className="text-gray-400 mb-8 leading-relaxed text-sm">We need transaction data to compute categories so you can set budgets.</p>
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
