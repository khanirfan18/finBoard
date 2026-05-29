import React, { useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import { parse, format, subMonths } from "date-fns";

const getTransactionDate = (txn) => {
  if (!txn) return null;

  const rawDate =
    txn.Date ||
    txn.date ||
    txn.transactionDate ||
    txn.createdAt ||
    txn.TransactionDate;

  if (!rawDate) return null;

  try {
    if (typeof rawDate === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(rawDate)) {
      const parsed = parse(rawDate, "dd/MM/yyyy", new Date());
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(rawDate);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
};

const getTransactionAmount = (txn) => {
  const rawAmount = txn.Amount ?? txn.amount ?? txn.Debit ?? txn.debit ?? 0;
  const amount = Number(String(rawAmount).replace(/,/g, ""));
  return isNaN(amount) ? 0 : amount;
};

const getColorClass = (amount) => {
  if (!amount || amount <= 0) return "color-empty";
  if (amount <= 500) return "color-low";
  if (amount <= 2000) return "color-medium";
  return "color-high";
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function SpendingHeatmap({ transactions = [] }) {
  const heatmapData = useMemo(() => {
    const dailySpending = {};

    transactions.forEach((txn) => {
      const amount = getTransactionAmount(txn);

      // only expenses are negative in demoData
      if (amount >= 0) return;

      const date = getTransactionDate(txn);
      if (!date) return;

      const dateString = format(date, "yyyy-MM-dd");
      dailySpending[dateString] =
        (dailySpending[dateString] || 0) + Math.abs(amount);
    });

    return Object.entries(dailySpending).map(([date, count]) => ({
      date,
      count,
    }));
  }, [transactions]);

  const { startDate, endDate } = useMemo(() => {
    if (heatmapData.length === 0) {
      const today = new Date();
      return {
        startDate: subMonths(today, 12),
        endDate: today,
      };
    }

    const dates = heatmapData.map((item) => new Date(item.date));
    const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    return {
      startDate: subMonths(latestDate, 12),
      endDate: latestDate,
    };
  }, [heatmapData]);

  if (!transactions || transactions.length === 0) return null;

  return (
    <div className="fin-card p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-wider text-white mb-2 uppercase">
          Smart Spending Heatmap
        </h2>
        <p className="text-gray-400 text-sm tracking-wide">
          Visualize your daily spending intensity across time
        </p>
      </div>

      <div className="overflow-x-auto mb-8 pb-4">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapData}
          classForValue={(value) => {
            if (!value || !value.count) return "color-empty";
            return getColorClass(value.count);
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) {
              return {
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": "No spending",
              };
            }

            return {
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": `${value.date} • ${formatCurrency(
                value.count
              )}`,
            };
          }}
          showWeekdayLabels
        />
      </div>

      <div className="border-t border-[#333333] pt-6">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
          Spending Intensity
        </p>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-sm bg-[#1f1f1f] border border-[#333]" />
            <div>
              <p className="text-xs font-semibold text-gray-300">₹0</p>
              <p className="text-xs text-gray-500">No spending</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-sm bg-[#facc15]" />
            <div>
              <p className="text-xs font-semibold text-gray-300">Low</p>
              <p className="text-xs text-gray-500">₹1–500</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-sm bg-[#fb923c]" />
            <div>
              <p className="text-xs font-semibold text-gray-300">Medium</p>
              <p className="text-xs text-gray-500">₹501–2000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-sm bg-[#ef4444]" />
            <div>
              <p className="text-xs font-semibold text-gray-300">High</p>
              <p className="text-xs text-gray-500">₹2000+</p>
            </div>
          </div>
        </div>
      </div>

      <Tooltip id="heatmap-tooltip" place="top" />
    </div>
  );
}