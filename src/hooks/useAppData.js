import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import normalizeTransaction, { normalizeTransactions } from '../lib/transactionNormalizer';

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

// Queries
export function useCurrencyQuery() {
  return useQuery({
    queryKey: ['currency'],
    queryFn: () => readLocalStorageJSON('currency', CURRENCIES[0]),
  });
}

export function useTransactionsQuery() {
  const { data: currency } = useCurrencyQuery();

  return useQuery({
    queryKey: ['transactions', currency?.code],
    queryFn: () => {
      const stored = readLocalStorageJSON('transactions', []);
      if (Array.isArray(stored) && stored.length > 0 && currency) {
        const normalized = normalizeTransactions(stored, { currency });
        if (JSON.stringify(normalized) !== JSON.stringify(stored)) {
          localStorage.setItem('transactions', JSON.stringify(normalized));
          return normalized;
        }
      }
      return stored;
    },
    enabled: !!currency,
  });
}

export function useCurrencySymbolsQuery() {
  return useQuery({
    queryKey: ['currencySymbols'],
    queryFn: async () => {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Failed to fetch currency symbols');
      const data = await res.json();
      
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
      return symbols;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// Mutations
export function useAddTransactionMutation() {
  const queryClient = useQueryClient();
  const { data: currency } = useCurrencyQuery();

  return useMutation({
    mutationFn: async (newTransaction) => {
      const currentTransactions = readLocalStorageJSON('transactions', []);
      const normalized = normalizeTransaction(newTransaction, {
        currency,
        source: 'manual',
      });
      const updated = [...currentTransactions, normalized];
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  const { data: currency } = useCurrencyQuery();

  return useMutation({
    mutationFn: async ({ index, updatedTransaction }) => {
      const currentTransactions = readLocalStorageJSON('transactions', []);
      const normalized = normalizeTransaction(updatedTransaction, {
        currency,
        source: 'edit',
      });
      const updated = currentTransactions.map((t, i) =>
        i === index ? normalized : t
      );
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (index) => {
      const currentTransactions = readLocalStorageJSON('transactions', []);
      const updated = currentTransactions.filter((_, i) => i !== index);
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdateCurrencyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateCurrency'],
    mutationFn: async (selectedCurrency) => {
      const currentCurrency = readLocalStorageJSON('currency', CURRENCIES[0]);
      if (selectedCurrency.code === currentCurrency.code) return;

      const transactions = readLocalStorageJSON('transactions', []);

      if (!transactions.length) {
        localStorage.setItem('currency', JSON.stringify(selectedCurrency));
        return { currency: selectedCurrency, transactions: [] };
      }

      const confirmed = window.confirm(
        `Convert all transactions from ${currentCurrency.code} to ${selectedCurrency.code}?`
      );
      if (!confirmed) throw new Error('User cancelled conversion');

      const res = await fetch(`https://open.er-api.com/v6/latest/${currentCurrency.code}`);
      if (!res.ok) throw new Error('Failed to fetch exchange rate');
      const data = await res.json();
      const rate = data.rates[selectedCurrency.code];
      if (!rate) throw new Error('Rate not found');

      const symbolsRes = await fetch('https://open.er-api.com/v6/latest/USD');
      let symbols = {};
      if (symbolsRes.ok) {
         const sData = await symbolsRes.json();
         // simple extraction
         symbols = Object.keys(sData.rates).reduce((acc, code) => {
           try {
             acc[code] = new Intl.NumberFormat('en', { style: 'currency', currency: code }).format(0).replace(/[\d,.\s]/g, '').trim();
           } catch {
             acc[code] = code;
           }
           return acc;
         }, {});
      }

      const enrichedCurrency = {
        ...selectedCurrency,
        symbol:
          selectedCurrency.symbol ||
          symbols[selectedCurrency.code] ||
          selectedCurrency.code,
      };

      const convertedTransactions = transactions.map((t) => {
        const parsed = Number(t.Amount);
        const amt = isNaN(parsed) ? t.Amount : (parsed * rate).toFixed(2);
        return normalizeTransaction(
          { ...t, Amount: amt, Currency: enrichedCurrency },
          { currency: enrichedCurrency, source: 'conversion' }
        );
      });

      localStorage.setItem('transactions', JSON.stringify(convertedTransactions));
      localStorage.setItem('currency', JSON.stringify(enrichedCurrency));
      
      return { currency: enrichedCurrency, transactions: convertedTransactions };
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(['currency'], data.currency);
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      }
    },
    onError: (err) => {
      if (err.message !== 'User cancelled conversion') {
        alert('Failed to fetch exchange rate. Check your internet and try again.');
        console.error(err);
      }
    }
  });
}
