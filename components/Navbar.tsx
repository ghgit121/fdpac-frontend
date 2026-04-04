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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600 hover:text-indigo-500 transition-colors">
              FDPAC Dashboard
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <div className="hidden space-x-6 sm:flex">
            <Link 
              href="/dashboard" 
              className="hover:text-indigo-600 transition-colors py-2"
            >
              Dashboard
            </Link>
            
            {(role === "admin" || role === "analyst") && (
              <Link 
                href="/records" 
                className="hover:text-indigo-600 transition-colors py-2"
              >
                Records
              </Link>
            )}
            
            {role === "admin" && (
              <Link 
                href="/users" 
                className="hover:text-indigo-600 transition-colors py-2"
              >
                Users
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
            <button 
              onClick={onLogout} 
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
