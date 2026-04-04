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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/90 backdrop-blur shadow-sm transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent hover:from-white hover:to-gray-300 transition-colors">
              FDPAC Dashboard
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
          <div className="hidden space-x-6 sm:flex">
            <Link
              href="/dashboard"
              className="hover:text-gray-100 transition-colors py-2"
            >
              Dashboard
            </Link>

            {(role === "admin" || role === "analyst") && (
              <Link
                href="/records"
                className="hover:text-gray-100 transition-colors py-2"
              >
                Records
              </Link>
            )}

            {role === "admin" && (
              <Link
                href="/users"
                className="hover:text-gray-100 transition-colors py-2"
              >
                Users
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 border-l border-gray-800 pl-6">
            <button
              onClick={onLogout}
              className="rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-gray-700 hover:to-gray-600 transition-all border border-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
