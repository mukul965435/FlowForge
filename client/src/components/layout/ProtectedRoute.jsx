import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm font-medium">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login preserving requested location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
