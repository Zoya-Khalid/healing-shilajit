// ============================================
// FILE: src/pages/Profile.jsx
// ============================================
import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Profile() {
  const { user, profile, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      <div className="text-center mb-16 px-4 max-md:!mb-[16px]">
        <div className="inline-block group max-md:flex max-md:flex-col max-md:items-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4 max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[12px]">My Profile</h1>
          <div className="w-full h-2 max-md:!h-[4px] max-md:!w-[60px] bg-amber-500 rounded-full md:hidden"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[16px_14px] max-md:!rounded-[12px] max-md:!mx-[14px] max-md:!shadow-sm">
        <form onSubmit={handleSubmit}>
          <Input label="Full Name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />

          <Input label="Email" type="email" value={user?.email || ""} disabled />

          <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

          <div className="mt-8 text-center">
            <Button type="submit" disabled={loading} className="max-md:!text-[13px] max-md:!px-[20px] max-md:!h-[40px] max-md:!rounded-[8px] max-md:!w-auto max-md:!inline-block mx-auto">
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
