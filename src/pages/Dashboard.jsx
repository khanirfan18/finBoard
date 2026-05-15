import { DataContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import categorize from "../components/utils/categorize";
import { ArrowDownRight, ArrowUpRight, Wallet, Activity } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import { parse, format } from "date-fns";

export default function Dashboard() {
  const { transactions } = React.useContext(DataContext);

  const COLORS = [
    "#10b981", // Emerald
    "#14b8a6", // Teal
    "#0ea5e9", // Sky Blue
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#d946ef", // Fuchsia
    "#f43f5e", // Rose
  ];

  const totalIncome = transactions?.reduce((acc, amt) => {
    const num = Number(amt.Amount);
    return num > 0 ? acc + num : acc;
  }, 0);

  const totalExpense = transactions?.reduce((acc, item) => {
    const amount = Number(item.Amount);
    return amount < 0 ? acc + amount : acc;
  }, 0);

  const savings = totalIncome + totalExpense;

  const categoryData =
    transactions
      ?.filter((t) => Number(t.Amount) < 0)
      .reduce((acc, item) => {
        const category = categorize(item.Description);
        acc[category] =
          (acc[category] || 0) + Math.abs(Number(item.Amount));
        return acc;
      }, {}) || {};

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const getMonth = (dateStr) => {
    if (!dateStr) return "Unknown";
    try {
      const date = parse(dateStr, "dd/MM/yyyy", new Date());
      if (isNaN(date.getTime())) return "Unknown";
      return format(date, "MMM yyyy");
    } catch (e) {
      return "Unknown";
    }
  };

  const monthData = transactions?.reduce((acc, item) => {
    if (!item || !item.Date || !item.Amount) return acc;
    const month = getMonth(item.Date);
    if (!acc[month]) {
      acc[month] = { month, income: 0, spent: 0 };
    }
    const amt = Math.abs(Number(item.Amount));
    if (Number(item.Amount) > 0) acc[month].income += amt;
    else acc[month].spent += amt;
    return acc;
  }, {});

  const barData = Object.values(monthData);

  return transactions && transactions.length > 0 ? (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowDownRight size={80} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ArrowDownRight size={20} className="text-emerald-400" />
            </div>
            <h2 className="text-gray-400 text-sm font-semibold tracking-wider">Income</h2>
          </div>
          <p className="text-emerald-400 text-3xl font-bold tracking-tight">₹{totalIncome.toLocaleString()}</p>
        </div>
        
        <div className="premium-card p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpRight size={80} className="text-rose-500" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
              <ArrowUpRight size={20} className="text-rose-400" />
            </div>
            <h2 className="text-gray-400 text-sm font-semibold tracking-wider">Spent</h2>
          </div>
          <p className="text-rose-400 text-3xl font-bold tracking-tight">₹{totalExpense.toLocaleString()}</p>
        </div>

        <div className="premium-card p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} className="text-indigo-500" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Wallet size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-gray-400 text-sm font-semibold tracking-wider">Savings</h2>
          </div>
          <p className="text-indigo-400 text-3xl font-bold tracking-tight">₹{savings.toLocaleString()}</p>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="premium-card p-6 flex flex-col items-center justify-center min-h-[420px]">
          <div className="w-full flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Activity size={18} className="text-teal-400" />
            </div>
            <h3 className="text-gray-100 font-semibold tracking-wide text-lg">Spending by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={90}
                outerRadius={120}
                dataKey="value"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#f3f4f6', fontWeight: 500 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="premium-card p-6 flex flex-col min-h-[420px]">
          <div className="w-full flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Activity size={18} className="text-indigo-400" />
            </div>
            <h3 className="text-gray-100 font-semibold tracking-wide text-lg">Monthly Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="spent" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-in fade-in duration-700">
      <div className="premium-card p-12 flex flex-col items-center max-w-md text-center border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center rounded-2xl mb-6 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/30">
          <Activity size={32} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">No Data Found</h2>
        <p className="text-gray-400 mb-8 leading-relaxed text-sm">Your dashboard is looking a bit empty. Head over to settings to upload your transaction history.</p>
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
