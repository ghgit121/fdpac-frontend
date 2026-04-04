interface DashboardCardsProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;  avgExpense?: number;
  txCount?: number;
  highestExpenseCategory?: string;}

import React from "react";

interface DashboardCardsProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  avgExpense?: number;
  txCount?: number;
  highestExpenseCategory?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function DashboardCards({ 
  totalIncome, 
  totalExpense, 
  netBalance,
  avgExpense = 0,
  txCount = 0,
  highestExpenseCategory = "N/A"
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Income Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-100 uppercase tracking-wider">Total Income</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      {/* Total Expense Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-rose-100 uppercase tracking-wider">Total Expense</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      {/* Net Balance Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-100 uppercase tracking-wider">Net Balance</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{formatCurrency(netBalance)}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      {/* Stats row */}
      <div className="col-span-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-3">
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-4 py-2 text-center">
            <p className="text-sm font-medium text-slate-500">Average Expense</p>
            <p className="mt-1 text-xl font-semibold text-slate-700">{formatCurrency(avgExpense)}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-sm font-medium text-slate-500">Total Transactions</p>
            <p className="mt-1 text-xl font-semibold text-slate-700">{txCount}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-sm font-medium text-slate-500">Highest Expense</p>
            <p className="mt-1 text-xl font-semibold text-slate-700 capitalize">{highestExpenseCategory || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
