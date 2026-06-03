import React from 'react';
import normalizeTransaction, { normalizeTransactions } from '../lib/transactionNormalizer';

export const DataContext = React.createContext();
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

function readLocalStorageJSON(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return fallback;

    return JSON.parse(storedValue);
  } catch {
    return fallback;
  }
}

export function AppContext({ children }) {
  const [transactions, setTransactions] = React.useState(() =>
    readLocalStorageJSON('transactions', [])
  );

  const [currency, setCurrency] = React.useState(() =>
    readLocalStorageJSON('currency', CURRENCIES[0])
  );


  const [currencySymbols, setCurrencySymbols] = React.useState({});
  const [exchangeRates, setExchangeRates] = React.useState(null);

  React.useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        const symbols = {};

        Object.keys(data.rates).forEach((code) => {
          try {
            const formatted = new Intl.NumberFormat('en', {
              style: 'currency',
              currency: code,
              minimumFractionDigits: 0,
            }).format(0);

            symbols[code] = formatted.replace(/[\d,.\s]/g, '').trim();
          } catch {
            symbols[code] = code;
          }
        });

        setCurrencySymbols(symbols);
        setExchangeRates(data.rates);
      })
      .catch((err) => console.error(err));
  }, []);

  // Normalize stored transactions on mount
  React.useEffect(() => {
    try {
      const stored = readLocalStorageJSON('transactions', []);

      if (Array.isArray(stored) && stored.length > 0) {
        const normalized = normalizeTransactions(stored, { currency });

        if (JSON.stringify(normalized) !== JSON.stringify(stored)) {
          setTransactions(normalized);
          localStorage.setItem('transactions', JSON.stringify(normalized));
        }
      }
    } catch (e) {
      console.error('Normalization failed', e);
    }
  }, []); // Note: we only want this to run once, so currency isn't in dep array to avoid loops, but normalization might use current base currency.

  const updateCurrency = async (selectedCurrency) => {
    if (selectedCurrency.code === currency.code) return;

    const enrichedCurrency = {
      ...selectedCurrency,
      symbol:
        selectedCurrency.symbol ||
        currencySymbols[selectedCurrency.code] ||
        selectedCurrency.code,
    };

    setCurrency(enrichedCurrency);
    localStorage.setItem('currency', JSON.stringify(enrichedCurrency));
  };

  const deleteTransaction = (index) => {
    const updated = transactions.filter((_, i) => i !== index);

    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  const addTransaction = (newTransaction) => {
    const normalized = normalizeTransaction(newTransaction, {
      currency,
      source: 'manual',
    });

    const updated = [...(transactions || []), normalized];

    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  const updateTransaction = (index, updatedTransaction) => {
    // Retain the original currency if possible
    const originalCurrency = transactions[index]?.Currency || currency;
    
    const normalized = normalizeTransaction({
      ...updatedTransaction,
      Currency: originalCurrency,
    }, {
      currency: originalCurrency,
      source: 'edit',
    });

    const updated = transactions.map((t, i) =>
      i === index ? normalized : t
    );

    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  const displayTransactions = React.useMemo(() => {
    if (!transactions) return [];
    
    return transactions.map((t) => {
      let convertedAmt = t.Amount;
      
      if (exchangeRates && t.Currency?.code !== currency.code) {
        const origCode = t.Currency?.code || currency.code;
        const rateOrigToUSD = 1 / (exchangeRates[origCode] || 1);
        const rateUSDToTarget = exchangeRates[currency.code] || 1;
        const conversionRate = rateOrigToUSD * rateUSDToTarget;
        
        const parsed = Number(t.Amount);
        if (!isNaN(parsed)) {
          convertedAmt = (parsed * conversionRate).toFixed(2);
        }
      }

      return {
        ...t,
        originalAmount: t.Amount,
        originalCurrency: t.Currency || currency,
        Amount: convertedAmt,
        Currency: currency,
      };
    });
  }, [transactions, currency, exchangeRates]);

  return (
    <DataContext.Provider
      value={{
        transactions: displayTransactions,
        setTransactions, // Used primarily internally or for full resets
        currency,
        updateCurrency,
        deleteTransaction,
        addTransaction,
        updateTransaction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}