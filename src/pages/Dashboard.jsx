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
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

export default function Dashboard() {
  const { transactions, currency } = React.useContext(DataContext);

  const [loading] = React.useState(false);



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

  const chartData = Object.entries(categoryData).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const getMonth = (dateStr) => {
    const date = parse(dateStr, "dd/MM/yyyy", new Date());
    return format(date, "MMM yyyy");
  };

  const monthData = transactions?.reduce((acc, item) => {
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

  const barData = Object.values(monthData || {});

  return (
    <div className="space-y-8 animate-in fade-in duration-500">



      {loading && (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {transactions && transactions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="fin-metric-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Income</p>
                  <p className="text-[#00C49F] text-3xl font-black">
                    {currency.symbol}{totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(0,196,159,0.1)", border: "1px solid rgba(0,196,159,0.2)" }}>
                  <TrendingUp className="w-5 h-5 text-[#00C49F]" />
                </div>
              </div>
              <p className="text-xs text-gray-600">Total income received</p>
            </div>
            <div className="fin-metric-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Spent</p>
                  <p className="text-[#FF6B6B] text-3xl font-black">
                    {currency.symbol}{Math.abs(totalExpense).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)" }}>
                  <TrendingDown className="w-5 h-5 text-[#FF6B6B]" />
                </div>
              </div>
              <p className="text-xs text-gray-600">Total expenses tracked</p>
            </div>
            <div className="fin-metric-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Savings</p>
                  <p className="text-[#0088FE] text-3xl font-black">
                    {currency.symbol}{savings.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(0,136,254,0.1)", border: "1px solid rgba(0,136,254,0.2)" }}>
                  <PiggyBank className="w-5 h-5 text-[#0088FE]" />
                </div>
              </div>
              <p className="text-xs text-gray-600">Net savings balance</p>

            </div>

          </div>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="retro-card p-4 flex flex-col items-center justify-center min-h-[400px]">

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
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>

            </div>

            <div className="retro-card p-4 flex flex-col min-h-[400px]">

              <h3 className="text-fin-orange font-bold tracking-widest text-sm uppercase self-start mb-4 px-4 pt-2">
                Monthly Overview
              </h3>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData}>

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar dataKey="income" fill="#00C49F" />

                  <Bar dataKey="spent" fill="#FF6B6B" />

                </BarChart>
              </ResponsiveContainer>

            </div>

          </section>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">

          <div className="retro-card p-12 flex flex-col items-center max-w-md text-center">

            <h2 className="text-2xl font-black tracking-wider text-white mb-2 uppercase">
              No Data Found
            </h2>

            <p className="text-gray-400 mb-8 leading-relaxed">
              Upload your transactions from settings.
            </p>

            <Link to="/settings" className="retro-btn">
              Configure Settings
            </Link>

          </div>

        </div>
      )}
    </div>
  );
}