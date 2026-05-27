import React, { useContext } from 'react';
import { DataContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import InsightCards from '../components/Insights/InsightCards';
import CategoryBreakdown from '../components/Insights/CategoryBreakdown';

export default function InsightsDashboard() {
  const { transactions } = useContext(DataContext);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-in fade-in duration-500">
        <div className="retro-card p-12 flex flex-col items-center max-w-md text-center border-[#FF6B00]/30 shadow-[0_0_20px_rgba(255,107,0,0.1)]">
          <div className="w-16 h-16 bg-[#FF6B00]/10 flex items-center justify-center rounded-full mb-6 text-[#FF6B00]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-wider text-white mb-2 uppercase">No Insights Found</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your insights playground is empty. Head over to settings to upload your transaction history or load demo data.
          </p>
          <Link to='/settings' className="retro-btn">
            Configure Settings
          </Link>
        </div>
      </div>
    );
  }

  // REVISED PARSING MATCHING BUDGET BALANCES EXCLUSIVELY
  const cleanedTransactions = transactions.map(t => {
    const desc = t.Description ? t.Description.toLowerCase().trim() : '';
    let category = 'Other'; // Default everything here first to protect budget groupings

    if (desc.includes('swiggy') || desc.includes('zomato')) {
      category = 'Food';
    } else if (desc.includes('uber') || desc.includes('petrol')) {
      category = 'Transport';
    } else if (desc.includes('amazon shopping') || desc.includes('amazon')) {
      category = 'Shopping';
    } else if (desc.includes('electricity bill')) {
      category = 'Bills';
    } else if (desc.includes('gym') || desc.includes('membership')) {
      category = 'Health';
    } else if (desc.includes('salary') || desc.includes('freelance') || desc.includes('dividend') || desc.includes('bonus')) {
      category = 'Income';
    }

    return { ...t, Category: category };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <p className="text-gray-400 text-sm tracking-wider uppercase">Key observations from your financial data matrix</p>
      </div>

      <div className="space-y-8">
        <InsightCards transactions={cleanedTransactions} />
        <div className="w-full">
          <CategoryBreakdown transactions={cleanedTransactions} />
        </div>
      </div>
    </div>
  );
}