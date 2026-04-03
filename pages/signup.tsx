import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { signup } from "../services/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, password });
      router.push("/login?registered=1");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-slate-950 to-slate-800 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Register to access the FDPAC dashboard.</p>
        <div className="mt-5 space-y-3">
          <input
            required
            type="text"
            placeholder="Full name"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Confirm password"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-md bg-slate-900 px-4 py-2 text-white"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-slate-900 underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
