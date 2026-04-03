interface DashboardCardsProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function DashboardCards({ totalIncome, totalExpense, netBalance }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Total Income</p>
        <p className="mt-2 text-xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Total Expense</p>
        <p className="mt-2 text-xl font-bold text-rose-600">{formatCurrency(totalExpense)}</p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Net Balance</p>
        <p className="mt-2 text-xl font-bold text-brand-dark">{formatCurrency(netBalance)}</p>
      </div>
    </div>
  );
}
