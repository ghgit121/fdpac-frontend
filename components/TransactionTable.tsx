interface Transaction {
  id: number;
  amount: number;
  type: string;
  category: string;
  date: string;
  notes?: string;
}

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{tx.date}</td>
              <td className="px-4 py-3 capitalize">{tx.type}</td>
              <td className="px-4 py-3">{tx.category}</td>
              <td className="px-4 py-3 font-medium">{tx.amount.toFixed(2)}</td>
              <td className="px-4 py-3">{tx.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
