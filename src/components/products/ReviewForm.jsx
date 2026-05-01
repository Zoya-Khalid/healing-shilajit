// ============================================
// FILE: src/components/products/ReviewForm.jsx
// NEW COMPONENT - Customer Review Form
// ============================================
import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabase";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../common/Button";
import Input from "../common/Input";

export default function ReviewForm({ productId, productName, onReviewAdded }) {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            product_id: productId,
            user_id: user?.id || null,
            full_name: name, // We store the name directly for anonymous reviews
            rating,
            title,
            comment,
            is_verified_purchase: false,
          },
        ])
        .select();

      if (error) throw error;

      toast.success("Review submitted successfully!");

      // Reset form
      if (!user) setName("");
      setRating(0);
      setTitle("");
      setComment("");

      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit review. If you're an admin, please ensure 'full_name' column exists in Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <Input 
            label="Your Name *" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name" 
            required 
          />
        </div>

        {/* Star Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} className="focus:outline-none">
                <Star className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
              </button>
            ))}
            {rating > 0 && <span className="ml-2 text-gray-600">({rating}/5)</span>}
          </div>
        </div>

        <Input label="Review Title (Optional)" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarize your experience" />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none" rows="5" placeholder="Tell us about your experience with this product..." required />
        </div>

        <Button type="submit" disabled={loading} fullWidth>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}
