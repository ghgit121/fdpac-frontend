import { useState } from "react";

export interface Transaction {
  id: number;
  amount: number;
  type: string;
  category: string;
  date: string;
  notes?: string;
}

interface Props {
  transactions: Transaction[];
  role?: string | null;
  onEdit?: (tx: Transaction) => void;
  onDelete?: (id: number) => void;
}

export default function TransactionTable({ transactions, role, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg bg-gray-900 border border-gray-800 shadow-2xl overflow-hidden">
      <table className="min-w-full text-left text-sm text-gray-300">
        <thead className="bg-black/90 text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-700">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Notes</th>
            {role === "admin" && (onEdit || onDelete) && <th className="px-6 py-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-gray-900">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-800/80 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">{tx.date}</td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${tx.type === "income" ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800/50" : "bg-rose-900/40 text-rose-400 border border-rose-800/50"}`}>
                  {tx.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-200">{tx.category}</td>
              <td className="px-6 py-4 whitespace-nowrap font-bold text-white">${tx.amount.toFixed(2)}</td>
              <td className="px-6 py-4 max-w-xs truncate text-gray-400">{tx.notes || "-"}</td>
              {role === "admin" && (onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-4 text-sm font-medium">
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(tx)} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(tx.id)} 
                      className="text-rose-500 hover:text-rose-400 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
