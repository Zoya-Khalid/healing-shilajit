// ============================================
// ENHANCED FILE: src/pages/Products.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
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
      // Apply SEO titles, review counts, and fix sizes as requested
      const enhancedData = (data || []).map(p => {
        let seoName = p.name;
        let reviewCount = "1.2k";
        let weight = p.weight;

        // Map by price to identify the variants correctly
        if (p.price === 9500 || p.name.includes("20g")) {
          seoName = "Pure Himalayan Shilajit Resin 20g | 40 Servings | PCSIR Certified";
          reviewCount = "12k";
          weight = "20g";
        } else if (p.price === 11200 || p.name.includes("30g")) {
          seoName = "Himalayan Shilajit Resin 30g | 60 Servings | Lab Tested Pure Resin";
          reviewCount = "14k";
          weight = "30g";
        } else if (p.price === 16900 || p.name.includes("50g")) {
          seoName = "Premium Himalayan Shilajit Resin 50g | 100 Servings | High Potency Natural Resin";
          reviewCount = "15k";
          weight = "50g";
        }

        return {
          ...p,
          name: seoName,
          review_count: reviewCount,
          weight: weight,
          image_url: "/images/products/shilajit-jar-main.png",
          hover_image_url: "/images/products/shilajit-infographic-main.jpg"
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
    </div>
  );
}
