import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CreateRecordModal from "../components/CreateRecordModal";
import EditRecordModal from "../components/EditRecordModal";
import Navbar from "../components/Navbar";
import TransactionTable, { Transaction } from "../components/TransactionTable";
import { api } from "../services/api";

export default function RecordsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<Transaction | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    void load();
  }, [router, page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    void load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/records/${id}`);
      void load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete record.");
    }
  };

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
      params.set("page", page.toString());
      params.set("page_size", pageSize.toString());

      const response = await api.get(`/records?${params.toString()}`);
      setRows(response.data.data.items);
      setTotalItems(response.data.data.pagination.total_items);
      setTotalPages(response.data.data.pagination.total_pages);
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
    <main className="min-h-screen bg-gray-950 pb-20">
      <Navbar role={role} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-rose-900/40 border border-rose-800/50 px-4 py-3 text-sm text-rose-300 shadow-xl">
            {error}
          </div>
        )}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <input
              placeholder="Filter category"
              className="rounded-lg bg-gray-900 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <select
              className="rounded-lg bg-gray-900 border border-gray-700 px-4 py-2.5 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button className="rounded-lg border border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700 px-5 py-2.5 text-white shadow-md hover:from-gray-700 hover:to-gray-600 transition-all font-medium" onClick={handleSearch}>
              Apply Filters
            </button>
          </div>
          {role === "admin" && <CreateRecordModal onCreated={() => void load()} />}
        </div>

        <TransactionTable 
          transactions={rows} 
          role={role} 
          onEdit={(tx) => setEditingRecord(tx)}
          onDelete={handleDelete}
        />

        {/* Pagination Controls */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-400 bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-800">
          <div>
            Showing page <span className="font-bold text-gray-200">{page}</span> of{" "}
            <span className="font-bold text-gray-200">{totalPages}</span> <span className="text-gray-500">({totalItems} total items)</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 text-gray-300 font-medium transition-colors border border-gray-700"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 text-gray-300 font-medium transition-colors border border-gray-700"
            >
              Next
            </button>
          </div>
        </div>

        {editingRecord && (
          <EditRecordModal
            record={editingRecord}
            onUpdated={() => {
              setEditingRecord(null);
              void load();
            }}
            onCancel={() => setEditingRecord(null)}
          />
        )}
      </div>
    </main>
  );
}
