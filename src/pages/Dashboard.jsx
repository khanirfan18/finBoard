import { DataContext } from "../context/DataContext";
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
import { useMemo } from "react";
import { parse, format } from "date-fns";
import { TrendingUp, TrendingDown, PiggyBank, Plus, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const { transactions, currency, addTransaction } = React.useContext(DataContext);
  const { theme } = useTheme();

  const [loading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [form, setForm] = React.useState({
    Date: format(new Date(), "dd/MM/yyyy"),
    Description: "",
    Amount: "",
  });
  const [transactionType, setTransactionType] = React.useState("expense");
  const handleQuickAdd = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const description = form.Description.trim();
    const amount = Number(form.Amount);

    if (!form.Date || !description || !form.Amount) {
      setErrorMsg("Please fill all fields before adding a transaction.");
      return;
    }

    if (!Number.isFinite(amount) || amount === 0) {
      setErrorMsg("Enter a valid non-zero amount.");
      return;
    }

    if (typeof addTransaction !== "function") {
      setErrorMsg("Transaction service is unavailable. Please refresh and try again.");
      return;
    }

    addTransaction({
      Date: form.Date,
      Description: description || form.Description,
      Amount: transactionType === "expense"
        ? -Math.abs(Number(amount || form.Amount))
        : Math.abs(Number(amount || form.Amount)),
      category: categorize(description || form.Description),
      Currency: currency,
    });

    setForm({
      Date: format(new Date(), "dd/MM/yyyy"),
      Description: "",
      Amount: "",
    });

    setSuccessMsg("Transaction added!");
    setShowForm(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const COLORS = theme === "light"
    ? ["#FF6B00", "#FF8C00", "#FFA500", "#FFB732", "#FFC966", "#FFDB99", "#FFECCC"]
    : ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6B6B", "#82ca9d"];

 const totalIncome = useMemo(() => {
  return transactions?.reduce((acc, amt) => {
    const num = Number(amt.Amount);
    return num > 0 ? acc + num : acc;
  }, 0);
}, [transactions]);

const totalExpense = useMemo(() => {
  return transactions?.reduce((acc, item) => {
    const amount = Number(item.Amount);
    return amount < 0 ? acc + amount : acc;
  }, 0);
}, [transactions]);


  const savings = totalIncome + totalExpense;

   const categoryData = useMemo(() => {
  return (
    transactions
      ?.filter((t) => Number(t.Amount) < 0)
      .reduce((acc, item) => {
        const category =
          item.category ||
          item.Category ||
          categorize(item.Description);

        acc[category] =
          (acc[category] || 0) +
          Math.abs(Number(item.Amount));

        return acc;
      }, {}) || {}
  );
}, [transactions]);

  const chartData = useMemo(() => {
  return Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));
}, [categoryData]);

  const getMonth = (dateStr) => {
    const date = parse(dateStr, "dd/MM/yyyy", new Date());
    return format(date, "MMM yyyy");
  };

  const monthData = useMemo(() => {
  return transactions?.reduce((acc, item) => {
    const month = getMonth(item.Date);

    if (!acc[month]) {
      acc[month] = {
        month,
        income: 0,
        spent: 0,
      };
    }

    const amt = Math.abs(Number(item.Amount));

    if (Number(item.Amount) > 0) {
      acc[month].income += amt;
    } else {
      acc[month].spent += amt;
    }

    return acc;
  }, {});
}, [transactions]); 

const barData = useMemo(() => {
  return Object.values(monthData || {});
}, [monthData]);

return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {transactions && transactions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="fin-metric-card h-full animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">
                      Income
                    </p>
                    <p className="text-[#00C49F] text-3xl font-black">
                      {currency.symbol}
                      {totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: "rgba(0,196,159,0.1)",
                      border: "1px solid rgba(0,196,159,0.2)",
                    }}
                  >
                    <TrendingUp className="w-5 h-5 text-[#00C49F]" />
                  </div>
                </div>
                <p className="text-xs text-gray-600">Total income received</p>
              </div>

              <div className="fin-metric-card h-full animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">
                      Spent
                    </p>
                    <p className="text-[#FF6B6B] text-3xl font-black">
                      {currency.symbol}
                      {Math.abs(totalExpense).toFixed(2)}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: "rgba(255,107,107,0.1)",
                      border: "1px solid rgba(255,107,107,0.2)",
                    }}
                  >
                    <TrendingDown className="w-5 h-5 text-[#FF6B6B]" />
                  </div>
                </div>
                <p className="text-xs text-gray-600">Total expenses tracked</p>
              </div>

              <div className="fin-metric-card h-full animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">
                      Savings
                    </p>
                    <p className="text-[#0088FE] text-3xl font-black">
                      {currency.symbol}
                      {savings.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: "rgba(0,136,254,0.1)",
                      border: "1px solid rgba(0,136,254,0.2)",
                    }}
                  >
                    <PiggyBank className="w-5 h-5 text-[#0088FE]" />
                  </div>
                </div>
                <p className="text-xs text-gray-600">Net savings balance</p>
              </div>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div className="retro-card p-4 flex flex-col items-center justify-center min-h-[400px] h-full animate-in fade-in duration-500">
                <h3 className="text-fin-orange font-bold tracking-widest text-sm uppercase self-start mb-4 px-4 pt-2">
                  Spending by Category
                </h3>
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
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="retro-card p-4 flex flex-col min-h-[400px] h-full animate-in fade-in duration-500">
                <h3 className="text-fin-orange font-bold tracking-widest text-sm uppercase self-start mb-4 px-4 pt-2">
                  Monthly Overview
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={barData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill={theme === "light" ? "#00C49F" : "#00C49F"} />
                    <Bar dataKey="spent" fill={theme === "light" ? "#FF6B00" : "#FF6B6B"} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[78vh] pt-10 animate-in fade-in duration-500">
            <div className="retro-card p-12 flex flex-col items-center max-w-md text-center border-[#FF6B00]/20 transition-all duration-300 hover:border-[#FF6B00]/28">
              <div className="w-16 h-16 bg-[#FF6B00]/10 flex items-center justify-center rounded-full mb-6 text-[#FF6B00]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-black tracking-wider text-white mb-2 uppercase">
                No Data Found
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed min-h-[88px] flex items-center justify-center">
                Upload your transaction history from settings to start tracking your finances.
              </p>
              <Link to="/settings" className="retro-btn">
                Configure Settings
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setErrorMsg("");
          setShowForm(!showForm);
        }}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-lg hover:bg-[#e05e00] transition-all duration-200 hover:scale-110"
      >
        {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {successMsg && (
        <div className="fixed bottom-24 right-8 z-50 rounded-xl border border-green-500/40 bg-[#111] px-4 py-3 text-sm font-bold text-green-400 shadow-lg">
          {successMsg}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="retro-card p-6 w-full max-w-md mx-4 animate-in fade-in duration-200">
            <h3 className="text-fin-orange font-bold tracking-widest text-sm uppercase mb-4">
              Quick Add Transaction
            </h3>
            <form onSubmit={handleQuickAdd} className="flex flex-col gap-3">
              <input
                type="date"
                required
                className="retro-input p-3 w-full"
                onChange={(e) => {
                  if (!e.target.value) return;
                  const [year, month, day] = e.target.value.split("-");
                  setForm({ ...form, Date: `${day}/${month}/${year}` });
                }}
                value={form.Date.split("/").reverse().join("-")}
              />
              <input
                type="text"
                required
                placeholder="Description e.g. Swiggy"
                className="retro-input p-3 w-full"
                value={form.Description}
                onChange={(e) => setForm({ ...form, Description: e.target.value })}
              />
              <div className="flex rounded-xl overflow-hidden border border-[#222]">
                <button
                  type="button"
                  onClick={() => setTransactionType("expense")}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    transactionType === "expense"
                      ? "bg-[#FF6B6B] text-white"
                      : "bg-[#111] text-gray-400 hover:text-white"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("income")}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    transactionType === "income"
                      ? "bg-[#00C49F] text-white"
                      : "bg-[#111] text-gray-400 hover:text-white"
                  }`}
                >
                  Income
                </button>
              </div>
              <input
                type="number"
                placeholder="e.g., 450"
                required
                step="0.01"
                className="retro-input p-3 w-full"
                value={form.Amount}
                onChange={(e) => setForm({ ...form, Amount: e.target.value })}
              />
              {errorMsg && (
                <p className="text-red-400 text-xs">{errorMsg}</p>
              )}
              <div className="flex gap-3 mt-2">
                <button type="submit" className="retro-btn flex-1">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setShowForm(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
