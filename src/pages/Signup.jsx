// ============================================
// FILE: src/pages/Signup.jsx
// ============================================
import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black pt-32 pb-12 px-4 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl p-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-white mb-3 tracking-wide">Create Account</h2>
          <div className="h-1 w-full bg-[#D4AF37] rounded-full opacity-80" />
        </div>

        <SignupForm />

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-bold hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
