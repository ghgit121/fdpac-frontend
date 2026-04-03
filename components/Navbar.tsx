import Link from "next/link";
import { useRouter } from "next/router";

import { logout } from "../services/auth";

interface NavbarProps {
  role: string | null;
}

export default function Navbar({ role }: NavbarProps) {
  const router = useRouter();

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold text-brand-dark">FDPAC Dashboard</h1>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-brand-accent">
            Dashboard
          </Link>
          <Link href="/records" className="hover:text-brand-accent">
            Records
          </Link>
          {role === "admin" && (
            <Link href="/users" className="hover:text-brand-accent">
              Users
            </Link>
          )}
          <button onClick={onLogout} className="rounded-md bg-slate-900 px-3 py-1.5 text-white">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
