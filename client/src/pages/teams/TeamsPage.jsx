import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { orgApi } from "../../api/orgApi";
import { teamApi } from "../../api/teamApi";
import {
  Users,
  Building2,
  Plus,
  Shield,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

export default function TeamsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });
  const [actionLoading, setActionLoading] = useState(false);

  // Load user organizations first
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await orgApi.getUserOrgs();
        if (res.success && res.data.organizations?.length > 0) {
          const orgs = res.data.organizations.map((o) => o.organization);
          setOrganizations(orgs);
          setSelectedOrgId(orgs[0]._id);
        }
      } catch (err) {
        setError("Failed to load user organizations");
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  // Fetch teams whenever selectedOrgId changes
  useEffect(() => {
    if (!selectedOrgId) return;

    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await teamApi.getOrgTeams(selectedOrgId);
        if (res.success) {
          setTeams(res.data.teams || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load teams for selected organization");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [selectedOrgId]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!selectedOrgId) return;
    setActionLoading(true);
    setError(null);

    try {
      const res = await teamApi.createTeam(selectedOrgId, newTeam);
      if (res.success) {
        setSuccessMsg("Team created successfully!");
        setNewTeam({ name: "", description: "" });
        setShowCreateModal(false);
        // Refresh team list
        const refreshRes = await teamApi.getOrgTeams(selectedOrgId);
        if (refreshRes.success) {
          setTeams(refreshRes.data.teams || []);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create team");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-7 h-7 text-violet-400" />
              Teams Workspace
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Organize engineers and contributors into dedicated team units within your organization.
            </p>
          </div>

          {/* Org Switcher & Create Team Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {organizations.length > 0 && (
              <div className="relative flex-1 sm:flex-initial">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full sm:w-56 pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!selectedOrgId}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-medium rounded-xl shadow-lg shadow-violet-600/25 flex items-center gap-2 text-xs transition disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Create Team</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Teams List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <span className="text-slate-400 text-sm mt-3">Loading teams...</span>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No Teams Found</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
              No teams exist in this organization yet. Create your first team to assign team leads and members!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-4 font-bold">
                    {team.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-bold text-white">{team.name}</h3>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                    {team.description || "No team description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-violet-400" />
                    <span>{team.memberCount || 1} Member(s)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-400" />
                  Create Team
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Team Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Backend Engineering"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Core API development and microservices..."
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {actionLoading ? "Creating..." : "Create Team"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
