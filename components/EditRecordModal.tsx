import { FormEvent, useState, useEffect } from "react";
import { api } from "../services/api";

interface Props {
  record: any;
  onUpdated: () => void;
  onCancel: () => void;
}

export default function EditRecordModal({ record, onUpdated, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: record.amount.toString(),
    type: record.type,
    category: record.category,
    date: record.date.split("T")[0],
    notes: record.notes || "",
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.put(`/records/${record.id}`, {
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
        notes: form.notes || null,
      });
      onUpdated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4">
      <form onSubmit={onSubmit} className="w-full max-w-lg rounded-xl bg-gray-900 border border-gray-700 shadow-2xl p-6">
        <h2 className="mb-6 text-xl font-bold text-gray-100 flex items-center">
          <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Edit Financial Record
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            required
            type="number"
            step="0.01"
            placeholder="Amount"
            className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <select
            className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            required
            placeholder="Category"
            className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            required
            type="date"
            className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <textarea
            placeholder="Notes"
            className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="rounded-lg border border-gray-600 px-4 py-2 hover:bg-gray-800 text-gray-300 transition-colors" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 px-5 py-2 text-white font-medium shadow-md transition-all">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}