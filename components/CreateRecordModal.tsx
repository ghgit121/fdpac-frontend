import { FormEvent, useState } from "react";

import { api } from "../services/api";

interface Props {
  onCreated: () => void;
}

export default function CreateRecordModal({ onCreated }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: "",
    notes: "",
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/records", {
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
        notes: form.notes || null,
      });
      setIsOpen(false);
      setForm({ amount: "", type: "expense", category: "", date: "", notes: "" });
      onCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="rounded-md bg-brand-accent px-4 py-2 text-white" onClick={() => setIsOpen(true)}>
        Create Record
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-slate-900/40 p-4">
          <form onSubmit={onSubmit} className="w-full max-w-lg rounded-lg bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold">Create Financial Record</h2>
            <div className="grid grid-cols-1 gap-3">
              <input
                required
                type="number"
                step="0.01"
                placeholder="Amount"
                className="rounded-md border border-slate-300 px-3 py-2"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <select
                className="rounded-md border border-slate-300 px-3 py-2"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                required
                placeholder="Category"
                className="rounded-md border border-slate-300 px-3 py-2"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                required
                type="date"
                className="rounded-md border border-slate-300 px-3 py-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <textarea
                placeholder="Notes"
                className="rounded-md border border-slate-300 px-3 py-2"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="rounded-md border border-slate-300 px-3 py-2" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="rounded-md bg-slate-900 px-3 py-2 text-white">
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
