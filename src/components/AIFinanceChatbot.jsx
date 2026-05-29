import React from "react";
import {
  Bot,
  ChartNoAxesCombined,
  ChevronDown,
  FileSearch,
  LayoutDashboard,
  MessageSquareText,
  PiggyBank,
  Search,
  Send,
  Wallet,
  X,
} from "lucide-react";
import categorize from "./utils/categorize";

const pageConfig = {
  dashboard: {
    title: "Dashboard AI",
    subtitle: "Overview insights",
    introTitle: "Dashboard insights ready",
    introBody:
      "Use this assistant for high-level spending, savings, and outlier checks from your current dataset.",
    icon: LayoutDashboard,
    actions: [
      { id: "spending", label: "Analyze Spending", icon: MessageSquareText },
      { id: "saving", label: "Saving Suggestions", icon: PiggyBank },
      { id: "unusual", label: "Detect Unusual Expenses", icon: Search },
    ],
  },
  transactions: {
    title: "Transactions AI",
    subtitle: "Search and review",
    introTitle: "Transaction review ready",
    introBody:
      "Use this assistant to inspect spending patterns, unusual charges, and transaction review patterns from the current table.",
    icon: FileSearch,
    actions: [
      { id: "spending", label: "Analyze Spending", icon: MessageSquareText },
      { id: "unusual", label: "Detect Unusual Expenses", icon: Search },
      { id: "search", label: "Search Review Tips", icon: FileSearch },
    ],
  },
  budgets: {
    title: "Budgets AI",
    subtitle: "Budget coaching",
    introTitle: "Budget guidance ready",
    introBody:
      "Use this assistant to spot budget pressure, savings opportunities, and categories that deserve tighter limits.",
    icon: Wallet,
    actions: [
      { id: "budget", label: "Budget Pressure", icon: Wallet },
      { id: "saving", label: "Saving Suggestions", icon: PiggyBank },
      { id: "unusual", label: "Detect Unusual Expenses", icon: Search },
    ],
  },
  insights: {
    title: "Insights AI",
    subtitle: "Pattern analysis",
    introTitle: "Insights context ready",
    introBody:
      "Use this assistant to interpret category breakdowns, trend cards, and the biggest patterns behind your insights view.",
    icon: ChartNoAxesCombined,
    actions: [
      { id: "spending", label: "Explain Insights", icon: ChartNoAxesCombined },
      { id: "saving", label: "Find Leaks", icon: PiggyBank },
      { id: "unusual", label: "Detect Outliers", icon: Search },
    ],
  },
};

const pageContext = {
  dashboard:
    "Dashboard context: summarize the overview cards, monthly trend, category chart, savings balance, and headline outliers.",
  transactions:
    "Transactions context: help review the transaction table, repeated merchants, largest debits, search/filter decisions, and suspicious charges.",
  budgets:
    "Budgets context: compare category spend against limits, highlight over-budget pressure, and suggest practical cap adjustments.",
  insights:
    "Insights context: explain category breakdowns, trend cards, cash-flow patterns, and the strongest story in the insights page.",
};

const formatMoney = (value, currency) =>
  `${currency?.symbol || "$"}${Math.round(value).toLocaleString()}`;

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

const inferIntent = (prompt) => {
  const normalizedPrompt = prompt.toLowerCase();

  if (
    normalizedPrompt.includes("save") ||
    normalizedPrompt.includes("saving") ||
    normalizedPrompt.includes("cut") ||
    normalizedPrompt.includes("reduce")
  ) {
    return "saving";
  }

  if (
    normalizedPrompt.includes("budget") ||
    normalizedPrompt.includes("limit") ||
    normalizedPrompt.includes("overspend") ||
    normalizedPrompt.includes("pressure")
  ) {
    return "budget";
  }

  if (
    normalizedPrompt.includes("unusual") ||
    normalizedPrompt.includes("outlier") ||
    normalizedPrompt.includes("suspicious") ||
    normalizedPrompt.includes("high")
  ) {
    return "unusual";
  }

  if (
    normalizedPrompt.includes("search") ||
    normalizedPrompt.includes("review") ||
    normalizedPrompt.includes("find") ||
    normalizedPrompt.includes("merchant")
  ) {
    return "search";
  }

  return "spending";
};

const createInsight = (intent, summary, currency, prompt = "", page = "dashboard") => {
  const contextLine = pageContext[page] || pageContext.dashboard;
  const noDataDetails = [
    contextLine,
    "Upload transactions or load demo data from Settings for numeric recommendations.",
    "The assistant stays available on this page so you can ask what to inspect next.",
  ];

  if (!summary.income && !summary.expense && !summary.expenses.length) {
    return {
      title: "Data Needed",
      body: prompt
        ? `I can help with "${prompt}", but there are no loaded transactions to calculate against yet.`
        : "There are no loaded transactions to calculate against yet.",
      details: noDataDetails,
    };
  }

  if (intent === "spending") {
    const categoryLine =
      summary.topCategories.length > 0
        ? summary.topCategories
            .map(
              ([category, amount]) =>
                `${category}: ${formatMoney(amount, currency)}`
            )
            .join(", ")
        : "No expense categories found yet.";

    return {
      title: "Spending Snapshot",
      body: prompt
        ? `For "${prompt}", the main read is ${formatMoney(summary.income, currency)} income against ${formatMoney(summary.expense, currency)} expenses. Current savings from this upload is ${formatMoney(summary.savings, currency)}.`
        : `You have ${formatMoney(summary.income, currency)} in income and ${formatMoney(summary.expense, currency)} in expenses. Your current savings balance from this upload is ${formatMoney(summary.savings, currency)}.`,
      details: [
        contextLine,
        `Top categories: ${categoryLine}`,
        `Average expense size: ${formatMoney(summary.averageExpense, currency)}`,
        summary.savings >= 0
          ? "Cash flow is positive for this dataset."
          : "Expenses are above income in this dataset.",
      ],
    };
  }

  if (intent === "saving") {
    const highestCategory = summary.topCategories[0];
    const target = highestCategory ? Math.round(highestCategory[1] * 0.15) : 0;

    return {
      title: "Saving Plan",
      body: highestCategory
        ? `Your biggest controllable area is ${highestCategory[0]}. A 15% cut there could free about ${formatMoney(target, currency)}.`
        : "Add more expenses to receive stronger saving suggestions.",
      details: [
        contextLine,
        "Set a weekly cap for the highest category.",
        "Move recurring bills into a separate review list.",
        "Keep a small buffer before adding new discretionary spends.",
      ],
    };
  }

  if (intent === "budget") {
    const highestCategory = summary.topCategories[0];
    const secondCategory = summary.topCategories[1];

    return {
      title: "Budget Pressure Check",
      body: highestCategory
        ? `${highestCategory[0]} is your heaviest expense category at ${formatMoney(highestCategory[1], currency)}. That is the first place to tighten if a budget is overshooting.`
        : "Upload more expense data to identify which categories need tighter limits.",
      details: [
        contextLine,
        highestCategory
          ? `Set a visible cap for ${highestCategory[0]} and review it weekly.`
          : "Create at least one category budget after importing transactions.",
        secondCategory
          ? `${secondCategory[0]} is the next category to watch at ${formatMoney(secondCategory[1], currency)}.`
          : "A second high-spend category will appear once more data is available.",
        "Use the budget page to compare actual spending against limits before adding new discretionary expenses.",
      ],
    };
  }

  if (intent === "search") {
    return {
      title: "Transaction Review Tips",
      body: `You are viewing ${summary.expenses.length} expense transactions. Use search and amount filters together to isolate merchants, repeated charges, or unusually large debits.`,
      details: [
        contextLine,
        "Start with the merchant or keyword in the search box, then narrow by date or amount.",
        "Sort by highest amount to review the biggest cash outflows first.",
        "Use category filters to compare similar expenses before deciding what to cut.",
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
    body: prompt
      ? `I checked "${prompt}" against your transaction distribution and compared each expense with the average expense of ${formatMoney(summary.averageExpense, currency)}.`
      : `I compared each expense against the average expense of ${formatMoney(summary.averageExpense, currency)}.`,
    details: [contextLine, ...unusualLine],
  };
};

export default function AIFinanceChatbot({
  transactions = [],
  currency,
  page = "dashboard",
}) {
  const config = pageConfig[page] || pageConfig.dashboard;
  const HeaderIcon = config.icon;
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMinimized, setIsMinimized] = React.useState(true);
  const [prompt, setPrompt] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      role: "assistant",
      title: config.introTitle,
      body: config.introBody,
      details: [pageContext[page] || pageContext.dashboard],
    },
  ]);
  const messageListRef = React.useRef(null);

  const summary = React.useMemo(() => buildSummary(transactions), [transactions]);

  React.useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendPrompt = (rawPrompt, actionId) => {
    const trimmedPrompt = rawPrompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    const intent = actionId || inferIntent(trimmedPrompt);
    const insight = createInsight(intent, summary, currency, trimmedPrompt, page);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        body: trimmedPrompt,
      },
      {
        role: "assistant",
        ...insight,
      },
    ]);
  };

  const handleAction = (actionId) => {
    const action = config.actions.find((item) => item.id === actionId);
    sendPrompt(action?.label || "Analyze my finances", actionId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendPrompt(prompt);
    setPrompt("");
  };

  if (!isOpen) {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-12 w-12 items-center justify-center border border-[#FF6B00] bg-[#111111] text-[#FF6B00] shadow-[0_0_14px_rgba(255,107,0,0.18)] transition-colors hover:bg-[#FF6B00] hover:text-black md:bottom-5 md:right-5"
        aria-label={`Open ${config.title}`}
        title={`Open ${config.title}`}
      >
        <Bot size={20} aria-hidden="true" />
      </button>
    );
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 mx-0 flex max-h-[calc(100dvh-4rem)] w-full flex-col border border-[#FF6B00]/60 bg-[#0A0A0A] shadow-[0_0_22px_rgba(255,107,0,0.16)] sm:inset-x-4 sm:bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:mx-auto sm:max-h-[min(78vh,640px)] sm:w-auto md:inset-x-auto md:right-5 md:bottom-5 md:w-[380px]">
      <header className="flex items-center justify-between border-b border-[#1F1F1F] bg-[#111111] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#FF6B00]/50 bg-[#FF6B00]/10 text-[#FF6B00]">
            <HeaderIcon size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-black uppercase tracking-widest text-white">
              {config.title}
            </h2>
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-gray-500">
              {config.subtitle} • {transactions.length} loaded
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="flex h-9 w-9 items-center justify-center border border-[#1F1F1F] text-gray-400 transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
            aria-label={`Minimize ${config.title}`}
            title="Minimize"
          >
            <ChevronDown size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center border border-[#1F1F1F] text-gray-400 transition-colors hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
            aria-label={`Close ${config.title}`}
            title="Close"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        ref={messageListRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
        aria-live="polite"
      >
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
        <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
          {config.actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => handleAction(action.id)}
                className="flex min-h-11 items-center justify-center gap-2 border border-[#1F1F1F] px-3 py-2 text-left text-xs font-black uppercase tracking-wider text-gray-200 transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00] md:justify-between"
                title={action.label}
              >
                <span className="hidden min-w-0 md:inline">{action.label}</span>
                <Icon size={16} aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="retro-input min-w-0 flex-1 px-3 py-2 text-sm"
            placeholder="Ask FinBoard AI"
            aria-label={`Message ${config.title}`}
          />
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#FF6B00] text-[#FF6B00] transition-colors hover:bg-[#FF6B00] hover:text-black disabled:cursor-not-allowed disabled:border-[#333] disabled:text-gray-600 disabled:hover:bg-transparent"
            aria-label="Send message"
            title="Send"
          >
            <Send size={16} aria-hidden="true" />
          </button>
        </form>
      </div>
    </aside>
  );
}
