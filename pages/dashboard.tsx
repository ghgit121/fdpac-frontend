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
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_balance: 0 });
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
      const [meRes, summaryRes, categoryRes, trendsRes, weeklyRes, recentRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/dashboard/summary"),
        api.get("/dashboard/category-breakdown"),
        api.get("/dashboard/monthly-trends"),
        api.get("/dashboard/weekly-trends"),
        api.get("/dashboard/recent-activity"),
      ]);

      setRole(meRes.data.role);
      setSummary(summaryRes.data.data);
      setCategories(categoryRes.data.data);
      setTrends(trendsRes.data.data);
      setWeeklyTrends(weeklyRes.data.data);
      setRecent(recentRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar role={role} />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <DashboardCards
          totalIncome={summary.total_income}
          totalExpense={summary.total_expense}
          netBalance={summary.net_balance}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-80 rounded-lg bg-white p-4 shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Income vs Expense Trends</h2>
              <button
                onClick={() => setShowWeekly(!showWeekly)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded"
              >
                {showWeekly ? "Show Monthly" : "Show Weekly"}
              </button>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={showWeekly ? weeklyTrends : trends}>
                <XAxis dataKey={showWeekly ? "week" : "month"} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80 rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">Category Breakdown</h2>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={categories} dataKey="total" nameKey="category" outerRadius={100} label>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${entry.category}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Recent Transactions</h2>
          <TransactionTable transactions={recent} />
        </section>
      </div>
    </main>
  );
}
