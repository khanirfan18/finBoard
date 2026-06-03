import React from 'react';
import { ShoppingBag, PiggyBank, TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';
import { parse, format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';

export default function InsightCards({ transactions }) {
  const { theme } = useTheme();
  
  const processMetrics = () => {
    let income = 0;
    let expenses = 0;
    const categoryTotals = {};
    const monthlyData = {};

    transactions.forEach(t => {
      // Pull using exact schema keys from matching data matrix
      const amt = Number(t.Amount) || 0;
      const category = t.category || t.Category || 'Other';
      
      let monthYear = "Active Period";
      if (t.Date) {
        try {
          // Parse "dd/MM/yyyy" format accurately using date-fns
          const parsedDate = parse(t.Date, "dd/MM/yyyy", new Date());
          monthYear = format(parsedDate, "MMM yyyy");
        } catch {
          // Fallback parsing if date structure varies
          const fallbackDate = new Date(t.Date);
          if (!isNaN(fallbackDate.getTime())) {
            monthYear = fallbackDate.toLocaleString('default', { month: 'short', year: 'numeric' });
          }
        }
      }

      // Check positive/negative balances directly
      if (amt > 0) {
        income += amt;
        
        if (!monthlyData[monthYear]) monthlyData[monthYear] = { income: 0, expense: 0, totalActivity: 0 };
        monthlyData[monthYear].income += amt;
        monthlyData[monthYear].totalActivity += amt;
      } else if (amt < 0) {
        const absAmt = Math.abs(amt);
        expenses += absAmt;
        categoryTotals[category] = (categoryTotals[category] || 0) + absAmt;

        if (!monthlyData[monthYear]) monthlyData[monthYear] = { income: 0, expense: 0, totalActivity: 0 };
        monthlyData[monthYear].expense += absAmt;
        monthlyData[monthYear].totalActivity += absAmt;
      }
    });

    // 1. Find top expenditure destination
    let topCategory = "None";
    let topCatAmt = 0;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > topCatAmt) {
        topCatAmt = val;
        topCategory = cat;
      }
    });

    // 2. Savings Rate tracking
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

    // 3. Peak active window
    let mostActiveMonth = "N/A";
    let maxActivity = 0;
    Object.entries(monthlyData).forEach(([m, obj]) => {
      if (obj.totalActivity > maxActivity) {
        maxActivity = obj.totalActivity;
        mostActiveMonth = m;
      }
    });

    // 4. Monthly average generation values
    const uniqueMonthsCount = Object.keys(monthlyData).length || 1;
    const avgMonthlyIncome = Math.round(income / uniqueMonthsCount);

    // 5. Month-on-month expense change
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    let monthOnMonthChange = null;
    let prevMonthLabel = null;
    if (sortedMonths.length >= 2) {
      const currentMonth = sortedMonths[sortedMonths.length - 1];
      const previousMonth = sortedMonths[sortedMonths.length - 2];
      const currentExpense = monthlyData[currentMonth].expense;
      const previousExpense = monthlyData[previousMonth].expense;
      prevMonthLabel = previousMonth;

      if (previousExpense > 0) {
        monthOnMonthChange = Math.round(((currentExpense - previousExpense) / previousExpense) * 100);
      }
    }

    return { 
      topCategory, 
      topCatAmt, 
      savingsRate, 
      netSavings: income - expenses, 
      totalIncome: income, 
      totalExpenses: expenses, 
      mostActiveMonth, 
      avgMonthlyIncome,
      monthOnMonthChange,
      prevMonthLabel
    };
  };

  const metrics = processMetrics();

  const cardConfig = [
    {
      title: "TOP SPENDING CATEGORY",
      value: metrics.topCategory,
      subtitle: `₹${metrics.topCatAmt.toLocaleString()} spent — your biggest expense bucket.`,
      icon: <ShoppingBag className="w-5 h-5" style={{ color: theme === 'light' ? '#FF6B00' : '#60A5FA' }} />,
    },
    {
      title: "SAVINGS RATE",
      value: `${metrics.savingsRate}%`,
      subtitle: metrics.savingsRate >= 20 ? "Great job! You're saving above the recommended 20% threshold." : "Try reducing non-essential expenses to hit a 20% safety margin.",
      icon: <PiggyBank className="w-5 h-5" style={{ color: theme === 'light' ? '#FF8C00' : '#F472B6' }} />,
    },
    {
      title: "MONTH-ON-MONTH EXPENSES",
      value: metrics.monthOnMonthChange !== null
        ? `${metrics.monthOnMonthChange > 0 ? "+" : ""}${metrics.monthOnMonthChange}%`
        : "N/A",
      subtitle: metrics.monthOnMonthChange !== null
        ? metrics.monthOnMonthChange > 0
          ? `Spending rose vs ${metrics.prevMonthLabel}. Review discretionary categories.`
          : metrics.monthOnMonthChange < 0
          ? `Spending dropped vs ${metrics.prevMonthLabel}. Great discipline!`
          : `No change in spending vs ${metrics.prevMonthLabel}.`
        : "Not enough data to calculate month-on-month change.",
      icon: <TrendingUp className="w-5 h-5 text-red-400" />,
      valueClass: metrics.monthOnMonthChange !== null && metrics.monthOnMonthChange > 0
        ? "text-red-500"
        : "text-green-500"
    },
    {
      title: "NET SAVINGS THIS MONTH",
      value: `₹${metrics.netSavings.toLocaleString()}`,
      subtitle: `Income ₹${metrics.totalIncome.toLocaleString()} minus expenses ₹${metrics.totalExpenses.toLocaleString()}`,
      icon: <Target className="w-5 h-5" style={{ color: theme === 'light' ? '#FF6B00' : '#E879F9' }} />,
    },
    {
      title: "MOST ACTIVE MONTH",
      value: metrics.mostActiveMonth,
      subtitle: "The month with the highest combined income and expense activity.",
      icon: <Calendar className="w-5 h-5" style={{ color: theme === 'light' ? '#FF6B00' : '#34D399' }} />,
    },
    {
      title: "AVG MONTHLY INCOME",
      value: `₹${metrics.avgMonthlyIncome.toLocaleString()}`,
      subtitle: "Average income across all recorded months in your history.",
      icon: <DollarSign className="w-5 h-5" style={{ color: theme === 'light' ? '#FF6B00' : '#C084FC' }} />,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {cardConfig.map((card, idx) => (
        <div key={idx} className="theme-panel theme-panel-strong rounded-xl p-5 hover:border-zinc-700 transition duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">{card.title}</span>
              <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">{card.icon}</div>
            </div>
            <h2 className={`text-2xl font-bold text-white mb-1 tracking-tight uppercase ${card.valueClass || ''}`}>
              {card.value}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mt-2">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}