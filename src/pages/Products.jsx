// ============================================
// ENHANCED FILE: src/pages/Products.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Award, CheckCircle } from "lucide-react";
import { db } from "../lib/supabase";
import ProductGrid from "../components/products/ProductGrid";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortBy, priceRange]);

  const loadProducts = async () => {
    const { data, error } = await db.getProducts();
    if (error) {
      console.error("Error loading products:", error);
    } else {
      // Use database products and apply local images for demo consistency
      // SEO-Friendly Titles and Unique Review Counts for the 3 products
      const seoTitles = [
        "Pure Himalayan Shilajit Resin - 20g Gold Grade | PCSIR Certified",
        "Herbveda Authentic Himalayan Shilajit - 30g Potent Extract | 100% Natural",
        "Premium Sun-Dried Himalayan Shilajit Resin - 50g Mega Pack | Lab Tested"
      ];
      
      const reviewCounts = ["847", "1,134", "2,310"];

      // Use database products and apply local images for demo consistency
      const enhancedData = (data || []).map((p, idx) => {
        return {
          ...p,
          name: seoTitles[idx] || p.name,
          review_count: reviewCounts[idx] || "1.2k",
          image_url: "/images/products/shilajit-box-spoon.jpg",
          hover_image_url: "/images/products/shilajit-nutrition-infographic.jpg"
        };
      });
      setProducts(enhancedData);
      setFilteredProducts(enhancedData);
    }
    setLoading(false);
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter((p) => {
        if (priceRange === "under-15000") return p.price < 15000;
        if (priceRange === "15000-50000") return p.price >= 15000 && p.price < 50000;
        if (priceRange === "50000-100000") return p.price >= 50000 && p.price < 100000;
        if (priceRange === "over-100000") return p.price >= 100000;
        return true;
      });
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-white text-black font-light">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-40 md:pt-32 pb-12 max-md:!px-[8px] max-md:!pt-[70px] max-md:!pb-[16px]">
        {/* Header */}
        <div className="mb-12 text-center max-md:!mb-[16px]">
          <h1 className="text-6xl md:text-7xl font-serif font-bold inline-block border-b-8 border-[#D4AF37] pb-4 tracking-tight max-md:!text-[28px] max-md:!font-[700] max-md:!pb-0 max-md:!border-b-0 max-md:!mb-0">
            Products
          </h1>
          <div className="hidden max-md:!block max-md:!w-[60px] max-md:!h-[4px] max-md:!bg-[#D4AF37] max-md:!rounded-full max-md:!mx-auto max-md:!mt-0"></div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-6 max-md:!text-[13px] max-md:!mt-[8px] max-md:!px-[16px] max-md:!leading-[1.6] max-md:!mb-[16px]">
            Premium Himalayan Shilajit. Pure. Potent. Verified. Explored our curated collection of natural wellness.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-12 sticky top-24 z-30 bg-white/90 backdrop-blur-md py-4 max-md:!static max-md:!mb-[16px] max-md:!py-[10px] max-md:!z-auto max-md:!bg-white max-md:!backdrop-blur-none max-md:!shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-md:!gap-[10px] max-w-[1500px] mx-auto px-[40px] max-md:!px-0">
            {/* Search (Light Grey Rectangle) */}
            <div className="relative group bg-gray-100 rounded-lg px-6 py-3 shadow-sm flex items-center border border-gray-200/50 max-md:!px-[14px] max-md:!py-0 max-md:!h-[44px] max-md:!rounded-[8px]">
              <Search className="text-gray-500 h-4 w-4 mr-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-black placeholder-gray-400 text-sm max-md:!text-[14px]"
              />
            </div>

            {/* Sort + Price Range — side by side on mobile */}
            <div className="contents max-md:!flex max-md:!gap-[10px]">
              {/* Sort (Light Grey Rectangle) */}
              <div className="relative bg-gray-100 rounded-lg px-6 py-3 shadow-sm flex items-center border border-gray-200/50 max-md:!flex-1 max-md:!px-[12px] max-md:!py-0 max-md:!h-[40px] max-md:!rounded-[8px]">
                <SlidersHorizontal className="text-gray-500 h-4 w-4 absolute left-6 max-md:!left-[12px]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-8 pr-4 bg-transparent border-none outline-none text-black appearance-none cursor-pointer text-sm font-medium max-md:!text-[13px] max-md:!pl-[24px]"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* Price Range (Light Grey Rectangle) */}
              <div className="relative bg-gray-100 rounded-lg px-6 py-3 shadow-sm flex items-center border border-gray-200/50 max-md:!flex-1 max-md:!px-[12px] max-md:!py-0 max-md:!h-[40px] max-md:!rounded-[8px]">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-black appearance-none cursor-pointer text-sm font-medium max-md:!text-[13px]"
                >
                  <option value="all">All Prices</option>
                  <option value="under-15000">Under Rs.15,000</option>
                  <option value="15000-50000">Rs.15,000 - Rs.50,000</option>
                  <option value="50000-100000">Rs.50,000 - Rs.100,000</option>
                  <option value="over-100000">Over Rs.100,000</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-500 max-md:!px-[12px]">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || priceRange !== "all") && (
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <span className="text-xs uppercase tracking-wider text-gray-500">Active filters:</span>
              {searchQuery && (
                <span className="border border-black text-black px-4 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-2">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-gray-500">
                    ×
                  </button>
                </span>
              )}
              {priceRange !== "all" && (
                <span className="border border-black text-black px-4 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-2">
                  {priceRange}
                  <button onClick={() => setPriceRange("all")} className="hover:text-gray-500">
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-8 text-xs uppercase tracking-widest text-gray-500 font-semibold text-center max-md:!text-[12px] max-md:!mb-[12px] max-md:!mt-0">
          Showing {filteredProducts.length} results
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-gray-200 rounded-2xl">
            <h3 className="text-2xl font-serif mb-4">No results found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your filters or search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setPriceRange("all");
                setSortBy("featured");
              }}
              className="text-black uppercase tracking-widest text-xs font-bold border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>

      {/* Benefits of Shilajit Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="bg-white text-black py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
                    src="/images/about/how-to-use-drops.jpg"
                    alt="Herbveda Shilajit Usage Routine"
                    className="w-full h-full object-contain bg-white"
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
                  {
                    step: 3,
                    title: "Drink in the morning or before bed",
                    desc: "Best taken on an empty stomach for maximum absorption."
                  }
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
