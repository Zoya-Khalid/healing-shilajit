// ============================================
// FILE: src/components/auth/SignupForm.jsx
// ============================================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore((state) => state.signUp);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName);
      toast.success("Account created! Please check your email to verify.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required variant="dark" />

      <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required variant="dark" />

      <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required variant="dark" />

      <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required variant="dark" />

      <Button type="submit" fullWidth disabled={loading} variant="white" className="py-4 text-lg">
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
}
