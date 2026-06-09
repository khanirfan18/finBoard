import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function CategoryBreakdown({ transactions }) {
  const { theme } = useTheme();

  const getCategoryStats = () => {
    const totals = {};
    let totalExpenseSum = 0;

    transactions.forEach((t) => {
      const amt = Number(t.Amount) || 0;

      // Target expense records exclusively
      if (amt < 0) {
        const absAmt = Math.abs(amt);
        const desc = (t.Description || t.description || '').toString().trim().toLowerCase();

        // Prefer stored category if present
        let categoryKey = (t.category || t.Category || '').toString().trim().toLowerCase();

        if (!categoryKey) {
          // Derive from description when no stored category
          if (desc.includes('swiggy') || desc.includes('zomato')) {
            categoryKey = 'food';
          } else if (desc.includes('uber') || desc.includes('petrol')) {
            categoryKey = 'transport';
          } else if (desc.includes('amazon shopping') || desc.includes('amazon')) {
            categoryKey = 'shopping';
          } else if (desc.includes('electricity bill')) {
            categoryKey = 'bills';
          } else if (desc.includes('gym') || desc.includes('membership')) {
            categoryKey = 'health';
          } else {
            categoryKey = 'other';
          }
        }

        totals[categoryKey] = (totals[categoryKey] || 0) + absAmt;
        totalExpenseSum += absAmt;
      }
    });

    const colorMap = theme === "light"
      ? {
          bills: "#FF6B00",
          food: "#FF8C00",
          health: "#FFA500",
          shopping: "#FFB732",
          transport: "#FFC966",
          other: "#FFDB99",
        }
      : {
          bills: "#ef4444",      // Coral Red
          food: "#3b82f6",       // Indigo Blue
          health: "#a855f7",     // Fuchsia Purple
          shopping: "#ec4899",   // Hot Pink
          transport: "#10b981",  // Teal Green
          other: "#f59e0b",      // Amber Orange
        };

    const formatLabel = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return Object.entries(totals)
      .map(([categoryKey, amount]) => {
        const percentage = totalExpenseSum > 0 ? Math.round((amount / totalExpenseSum) * 100) : 0;
        return {
          displayLabel: formatLabel(categoryKey),
          amount,
          percentage,
          color: colorMap[categoryKey] || "#64748b",
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  const categories = getCategoryStats();

  return (
    <div className="theme-panel rounded-xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-base font-bold text-white mb-1">Full Category Breakdown</h3>
        <p className="text-xs text-zinc-500">Ranked contribution distribution analysis</p>
      </div>

      <div className="space-y-5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {categories.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">No expenditure metrics discovered.</p>
        ) : (
          categories.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-600 font-mono w-4">{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300 font-medium">{item.displayLabel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold">₹{item.amount.toFixed(2)}</span>
                  <span className="text-zinc-500 text-[10px] font-mono">{item.percentage}%</span>
                </div>
              </div>

              <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800/40">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}