import React from "react";
import { DataContext } from "../context/DataContext";
import { useModal } from "../context/ModalContext";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/useAuth";

export default function Goals() {
  const { transactions, currency } = React.useContext(DataContext);
  const { showModal } = useModal();
  const { user } = useAuth();

  const [goals, setGoals] = React.useState([]);

  const [form, setForm] = React.useState({
    name: "",
    target: "",
    deadline: "",
  });

  const [showForm, setShowForm] = React.useState(false);
  const [allocationGoalId, setAllocationGoalId] = React.useState(null);
  const [allocationAmount, setAllocationAmount] = React.useState("");

  React.useEffect(() => {
    async function fetchGoals() {
      if (!user) {
        setGoals([]);
        return;
      }
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      if (data && !error) {
        setGoals(data);
      }
    }
    fetchGoals();
  }, [user]);

  const totalSavings = transactions?.reduce((acc, t) => {
    return acc + Number(t.Amount);
  }, 0) || 0;

  const totalAllocated = goals.reduce((acc, g) => acc + (Number(g.saved_amount) || 0), 0);
  const unallocatedSavings = Math.max(0, totalSavings - totalAllocated);

  const avgMonthlySavings = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return 0;
    const months = {};
    transactions.forEach((t) => {
      const [, month, year] = (t.Date || t.date).split("/");
      const key = `${year}-${month}`;
      months[key] = (months[key] || 0) + Number(t.Amount);
    });
    const values = Object.values(months);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [transactions]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!user || !form.name || !form.target || !form.deadline) return;

    const newGoal = {
      name: form.name,
      target: Number(form.target),
      deadline: form.deadline,
      saved_amount: 0,
    };

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        ...newGoal
      })
      .select()
      .single();

    if (data && !error) {
      setGoals([...goals, data]);
      setForm({ name: "", target: "", deadline: "" });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    if (!user) return;

    showModal({
      type: "confirm",
      message: "Are you sure you want to delete this goal? Any allocated funds will be returned to your unallocated savings.",
      onConfirm: async () => {
        setGoals(goals.filter((g) => g.id !== id));
        await supabase.from('goals').delete().eq('id', id);
      },
    });
  };

  const handleAllocate = async (goalId, isWithdrawal = false) => {
    if (!user) return;

    const amount = Number(allocationAmount);
    if (!amount || amount <= 0) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const currentSaved = Number(goal.saved_amount) || 0;
    
    if (isWithdrawal && amount > currentSaved) {
      showModal({ type: "alert", message: "Cannot withdraw more than the currently saved amount." });
      return;
    }
    
    if (!isWithdrawal && amount > unallocatedSavings) {
      showModal({ type: "alert", message: "Cannot allocate more than your available unallocated savings." });
      return;
    }

    const newSavedAmount = isWithdrawal ? currentSaved - amount : currentSaved + amount;

    const updatedGoals = goals.map(g => g.id === goalId ? { ...g, saved_amount: newSavedAmount } : g);
    setGoals(updatedGoals);
    setAllocationGoalId(null);
    setAllocationAmount("");

    await supabase.from('goals').update({ saved_amount: newSavedAmount }).eq('id', goalId);
  };

  const getProgress = (saved, target) => {
    if (saved <= 0) return 0;
    return Math.min((saved / target) * 100, 100);
  };

  const getMonthsLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const months =
      (end.getFullYear() - now.getFullYear()) * 12 +
      (end.getMonth() - now.getMonth());
    return Math.max(0, months);
  };

  const getMonthlyNeeded = (saved, target, deadline) => {
    const months = getMonthsLeft(deadline);
    if (months === 0) return target - saved;
    return Math.max(0, (target - saved) / months);
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
      <div className="w-full rounded-[24px] border border-[#00C49F]/20 bg-[#0a1a12] p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Total Savings
          </p>
          <p className="text-3xl font-black text-white mt-1">
            {currency.symbol}{totalSavings.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Unallocated (Available)
          </p>
          <p className="text-3xl font-black text-[#00C49F] mt-1">
            {currency.symbol}{totalSavings.toFixed(2)}
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Avg Monthly Savings
          </p>
          <p className={`text-xl font-black mt-1 ${avgMonthlySavings >= 0 ? "text-[#00C49F]" : "text-[#FF6B6B]"}`}>
            {currency.symbol}{Math.abs(avgMonthlySavings).toFixed(0)}
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const saved = Number(goal.saved_amount) || 0;
            const progress = getProgress(saved, goal.target);
            const monthsLeft = getMonthsLeft(goal.deadline);
            const monthlyNeeded = getMonthlyNeeded(saved, goal.target, goal.deadline);
            const isAchieved = saved >= goal.target;

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
                      Target: {currency.symbol}{goal.target.toFixed(2)} · Due {new Date(goal.deadline).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
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
                    <span>{currency.symbol}{Math.min(totalSavings, goal.target).toFixed(2)} / {currency.symbol}{goal.target.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#222]">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${isAchieved ? "bg-[#00C49F]" : "bg-[#FF6B00]"
                        }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* INSIGHTS & ALLOCATION */}
                <div className="pt-2">
                  {allocationGoalId === goal.id && (
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number" 
                        placeholder="Amount" 
                        value={allocationAmount}
                        onChange={(e) => setAllocationAmount(e.target.value)}
                        className="rounded-lg border border-[#222] bg-[#111] p-2 text-white w-full text-sm"
                      />
                      <button onClick={() => handleAllocate(goal.id, false)} className="bg-[#00C49F] text-black px-3 py-2 rounded-lg text-xs font-bold uppercase">Add</button>
                      <button onClick={() => handleAllocate(goal.id, true)} className="bg-[#FF6B6B] text-black px-3 py-2 rounded-lg text-xs font-bold uppercase">Withdraw</button>
                      <button onClick={() => setAllocationGoalId(null)} className="text-gray-500 px-2 text-xs uppercase font-bold">Cancel</button>
                    </div>
                  )}
                  {allocationGoalId !== goal.id && (
                    <div className="flex justify-between items-end">
                      <div className="flex gap-3">
                        <div className="rounded-xl bg-[#111] p-3">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Months Left</p>
                          <p className="text-white font-black text-lg">{monthsLeft}</p>
                        </div>
                        <div className="rounded-xl bg-[#111] p-3">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Need/Month</p>
                          <p className="text-[#FF6B00] font-black text-lg">
                            {currency.symbol}{monthlyNeeded.toFixed(0)}
                          </p>
                        </div>
                      </div>
                      
                      {!isAchieved && (
                        <button 
                          onClick={() => { setAllocationGoalId(goal.id); setAllocationAmount(""); }}
                          className="rounded-lg border border-[#333] hover:border-[#FF6B00] hover:text-[#FF6B00] text-gray-400 px-4 py-2 text-xs font-bold uppercase transition-colors"
                        >
                          Manage Funds
                        </button>
                      )}
                      
                      {isAchieved && (
                        <p className="text-[#00C49F] text-xs font-bold uppercase tracking-wider">
                          🎉 Goal Achieved!
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}