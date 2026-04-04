import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Navbar from "../components/Navbar";
import { api } from "../services/api";

export default function UsersPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role_name: "viewer" });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    void load();
  }, [router]);

  const load = async () => {
    const meRes = await api.get("/auth/me");
    const userRole = meRes.data.role;
    setRole(userRole);
    if (userRole !== "admin") {
      router.replace("/dashboard");
      return;
    }
    const response = await api.get("/users");
    setUsers(response.data.data);
  };

  const createUser = async (event: FormEvent) => {
    event.preventDefault();
    await api.post("/users", form);
    setForm({ name: "", email: "", password: "", role_name: "viewer" });
    await load();
  };

  const toggleStatus = async (id: number, isActive: boolean) => {
    await api.patch(`/users/${id}/status`, { is_active: !isActive });
    await load();
  };

  const removeUser = async (id: number) => {
    await api.delete(`/users/${id}`);
    await load();
  };

  return (
    <main className="min-h-screen bg-gray-950 pb-20">
      <Navbar role={role} />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <h2 className="text-xl font-bold text-gray-200">Manage Users</h2>
        <form onSubmit={createUser} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-lg md:grid-cols-5">
          <input
            required
            placeholder="Name"
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 focus:border-indigo-500 focus:outline-none"
            value={form.role_name}
            onChange={(e) => setForm({ ...form, role_name: e.target.value })}
          >
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition-colors">
            Create User
          </button>
        </form>

        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-800 bg-gray-800/50 text-left text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Name</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Email</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Role</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-300">{u.name}</td>
                  <td className="px-5 py-4 text-gray-400">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className="capitalize inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${u.is_active ? 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/30' : 'bg-rose-400/10 text-rose-400 ring-rose-400/30'}`}>
                      {u.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={() => void toggleStatus(u.id, u.is_active)}
                      >
                        {u.is_active ? "Disable" : "Enable"}
                      </button>
                      <button className="text-rose-500 hover:text-rose-400 transition-colors" onClick={() => void removeUser(u.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
