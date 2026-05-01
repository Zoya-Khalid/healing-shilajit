// ============================================
// FIXED FILE: src/pages/admin/Reviews.jsx
// Removed email dependency - works without email service
// ============================================
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { format } from "date-fns";
import { Star, MessageSquare, Send, Home, CheckCircle2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select(
        `
        *,
        profiles (full_name, email),
        products (name)
      `,
      )
      .order("created_at", { ascending: false });

    setReviews(data || []);
    setLoading(false);
  };

  const handleResponse = async (reviewId) => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      // Update review with admin response
      const { error } = await supabase
        .from("reviews")
        .update({
          admin_response: response,
          response_date: new Date().toISOString(),
        })
        .eq("id", reviewId);

      if (error) throw error;

      toast.success("Response posted successfully!", { duration: 3000 });

      setResponse("");
      setRespondingTo(null);
      loadReviews();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to post response");
    }
  };

  const toggleHomeStatus = async (reviewId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          show_on_home: !currentStatus,
        })
        .eq("id", reviewId);

      if (error) throw error;

      toast.success(!currentStatus ? "Added to Home Page" : "Removed from Home Page");
      loadReviews();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update status. Please ensure 'show_on_home' column exists in Supabase.");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      toast.success("Review deleted successfully");
      loadReviews();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 max-md:!mb-6">
        <h1 className="text-3xl font-bold max-md:!text-[20px]">Customer Reviews</h1>
        <p className="text-gray-600 mt-1 max-md:!text-[13px]">Manage and respond to customer feedback</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-md:!grid-cols-2 max-md:!gap-[12px] max-md:!mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Total Reviews</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{reviews.length}</p>
            </div>
            <MessageSquare className="h-12 w-12 text-blue-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Pending Response</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{reviews.filter((r) => !r.admin_response).length}</p>
            </div>
            <MessageSquare className="h-12 w-12 text-yellow-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px] max-md:!col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Average Rating</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}</p>
            </div>
            <Star className="h-12 w-12 text-yellow-500 fill-current max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6 max-md:!p-[14px] max-md:!rounded-[12px] max-md:!mb-[12px]">
            {/* Review Header */}
            <div className="flex justify-between items-start mb-4 max-md:!mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2 max-md:!mb-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 max-md:!h-[14px] max-md:!w-[14px] ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="font-semibold max-md:!text-[13px]">{review.rating}/5</span>
                </div>
                <p className="font-semibold text-lg max-md:!text-[13px] max-md:!font-bold">{review.profiles?.full_name || "Anonymous"}</p>
                <p className="text-sm text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">{review.profiles?.email}</p>
                <p className="text-sm text-gray-500 mt-1 max-md:!text-[10px]">{format(new Date(review.created_at), "MMM d, yyyy h:mm a")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 max-md:!hidden">Product:</p>
                <p className="font-semibold max-md:!text-[12px] max-md:!text-right">{review.products?.name}</p>
                {review.is_verified_purchase && <span className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold max-md:!text-[10px] max-md:!px-[8px] max-md:!py-[2px]">✓ Verified</span>}
                <div className="mt-2">
                  <button
                    onClick={() => toggleHomeStatus(review.id, review.show_on_home)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all max-md:!text-[10px] max-md:!px-[8px] max-md:!py-[4px] ${review.show_on_home
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                      }`}
                  >
                    <Home className="h-3 w-3" />
                    <span className="max-md:!hidden">{review.show_on_home ? "Featured" : "Show on Home"}</span>
                    <span className="hidden max-md:!inline">Home</span>
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="mt-3 flex items-center justify-center gap-1.5 w-full py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all text-xs font-bold border border-transparent hover:border-red-100 max-md:!mt-2"
                  title="Delete Review"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete Review</span>
                </button>
              </div>
            </div>

            {/* Review Content */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 max-md:!p-[10px] max-md:!mb-3">
              {review.title && <h4 className="font-semibold mb-2 max-md:!text-[13px] max-md:!font-medium max-md:!mb-1">{review.title}</h4>}
              <p className="text-gray-700 max-md:!text-[12px] max-md:!leading-[1.5]">{review.comment}</p>
            </div>

            {/* Admin Response */}
            {review.admin_response ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Your Response</span>
                  <span className="text-sm text-gray-600">• {format(new Date(review.response_date), "MMM d, yyyy")}</span>
                </div>
                <p className="text-blue-900">{review.admin_response}</p>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700">✅ This response is now visible to customers on the product page</p>
                </div>
              </div>
            ) : (
              <div>
                {respondingTo === review.id ? (
                  <div className="space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-amber-800">
                        💡 <strong>Tip:</strong> Your response will appear publicly on the product page under this review
                      </p>
                    </div>
                    <textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Write your response to the customer..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none" rows="4" />
                    <div className="flex gap-2 max-md:!flex-col">
                      <button onClick={() => handleResponse(review.id)} className="bg-gradient-to-r from-[#8B4513] to-[#654321] text-white px-6 py-2 rounded-lg hover:shadow-lg font-semibold transition-all max-md:!text-[12px] max-md:!px-[14px] max-md:!h-[36px] max-md:!rounded-[8px] max-md:!w-full">
                        <Send className="h-4 w-4 inline mr-2" />
                        Post Response
                      </button>
                      <button
                        onClick={() => {
                          setRespondingTo(null);
                          setResponse("");
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-all max-md:!text-[12px] max-md:!h-[36px] max-md:!rounded-[8px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setRespondingTo(review.id)} className="border-2 border-[#8B4513] text-[#8B4513] px-6 py-2 rounded-lg hover:bg-[#8B4513] hover:text-white font-semibold transition-colors max-md:!text-[12px] max-md:!px-[14px] max-md:!h-[36px] max-md:!rounded-[8px] max-md:!w-full">
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Respond to Review
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-2">Reviews will appear here when customers leave feedback</p>
          </div>
        )}
      </div>
    </div>
  );
}
