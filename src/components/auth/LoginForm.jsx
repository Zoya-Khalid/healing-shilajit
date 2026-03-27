// ============================================
// UPDATED FILE: src/components/auth/LoginForm.jsx
// Redirect admins to dashboard after login
// ============================================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((state) => state.signIn);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🆕 Get profile back from signIn to check role
      const { profile } = await signIn(email, password);

      toast.success("Welcome back!");

      // 🆕 Redirect based on role
      if (profile?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required variant="dark" />

      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required variant="dark" />

      <Button type="submit" fullWidth disabled={loading} variant="white" className="py-4 text-lg">
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
