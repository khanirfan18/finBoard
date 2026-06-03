import React from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../context/AppContext";
import { useModal } from "../context/ModalContext";
import categorize from "../components/utils/categorize";
import { parse } from "date-fns";
import { useState } from "react";

const categoryIcons = {
  Food: "🍔",
  Transport: "✈️",
  Shopping: "🛒",
  Income: "💰",
  Bills: "📄",
  Entertainment: "🎬",
  Health: "🏥",
  Other: "📌",
};

function EditModal({ transaction, onSave, onClose }) {
  const [form, setForm] = React.useState({
    Date: transaction.Date,
    Description: transaction.Description,
    Amount: transaction.originalAmount ?? transaction.Amount,
    category: transaction.category || "",
  });

  const [DEFAULTCATEGORIES , setDEFAULTCATEGORIES] = useState([ "Food", "Transport",
    "Shopping","Income", "Bills", "Entertainment", "Health", "Other"]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    if (!form.Date || !form.Description || form.Amount === "") return;
    onSave({ ...transaction, ...form, Amount: Number(form.Amount) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="retro-card p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6">
          Edit Transaction
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
              Date
            </label>
            <input
              type="text"
              name="Date"
              value={form.Date}
              onChange={handleChange}
              placeholder="dd/MM/yyyy"
              className="retro-input p-3 w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
              Description
            </label>
            <input
              type="text"
              name="Description"
              value={form.Description}
              onChange={handleChange}
              className="retro-input p-3 w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
              Select Category
            </label>
            <select 
              className="retro-input p-3 w-full"
              name="category"
              value={form.category}
              onChange={handleChange}
              >
              {
                DEFAULTCATEGORIES.map((options, index)=>(
                  <option key={index} value={options}>{options}</option>
                ))
              }
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
              Amount {transaction.originalCurrency ? `(${transaction.originalCurrency.symbol || transaction.originalCurrency.code})` : ""}
            </label>
            <input
              type="number"
              name="Amount"
              value={form.Amount}
              onChange={handleChange}
              className="retro-input p-3 w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Use negative value for expenses</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-[#1F1F1F] text-gray-400 hover:text-white hover:border-gray-500 font-bold uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>
          <button onClick={handleSave} className="retro-btn">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Transaction() {
  const { transactions, currency, deleteTransaction, updateTransaction } =
    React.useContext(DataContext);
  const { showModal } = useModal();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [datePreset, setDatePreset] = React.useState("all");
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [sortBy, setSortBy] = React.useState("date-desc");
  const [minAmount, setMinAmount] = React.useState("");
  const [maxAmount, setMaxAmount] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState(null);

  const allCategories = React.useMemo(() => {
    const cats = new Set();
    transactions?.forEach((t) => cats.add(t.category || categorize(t.Description)));
    return Array.from(cats).sort();
  }, [transactions]);

  const getDateRange = (preset) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (preset) {
      case "today":
        return { start: today, end: new Date(today.getTime() + 86400000) };
      case "yesterday":
        const yesterday = new Date(today.getTime() - 86400000);
        return { start: yesterday, end: today };
      case "this-week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return { start: weekStart, end: new Date() };
      case "last-week":
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay());
        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekEnd.getDate() - 7);
        return { start: lastWeekStart, end: lastWeekEnd };
      case "this-month":
        return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date() };
      case "last-month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start: lastMonth, end: lastMonthEnd };
      case "last-3-months":
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        return { start: threeMonthsAgo, end: new Date() };
      case "this-year":
        return { start: new Date(now.getFullYear(), 0, 1), end: new Date() };
      default:
        return null;
    }
  };

  const { filteredTransactions, originalIndices } = React.useMemo(() => {
    if (!transactions) return { filteredTransactions: [], originalIndices: [] };

    let indexed = transactions.map((t, i) => ({ t, i }));

    if (searchTerm) {
      indexed = indexed.filter(({ t }) =>
        (t.Description || t.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (datePreset !== "all") {
      const dateRange = getDateRange(datePreset);
      if (dateRange) {
        indexed = indexed.filter(({ t }) => {
          try {
            const transactionDate = parse(t.Date || t.date, "dd/MM/yyyy", new Date());
            return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
          } catch {
            return true;
          }
        });
      }
    }

    if (selectedCategories.length > 0) {
      indexed = indexed.filter(({ t }) =>
        selectedCategories.includes(t.category || t.Category || categorize(t.Description))
      );
    }

    if (minAmount !== "" || maxAmount !== "") {
      indexed = indexed.filter(({ t }) => {
        const amount = Math.abs(Number(t.Amount));
        const min = minAmount !== "" ? Number(minAmount) : -Infinity;
        const max = maxAmount !== "" ? Number(maxAmount) : Infinity;
        return amount >= min && amount <= max;
      });
    }

    indexed.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return parse(a.t.Date || a.t.date, "dd/MM/yyyy", new Date()) - parse(b.t.Date || b.t.date, "dd/MM/yyyy", new Date());
        case "date-desc":
          return parse(b.t.Date || b.t.date, "dd/MM/yyyy", new Date()) - parse(a.t.Date || a.t.date, "dd/MM/yyyy", new Date());
        case "amount-asc":
          return Number(a.t.Amount) - Number(b.t.Amount);
        case "amount-desc":
          return Number(b.t.Amount) - Number(a.t.Amount);
        case "category":
          return (a.t.category || a.t.Category || categorize(a.t.Description)).localeCompare(b.t.category || b.t.Category || categorize(b.t.Description));
        default:
          return 0;
      }
    });

    return {
      filteredTransactions: indexed.map(({ t }) => t),
      originalIndices: indexed.map(({ i }) => i),
    };
  }, [transactions, searchTerm, datePreset, selectedCategories, sortBy, minAmount, maxAmount]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDatePreset("all");
    setSelectedCategories([]);
    setSortBy("date-desc");
    setMinAmount("");
    setMaxAmount("");
  };

  const handleDelete = (filteredIdx) => {
    const originalIdx = originalIndices[filteredIdx];
    showModal({
      type: "confirm",
      message: `Are you sure you want to delete this transaction? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => deleteTransaction(originalIdx),
    });
  };

  const handleEdit = (filteredIdx) => {
    setEditingIndex(filteredIdx);
  };

  const handleSaveEdit = (updatedTransaction) => {
    const originalIdx = originalIndices[editingIndex];
    updateTransaction(originalIdx, updatedTransaction);
    setEditingIndex(null);
  };

  const exportToCSV = () => {
    if (!filteredTransactions.length) return;
    const headers = ["Date", "Description", "Amount", "Category"];
    const rows = filteredTransactions.map((item) => [
      item.Date,
      item.Description,
      item.Amount,
      item.category || categorize(item.Description),
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return transactions && transactions.length > 0 ? (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Edit Modal */}
      {editingIndex !== null && (
        <EditModal
          transaction={filteredTransactions[editingIndex]}
          onSave={handleSaveEdit}
          onClose={() => setEditingIndex(null)}
        />
      )}

      {/* Filter Panel */}
      <div className="retro-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#FF6B00] text-lg font-black uppercase tracking-widest">
            Filters & Search
          </h2>
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-[#FF6B00] uppercase tracking-wider font-bold transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
              Search Description
            </label>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="retro-input p-3 w-full"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
              Time Period
            </label>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value)}
              className="retro-input p-3 w-full"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this-week">This Week</option>
              <option value="last-week">Last Week</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="this-year">This Year</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
              Min Amount
            </label>
            <input
              type="number"
              placeholder="Min"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="retro-input p-3 w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
              Max Amount
            </label>
            <input
              type="number"
              placeholder="Max"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="retro-input p-3 w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="retro-input p-3 w-full"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
              <option value="category">Category (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm border transition-colors ${
                  selectedCategories.includes(category)
                    ? "bg-[#FF6B00] text-[whitesmoke] border-[#FF6B00]"
                    : "bg-[#1F1F1F] text-gray-300 border-[#2a2a2a] hover:border-[#FF6B00]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Showing{" "}
          <span className="text-[#FF6B00] font-bold">{filteredTransactions.length}</span> of{" "}
          <span className="font-bold">{transactions.length}</span> transactions
        </div>
      </div>

      {/* Transactions Table */}
      <div className="retro-card overflow-x-auto">
        <div className="flex justify-end items-center px-4 pt-4">
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-[#FF6B00] text-[whitesmoke] text-sm font-bold rounded-md hover:opacity-90 transition"
          >
            Export CSV
          </button>
        </div>
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-[#111111] text-[#FF6B00] border-b border-[#1F1F1F] uppercase tracking-widest text-sm">
              <th className="py-4 px-6 font-bold">Date</th>
              <th className="py-4 px-6 font-bold">Description</th>
              <th className="py-4 px-6 font-bold text-right">Amount</th>
              <th className="py-4 px-6 font-bold">Category</th>
              <th className="py-4 px-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((data, i) => (
              <tr
                key={i}
                className="border-b border-[#1F1F1F]/50 hover:bg-[#1a1a1a] transition-colors"
              >
                <td className="py-4 px-6 text-gray-400 whitespace-nowrap">{data.Date}</td>
                <td
                  className="py-4 px-6 font-medium max-w-sm truncate"
                  title={data.Description}
                >
                  {data.Description}
                </td>
                <td
                  className={`py-4 px-6 font-black text-right whitespace-nowrap ${
                    Number(data.Amount) > 0 ? "text-[#00C49F]" : "text-white"
                  }`}
                >
                  {Number(data.Amount) > 0 ? "+" : ""}
                  {data.Currency?.symbol || currency.symbol}
                  {Math.abs(Number(data.Amount)).toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  <span className="bg-[#1F1F1F] text-gray-300 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm border border-[#2a2a2a] flex items-center gap-2 w-fit">
                    <span>{categoryIcons[data.category] || categoryIcons[categorize(data.Description)] || "📌"}</span>
                    {data.category || categorize(data.Description)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(i)}
                      title="Edit transaction"
                      className="p-2 rounded-sm border border-[#2a2a2a] bg-[#1F1F1F] text-gray-400 hover:text-[#FF6B00] hover:border-[#FF6B00] transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      title="Delete transaction"
                      className="p-2 rounded-sm border border-[#2a2a2a] bg-[#1F1F1F] text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="retro-card p-12 flex flex-col items-center max-w-md text-center border-[#FF6B00]/20 animate-in fade-in zoom-in-95 duration-500 transition-all duration-300 hover:border-[#FF6B00]/28">
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
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </div>
        <h2 className="text-2xl font-black tracking-wider text-white mb-2 uppercase">
          No Transactions
        </h2>
       <p className="text-gray-400 mb-8 leading-relaxed min-h-[96px] flex items-center">
        No transactions found. Upload your data to view the history.
       </p>
        <Link to="/settings" className="retro-btn">
          Configure Settings
        </Link>
      </div>
    </div>
  );
}