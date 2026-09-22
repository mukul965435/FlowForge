import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { orgApi } from "../../api/orgApi";
import { teamApi } from "../../api/teamApi";
import { projectApi } from "../../api/projectApi";
import {
  FolderGit2,
  Building2,
  Plus,
  Users,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  BarChart3,
  Archive,
  Sparkles,
} from "lucide-react";

export default function ProjectsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    key: "",
    description: "",
    teamId: "",
  });
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

  // Fetch projects, teams, and stats whenever selectedOrgId or statusFilter changes
  useEffect(() => {
    if (!selectedOrgId) return;

    const fetchOrgData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = statusFilter !== "ALL" ? { status: statusFilter } : {};

        const [projectsRes, statsRes, teamsRes] = await Promise.all([
          projectApi.getOrgProjects(selectedOrgId, params),
          projectApi.getProjectStats(selectedOrgId),
          teamApi.getOrgTeams(selectedOrgId),
        ]);

        if (projectsRes.success) setProjects(projectsRes.data.projects || []);
        if (statsRes.success) setStats(statsRes.data.stats || null);
        if (teamsRes.success) setTeams(teamsRes.data.teams || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project workspace data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrgData();
  }, [selectedOrgId, statusFilter]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!selectedOrgId) return;
    setActionLoading(true);
    setError(null);

    try {
      const payload = {
        name: newProject.name,
        description: newProject.description,
        ...(newProject.key ? { key: newProject.key } : {}),
        ...(newProject.teamId ? { teamId: newProject.teamId } : {}),
      };

      const res = await projectApi.createProject(selectedOrgId, payload);
      if (res.success) {
        setSuccessMsg(`Project created successfully with key: ${res.data.project.key}`);
        setNewProject({ name: "", key: "", description: "", teamId: "" });
        setShowCreateModal(false);

        // Refresh project list & stats
        const [pRes, sRes] = await Promise.all([
          projectApi.getOrgProjects(selectedOrgId, statusFilter !== "ALL" ? { status: statusFilter } : {}),
          projectApi.getProjectStats(selectedOrgId),
        ]);
        if (pRes.success) setProjects(pRes.data.projects || []);
        if (sRes.success) setStats(sRes.data.stats || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
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
              <FolderGit2 className="w-7 h-7 text-emerald-400" />
              Project Workspaces
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create and manage software projects with custom prefix keys and team assignments.
            </p>
          </div>

          {/* Org Switcher & Create Project Button */}
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 text-xs transition disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Banner */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                {stats.totalProjects || 0}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</div>
                <div className="text-xs text-slate-300">Projects</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                {stats.activeProjects || 0}
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active</div>
                <div className="text-xs text-slate-300">In Progress</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                {stats.completedProjects || 0}
              </div>
              <div>
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Completed</div>
                <div className="text-xs text-slate-300">Shipped</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="w-10 h-10 rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-400 flex items-center justify-center font-bold text-lg">
                {stats.archivedProjects || 0}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Archived</div>
                <div className="text-xs text-slate-300">Stored</div>
              </div>
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          {["ALL", "ACTIVE", "COMPLETED", "ARCHIVED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === tab
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
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

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-slate-400 text-sm mt-3">Loading project workspaces...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No Projects Found</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
              No projects match the selected filter in this organization. Create a project to start planning boards and tasks!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono font-bold text-xs">
                      {project.key}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border uppercase ${
                        project.status === "ACTIVE"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : project.status === "COMPLETED"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{project.name}</h3>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
                    {project.description || "No project description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{project.teamId?.name || "Unassigned Team"}</span>
                  </div>

                  {project.createdBy?.name && (
                    <div className="text-[11px] text-slate-500">
                      by <span className="text-slate-400 font-medium">{project.createdBy.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-emerald-400" />
                  Create Project
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mobile Banking App"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Project Prefix Key</span>
                    <span className="text-[10px] text-slate-500 font-normal lowercase">(optional - auto-generated if empty)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="MBA"
                    value={newProject.key}
                    onChange={(e) => setNewProject({ ...newProject, key: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Assigned Team (Optional)
                  </label>
                  <select
                    value={newProject.teamId}
                    onChange={(e) => setNewProject({ ...newProject, teamId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Unassigned --</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="iOS & Android banking application workspace..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
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
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {actionLoading ? "Creating..." : "Create Project"}
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
