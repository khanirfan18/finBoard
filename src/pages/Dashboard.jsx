import { DataContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import categorize from "../components/utils/categorize";
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
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
    "#FF6B6B",
    "#82ca9d",
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
    const date = parse(dateStr, "dd/MM/yyyy", new Date());
    return format(date, "MMM yyyy");
  };

  const monthData = transactions?.reduce((acc, item) => {
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="retro-card p-6 flex flex-col justify-center">
          <h2 className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-2">Income</h2>
          <p className="text-[#00C49F] text-3xl font-black">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="retro-card p-6 flex flex-col justify-center">
          <h2 className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-2">Spent</h2>
          <p className="text-[#FF6B6B] text-3xl font-black">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div className="retro-card p-6 flex flex-col justify-center">
          <h2 className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-2">Savings</h2>
          <p className="text-[#0088FE] text-3xl font-black">₹{savings.toLocaleString()}</p>
        </div>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="retro-card p-4 flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-fin-orange font-bold tracking-widest text-sm uppercase self-start mb-4 px-4 pt-2">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={90}
                outerRadius={130}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111111', borderColor: '#1F1F1F', borderRadius: '0' }}
                itemStyle={{ color: '#E0E0E0' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="retro-card p-4 flex flex-col min-h-[400px]">
          <h3 className="text-fin-orange font-bold tracking-widest text-sm uppercase self-start mb-4 px-4 pt-2">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#666" tick={{fill: '#888'}} />
              <YAxis stroke="#666" tick={{fill: '#888'}} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: '#111111', borderColor: '#1F1F1F', borderRadius: '0' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="income" fill="#00C49F" radius={[2, 2, 0, 0]} />
              <Bar dataKey="spent" fill="#FF6B6B" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="retro-card p-12 flex flex-col items-center max-w-md text-center border-[#FF6B00]/30 shadow-[0_0_20px_rgba(255,107,0,0.1)]">
        <div className="w-16 h-16 bg-[#FF6B00]/10 flex items-center justify-center rounded-full mb-6 text-[#FF6B00]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
        </div>
        <h2 className="text-2xl font-black tracking-wider text-white mb-2 uppercase">No Data Found</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">Your dashboard is looking a bit empty. Head over to settings to upload your transaction history.</p>
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
