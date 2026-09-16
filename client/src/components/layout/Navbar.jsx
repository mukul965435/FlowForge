import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Kanban,
  Building2,
  Users,
  FolderGit2,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Main Navigation Links */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:bg-indigo-500 transition">
                <Kanban className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Flow<span className="text-indigo-400">Forge</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2"
              >
                <Kanban className="w-4 h-4 text-slate-400" />
                Dashboard
              </Link>
              <Link
                to="/orgs"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                Organizations
              </Link>
              <Link
                to="/teams"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-slate-400" />
                Teams
              </Link>
              <Link
                to="/projects"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2"
              >
                <FolderGit2 className="w-4 h-4 text-slate-400" />
                Projects
              </Link>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs uppercase">
                  {user.name ? user.name.slice(0, 2) : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white">{user.name}</div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
