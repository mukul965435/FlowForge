import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { orgApi } from "../../api/orgApi";
import {
  Building2,
  Plus,
  Users,
  Shield,
  UserPlus,
  X,
  AlertCircle,
  CheckCircle2,
  Crown,
} from "lucide-react";

export default function OrgsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(null);

  // Form States
  const [newOrg, setNewOrg] = useState({ name: "", description: "" });
  const [inviteData, setInviteData] = useState({ email: "", role: "MEMBER" });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await orgApi.getUserOrgs();
      if (res.success) {
        setOrganizations(res.data.organizations || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    try {
      const res = await orgApi.createOrg(newOrg);
      if (res.success) {
        setSuccessMsg("Organization created successfully!");
        setNewOrg({ name: "", description: "" });
        setShowCreateModal(false);
        fetchOrgs();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create organization");
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!selectedOrgId) return;
    setActionLoading(true);
    setError(null);

    try {
      const res = await orgApi.inviteMember(selectedOrgId, inviteData);
      if (res.success) {
        setSuccessMsg("Invitation sent successfully!");
        setInviteData({ email: "", role: "MEMBER" });
        setShowInviteModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invitation");
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
              <Building2 className="w-7 h-7 text-indigo-400" />
              Organizations
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Select or manage multi-tenant organization workspaces you belong to.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 text-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Organization</span>
          </button>
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

        {/* Organizations Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-slate-400 text-sm mt-3">Loading organizations...</span>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No Organizations Found</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
              You aren't a member of any organization yet. Create your first workspace to start collaborating!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition"
            >
              + Create Organization
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map(({ organization, role }) => (
              <div
                key={organization._id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
                      {organization.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border flex items-center gap-1 uppercase ${
                        role === "OWNER"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : role === "ADMIN"
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                          : "bg-slate-800 border-slate-700 text-slate-300"
                      }`}
                    >
                      {role === "OWNER" && <Crown className="w-3 h-3" />}
                      {role}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{organization.name}</h3>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                    {organization.description || "No description provided."}
                  </p>
                  <div className="text-[11px] text-slate-500 mt-2 font-mono">
                    slug: {organization.slug}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Member</span>
                  </div>

                  {(role === "OWNER" || role === "ADMIN") && (
                    <button
                      onClick={() => {
                        setSelectedOrgId(organization._id);
                        setShowInviteModal(true);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Invite Member</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Organization Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  Create New Organization
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Corporation"
                    value={newOrg.name}
                    onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Engineering and product development workspace..."
                    value={newOrg.description}
                    onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
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
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {actionLoading ? "Creating..." : "Create Organization"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite Member Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                  Invite Member
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInviteMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    User Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="colleague@company.com"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Organization Role
                  </label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="MEMBER">MEMBER (Standard Access)</option>
                    <option value="MANAGER">MANAGER (Manage Teams & Projects)</option>
                    <option value="ADMIN">ADMIN (Full Administrative Access)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {actionLoading ? "Sending..." : "Send Invitation"}
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
