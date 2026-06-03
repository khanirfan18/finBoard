import React from "react";
import { DataContext } from "../context/AppContext";
import { useModal } from "../context/ModalContext";

export default function Goals() {
  const { transactions, currency } = React.useContext(DataContext);
  const { showModal } = useModal();

  const [goals, setGoals] = React.useState(() => {
    const saved = localStorage.getItem("savingsGoals");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = React.useState({
    name: "",
    target: "",
    deadline: "",
  });

  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem("savingsGoals", JSON.stringify(goals));
  }, [goals]);

  const totalSavings = transactions?.reduce((acc, t) => {
    return acc + Number(t.Amount);
  }, 0) || 0;

  const avgMonthlySavings = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return 0;
    const months = {};
    transactions.forEach((t) => {
      const [day, month, year] = t.Date.split("/");
      const key = `${year}-${month}`;
      months[key] = (months[key] || 0) + Number(t.Amount);
    });
    const values = Object.values(months);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [transactions]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!form.name || !form.target || !form.deadline) return;

    const newGoal = {
      id: Date.now(),
      name: form.name,
      target: Number(form.target),
      deadline: form.deadline,
    };

    setGoals([...goals, newGoal]);
    setForm({ name: "", target: "", deadline: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    showModal({
      type: "confirm",
      message: "Are you sure you want to delete this goal?",
      onConfirm: () => {
        setGoals(goals.filter((g) => g.id !== id));
      },
    });
  };

  const getProgress = (target) => {
    if (totalSavings <= 0) return 0;
    return Math.min((totalSavings / target) * 100, 100);
  };

  const getMonthsLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const months =
      (end.getFullYear() - now.getFullYear()) * 12 +
      (end.getMonth() - now.getMonth());
    return Math.max(0, months);
  };

  const getMonthlyNeeded = (target, deadline) => {
    const months = getMonthsLeft(deadline);
    if (months === 0) return target - totalSavings;
    return Math.max(0, (target - totalSavings) / months);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white">
            Savings Goals
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your financial targets
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-[#FF6B00] px-5 py-2.5 text-sm font-black uppercase text-black"
        >
          {showForm ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      {/* ADD GOAL FORM */}
      {showForm && (
        <div className="w-full rounded-[24px] border border-[#222] bg-[#141414] p-6">
          <h2 className="text-[#FF6B00] font-black uppercase tracking-widest text-lg mb-6">
            New Goal
          </h2>
          <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Goal Name
              </label>
              <input
                type="text"
                placeholder="e.g. New Laptop"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-[#222] bg-[#111] p-4 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Target Amount ({currency.symbol})
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 50000"
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
                className="w-full rounded-xl border border-[#222] bg-[#111] p-4 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Target Date
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full rounded-xl border border-[#222] bg-[#111] p-4 text-white"
                required
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="rounded-xl bg-[#FF6B00] px-7 py-3 font-black uppercase text-black"
              >
                Add Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CURRENT SAVINGS BANNER */}
      <div className="w-full rounded-[24px] border border-[#00C49F]/20 bg-[#0a1a12] p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Current Total Savings
          </p>
          <p className="text-3xl font-black text-[#00C49F] mt-1">
            {currency.symbol}{totalSavings.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Avg Monthly Savings
          </p>
          <p className={`text-xl font-black mt-1 ${avgMonthlySavings >= 0 ? "text-[#00C49F]" : "text-[#FF6B6B]"}`}>
            {currency.symbol}{Math.abs(avgMonthlySavings).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* GOALS LIST */}
      {goals.length === 0 ? (
        <div className="w-full rounded-[24px] border border-[#222] bg-[#141414] p-12 flex flex-col items-center text-center">
          <p className="text-4xl mb-4">🎯</p>
          <h2 className="text-white font-black uppercase tracking-wider text-xl mb-2">
            No Goals Yet
          </h2>
          <p className="text-gray-500 text-sm">
            Click "+ New Goal" to set your first savings target.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const progress = getProgress(goal.target);
            const monthsLeft = getMonthsLeft(goal.deadline);
            const monthlyNeeded = getMonthlyNeeded(goal.target, goal.deadline);
            const isAchieved = totalSavings >= goal.target;

            return (
              <div
                key={goal.id}
                className="w-full rounded-[24px] border border-[#222] bg-[#141414] p-6 space-y-4 hover:border-[#FF6B00]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-black uppercase tracking-wider">
                      {goal.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Target: {currency.symbol}{goal.target.toLocaleString()} · Due {new Date(goal.deadline).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors text-xs uppercase font-bold"
                  >
                    Delete
                  </button>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{progress.toFixed(1)}% saved</span>
                    <span>{currency.symbol}{Math.min(totalSavings, goal.target).toLocaleString()} / {currency.symbol}{goal.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#222]">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isAchieved ? "bg-[#00C49F]" : "bg-[#FF6B00]"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* INSIGHTS */}
                {isAchieved ? (
                  <p className="text-[#00C49F] text-xs font-bold uppercase tracking-wider">
                    🎉 Goal Achieved!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#111] p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Months Left</p>
                      <p className="text-white font-black text-lg">{monthsLeft}</p>
                    </div>
                    <div className="rounded-xl bg-[#111] p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Need/Month</p>
                      <p className="text-[#FF6B00] font-black text-lg">
                        {currency.symbol}{monthlyNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}