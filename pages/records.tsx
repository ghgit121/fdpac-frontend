import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CreateRecordModal from "../components/CreateRecordModal";
import Navbar from "../components/Navbar";
import TransactionTable from "../components/TransactionTable";
import { api } from "../services/api";

export default function RecordsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

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

      // Viewers don't have access to records — redirect to dashboard
      if (userRole === "viewer") {
        router.replace("/dashboard");
        return;
      }

      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (type) params.set("type", type);
      const response = await api.get(`/records?${params.toString()}`);
      setRows(response.data.data.items);
      setError("");
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError("You don't have permission to view records.");
      } else {
        setError(err?.response?.data?.message || "Failed to load records.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar role={role} />
      <div className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row">
            <input
              placeholder="Filter category"
              className="rounded-md border border-slate-300 px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <select
              className="rounded-md border border-slate-300 px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button className="rounded-md bg-slate-900 px-4 py-2 text-white" onClick={() => void load()}>
              Apply
            </button>
          </div>
          {role === "admin" && <CreateRecordModal onCreated={() => void load()} />}
        </div>

        <TransactionTable transactions={rows} />
      </div>
    </main>
  );
}
