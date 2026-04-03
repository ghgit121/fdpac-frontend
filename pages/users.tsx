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
    <main className="min-h-screen bg-slate-100">
      <Navbar role={role} />
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <form onSubmit={createUser} className="grid grid-cols-1 gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-5">
          <input
            required
            placeholder="Name"
            className="rounded-md border border-slate-300 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-md border border-slate-300 px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="rounded-md border border-slate-300 px-3 py-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="rounded-md border border-slate-300 px-3 py-2"
            value={form.role_name}
            onChange={(e) => setForm({ ...form, role_name: e.target.value })}
          >
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-white">
            Create
          </button>
        </form>

        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">{u.is_active ? "Active" : "Disabled"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="rounded border border-slate-300 px-2 py-1"
                        onClick={() => void toggleStatus(u.id, u.is_active)}
                      >
                        Toggle
                      </button>
                      <button className="rounded bg-rose-600 px-2 py-1 text-white" onClick={() => void removeUser(u.id)}>
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
