// ============================================
// FIXED FILE: src/pages/Contact.jsx
// Better error handling for Edge Function calls
// ============================================
import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("💾 Sending message...");

    try {
      // Call Edge Function (works for both authenticated and anonymous users)
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
        },
      });

      // Check for errors
      if (error) {
        console.error("❌ Function error:", error);
        throw error;
      }

      // Check response
      if (!data || !data.success) {
        console.error("❌ Response error:", data);
        throw new Error(data?.error || "Failed to submit message");
      }

      console.log("✅ Message sent successfully:", data);

      // Show success
      setSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you within 24 hours.", { duration: 5000 });

      // Clear form
      setFormData({ name: "", email: "", phone: "", message: "" });

      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("❌ Error:", error);

      // More specific error messages
      const errorMessage = error?.message || "Failed to send message";

      if (errorMessage.includes("Edge Function")) {
        toast.error("Server error. Please try again or call us at +92 333 807 1123", { duration: 7000 });
      } else {
        toast.error(`${errorMessage}. Please try again or call us at +92 333 807 1123`, { duration: 7000 });
      }
    } finally {
      setLoading(false);
    }
  };

  // Success View - Dark Theme
  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-[#111] border border-gray-800 rounded-[2rem] p-12 text-center shadow-2xl">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-20 w-20 text-white mx-auto" strokeWidth={1} />
            </div>
            <h1 className="text-4xl font-serif mb-4 tracking-wide">Message Sent</h1>
            <p className="text-lg text-gray-400 mb-8 font-light">Thank you for contacting us. We've received your message and will respond within 24 hours.</p>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8 text-left">
              <p className="text-sm text-gray-400">
                <strong className="text-white block mb-1">Confirmation</strong>
                Your message has been securely transmitted to our support team.
              </p>
            </div>

            <div className="space-y-4">
              <button onClick={() => setSubmitted(false)} className="w-full bg-white text-black py-4 rounded-none uppercase tracking-widest text-xs font-bold hover:bg-gray-200 transition-colors">
                Send Another Message
              </button>
              <a href="/" className="block w-full text-gray-500 py-3 text-xs tracking-widest uppercase hover:text-white transition-colors">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-light flex flex-col items-center justify-start pt-24 pb-8 md:pt-32 md:pb-12 px-4">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[700px] bg-black text-white rounded-3xl lg:rounded-[4rem] shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:hover:scale-[1.01] group border border-gray-900/50 max-md:!flex max-md:!flex-row max-md:!gap-0 max-md:!rounded-[16px] max-md:!border-0 max-md:!shadow-none max-md:!h-auto max-md:!overflow-visible max-md:!p-[20px_16px]">

        {/* Left Column - Form Section */}
        <div className="lg:col-span-7 p-10 md:p-16 relative max-md:!w-[60%] max-md:!p-0 max-md:!pr-[8px]">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 transition-colors group-hover:text-white max-md:!text-[10px] max-md:!tracking-[0.08em] max-md:!mb-[6px]">say hi to the team</p>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight max-md:!text-[18px] max-md:!mb-[16px]">Contact Us</h1>
          <p className="text-gray-400 mb-12 max-w-md text-sm leading-relaxed max-md:!text-[12px] max-md:!leading-[1.5] max-md:!mb-[16px]">
            Feel free to contact us and we will get back to you as soon as we can.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10 max-w-lg mt-8 lg:mt-0 max-md:!mt-0 max-md:!space-y-0">
            <div className="space-y-1 group/input max-md:!mb-[16px]">
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2 group-hover/input:text-white transition-colors max-md:!text-[11px] max-md:!mb-[6px] max-md:!block">name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-white outline-none transition-colors text-lg placeholder-gray-800 max-md:!h-[36px] max-md:!text-[13px] max-md:!pb-[6px] max-md:!border-white/20"
              />
            </div>

            <div className="space-y-1 group/input max-md:!mb-[16px]">
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2 group-hover/input:text-white transition-colors max-md:!text-[11px] max-md:!mb-[6px] max-md:!block">email address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-white outline-none transition-colors text-lg placeholder-gray-800 max-md:!h-[36px] max-md:!text-[13px] max-md:!pb-[6px] max-md:!border-white/20"
              />
            </div>

            <div className="space-y-1 group/input max-md:!mb-[16px]">
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2 group-hover/input:text-white transition-colors max-md:!text-[11px] max-md:!mb-[6px] max-md:!block">phone (optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-white outline-none transition-colors text-lg placeholder-gray-800 max-md:!h-[36px] max-md:!text-[13px] max-md:!pb-[6px] max-md:!border-white/20"
              />
            </div>

            <div className="space-y-1 group/input max-md:!mb-[16px]">
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2 group-hover/input:text-white transition-colors max-md:!text-[11px] max-md:!mb-[6px] max-md:!block">tell us all about it</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-white outline-none transition-colors text-lg min-h-[100px] resize-none placeholder-gray-800 max-md:!min-h-[80px] max-md:!h-[80px] max-md:!text-[13px] max-md:!border-white/20"
                rows="1"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 text-white py-4 rounded-full uppercase tracking-[0.15em] text-xs font-bold hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg hover:shadow-white/20 max-md:!text-[13px] max-md:!h-[42px] max-md:!py-0 max-md:!mt-[8px]"
            >
              {loading ? "sending..." : "send message"}
            </button>
          </form>
        </div>

        {/* Right Column - Info Section */}
        <div className="lg:col-span-5 flex flex-col justify-between p-10 md:p-16 bg-[#0a0a0a] relative overflow-hidden max-md:!w-[40%] max-md:!p-0 max-md:!pl-[8px] max-md:!pt-[48px]">
          {/* Decorative Circle */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none max-md:!hidden"></div>

          <div className="space-y-12 relative z-10 max-md:!space-y-0">
            <div className="group/info hover:translate-x-2 transition-transform duration-300 pt-12 max-md:!pt-0 max-md:!mb-[20px]">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 group-hover/info:text-white transition-colors max-md:!text-[11px] max-md:!tracking-[0.08em] max-md:!mb-[6px]">opening hours</h3>
              <p className="text-sm text-gray-300 leading-relaxed max-md:!text-[12px] max-md:!line-height-[1.8]">
                Mon - Sat<br />
                9am - 6pm<br />
                Sunday<br />
                Closed
              </p>
            </div>

            <div className="group/info hover:translate-x-2 transition-transform duration-300 max-md:!mb-[20px]">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 group-hover/info:text-white transition-colors max-md:!text-[11px] max-md:!tracking-[0.08em] max-md:!mb-[6px]">address</h3>
              <p className="text-sm text-gray-300 leading-relaxed max-md:!text-[12px] max-md:!line-height-[1.8]">
                Rawalpindi, Punjab,<br />
                Pakistan
              </p>
            </div>

            <div className="group/info hover:translate-x-2 transition-transform duration-300 max-md:!pt-[24px]">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 group-hover/info:text-white transition-colors max-md:!text-[11px] max-md:!tracking-[0.08em] max-md:!mb-[6px]">support</h3>
              <p className="text-sm text-gray-300 leading-relaxed max-md:!text-[12px] mb-0 max-md:!line-height-[1.8]">support@healingshilajit.com</p>
              <p className="text-sm text-gray-300 leading-relaxed max-md:!text-[12px] max-md:!line-height-[1.8]">+92 333 8071123</p>
            </div>
          </div>

          <div className="flex gap-8 mt-16 lg:mt-0 pt-8 border-t border-gray-800 lg:border-none relative z-10 max-md:!mt-[16px] max-md:!gap-[12px] max-md:!flex-wrap max-md:!pt-[12px] max-md:!border-white/10">
            {["dribbble", "instagram", "linkedin", "twitter"].map((social) => (
              <a key={social} href="#" className="text-xs text-gray-600 hover:text-white uppercase tracking-wider transition-colors hover:scale-110 transform inline-block max-md:!text-[11px]">
                {social}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}