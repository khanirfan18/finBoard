import { DataContext } from "../context/AppContext";
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


  const totalIncome =
    transactions?.reduce((acc, item) => {
      const num = Number(item.Amount);
      return num > 0 ? acc + num : acc;
    }, 0) || 0;

  const totalExpense =
    transactions?.reduce((acc, item) => {
      const amount = Number(item.Amount);
      return amount < 0 ? acc + amount : acc;
    }, 0) || 0;

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
    try {
      const date = parse(dateStr, "dd/MM/yyyy", new Date());
      return format(date, "MMM yyyy");
    } catch {
      return "Invalid";
    }
  };

  const monthData =
    transactions?.reduce((acc, item) => {
      const month = getMonth(item.Date);

      if (!acc[month]) {
        acc[month] = { month, income: 0, spent: 0 };
      }

      const amt = Math.abs(Number(item.Amount));
      if (Number(item.Amount) > 0) acc[month].income += amt;
      else acc[month].spent += amt;

      return acc;
    }, {}) || {};

  const barData = Object.values(monthData);

  return transactions ? (
    <>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Income</h2>
            <p className="text-green-500 text-xl font-bold">
              ₹{totalIncome}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Spent</h2>
            <p className="text-red-500 text-xl font-bold">
              ₹{Math.abs(totalExpense)}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Savings</h2>
            <p className="text-blue-500 text-xl font-bold">
              ₹{savings}
            </p>
          </div>
        </div>
      </div>


      <section className="mt-6 flex flex-col md:flex-row gap-6">
   
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            innerRadius={80}
            outerRadius={140}
            dataKey="value"
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

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#00C49F" />
            <Bar dataKey="spent" fill="#FF6B6B" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </>
  ) : (
    "Loading..."
  );
}
