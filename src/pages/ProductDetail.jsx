// ============================================
// UPDATED FILE: src/pages/ProductDetail.jsx
// Added Review Section, Write Review Button,
// Benefits of Shilajit, and How to Use sections
// ============================================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight, Package, Award, CheckCircle } from "lucide-react";
import { db, supabase } from "../lib/supabase";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import Button from "../components/common/Button";
import ReviewForm from "../components/products/ReviewForm";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  // Hardcoded gallery images + dynamic main image
  const images = [
    "/images/products/shilajit-infographic-main.jpg",
    "/images/products/shilajit-infographic-1.jpg",
    "/images/products/shilajit-infographic-2.jpg",
    "/images/products/shilajit-nutrition-infographic.jpg",
  ];

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    const { data, error } = await db.getProduct(id);
    if (!error) setProduct(data);
    setLoading(false);
  };

  const loadReviews = async () => {
    const { data } = await db.getProductReviews(id);
    setReviews(data || []);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate("/checkout");
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    loadReviews();
    setActiveTab("reviews");
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = (stars) => {
    if (reviews.length === 0) return 0;
    const count = reviews.filter((r) => r.rating === stars).length;
    return ((count / reviews.length) * 100).toFixed(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  const discountPercent = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
  const avgRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 md:pt-32 pb-12 max-md:!pt-[80px] max-md:!px-0 max-md:!pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 max-md:!mb-[16px] max-md:!gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group max-md:!h-[280px] max-md:!rounded-[12px] max-md:!aspect-auto max-md:!mx-[14px] max-md:!bg-[#f5f5f5] max-md:!p-[8px]">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover max-md:!object-contain max-md:!h-full" />

              {/* Navigation Arrows */}
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Badges */}
              {product.original_price && <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">{discountPercent}% OFF</div>}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4 max-md:!flex max-md:!overflow-x-auto max-md:!gap-[8px] max-md:!mt-[10px] max-md:!mx-[14px] max-md:!pb-2 max-md:!px-[2px] max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(idx)} 
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === idx ? "border-black ring-2 ring-black ring-offset-2" : "border-gray-200 hover:border-gray-300"} max-md:!w-[64px] max-md:!h-[64px] max-md:!rounded-[8px] max-md:!ring-0 max-md:!border max-md:!border-black/10`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="max-md:!mt-2 max-md:!px-[14px]">
              <h1 className="text-3xl font-bold mb-3 max-md:!text-[18px] max-md:!mb-[4px]">{product.name}</h1>
              <p className="text-gray-600 mb-4 max-md:!text-[12px] max-md:!mb-[10px] max-md:!text-gray-500">Gold Grade | Certified | Third-Party USA Lab Tested</p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4 max-md:!mb-[6px] max-md:!gap-2 max-md:!px-[14px]">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(avgRating) ? "fill-current" : "text-gray-300"} max-md:!w-[12px] max-md:!h-[12px]`} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-semibold max-md:!text-[12px]">{avgRating}</span>
                </div>
                <span className="text-gray-600 max-md:!text-[12px]">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl max-md:!p-[14px] max-md:!rounded-[12px] max-md:!m-[12px_14px]">
              {product.original_price ? (
                <div className="space-y-2 max-md:!space-y-0 text-left">
                  <div className="flex items-baseline gap-4 max-md:!gap-2 max-md:!mb-[6px]">
                    <span className="text-4xl font-bold text-black max-md:!text-[20px]">Rs.{product.price.toLocaleString()}</span>
                    <span className="text-xl text-gray-500 line-through max-md:!text-[13px]">Rs.{product.original_price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 max-md:!mb-[6px]">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold max-md:!text-[11px] max-md:!px-[8px] max-md:!py-[3px]">SAVE Rs.{(product.original_price - product.price).toLocaleString()}</span>
                    <span className="text-green-600 font-semibold max-md:!text-[12px]">({discountPercent}% OFF)</span>
                  </div>
                </div>
              ) : (
                <span className="text-4xl font-bold text-black max-md:!text-[20px]">Rs.{product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 max-md:!my-[6px] max-md:!px-[14px]">
              {product.stock > 10 ? (
                <div className="flex items-center text-green-600 font-semibold max-md:!text-[12px]">
                  <Package className="h-5 w-5 mr-2 max-md:!h-4 max-md:!w-4" />
                  In Stock
                </div>
              ) : product.stock > 0 ? (
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-semibold max-md:!text-[12px] max-md:!px-3 max-md:!py-1">⚠ Hurry! Only {product.stock} Left</div>
              ) : (
                <div className="text-red-600 font-semibold max-md:!text-[12px]">Out of Stock</div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-3 text-gray-600">
              <p className="flex items-center gap-2">
                <Package className="h-5 w-5 text-black" />
                <span>
                  {product.weight} | {product.servings} Servings
                </span>
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 max-md:!my-[8px] max-md:!px-[14px]">
              <span className="font-semibold max-md:!text-[12px]">Quantity:</span>
              <div className="flex items-center border-2 border-gray-300 rounded-lg max-md:!h-[36px]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 transition-colors text-xl font-bold max-md:!w-[32px] max-md:!p-0 max-md:!h-full">
                  −
                </button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center border-x-2 border-gray-300 py-2 font-semibold max-md:!w-[40px] max-md:!text-[14px] max-md:!py-0" />
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 transition-colors text-xl font-bold max-md:!w-[32px] max-md:!p-0 max-md:!h-full">
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 max-md:!space-y-[10px] max-md:!px-[14px]">
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full bg-black text-white py-4 rounded-full font-semibold hover:shadow-xl hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg max-md:!h-[44px] max-md:!text-[14px] max-md:!py-0 max-md:!rounded-[10px] max-md:!mb-[10px]">
                <ShoppingCart className="h-6 w-6 inline mr-2 max-md:!h-4 max-md:!w-4" />
                Add To Cart
              </button>

              <button onClick={handleBuyNow} disabled={product.stock === 0} className="w-full bg-white border-2 border-black text-black py-4 rounded-full font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg max-md:!h-[44px] max-md:!text-[14px] max-md:!py-0 max-md:!rounded-[10px] max-md:!mb-[10px]">
                Buy It Now
              </button>

              <div className="flex gap-3 max-md:!gap-[10px] max-md:!mb-[14px]">
                <button onClick={() => toast.success("Added to favorites!")} className="flex-1 border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-colors max-md:!h-[40px] max-md:!text-[13px] max-md:!py-0 max-md:!flex max-md:items-center max-md:justify-center">
                  <Heart className="h-5 w-5 inline mr-2 max-md:!h-4 max-md:!w-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    navigator.share?.({ title: product.name, url: window.location.href });
                    toast.success("Share link copied!");
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors max-md:!h-[40px] max-md:!text-[13px] max-md:!py-0 max-md:!flex max-md:items-center max-md:justify-center"
                >
                  <Share2 className="h-5 w-5 inline mr-2 max-md:!h-4 max-md:!w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t max-md:!flex max-md:!justify-around max-md:!my-[14px] max-md:!py-[10px] max-md:!px-[14px]">
              <div className="text-center">
                <Shield className="h-8 w-8 text-black mx-auto mb-2 max-md:!h-[22px] max-md:!w-[22px] max-md:!mb-1" />
                <p className="text-sm font-semibold max-md:!text-[11px]">Lab Tested</p>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 text-black mx-auto mb-2 max-md:!h-[22px] max-md:!w-[22px] max-md:!mb-1" />
                <p className="text-sm font-semibold max-md:!text-[11px]">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 text-black mx-auto mb-2 max-md:!h-[22px] max-md:!w-[22px] max-md:!mb-1" />
                <p className="text-sm font-semibold max-md:!text-[11px]">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-[2rem] shadow-xl p-8 max-md:!p-[14px] max-md:!rounded-[12px] max-md:!mb-[16px] max-md:!mx-[14px]">
          {/* Tab Headers */}
          <div className="flex border-b mb-6 max-md:!overflow-x-auto max-md:!whitespace-nowrap max-md:!mb-4 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
            {["description", "benefits", "reviews", "certifications"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-semibold capitalize transition-colors ${activeTab === tab ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"} max-md:!px-[10px] max-md:!py-[8px] max-md:!text-[13px] max-md:!border-b-[2px]`}>
                {tab}
                {tab === "reviews" && ` (${reviews.length})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="prose max-w-none">
            {activeTab === "description" && (
              <div>
                <h3 className="text-2xl font-bold mb-4 max-md:!text-[15px] max-md:!mb-[10px]">Product Description</h3>
                <p className="text-gray-600 leading-relaxed max-md:!text-[13px] max-md:!leading-[1.7]">{product.description || "Pure Himalayan Shilajit sourced from 17,000 feet. Gold Grade | Certified | Third-Party USA Lab Tested. Each batch is limited, traceable, and third-party lab tested. Rich in fulvic acid and 80+ minerals."}</p>
              </div>
            )}

            {activeTab === "benefits" && (
              <div>
                <h3 className="text-2xl font-bold mb-4 max-md:!text-[15px] max-md:!mb-[10px]">Health Benefits</h3>
                <ul className="space-y-3 max-md:!space-y-[6px]">
                  <li className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 max-md:!h-4 max-md:!w-4" />
                    <span className="max-md:!text-[13px]">✓ Boosts energy and stamina naturally</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 max-md:!h-4 max-md:!w-4" />
                    <span className="max-md:!text-[13px]">✓ Supports immune system function</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 max-md:!h-4 max-md:!w-4" />
                    <span className="max-md:!text-[13px]">✓ Enhances mental clarity and focus</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 max-md:!h-4 max-md:!w-4" />
                    <span className="max-md:!text-[13px]">✓ Rich in 80+ minerals and fulvic acid</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 max-md:!h-4 max-md:!w-4" />
                    <span className="max-md:!text-[13px]">✓ 100% natural with no additives</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Customer Reviews</h3>
                  {user && (
                    <button onClick={() => setShowReviewForm(!showReviewForm)} className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all">
                      {showReviewForm ? "Cancel" : "Write a Review"}
                    </button>
                  )}
                  {!user && <p className="text-sm text-gray-600">Please login to write a review</p>}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-8">
                    <ReviewForm productId={product.id} productName={product.name} onReviewAdded={handleReviewAdded} />
                  </div>
                )}

                {/* Rating Summary */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 mb-6 max-md:!p-4 max-md:!rounded-[16px]">
                  <div className="flex items-center gap-8 max-md:!flex-col max-md:!gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-black max-md:!text-[28px]">{avgRating}</div>
                      <div className="flex text-yellow-400 my-2 max-md:!my-1 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < Math.floor(avgRating) ? "fill-current" : "text-gray-300"} max-md:!w-[14px] max-md:!h-[14px]`} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 max-md:!text-[11px]">Based on {reviews.length} reviews</div>
                    </div>
                    <div className="flex-1 space-y-2 w-full max-md:!space-y-1">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm w-8 max-md:!text-[12px]">{stars}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-md:!h-1.5">
                            <div className={`bg-yellow-400 h-2 max-md:!h-1.5 rounded-full`} style={{ width: `${getRatingDistribution(stars)}%` }}></div>
                          </div>
                          <span className="text-sm w-12 text-gray-600 max-md:!text-[12px]">{reviews.filter((r) => r.rating === stars).length}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 max-md:!pb-4 max-md:!px-0">
                        <div className="flex items-center gap-4 mb-3 max-md:!mb-2 max-md:!gap-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300"} max-md:!w-[10px] max-md:!h-[10px]`} />
                            ))}
                          </div>
                          <span className="font-semibold max-md:!text-[13px]">{review.profiles?.full_name || "Anonymous"}</span>
                          <span className="text-sm text-gray-500 max-md:!text-[11px]">{format(new Date(review.created_at), "MMM d, yyyy")}</span>
                        </div>
                        {review.title && <h4 className="font-semibold mb-2 max-md:!text-[13px]">{review.title}</h4>}
                        <p className="text-gray-700 max-md:!text-[13px] max-md:!leading-relaxed">{review.comment}</p>

                        {/* Admin Response */}
                        {review.admin_response && (
                          <div className="mt-4 bg-gray-50 border-l-4 border-black p-4 rounded-lg shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="bg-black text-white p-2 rounded-full">
                                <Award className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-bold text-gray-900">Response from Herbveda Shilajit Team</p>
                                  <p className="text-xs text-gray-500">{format(new Date(review.response_date), "MMM d, yyyy")}</p>
                                </div>
                                <p className="text-gray-800 leading-relaxed">{review.admin_response}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "certifications" && (
              <div>
                <h3 className="text-2xl font-bold mb-4 max-md:!text-[15px] max-md:!mb-[10px]">Certifications & Lab Reports</h3>
                <div className="grid grid-cols-2 gap-6 max-md:!gap-[12px]">
                  <div className="border rounded-lg p-4 max-md:!p-[12px] max-md:!rounded-[10px]">
                    <Award className="h-12 w-12 text-black mb-3 max-md:!h-[28px] max-md:!w-[28px] max-md:!mb-[6px]" />
                    <h4 className="font-semibold mb-2 max-md:!text-[13px]">USA Lab Tested</h4>
                    <p className="text-sm text-gray-600 max-md:!text-[11px] max-md:!leading-[1.4]">Third-party laboratory testing in USA</p>
                  </div>
                  <div className="border rounded-lg p-4 max-md:!p-[12px] max-md:!rounded-[10px]">
                    <Shield className="h-12 w-12 text-black mb-3 max-md:!h-[28px] max-md:!w-[28px] max-md:!mb-[6px]" />
                    <h4 className="font-semibold mb-2 max-md:!text-[13px]">ISO 9001 Certified</h4>
                    <p className="text-sm text-gray-600 max-md:!text-[11px] max-md:!leading-[1.4]">International quality management</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits of Shilajit Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-md:!mb-[16px]">
            <div className="inline-block group max-md:flex max-md:flex-col max-md:items-center">
              <h2 className="text-4xl md:text-5xl max-md:!text-[22px] font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4 max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[12px]">Benefits Of Shilajit</h2>
              <div className="w-full h-2 max-md:!h-[4px] max-md:!w-[60px] bg-amber-500 rounded-full md:hidden"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-[12px] md:gap-8">
            {[
              {
                title: "Boost Testosterone",
                description: "Naturally supports healthy testosterone levels to improve strength, muscle tone, confidence, and overall male vitality.",
                image: "/images/benefits/testosterone.jpg",
              },
              {
                title: "Boosts Energy & Stamina",
                description: "Enhances physical performance by increasing natural energy levels, reducing fatigue, and improving long-lasting stamina.",
                image: "/images/benefits/energy.jpg",
              },
              {
                title: "Heals Joints Pain",
                description: "Helps reduce joint stiffness and discomfort by supporting lubrication, flexibility, and faster recovery for smoother movement.",
                image: "/images/benefits/joints.jpg",
              },
              {
                title: "Strengthens Immunity",
                description: "Boosts the body's natural defense system by providing essential minerals and antioxidants that help fight sickness and weakness.",
                image: "/images/benefits/immunity.jpg",
              },
              {
                title: "Cognitive Support",
                description: "Improves focus, memory, and mental clarity by nourishing brain function and reducing mental fatigue.",
                image: "/images/benefits/cognitive.jpg",
              },
              {
                title: "Anti-Aging Properties",
                description: "Rich in powerful antioxidants that help slow visible aging, improve skin texture, and support youthful cellular health.",
                image: "/images/benefits/anti-aging.jpg",
                objectPosition: "object-[center_20%]",
              },
            ].map((benefit, index) => (
              <div key={index} className="group relative bg-black text-white rounded-[12px] md:rounded-[3rem] p-[10px] md:p-8 flex flex-col items-center text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-900/50 border-2 border-[#D4AF37]">
                <div className="w-full h-[120px] md:h-48 mb-[10px] md:mb-6 rounded-[10px] md:rounded-[2rem] overflow-hidden border-2 border-white/10 group-hover:border-amber-500/50 transition-all duration-500">
                  <img 
                    src={benefit.image} 
                    alt={benefit.title} 
                    className={`w-full h-full object-cover ${benefit.objectPosition || 'object-center'} transform group-hover:scale-110 transition-transform duration-700`} 
                  />
                </div>
                <h3 className="text-[13px] md:text-2xl font-bold mb-1 md:mb-4 text-amber-500 group-hover:text-amber-400">{benefit.title}</h3>
                <p className="text-gray-300 leading-[1.4] md:leading-relaxed text-[11px] md:text-sm group-hover:text-white transition-colors">{benefit.description}</p>
                <div className="absolute inset-0 rounded-[12px] md:rounded-[3rem] bg-gradient-to-tr from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="bg-gray-50 text-black py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-md:!mb-[24px]">
            <h2 className="text-4xl md:text-6xl font-serif font-bold inline-block border-b-8 border-[#D4AF37] pb-4 tracking-tight max-md:!text-[22px] max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[4px]">How to Use</h2>
            <div className="hidden max-md:!block max-md:!w-[60px] max-md:!h-[4px] max-md:!bg-amber-600 max-md:!rounded-full max-md:!mx-auto max-md:!mt-0"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            {/* Left Column - Product Image */}
            <div className="w-full lg:flex-1 max-md:px-4">
              <div className="relative group mx-auto max-w-lg lg:max-w-none">
                <div className="relative z-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden border-2 border-black/5 shadow-[0_0_50px_rgba(212,175,55,0.05)] transition-transform duration-700 group-hover:scale-[1.02] aspect-square md:aspect-[4/5] max-md:max-h-[350px]">
                  <img
                    src="/images/about/how-to-use-final-v4.png"
                    alt="Herbveda Shilajit Usage Routine"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Steps */}
            <div className="w-full lg:flex-1 space-y-8 md:space-y-10 px-6 md:px-0">
              <div className="space-y-2 max-md:text-center lg:text-left">
                <span className="text-[#D4AF37] font-bold text-xs md:text-sm tracking-[0.3em] uppercase">Simple 3-Step Routine</span>
              </div>

              <div className="space-y-6 md:space-y-8">
                {[
                  {
                    step: 1,
                    title: "Take a pea-sized amount",
                    desc: "Around 250–500 mg, roughly the size of a grain of rice."
                  },
                  {
                    step: 2,
                    title: "Dissolve in warm water or milk",
                    desc: "Stir until fully dissolved. Never use boiling water, keep it warm."
                  },
                  { step: 3, title: "Drink in the morning or before bed", desc: "Best taken on an empty stomach for maximum absorption." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 items-start">
                    <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold text-lg md:text-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                      {item.step}
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <h3 className="text-lg md:text-2xl font-bold text-black max-md:text-[15px]">{item.title}</h3>
                      <p className="text-gray-600 text-sm md:text-lg leading-relaxed max-md:text-[13px]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Tip Box */}
              <div className="bg-white border-l-4 border-[#D4AF37] p-5 md:p-8 rounded-r-2xl shadow-sm">
                <p className="text-gray-700 text-sm md:text-lg italic leading-relaxed max-md:text-[12px]">
                  <strong className="text-[#D4AF37] not-italic">Pro Tip —</strong> Consistency is key. Use daily for at least 2–3 weeks to feel the full benefit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
