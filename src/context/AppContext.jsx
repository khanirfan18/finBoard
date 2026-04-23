import React from 'react'
export const DataContext = React.createContext();
export function AppContext({children}){
  const [transactions, setTransactions] = React.useState(JSON.parse(localStorage.getItem( 'transactions'))|| [])
  return (
      <DataContext.Provider value={{transactions,setTransactions}}>
        {children}
      </DataContext.Provider>
  )
}