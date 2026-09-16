import React from "react";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import { Building2, Users, FolderGit2, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FlowForge Platform Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome back, {user?.name || "Developer"}! 👋
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Manage your multi-tenant organizations, team memberships, and project workspaces seamlessly.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Session Authenticated</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/orgs"
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition">
                Organizations
              </h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Create and manage tenant organizations, invite team members, and configure RBAC roles.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>View Organizations</span> &rarr;
            </div>
          </Link>

          <Link
            to="/teams"
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition">
                Teams
              </h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Organize users into backend, frontend, or feature teams with dedicated team leads.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-violet-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>View Teams</span> &rarr;
            </div>
          </Link>

          <Link
            to="/projects"
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition transform">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition">
                Projects
              </h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Create project workspaces with custom prefix keys (e.g. PROJ-1) and status tracking.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>View Projects</span> &rarr;
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
