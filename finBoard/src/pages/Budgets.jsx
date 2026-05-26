import { DataContext } from "../context/AppContext";
import React from "react";
import { Link } from "react-router-dom";
import categorize from "../components/utils/categorize";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useModal } from "../context/ModalContext";

export default function Budgets() {
  const { showModal } = useModal();
  const [budgets, setBudgets] = React.useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : {};
  });
  const [showAlert, setShowAlert] = React.useState(false);
  const [exceededCategories, setExceededCategories] = React.useState([]);
  const { transactions, currency } = React.useContext(DataContext);
  const spending = transactions
    ?.filter((t) => Number(t.Amount) < 0)
    .reduce((acc, item) => {
      const category = categorize(item.Description);
      acc[category] = (acc[category] || 0) + Math.abs(Number(item.Amount));
      return acc;
    }, {});

  // Save budgets to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Check for budget exceeded
  React.useEffect(() => {
    const exceeded = [];
    Object.keys(budgets).forEach(category => {
      if (spending[category] > budgets[category]) {
        exceeded.push({
          category,
          spent: spending[category],
          limit: budgets[category],
          over: spending[category] - budgets[category]
        });
      }
    });
    setExceededCategories(exceeded);
    if (exceeded.length > 0) {
      setShowAlert(true);
    }
  }, [budgets, transactions, spending]);

  const categories = Object.keys(spending || {});

  // Prepare comparison chart data
  const comparisonData = categories.map(category => ({
    category,
    spent: spending[category],
    budget: budgets[category] || 0,
    remaining: budgets[category] ? Math.max(0, budgets[category] - spending[category]) : 0
  })).filter(item => item.budget > 0);

  const handleBudgetChange = (category, value) => {
    if (Number(value) >= 0) {
      setBudgets({ ...budgets, [category]: Number(value) });
    }
  };

  const resetBudgets = () => {
    showModal({
      type: 'confirm',
      message: 'Are you sure you want to reset all budgets?',
      onConfirm: () => {
        setBudgets({});
        localStorage.removeItem('budgets');
      }
    });
  };

  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return '#FF6B6B';
    if (percentage >= 80) return '#FFBB28';
    return '#FF6B00';
  };


  return transactions && categories.length > 0 ? (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Budget Alerts */}
      {showAlert && exceededCategories.length > 0 && (
        <div className="retro-card p-6 border-[#FF6B6B] bg-[#FF6B6B]/5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B6B]/20 flex items-center justify-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-[#FF6B6B] font-black uppercase tracking-widest text-lg">Budget Alert!</h3>
                <p className="text-gray-400 text-sm mt-1">You've exceeded your budget in {exceededCategories.length} {exceededCategories.length === 1 ? 'category' : 'categories'}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {exceededCategories.map(item => (
              <div key={item.category} className="flex items-center justify-between bg-[#111111] p-3 border border-[#1F1F1F]">
                <span className="font-bold text-white uppercase tracking-wider">{item.category}</span>
                <span className="text-[#FF6B6B] font-black">
                  Over by {currency.symbol}{item.over.toLocaleString()} 
                  <span className="text-gray-500 text-sm ml-2">
                    ({currency.symbol}{item.spent.toLocaleString()} / {currency.symbol}{item.limit.toLocaleString()})
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget vs Actual Comparison Chart */}
      {comparisonData.length > 0 && (
        <div className="retro-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest">Budget vs Actual Spending</h2>
            <button 
              onClick={resetBudgets}
              className="text-xs text-gray-400 hover:text-[#FF6B6B] uppercase tracking-wider font-bold transition-colors"
            >
              Reset All Budgets
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="category" stroke="#666" tick={{fill: '#888'}} />
              <YAxis stroke="#666" tick={{fill: '#888'}} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: '#111111', borderColor: '#1F1F1F', borderRadius: '0' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="spent" fill="#FF6B6B" name="Spent" radius={[2, 2, 0, 0]} />
              <Bar dataKey="budget" fill="#00C49F" name="Budget" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const isOverBudget = budgets[category] && spending[category] > budgets[category];
          const percentage = budgets[category] ? (spending[category] / budgets[category]) * 100 : 0;
          
          return (
            <div key={category} className={`retro-card p-6 flex flex-col ${isOverBudget ? 'border-[#FF6B6B] bg-[#FF6B6B]/5' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-widest uppercase text-[#FF6B00]">{category}</h2>
                {isOverBudget && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-gray-500 uppercase tracking-wider">Spent</span>
                <span className={`text-2xl font-black ${isOverBudget ? 'text-[#FF6B6B]' : 'text-white'}`}>
                  {currency.symbol}{spending[category].toLocaleString()}
                </span>
              </div>

              <div className="mt-auto space-y-4">
                <input
                  type="number"
                  placeholder="Set limit"
                  className="retro-input p-3 w-full"
                  value={budgets[category] || ""}
                  onChange={(e) => handleBudgetChange(category, e.target.value)}
                />
                {budgets[category] && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      <span>{currency.symbol}{spending[category].toLocaleString()}</span>
                      <span>Limit: {currency.symbol}{budgets[category].toLocaleString()}</span>
                    </div>
                    <progress
                      className={`progress w-full h-3 rounded-none [&::-webkit-progress-bar]:bg-[#1a1a1a]`}
                      style={{
                        '--progress-color': getProgressColor(spending[category], budgets[category])
                      }}
                      value={spending[category]}
                      max={budgets[category]}
                    />
                    <div className="mt-2 text-xs text-gray-400">
                      {percentage >= 100 ? (
                        <span className="text-[#FF6B6B] font-bold">
                          {percentage.toFixed(0)}% - Over budget by {currency.symbol}{(spending[category] - budgets[category]).toLocaleString()}
                        </span>
                      ) : percentage >= 80 ? (
                        <span className="text-[#FFBB28] font-bold">
                          {percentage.toFixed(0)}% - Approaching limit
                        </span>
                      ) : (
                        <span className="text-[#00C49F]">
                          {percentage.toFixed(0)}% - {currency.symbol}{(budgets[category] - spending[category]).toLocaleString()} remaining
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="retro-card p-12 flex flex-col items-center max-w-md text-center border-[#FF6B00]/30 shadow-[0_0_20px_rgba(255,107,0,0.1)]">
        <div className="w-16 h-16 bg-[#FF6B00]/10 flex items-center justify-center rounded-full mb-6 text-[#FF6B00]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <h2 className="text-2xl font-black tracking-wider text-white mb-2 uppercase">No Budgets Yet</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">We need transaction data to compute categories so you can set budgets.</p>
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
