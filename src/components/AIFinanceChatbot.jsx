import React from "react";
import {
  Bot,
  ChevronDown,
  MessageSquareText,
  PiggyBank,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import categorize from "./utils/categorize";

const quickActions = [
  {
    id: "spending",
    label: "Analyze Spending",
    icon: MessageSquareText,
  },
  {
    id: "saving",
    label: "Saving Suggestions",
    icon: PiggyBank,
  },
  {
    id: "unusual",
    label: "Detect Unusual Expenses",
    icon: Search,
  },
];

const formatMoney = (value, currency) =>
  `${currency.symbol}${Math.round(value).toLocaleString()}`;

const getTransactionAmount = (transaction) =>
  Number(transaction.Amount || transaction.amount || 0);

const buildSummary = (transactions) => {
  const summary = transactions.reduce(
    (acc, transaction) => {
      const amount = getTransactionAmount(transaction);

      if (amount > 0) {
        acc.income += amount;
      } else if (amount < 0) {
        const expense = Math.abs(amount);
        const category = categorize(transaction.Description || "");
        acc.expense += expense;
        acc.categories[category] = (acc.categories[category] || 0) + expense;
        acc.expenses.push({
          ...transaction,
          amount: expense,
          category,
        });
      }

      return acc;
    },
    {
      income: 0,
      expense: 0,
      categories: {},
      expenses: [],
    }
  );

  const topCategories = Object.entries(summary.categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const averageExpense =
    summary.expenses.length > 0
      ? summary.expense / summary.expenses.length
      : 0;

  const unusualExpenses = summary.expenses
    .filter((expense) => expense.amount > averageExpense * 1.7)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return {
    ...summary,
    savings: summary.income - summary.expense,
    topCategories,
    averageExpense,
    unusualExpenses,
  };
};

const createInsight = (actionId, summary, currency) => {
  if (actionId === "spending") {
    const categoryLine =
      summary.topCategories.length > 0
        ? summary.topCategories
            .map(([category, amount]) => `${category}: ${formatMoney(amount, currency)}`)
            .join(", ")
        : "No expense categories found yet.";

    return {
      title: "Spending Snapshot",
      body: `You have ${formatMoney(summary.income, currency)} in income and ${formatMoney(summary.expense, currency)} in expenses. Your current savings balance from this upload is ${formatMoney(summary.savings, currency)}.`,
      details: [
        `Top categories: ${categoryLine}`,
        `Average expense size: ${formatMoney(summary.averageExpense, currency)}`,
        summary.savings >= 0
          ? "Cash flow is positive for this dataset."
          : "Expenses are above income in this dataset.",
      ],
    };
  }

  if (actionId === "saving") {
    const highestCategory = summary.topCategories[0];
    const target = highestCategory ? Math.round(highestCategory[1] * 0.15) : 0;

    return {
      title: "Saving Plan",
      body: highestCategory
        ? `Your biggest controllable area is ${highestCategory[0]}. A 15% cut there could free about ${formatMoney(target, currency)}.`
        : "Add more expenses to receive stronger saving suggestions.",
      details: [
        "Set a weekly cap for the highest category.",
        "Move recurring bills into a separate review list.",
        "Keep a small buffer before adding new discretionary spends.",
      ],
    };
  }

  const unusualLine =
    summary.unusualExpenses.length > 0
      ? summary.unusualExpenses.map((expense) => {
          const name = expense.Description || "Transaction";
          return `${name} (${formatMoney(expense.amount, currency)})`;
        })
      : ["No strong outliers detected against the current average expense."];

  return {
    title: "Unusual Expense Check",
    body: `I compared each expense against the average expense of ${formatMoney(summary.averageExpense, currency)}.`,
    details: unusualLine,
  };
};

export default function AIFinanceChatbot({ transactions = [], currency }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [messages, setMessages] = React.useState([
    {
      role: "assistant",
      title: "AI finance assistant ready",
      body: "Choose an analysis option to generate insights from your uploaded transactions.",
      details: ["Your data stays in this browser session."],
    },
  ]);

  const summary = React.useMemo(
    () => buildSummary(transactions),
    [transactions]
  );

  const handleAction = (actionId) => {
    const action = quickActions.find((item) => item.id === actionId);
    const insight = createInsight(actionId, summary, currency);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        body: action.label,
      },
      {
        role: "assistant",
        ...insight,
      },
    ]);
  };

  if (!transactions.length || !isOpen) {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center border border-[#FF6B00] bg-[#111111] text-[#FF6B00] shadow-[0_0_18px_rgba(255,107,0,0.22)] transition-colors hover:bg-[#FF6B00] hover:text-black"
        aria-label="Open AI finance insights"
        title="Open AI finance insights"
      >
        <Bot size={24} aria-hidden="true" />
      </button>
    );
  }

  return (
    <aside className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-h-[82vh] w-[calc(100vw-1.5rem)] max-w-[420px] flex-col border border-[#FF6B00]/60 bg-[#0A0A0A] shadow-[0_0_28px_rgba(255,107,0,0.2)] md:inset-x-auto md:right-5 md:bottom-5">
      <header className="flex items-center justify-between border-b border-[#1F1F1F] bg-[#111111] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#FF6B00]/50 bg-[#FF6B00]/10 text-[#FF6B00]">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-black uppercase tracking-widest text-white">
              AI Finance Insights
            </h2>
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-gray-500">
              {transactions.length} transactions loaded
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="flex h-9 w-9 items-center justify-center border border-[#1F1F1F] text-gray-400 transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
            aria-label="Minimize AI finance insights"
            title="Minimize"
          >
            <ChevronDown size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center border border-[#1F1F1F] text-gray-400 transition-colors hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
            aria-label="Close AI finance insights"
            title="Close"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`border p-3 ${
              message.role === "user"
                ? "ml-8 border-[#FF6B00]/40 bg-[#FF6B00]/10 text-[#FFB36B]"
                : "mr-4 border-[#1F1F1F] bg-[#111111] text-gray-200"
            }`}
          >
            {message.title && (
              <h3 className="mb-2 text-sm font-black uppercase tracking-wider text-white">
                {message.title}
              </h3>
            )}
            <p className="text-sm leading-6">{message.body}</p>
            {message.details && (
              <ul className="mt-3 space-y-2 text-xs leading-5 text-gray-400">
                {message.details.map((detail) => (
                  <li key={detail} className="border-l border-[#FF6B00]/40 pl-3">
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      <div className="border-t border-[#1F1F1F] bg-[#111111] p-4">
        <div className="grid grid-cols-1 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => handleAction(action.id)}
                className="flex min-h-11 items-center justify-between border border-[#1F1F1F] px-3 py-2 text-left text-xs font-black uppercase tracking-wider text-gray-200 transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                <span>{action.label}</span>
                <Icon size={16} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
