// ============================================
// FILE: src/components/auth/ProtectedRoute.jsx
// ============================================
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
