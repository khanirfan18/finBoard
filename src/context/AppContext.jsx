import React from 'react'
import { CURRENCIES, DataContext } from './AppContextValue';

export function AppContext({ children }) {
  const [transactions, setTransactions] = React.useState(
    JSON.parse(localStorage.getItem('transactions')) || []
  );
  const [currency, setCurrency] = React.useState(
    JSON.parse(localStorage.getItem('currency')) || CURRENCIES[0]
  );

  const updateCurrency = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    localStorage.setItem('currency', JSON.stringify(selectedCurrency));
  };

  return (
    <DataContext.Provider value={{ transactions, setTransactions, currency, updateCurrency }}>
      {children}
    </DataContext.Provider>
  );
}
