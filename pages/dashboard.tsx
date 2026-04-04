import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import DashboardCards from "../components/DashboardCards";
import Navbar from "../components/Navbar";
import TransactionTable from "../components/TransactionTable";
import { api } from "../services/api";

const PIE_COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#ef4444", "#6366f1"];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
    tx_count: 0,
    avg_expense: 0,
    highest_expense_category: "None"
  });
  const [adminInsights, setAdminInsights] = useState<{
    highest_transaction_30d: any | null;
    top_5_expenses: any[];
    expense_to_income_ratio: number;
    unusual_transactions: any[];
    total_income: number;
    net_balance: number;
    recent_transactions: any[];
  } | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<any[]>([]);
  const [showWeekly, setShowWeekly] = useState(false);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    void load();
  }, [router]);

  const load = async () => {
    try {
      const meRes = await api.get("/auth/me");
      const userRole = meRes.data.role;
      setRole(userRole);

      const requests: any[] = [
        api.get("/dashboard/summary"),
        api.get("/dashboard/category-breakdown"),
        api.get("/dashboard/monthly-trends"),
        api.get("/dashboard/weekly-trends"),
        api.get("/dashboard/recent-activity"),
      ];

      // Admin & Analyst get platform-wide insights
      if (userRole !== "viewer") {
        requests.push(api.get("/dashboard/admin-insights"));
      }

      const results = await Promise.all(requests);
      
      setSummary(results[0].data.data);
      setCategories(results[1].data.data);
      setTrends(results[2].data.data);
      setWeeklyTrends(results[3].data.data);
      setRecent(results[4].data.data);

      if (userRole !== "viewer" && results[5]) {
        setAdminInsights(results[5].data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-400">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 pb-20">
      <Navbar role={role} />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <DashboardCards
          totalIncome={summary.total_income}
          totalExpense={summary.total_expense}
          netBalance={summary.net_balance}
          txCount={summary.tx_count}
          avgExpense={summary.avg_expense}
          highestExpenseCategory={summary.highest_expense_category}
        />

        {adminInsights && (role === "admin" || role === "analyst") && (
          <section className="mb-6">
            <h2 className="mb-3 text-lg font-bold text-gray-200">Platform Insights</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-4">
                <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-5 shadow-lg shadow-gray-900/50">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Total Income</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">${adminInsights.total_income.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-5 shadow-lg shadow-gray-900/50">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Platform Net Balance</p>
                  <p className="mt-2 text-2xl font-bold text-indigo-400">${adminInsights.net_balance.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-5 shadow-lg shadow-gray-900/50">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Expense/Income Ratio</p>
                  <p className="mt-2 text-2xl font-bold text-amber-400">{adminInsights.expense_to_income_ratio.toFixed(2)}x</p>
                </div>
                <div className="col-span-1 sm:col-span-2 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-5 shadow-lg shadow-gray-900/50">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Highest Transaction (30d)</p>
                  {adminInsights.highest_transaction_30d ? (
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-2xl font-bold text-white">${adminInsights.highest_transaction_30d.amount.toLocaleString()}</p>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-300">{adminInsights.highest_transaction_30d.category}</p>
                        <p className="text-xs text-gray-500">{new Date(adminInsights.highest_transaction_30d.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">No transactions in the last 30 days</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-lg overflow-hidden">
                  <h3 className="mb-4 text-sm font-semibold text-gray-300">Top 5 Expense Transactions</h3>
                  <div className="divide-y divide-gray-800">
                    {adminInsights.top_5_expenses.map((tx: any, idx: number) => (
                      <div key={`exp-${idx}`} className="flex justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-200">{tx.category}</p>
                          <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-rose-400">-${tx.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 truncate w-32">{tx.description || "No notes"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-lg overflow-hidden">
                  <h3 className="mb-4 text-sm font-semibold text-gray-300">Unusual High-Value Transactions (&gt;$1k)</h3>
                  <div className="divide-y divide-gray-800 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {adminInsights.unusual_transactions.length > 0 ? adminInsights.unusual_transactions.map((tx: any, idx: number) => (
                      <div key={`unusual-${idx}`} className="flex justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-200">{tx.category}</p>
                          <p className="text-xs text-gray-500 truncate w-32">{tx.description || "No notes"}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-500 italic py-4 text-center">No unusual transactions found</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-80 rounded-xl bg-gray-900 border border-gray-800 p-4 shadow-xl relative">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-300">Income vs Expense Trends</h2>
              <button
                onClick={() => setShowWeekly(!showWeekly)}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                {showWeekly ? "Show Monthly" : "Show Weekly"}
              </button>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={showWeekly ? weeklyTrends : trends}>
                <XAxis stroke="#9ca3af" dataKey={showWeekly ? "week" : "month"} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#f3f4f6" }}
                  itemStyle={{ color: "#e5e7eb" }}
                />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ fill: '#064e3b' }} />
                <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#881337' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80 rounded-xl bg-gray-900 border border-gray-800 p-4 shadow-xl">
            <h2 className="mb-3 text-sm font-semibold text-gray-300">Category Breakdown</h2>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={categories} dataKey="total" nameKey="category" outerRadius={100} stroke="#1f2937" label>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${entry.category}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#f3f4f6" }}
                  itemStyle={{ color: "#e5e7eb" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {role !== "viewer" && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-gray-200">Recent Transactions</h2>
            <TransactionTable transactions={recent} />
          </section>
        )}
      </div>
    </main>
  );
}
