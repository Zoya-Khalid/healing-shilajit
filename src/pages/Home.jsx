// ============================================
// UPDATED FILE: src/pages/Home.jsx
// Removed Featured Products
// Added Benefits of Shilajit Section
// ============================================
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Award, Truck, Shield, Star, CheckCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/products/ProductCard";

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "/mountain-1.jpg",
      eyebrow: "SOURCED ABOVE THE CLOUDS",
      titleWhite: "Ancient",
      titleGold: "Purity",
      tagline: "Hand-harvested  ·  Glacier-purified  ·  Sun-dried",
      cta: "DISCOVER THE ORIGIN",
    },
    {
      image: "/mountain-2.jpg",
      eyebrow: "FORGED BY THE HIMALAYAS",
      titleWhite: "Raw",
      titleGold: "Power",
      tagline: "Million-year minerals  ·  100% Natural  ·  Lab Tested",
      cta: "EXPLORE THE RANGE",
    },
    {
      image: "/mountain-3.avif",
      eyebrow: "NATURE'S FINEST GIFT",
      titleWhite: "Eternal",
      titleGold: "Vitality",
      tagline: "Boost Energy  ·  Heal Joints  ·  Elevate Performance",
      cta: "SHOP COLLECTION",
    },
  ];
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const reviewsContainerRef = useRef(null);

  const featureDetails = {
    "Lab Tested": {
      title: "PCSIR Certified",
      detail: "Our Shilajit is certified for purity and potency by PCSIR (Pakistan Council of Scientific and Industrial Research), one of Pakistan's top testing laboratories. Every batch is tested for heavy metals, microbial contamination, and active compound levels.",
    },
    "100% Natural": {
      title: "Pure & Natural",
      detail: "Our Shilajit contains zero additives, fillers, or heavy metals. It is raw, unprocessed resin sourced directly from high-altitude Himalayan rocks and sun-dried naturally to preserve all minerals and fulvic acid.",
    },
    "Free Shipping": {
      title: "Free Express Shipping",
      detail: "We offer complimentary express shipping on all orders across Pakistan. Orders are dispatched within 24 hours and delivered within 2-4 business days.",
    },
    "Top Rated": {
      title: "Loved by Thousands",
      detail: "Trusted by thousands of customers across Pakistan and worldwide. Our customers report increased energy, better focus, and improved stamina within weeks of consistent use.",
    },
    "Trusted Products": {
      title: "Professionally Trusted",
      detail: "Our products are recommended by health professionals and used by athletes, executives, and wellness enthusiasts. We maintain strict quality control at every step from sourcing to delivery.",
    },
  };

  const reviews = [
    {
      name: "Fawad Khan",
      text: "maine apne father k liye purchase kiya tha aur unko boht positive effect hua ha. joints and back pain khatam in a week. Very impressed with the quality",
      rating: 5,
    },
    {
      name: "Danish Rafiq",
      text: "Beautiful Packaging and excellent quality. You can feel its purify and effectiveness with the very first use. Highly recommended",
      rating: 5,
    },
    {
      name: "Zain Malik",
      text: "Best Shilajit brand in town. Tired of using fake ones finally got the real deal. It helped me feel more active and focused throughout the day. Definitely worth trying.",
      rating: 5,
    },
    {
      name: "Ayesha Malik",
      text: "Apny husband k liye order kiya tha. Yaqeen nahi aa raha k ye itna effective ha. uski performance 10 x increase huvi ha. Highly recommended",
      rating: 5,
    },
    {
      name: "Abdul Basit",
      text: "Premium quality at its finest. Tried both of their products. Shilajit Resin and Honey Shilajit . Both were perfect. Recommend Honey shilajit more.",
      rating: 5,
    },
  ];
  const allReviews = [...dynamicReviews, ...reviews];

  const featuredProducts = [
    {
      id: "shilajit-resin-premium",
      name: "Premium Himalayan Shilajit Resin",
      price: 18500,
      image_url: "/images/products/shilajit-resin.jpg",
      hover_image_url: "/images/products/shilajit-nutrition.jpg",
      category: "Pure Resin",
      weight: "30g",
      servings: 150,
      stock: 50,
    },
    {
      id: "shilajit-honey-blend",
      name: "Gold Grade Shilajit Honey",
      price: 12500,
      image_url: "/images/products/shilajit-resin.jpg",
      hover_image_url: "/images/products/shilajit-nutrition.jpg",
      category: "Honey Blend",
      weight: "250g",
      servings: 50,
      stock: 30,
    },
    {
      id: "shilajit-capsules",
      name: "Potent Shilajit Capsules",
      price: 9500,
      image_url: "/images/products/shilajit-resin.jpg",
      hover_image_url: "/images/products/shilajit-nutrition.jpg",
      category: "Capsules",
      weight: "60 Capsules",
      servings: 60,
      stock: 100,
    },
    {
      id: "shilajit-extract",
      name: "Liquid Shilajit Extract",
      price: 15000,
      image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600",
      category: "Liquid",
      weight: "50ml",
      servings: 100,
      stock: 25,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);

    let isTouching = false;
    let lastUserTouch = 0;

    const handleTouchStart = () => {
      isTouching = true;
      lastUserTouch = Date.now();
    };
    const handleTouchEnd = () => {
      isTouching = false;
      lastUserTouch = Date.now();
    };

    const containerNode = reviewsContainerRef.current;
    if (containerNode) {
      containerNode.addEventListener("touchstart", handleTouchStart, { passive: true });
      containerNode.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    const reviewTimer = setInterval(() => {
      if (reviewsContainerRef.current && window.innerWidth <= 767) {
        // Pause auto-scroll if user is currently swiping or swiped recently
        if (isTouching || Date.now() - lastUserTouch < 4000) return;

        const container = reviewsContainerRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = container;

        // Loop back to start
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll dynamically by exact node size
          const firstCard = container.firstElementChild;
          const pushWidth = firstCard ? firstCard.offsetWidth + 12 : window.innerWidth * 0.85 + 12;
          container.scrollBy({ left: pushWidth, behavior: "smooth" });
        }
      }
    }, 3000);

    loadFeaturedReviews();
    loadFeaturedProducts();
    return () => {
      clearInterval(timer);
      clearInterval(reviewTimer);
      if (containerNode) {
        containerNode.removeEventListener("touchstart", handleTouchStart);
        containerNode.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).limit(4);

      if (error) throw error;
      // Enhance database products with local images/hover images for demo
      const enhancedData = data.map((p) => {
        const localJar = "/images/products/shilajit-resin.jpg";
        const localNutrition = "/images/products/shilajit-nutrition.jpg";

        return {
          ...p,
          // Swapped assignments to fix "opposite" order
          image_url: localNutrition,
          hover_image_url: localJar,
        };
      });
      setDynamicProducts(enhancedData);
    } catch (err) {
      console.error("Error fetching featured products:", err);
    }
  };

  const loadFeaturedReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          profiles (full_name)
        `,
        )
        .eq("show_on_home", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedReviews = (data || []).map((r) => ({
        name: r.profiles?.full_name || "Anonymous",
        text: r.comment,
        rating: r.rating,
        isDynamic: true,
      }));

      setDynamicReviews(formattedReviews);
    } catch (err) {
      console.error("Error fetching featured reviews:", err);
    }
  };

  // Redirect admins to dashboard
  useEffect(() => {
    if (profile?.role === "admin") {
      navigate("/admin");
    }
  }, [profile, navigate]);

  // Don't render anything for admins (they'll be redirected)
  if (profile?.role === "admin") {
    return null;
  }

  const benefits = [
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
    },
  ];

  return (
    <div className="pb-20 max-md:!pb-0 mt-[50px] md:mt-[72px]">
      {/* Announcement Banner */}
      <div className="bg-[#D4AF37] h-[32px] md:h-[40px] flex items-center overflow-hidden border-b border-black/5">
        <div className="animate-marquee-banner whitespace-nowrap">
          <span className="text-black font-bold text-[11px] md:text-[14px] uppercase tracking-wider">
            Buy 2 Get 1 FREE — Limited Time Offer! &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; Free Shipping on All Orders Across Pakistan &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; 100% Natural Himalayan Shilajit &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; Buy 2 Get 1 FREE — Limited Time Offer! &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; Free Shipping on All Orders Across Pakistan &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; 100% Natural Himalayan Shilajit &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; 
          </span>
          <span className="text-black font-bold text-[11px] md:text-[14px] uppercase tracking-wider">
            Buy 2 Get 1 FREE — Limited Time Offer! &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; Free Shipping on All Orders Across Pakistan &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; 100% Natural Himalayan Shilajit &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; Buy 2 Get 1 FREE — Limited Time Offer! &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; Free Shipping on All Orders Across Pakistan &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; 100% Natural Himalayan Shilajit &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; 
          </span>
        </div>
      </div>

      {/* Hero Section - Cinematic Mountain Slider */}
      <section className="relative w-full h-[60vh] md:h-screen min-h-[400px] md:min-h-[500px] max-h-[900px] overflow-hidden bg-black">
        {/* Slide backgrounds */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark gradient overlay - heavier at bottom and top */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          </div>
        ))}

        {/* Centered Text Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
          {/* Eyebrow text */}
          <p
            key={`eyebrow-${currentSlide}`}
            className="text-[#D4AF37] text-[10px] sm:text-sm tracking-[0.3em] uppercase font-medium mb-2 md:mb-4 animate-fade-in-up"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          >
            {heroSlides[currentSlide].eyebrow}
          </p>

          {/* Main title */}
          <h1
            key={`title-${currentSlide}`}
            className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-2 md:mb-4 animate-fade-in-up animation-delay-200"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            <span className="text-white">{heroSlides[currentSlide].titleWhite} </span>
            <span className="text-[#D4AF37]">{heroSlides[currentSlide].titleGold}</span>
          </h1>

          {/* Tagline */}
          <p
            key={`tagline-${currentSlide}`}
            className="text-white/80 text-[9px] sm:text-base tracking-widest mb-6 md:mb-8 animate-fade-in-up animation-delay-400"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          >
            {heroSlides[currentSlide].tagline}
          </p>

          {/* CTA Button */}
          <Link
            key={`cta-${currentSlide}`}
            to="/products"
            className="animate-fade-in-up animation-delay-400"
          >
            <button className="border border-[#D4AF37] text-white text-[10px] sm:text-sm tracking-[0.25em] uppercase px-4 py-2 md:px-8 md:py-3 hover:bg-[#D4AF37] hover:text-black transition-all duration-300 font-medium">
              {heroSlides[currentSlide].cta}
            </button>
          </Link>
        </div>

        {/* Left Arrow */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-white/40 text-white flex items-center justify-center hover:bg-white/20 transition-all duration-300 text-lg"
          aria-label="Previous slide"
        >
          ‹
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-white/40 text-white flex items-center justify-center hover:bg-white/20 transition-all duration-300 text-lg"
          aria-label="Next slide"
        >
          ›
        </button>

        {/* Slide counter top right */}
        <div className="absolute top-6 right-6 z-20 text-white/50 text-xs tracking-widest">
          {String(currentSlide + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-[3px] rounded-full transition-all duration-500 ${currentSlide === idx ? "bg-[#D4AF37] w-8" : "bg-white/40 w-4 hover:bg-white/70"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Main Content Container */}
      <div className="pt-20 px-[12px] md:px-4 max-w-[1600px] mx-auto space-y-20 max-md:!space-y-0 max-md:!pt-0 max-md:!pb-[24px]">
        {/* Features */}
        <section className="flex overflow-x-auto pb-4 gap-4 sm:gap-8 snap-x snap-mandatory md:grid md:grid-cols-5 hide-scrollbar max-md:px-[12px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-md:!h-auto max-md:!min-h-0 max-md:!my-0 max-md:!pt-[16px] max-md:!pb-[16px]">
          <div 
            onClick={() => setSelectedFeature("Lab Tested")}
            className="card-white flex flex-col items-center text-center justify-center flex-shrink-0 snap-start transition-all hover:shadow-2xl hover:bg-gray-50 max-md:!rounded-[12px] max-md:!px-[10px] max-md:!py-[12px] max-md:!w-[140px] max-md:!min-w-[140px] max-md:!min-h-0 md:w-auto md:p-10 md:min-h-[320px] cursor-pointer"
          >
            <div className="bg-black rounded-full flex items-center justify-center max-md:w-[36px] max-md:h-[36px] max-md:mb-2 md:w-24 md:h-24 md:mb-8">
              <Award className="text-white max-md:w-[20px] max-md:h-[20px] md:h-12 md:w-12" />
            </div>
            <h3 className="max-md:text-[13px] max-md:font-[600] max-md:mb-1 md:font-bold md:text-2xl md:mb-4">Lab Tested</h3>
            <p className="text-gray-500 max-md:text-[11px] max-md:leading-tight md:text-lg">Certified for purity and potency by top USA labs.</p>
          </div>

          <div 
            onClick={() => setSelectedFeature("100% Natural")}
            className="card-white flex flex-col items-center text-center justify-center flex-shrink-0 snap-start transition-all hover:shadow-2xl hover:bg-gray-50 max-md:!rounded-[12px] max-md:!px-[10px] max-md:!py-[12px] max-md:!w-[140px] max-md:!min-w-[140px] max-md:!min-h-0 md:w-auto md:p-10 md:min-h-[320px] cursor-pointer"
          >
            <div className="bg-black rounded-full flex items-center justify-center max-md:w-[36px] max-md:h-[36px] max-md:mb-2 md:w-24 md:h-24 md:mb-8">
              <Shield className="text-white max-md:w-[20px] max-md:h-[20px] md:h-12 md:w-12" />
            </div>
            <h3 className="max-md:text-[13px] max-md:font-[600] max-md:mb-1 md:font-bold md:text-2xl md:mb-4">100% Natural</h3>
            <p className="text-gray-500 max-md:text-[11px] max-md:leading-tight md:text-lg">Pure resin, no additives, fillers, or heavy metals.</p>
          </div>

          <div 
            onClick={() => setSelectedFeature("Free Shipping")}
            className="card-white flex flex-col items-center text-center justify-center flex-shrink-0 snap-start transition-all hover:shadow-2xl hover:bg-gray-50 max-md:!rounded-[12px] max-md:!px-[10px] max-md:!py-[12px] max-md:!w-[140px] max-md:!min-w-[140px] max-md:!min-h-0 md:w-auto md:p-10 md:min-h-[320px] cursor-pointer"
          >
            <div className="bg-black rounded-full flex items-center justify-center max-md:w-[36px] max-md:h-[36px] max-md:mb-2 md:w-24 md:h-24 md:mb-8">
              <Truck className="text-white max-md:w-[20px] max-md:h-[20px] md:h-12 md:w-12" />
            </div>
            <h3 className="max-md:text-[13px] max-md:font-[600] max-md:mb-1 md:font-bold md:text-2xl md:mb-4">Free Shipping</h3>
            <p className="text-gray-500 max-md:text-[11px] max-md:leading-tight md:text-lg">Complimentary express shipping on all orders.</p>
          </div>

          <div 
            onClick={() => setSelectedFeature("Top Rated")}
            className="card-white flex flex-col items-center text-center justify-center flex-shrink-0 snap-start transition-all hover:shadow-2xl hover:bg-gray-50 max-md:!rounded-[12px] max-md:!px-[10px] max-md:!py-[12px] max-md:!w-[140px] max-md:!min-w-[140px] max-md:!min-h-0 md:w-auto md:p-10 md:min-h-[320px] cursor-pointer"
          >
            <div className="bg-black rounded-full flex items-center justify-center max-md:w-[36px] max-md:h-[36px] max-md:mb-2 md:w-24 md:h-24 md:mb-8">
              <Star className="text-white max-md:w-[20px] max-md:h-[20px] md:h-12 md:w-12" />
            </div>
            <h3 className="max-md:text-[13px] max-md:font-[600] max-md:mb-1 md:font-bold md:text-2xl md:mb-4">Top Rated</h3>
            <p className="text-gray-500 max-md:text-[11px] max-md:leading-tight md:text-lg">Loved by thousands of customers worldwide.</p>
          </div>

          <div 
            onClick={() => setSelectedFeature("Trusted Products")}
            className="card-white flex flex-col items-center text-center justify-center flex-shrink-0 snap-start transition-all hover:shadow-2xl hover:bg-gray-50 max-md:!rounded-[12px] max-md:!px-[10px] max-md:!py-[12px] max-md:!w-[140px] max-md:!min-w-[140px] max-md:!min-h-0 md:w-auto md:p-10 md:min-h-[320px] cursor-pointer"
          >
            <div className="bg-black rounded-full flex items-center justify-center max-md:w-[36px] max-md:h-[36px] max-md:mb-2 md:w-24 md:h-24 md:mb-8">
              <Shield className="text-white max-md:w-[20px] max-md:h-[20px] md:h-12 md:w-12" />
            </div>
            <h3 className="max-md:text-[13px] max-md:font-[600] max-md:mb-1 md:font-bold md:text-2xl md:mb-4">Trusted Products</h3>
            <p className="text-gray-500 max-md:text-[11px] max-md:leading-tight md:text-lg">Premium quality products trusted by professionals.</p>
          </div>
        </section>

        {/* Benefits of Shilajit Section */}
        <section className="py-12 max-md:!h-auto max-md:!min-h-0 max-md:!my-0 max-md:!py-[16px]">
          <div className="text-center mb-16 px-4 max-md:!mb-[16px]">
            <div className="inline-block group max-md:flex max-md:flex-col max-md:items-center">
              <h2 className="text-4xl md:text-5xl max-md:!text-[22px] font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4 max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[12px]">Benefits Of Shilajit</h2>
              <div className="w-full h-2 max-md:!h-[4px] max-md:!w-[60px] bg-amber-500 rounded-full md:hidden"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-[12px] md:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group relative bg-black text-white rounded-[12px] md:rounded-[3rem] p-[10px] md:p-8 flex flex-col items-center text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-900/50 border border-gray-800">
                <div className="w-full h-[120px] md:h-48 mb-[10px] md:mb-6 rounded-[10px] md:rounded-[2rem] overflow-hidden border-2 border-white/10 group-hover:border-amber-500/50 transition-all duration-500">
                  <img src={benefit.image} alt={benefit.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-[13px] md:text-2xl font-bold mb-1 md:mb-4 text-amber-500 group-hover:text-amber-400">{benefit.title}</h3>
                <p className="text-gray-300 leading-[1.4] md:leading-relaxed text-[11px] md:text-sm group-hover:text-white transition-colors">{benefit.description}</p>
                <div className="absolute inset-0 rounded-[12px] md:rounded-[3rem] bg-gradient-to-tr from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop Now Section */}
        <section className="pt-4 pb-0 max-md:!h-auto max-md:!min-h-0 max-md:!my-0 max-md:!py-[16px] max-md:-mx-[8px] max-md:px-[8px]">
          <div className="text-center mb-16 px-4 max-md:!mb-[16px]">
            <div className="inline-block group max-md:flex max-md:flex-col max-md:items-center">
              <h2 className="text-4xl md:text-5xl max-md:!text-[22px] font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4 max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[12px]">Shop Now</h2>
              <div className="w-full h-2 max-md:!w-[60px] max-md:!h-[4px] bg-amber-500 rounded-full md:hidden"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 mb-16 max-md:mb-[24px] max-md:items-stretch max-md:[&>*:nth-child(3)]:col-span-full max-md:[&>*:nth-child(3)]:max-w-[calc(50%-4px)] max-md:[&>*:nth-child(3)]:mx-auto">
            {dynamicProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/products" className="max-md:!inline-block max-md:!w-full max-md:!max-w-[200px] max-md:!mx-auto">
              <button className="bg-black text-white px-12 py-4 text-lg font-bold rounded-full hover:bg-gray-900 transition-all shadow-lg hover:scale-105 max-md:!w-full max-md:!block max-md:!text-[14px] max-md:!py-[12px] max-md:!px-[24px] max-md:!mx-auto">View All Products</button>
            </Link>
          </div>
        </section>

        <section className="pt-10 pb-0 overflow-hidden max-md:!h-auto max-md:!min-h-0 max-md:!my-0 max-md:!py-[16px]">
          <div className="text-center mb-16 px-4 max-md:!mb-[16px]">
            <div className="inline-block group max-md:flex max-md:flex-col max-md:items-center">
              <h2 className="text-4xl md:text-5xl max-md:!text-[22px] font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4 max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[12px]">Customer Reviews</h2>
              <div className="w-full h-2 max-md:!w-[60px] max-md:!h-[4px] bg-amber-500 rounded-full md:hidden"></div>
            </div>
          </div>

          <div className="relative">
            <div ref={reviewsContainerRef} className="animate-marquee max-md:animate-none flex max-md:!w-full max-md:items-stretch gap-6 max-md:!gap-[12px] max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:px-[12px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4">
              {/* First set of reviews */}
              {allReviews.map((review, idx) => (
                <div key={`rev-1-${idx}`} className="w-[350px] max-md:!w-[85vw] max-md:!min-w-[85vw] flex-shrink-0 bg-black text-white rounded-[2.5rem] p-8 max-md:!p-[16px] border-2 border-amber-500 shadow-xl transition-all duration-500 hover:scale-105 max-md:snap-center flex flex-col">
                  <div className="flex gap-1 mb-6 max-md:!mb-4 justify-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 max-md:!w-[18px] max-md:!h-[18px] fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm max-md:!text-[13px] max-md:!leading-[1.6] leading-relaxed mb-8 max-md:!min-h-0 max-md:!mb-4 min-h-[80px] text-center">"{review.text}"</p>

                  <div className="text-center mt-auto">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="font-bold text-lg max-md:!text-[14px] max-md:!font-[600] text-amber-500">{review.name}</span>
                      <CheckCircle className="w-5 h-5 max-md:!w-[14px] max-md:!h-[14px] text-amber-500 fill-amber-500/20" />
                    </div>
                    <span className="text-xs max-md:!text-[11px] text-amber-500/80 uppercase tracking-widest font-medium">Verified Purchase</span>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop - Hidden on mobile so scrolling naturally terminates */}
              {allReviews.map((review, idx) => (
                <div key={`rev-2-${idx}`} className="w-[350px] max-md:hidden flex-shrink-0 bg-black text-white rounded-[2.5rem] p-8 border-2 border-amber-500 shadow-xl transition-all duration-500 hover:scale-105">
                  <div className="flex gap-1 mb-6 justify-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-8 min-h-[80px] text-center">"{review.text}"</p>

                  <div className="text-center mt-auto">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="font-bold text-lg text-amber-500">{review.name}</span>
                      <CheckCircle className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                    </div>
                    <span className="text-xs text-amber-500/80 uppercase tracking-widest font-medium">Verified Purchase</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pt-0 pb-20 max-md:!h-auto max-md:!min-h-0 max-md:!my-0 max-md:!py-[16px]">
          <div className="text-center mb-16 px-4 max-md:!mb-[16px]">
            <div className="inline-block group max-md:flex max-md:flex-col max-md:items-center">
              <h2 className="text-4xl md:text-5xl max-md:!text-[22px] font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4 max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[12px]">Frequently Asked Questions</h2>
              <div className="w-full h-2 max-md:!w-[60px] max-md:!h-[4px] bg-amber-500 rounded-full md:hidden"></div>
            </div>
            <p className="text-gray-500 max-w-xl mx-auto mt-6 text-lg max-md:!text-[13px] max-md:!mt-2 max-md:!px-[16px]">Everything you need to know about Healing Shilajit — answered.</p>
          </div>

          <div className="rounded-[3rem] bg-black px-6 md:px-12 py-16 max-md:!rounded-[12px] max-md:!p-[16px] max-md:!mx-[12px]">
            <div className="max-w-3xl mx-auto divide-y divide-white/10">
              {[
                { q: "What is Healing Shilajit?", a: "Healing Shilajit is a pure, mineral-rich resin sourced from the Himalayas at 17,000 feet. It undergoes natural filtration to preserve its full potency, free from additives or heavy metals." },
                { q: "How do I use Shilajit Resin?", a: "Take a pea-sized amount (300–500mg) and dissolve it in warm water, milk, or tea. Consume once daily, preferably in the morning on an empty stomach for best results." },
                { q: "How long until I see results?", a: "Most customers notice improved energy and focus within the first week. For deeper benefits like joint relief, muscle strength, and hormonal support, allow 4–8 weeks of consistent use." },
                { q: "Is Healing Shilajit safe for daily use?", a: "Yes. Our Shilajit is lab-tested and certified pure. It is safe for daily use by healthy adults. If you have an existing medical condition or are on medication, consult your doctor first." },
                { q: "What makes Healing Shilajit different from others?", a: "We source directly from high-altitude Himalayan regions and test every batch in certified USA labs. No fillers, no fakes — just 100% authentic, potent Shilajit resin." },
                { q: "Do you offer free shipping?", a: "Yes! We offer free express shipping on all orders nationwide, with tracking provided once your order is dispatched." },
              ].map((item, i) => (
                <div key={i}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center py-6 text-left gap-4 group max-md:!items-start max-md:!py-[14px] max-md:!gap-[12px]">
                    <span className={`text-white transition-colors md:font-semibold md:text-2xl max-md:!text-[14px] max-md:!font-[500] max-md:!leading-[1.4] ${openFaq === i ? "!text-amber-400" : ""}`}>{item.q}</span>
                    <span className={`text-amber-500 text-3xl font-light flex-shrink-0 transition-transform duration-300 max-md:!text-[18px] max-md:!leading-none max-md:!mt-[2px] ${openFaq === i ? "rotate-45" : "rotate-0"}`}>+</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ${openFaq === i ? "max-h-60 pb-6 max-md:!pb-0 max-md:!pt-[8px]" : "max-h-0"}`}>
                    <p className="text-gray-400 leading-relaxed text-xl max-md:!text-[13px] max-md:!leading-[1.6] max-md:!pb-[14px]">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Feature Modal */}
      {selectedFeature && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedFeature(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
          
          {/* Modal Content */}
          <div 
            className="relative bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl animate-scale-in max-md:w-[90vw] max-md:rounded-[1.5rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedFeature(null)}
              className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="p-8 sm:p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <h2 className="text-3xl font-serif font-bold text-black mb-6 border-b-4 border-[#D4AF37] pb-2 inline-block max-md:text-2xl">
                {featureDetails[selectedFeature].title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed max-md:text-base">
                {featureDetails[selectedFeature].detail}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
