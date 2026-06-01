import React from "react";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  MessageCircle,
  Minus,
  PiggyBank,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import categorize from "./utils/categorize";

const ACTIONS = [
  {
    key: "spending",
    label: "Analyze Spending",
    icon: BarChart3,
  },
  {
    key: "saving",
    label: "Saving Suggestions",
    icon: PiggyBank,
  },
  {
    key: "unusual",
    label: "Detect Unusual Expenses",
    icon: AlertTriangle,
  },
];

function toAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function formatMoney(value, currency) {
  return `${currency?.symbol || "₹"}${Math.abs(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

function getCategory(transaction) {
  return (
    transaction.Category ||
    transaction.category ||
    categorize(transaction.Description || transaction.description || "")
  );
}

function normalizeTransaction(transaction, index) {
  const amount = toAmount(transaction.Amount || transaction.amount);
  const description =
    transaction.Description || transaction.description || `Transaction ${index + 1}`;

  return {
    id: `${description}-${index}`,
    amount,
    category: getCategory(transaction),
    date: transaction.Date || transaction.date || "Unknown date",
    description,
  };
}

function buildFinanceProfile(transactions) {
  const normalized = (transactions || []).map(normalizeTransaction);
  const expenses = normalized.filter((transaction) => transaction.amount < 0);
  const income = normalized.filter((transaction) => transaction.amount > 0);

  const totalIncome = income.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );
  const totalExpense = expenses.reduce(
    (total, transaction) => total + Math.abs(transaction.amount),
    0
  );
  const categoryTotals = expenses.reduce((totals, transaction) => {
    totals[transaction.category] =
      (totals[transaction.category] || 0) + Math.abs(transaction.amount);
    return totals;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, firstAmount], [, secondAmount]) => secondAmount - firstAmount
  );
  const averageExpense = expenses.length ? totalExpense / expenses.length : 0;
  const unusualThreshold = Math.max(averageExpense * 1.75, totalExpense * 0.18);
  const unusualExpenses = expenses
    .filter((transaction) => Math.abs(transaction.amount) >= unusualThreshold)
    .sort((first, second) => Math.abs(second.amount) - Math.abs(first.amount))
    .slice(0, 3);

  return {
    count: normalized.length,
    expenses,
    income,
    totalExpense,
    totalIncome,
    netSavings: totalIncome - totalExpense,
    savingsRate: totalIncome
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0,
    sortedCategories,
    unusualExpenses,
    averageExpense,
  };
}

function buildSpendingInsight(profile, currency) {
  if (!profile.expenses.length) {
    return "I found income entries but no expenses yet. Add or upload expense rows so I can break down spending patterns.";
  }

  const [topCategory, topAmount] = profile.sortedCategories[0] || [
    "Uncategorized",
    0,
  ];
  const categoryShare = profile.totalExpense
    ? Math.round((topAmount / profile.totalExpense) * 100)
    : 0;
  const topThree = profile.sortedCategories
    .slice(0, 3)
    .map(
      ([category, amount], index) =>
        `${index + 1}. ${category}: ${formatMoney(amount, currency)}`
    )
    .join("\n");

  return `Your CSV shows ${profile.expenses.length} expense entries totaling ${formatMoney(
    profile.totalExpense,
    currency
  )}.

Top category: ${topCategory} at ${formatMoney(
    topAmount,
    currency
  )}, about ${categoryShare}% of all spending.

Category leaders:
${topThree}`;
}

function buildSavingInsight(profile, currency) {
  if (!profile.totalIncome) {
    return "I need at least one income row to calculate a savings rate. Once income is present, I can compare expenses against a 20% savings target.";
  }

  const [topCategory, topAmount] = profile.sortedCategories[0] || [
    "discretionary spending",
    0,
  ];
  const tenPercentCut = topAmount * 0.1;
  const targetSavings = profile.totalIncome * 0.2;
  const gapToTarget = Math.max(targetSavings - profile.netSavings, 0);

  if (gapToTarget === 0) {
    return `Your savings rate is ${profile.savingsRate}%, which clears the 20% benchmark.

Keep the lead by protecting this buffer. A light 10% trim in ${topCategory} would still free up ${formatMoney(
      tenPercentCut,
      currency
    )} for goals or emergency reserves.`;
  }

  return `Your current savings rate is ${profile.savingsRate}%. To reach a 20% savings target, you need about ${formatMoney(
    gapToTarget,
    currency
  )} more margin.

Start with ${topCategory}, your largest expense bucket. A 10% reduction there saves around ${formatMoney(
    tenPercentCut,
    currency
  )}, and pairing it with one recurring bill review should move the needle quickly.`;
}

function buildUnusualInsight(profile, currency) {
  if (!profile.expenses.length) {
    return "No expense entries are available for anomaly detection yet.";
  }

  const candidates = profile.unusualExpenses.length
    ? profile.unusualExpenses
    : profile.expenses
        .slice()
        .sort((first, second) => Math.abs(second.amount) - Math.abs(first.amount))
        .slice(0, 3);

  const rows = candidates
    .map(
      (transaction, index) =>
        `${index + 1}. ${transaction.description} — ${formatMoney(
          transaction.amount,
          currency
        )} in ${transaction.category} on ${transaction.date}`
    )
    .join("\n");

  return `I checked every expense against your average spend of ${formatMoney(
    profile.averageExpense,
    currency
  )}.

Review these high-impact entries first:
${rows}

If any entry is expected, keep it. If not, verify the merchant name, date, and uploaded CSV amount.`;
}

function getAssistantReply(actionKey, profile, currency) {
  switch (actionKey) {
    case "spending":
      return buildSpendingInsight(profile, currency);
    case "saving":
      return buildSavingInsight(profile, currency);
    case "unusual":
      return buildUnusualInsight(profile, currency);
    default:
      return "Choose one of the quick prompts and I will analyze the uploaded CSV data.";
  }
}

export default function FinanceChatbot({ transactions, currency }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const profile = React.useMemo(
    () => buildFinanceProfile(transactions),
    [transactions]
  );
  const [messages, setMessages] = React.useState(() => [
    {
      id: "welcome",
      role: "assistant",
      content:
        "I can review uploaded CSV transactions for spending patterns, savings moves, and unusual expenses.",
    },
  ]);

  const handleAction = (action) => {
    const assistantReply = getAssistantReply(action.key, profile, currency);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${action.key}-${currentMessages.length}`,
        role: "user",
        content: action.label,
      },
      {
        id: `assistant-${action.key}-${currentMessages.length}`,
        role: "assistant",
        content: assistantReply,
      },
    ]);
    setIsMinimized(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        aria-label="Open AI finance assistant"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#FF6B00]/50 bg-[#111] text-[#FF8C00] shadow-lg shadow-black/40 transition-all duration-200 hover:scale-110 hover:border-[#FF8C00] hover:text-white"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <aside
      aria-label="AI financial chatbot"
      className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-[#FF6B00]/40 bg-[#0D0D0D] shadow-2xl shadow-black/60 sm:right-8"
    >
      <header className="flex items-center justify-between border-b border-[#222] bg-[#141414] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF6B00]/30 bg-[#FF6B00]/10 text-[#FF8C00]">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black uppercase tracking-widest text-white">
              AI Finance Assistant
            </h3>
            <p className="truncate text-xs text-gray-500">
              {profile.count} CSV transactions loaded
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={isMinimized ? "Expand chatbot" : "Minimize chatbot"}
            onClick={() => setIsMinimized((current) => !current)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Close chatbot"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {!isMinimized && (
        <>
          <div className="max-h-[360px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#FF6B00] text-black"
                      : "border border-[#222] bg-[#151515] text-gray-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#222] bg-[#101010] p-3">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <Sparkles className="h-3.5 w-3.5 text-[#FF8C00]" />
              Quick prompts
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => handleAction(action)}
                    className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border border-[#222] bg-[#151515] px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-gray-300 transition-colors hover:border-[#FF6B00]/60 hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-[#FF8C00]" />
                    {action.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#222] bg-[#0A0A0A] px-3 py-2 text-xs text-gray-500">
              <Send className="h-3.5 w-3.5 text-[#FF8C00]" />
              Insights are generated locally from imported transactions.
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
