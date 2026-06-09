import React from 'react';
import normalizeTransaction, { normalizeTransactions } from '../lib/transactionNormalizer';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { DataContext } from './DataContext';
import {CURRENCIES} from '../lib/Currencies'

export function AppContext({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState([]);
  const [currency, setCurrency] = React.useState(CURRENCIES[0]);
  const [currencySymbols, setCurrencySymbols] = React.useState({});
  const [exchangeRates, setExchangeRates] = React.useState(null);
  const [loadingData, setLoadingData] = React.useState(true);

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

  React.useEffect(() => {
    async function loadData() {
      if (!user) {
        setTransactions([]);
        setCurrency(CURRENCIES[0]);
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      
      try {
        const { data: settingsData } = await supabase
          .from('user_settings')
          .select('currency')
          .eq('user_id', user.id)
          .single();
          
        if (settingsData && settingsData.currency) {
          setCurrency(settingsData.currency);
        } else {
          await supabase.from('user_settings').insert({
            user_id: user.id,
            currency: CURRENCIES[0]
          });
        }

        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
          
        if (txData) {
          const mappedTx = txData.map(t => ({
            id: t.id,
            Date: t.date,
            Amount: t.amount,
            Description: t.description,
            Currency: t.currency
          }));
          
          const normalized = normalizeTransactions(mappedTx, { currency: settingsData?.currency || CURRENCIES[0] });
          setTransactions(normalized);
        }
      } catch (err) {
        console.error('Error loading data from Supabase:', err);
      } finally {
        setLoadingData(false);
      }
    }
    
    loadData();
  }, [user]);

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
    if (user) {
      await supabase
        .from('user_settings')
        .upsert({ user_id: user.id, currency: enrichedCurrency }, { onConflict: 'user_id' });
    }
  };

  const deleteTransaction = async (indexOrId) => {
    const txToDelete = typeof indexOrId === 'number' ? transactions[indexOrId] : transactions.find(t => t.id === indexOrId);
    
    if (txToDelete && txToDelete.id && user) {
      await supabase.from('transactions').delete().eq('id', txToDelete.id);
    }
    
    const updated = typeof indexOrId === 'number' 
      ? transactions.filter((_, i) => i !== indexOrId)
      : transactions.filter((t) => t.id !== indexOrId);
      
    setTransactions(updated);
  };

  const addTransaction = async (newTransaction) => {
    const normalized = normalizeTransaction(newTransaction, {
      currency,
      source: 'manual',
    });

    if (user) {
      const { data } = await supabase.from('transactions').insert({
        user_id: user.id,
        date: normalized.Date,
        amount: normalized.Amount,
        description: normalized.Description,
        currency: normalized.Currency
      }).select().single();
      
      if (data) {
        normalized.id = data.id;
      }
    }

    setTransactions((prev) => [...prev, normalized]);
  };

  const updateTransaction = async (index, updatedTransaction) => {
    const originalCurrency = transactions[index]?.Currency || currency;
    
    const normalized = normalizeTransaction({
      ...updatedTransaction,
      Currency: originalCurrency,
    }, {
      currency: originalCurrency,
      source: 'edit',
    });

    const targetTx = transactions[index];
    if (targetTx && targetTx.id && user) {
      normalized.id = targetTx.id;
      await supabase.from('transactions').update({
        date: normalized.Date,
        amount: normalized.Amount,
        description: normalized.Description,
        currency: normalized.Currency
      }).eq('id', targetTx.id);
    }

    setTransactions((prev) => prev.map((t, i) => i === index ? normalized : t));
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
          convertedAmt = parsed * conversionRate;
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
        setTransactions,
        currency,
        updateCurrency,
        deleteTransaction,
        addTransaction,
        updateTransaction,
        loadingData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}