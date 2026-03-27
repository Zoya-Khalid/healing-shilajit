// ============================================
// FILE: src/components/auth/AdminRoute.jsx
// ============================================
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!user || profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
