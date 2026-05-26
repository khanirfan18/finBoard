import React from 'react'
export const DataContext = React.createContext();

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

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