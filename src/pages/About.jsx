// ============================================
// REDESIGNED FILE: src/pages/About.jsx
// ============================================
import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  const features = [
    {
      title: (
        <>
          Lab <span className="text-amber-600">Tested</span>
        </>
      ),
      description: "Verified for purity, safety, and mineral richness.",
      image: "/feature-1.jpg", // Lab Icon
    },
    {
      title: (
        <>
          Sun-<span className="text-amber-600">Dried</span>
        </>
      ),
      description: "Preserves strength, nutrients, and potency.",
      image: "/feature-2.jpg", // Sun Icon
    },
    {
      title: (
        <>
          Hand-<span className="text-amber-600">Harvested</span>
        </>
      ),
      description: "Collected at 17000+ feet in the mountains",
      image: "/feature-3.jpg", // Shovel Icon
    },
    {
      title: (
        <>
          Chemical-<span className="text-amber-600">Free</span>
        </>
      ),
      description: "No additives, fillers, or harmful processing",
      image: "/feature-4.jpg", // No Chemical Icon
    },
    {
      title: (
        <>
          Gilgit-<span className="text-amber-600">Baltistan</span> Sourced
        </>
      ),
      description: "Harvested from pristine Himalayan heights",
      image: "/feature-5.jpg", // Mountain Icon
    },
    {
      title: (
        <>
          100% <span className="text-amber-600">Pure & Natural</span>
        </>
      ),
      description: "Raw, potent, and completely unrefined.",
      image: "/feature-6.jpg", // Pure Icon
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero / Intro Section */}
      <section className="bg-black text-white pt-24 pb-20 overflow-hidden max-md:!pt-[80px] max-md:!pb-[16px] max-md:!px-[12px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 max-md:!px-0">
          {/* Mobile-only heading above the side-by-side layout */}
          <h1 className="hidden max-md:!block max-md:!text-[22px] max-md:!font-[700] font-serif max-md:!text-center max-md:!mb-[10px] max-md:!px-[12px]">
            About <span className="text-[#D4AF37]">Us</span>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-md:!flex max-md:!flex-col max-md:!gap-0 max-md:!items-start">
            {/* Left Image */}
            <div className="relative group max-md:!w-full max-md:!flex-shrink-0 max-md:!mb-[12px] max-md:!px-[12px]">
              <div className="relative z-10 rounded-[3rem] overflow-hidden border-2 border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] max-md:!rounded-[12px] max-md:!h-[220px]">
                <img
                  src="/about-hero-new.jpg"
                  alt="About Us Hero"
                  className="w-full h-full object-cover aspect-[4/5] object-center max-md:!h-[220px]"
                />
              </div>
              <div className="absolute -inset-4 bg-amber-500/10 rounded-[3.5rem] blur-2xl -z-10 group-hover:bg-amber-500/20 transition-all duration-700 max-md:!hidden"></div>
            </div>

            {/* Right Content */}
            <div className="space-y-8 pl-0 lg:pl-10 max-md:!w-full max-md:!space-y-[10px] max-md:!px-[12px]">

              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight max-md:!hidden">
                About <span className="text-[#D4AF37]">Us</span>
              </h1>

              <div className="space-y-6 text-gray-300 text-lg leading-relaxed max-w-xl max-md:!space-y-[10px] max-md:!text-[13px] max-md:!leading-[1.6]">
                <p>
                  Welcome to Herbveda, where ancient herbal wisdom meets contemporary wellness. We are committed to bringing you the most authentic and potent herbal products to support your health and wellbeing from the inside out.
                </p>
                <p>
                  Our story began with a deeply rooted belief that nature already has the answers. In a world flooded with artificial ingredients and quick fixes, Herbveda stands apart by going back to the source. From handpicking the finest herbs to ensuring every product meets the highest standards of purity and potency, our commitment to genuine natural wellness is present in everything we create.
                </p>
              </div>

              <div className="pt-4 max-md:!pt-[8px] max-md:!text-center">
                <Link to="/products" className="max-md:!inline-block max-md:!w-auto">
                  <button className="bg-[#D4AF37] hover:bg-[#B8962E] text-black px-10 py-4 font-bold rounded-full tracking-widest uppercase shadow-xl transition-all hover:scale-105 active:scale-95 max-md:!text-[12px] max-md:!px-[20px] max-md:!py-0 max-md:!h-[36px] max-md:!rounded-[20px] max-md:!w-auto max-md:!inline-block max-md:!mt-[8px]">
                    Explore Shop
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white max-md:!px-[12px] max-md:!py-[16px] max-md:!mt-[32px]">
        <div className="text-center mb-16 max-md:!mb-[4px]">
          <h2 className="text-5xl md:text-6xl font-serif font-bold inline-block border-b-8 border-amber-600 pb-4 tracking-tight max-md:!text-[22px] max-md:!pb-0 max-md:!border-b-0 max-md:!pt-[8px]">
            Why Choose Us
          </h2>
          <div className="hidden max-md:!block max-md:!w-[60px] max-md:!h-[4px] max-md:!bg-amber-600 max-md:!rounded-full max-md:!mx-auto max-md:!mt-0 max-md:!mb-[16px]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-md:!grid-cols-2 max-md:!gap-[12px]">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center group border-2 border-black rounded-[2rem] p-4 hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-300 bg-white max-md:!rounded-[12px] max-md:!p-[12px_8px]">
              {/* Image Container */}
              <div className="w-64 h-64 mb-6 rounded-[2rem] overflow-hidden transition-all duration-300 max-md:!w-[60px] max-md:!h-[60px] max-md:!mb-[8px] max-md:!rounded-[8px]">
                <img
                  src={feature.image}
                  alt="Feature"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 text-black max-md:!text-[13px] max-md:!font-[600] max-md:!mb-[4px]">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 max-w-xs mx-auto text-sm leading-relaxed max-md:!text-[11px] max-md:!leading-[1.4]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Story Section */}
      <section className="bg-white py-12 overflow-hidden max-md:!py-[20px] max-md:!px-[16px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Image */}
            <div className="relative group order-1 lg:order-1">
              <div className="relative z-10 rounded-[3rem] overflow-hidden border-2 border-black/5 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                <img
                  src="/images/about/himalayan-legacy.jpg"
                  alt="Himalayan Legacy"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
              <div className="absolute -inset-4 bg-amber-500/5 rounded-[3.5rem] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            </div>

            {/* Right Content */}
            <div className="space-y-8 order-2 lg:order-2 max-md:!space-y-0">
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-black leading-[1.1] tracking-tight max-md:!text-[26px] max-md:!leading-[1.3] max-md:!mb-[12px]">
                A Himalayan Legacy, <span className="text-amber-600 italic max-md:!text-[26px]">Refined.</span>
              </h2>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed max-md:!space-y-0">
                <p className="max-md:!text-[13px] max-md:!leading-[1.7] max-md:!mb-[12px]">
                  Our journey was born from a singular pursuit: to source the world’s finest Shilajit. This quest led us deep into the heart of Gilgit and Skardu, where we met local artisans who have spent generations sun-drying this potent earth-mineral to perfection.
                </p>
                <p className="max-md:!text-[13px] max-md:!leading-[1.7] max-md:!mb-[12px]">
                  Leveraging decades of pharmaceutical expertise, we recognized that the purest ingredients deserve world-class protection. We didn't just want to sell a product; we wanted to build a global standard.
                </p>
                <p className="max-md:!text-[13px] max-md:!leading-[1.7] max-md:!mb-[12px]">
                  By combining ancient tradition with premium, compliant packaging, we transformed a raw gift of nature into an international brand. Our vision of quality and sustainability was realized in just four months—bringing the power of the Himalayas to the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* How to Use Section */}
      <div className="bg-white pt-8 pb-24 max-md:!mt-0 max-md:!pt-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 max-md:!px-[12px]">
          <div className="text-center mb-24 max-md:!mb-[16px]">
            <h2 className="text-6xl md:text-7xl font-serif font-bold inline-block border-b-8 border-amber-600 pb-4 tracking-tight max-md:!text-[22px] max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[16px]">How to Use</h2>
            <div className="hidden max-md:!block max-md:!w-[60px] max-md:!h-[4px] max-md:!bg-amber-600 max-md:!rounded-full max-md:!mx-auto max-md:!mt-0 max-md:!mb-[16px]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 max-md:!grid-cols-2 max-md:!gap-[12px] max-md:[&>*:nth-child(3)]:col-span-full max-md:[&>*:nth-child(3)]:max-w-[50%] max-md:[&>*:nth-child(3)]:mx-auto">
            {[
              {
                title: "Shilajit Resin",
                description: "Take a pea-sized amount (250-500 mg), dissolve in warm water or milk, and use daily in the morning or before bed",
                image: "/images/about/how-to-use-resin.jpg"
              },
              {
                title: "Shilajit Drops",
                description: "Take 5-10 drops in water or milk, drink once or twice daily in the morning and before bed",
                image: "/images/about/how-to-use-drops.jpg"
              },
              {
                title: "Honey Shilajit",
                description: "Take one sachet daily with warm water, milk or tear and suck directly. Take every morning on an empty stomach or before bed",
                image: "/images/about/about-how-to-use.png"
              }
            ].map((method, index) => (
              <div
                key={index}
                className="group relative bg-black text-white rounded-[3rem] p-8 md:p-10 w-full flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(212,175,55,0.2)] border border-white/10 max-md:!p-[10px] max-md:!rounded-[12px]"
              >
                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-bold mb-8 text-amber-500 group-hover:text-amber-400 transition-colors max-md:!text-[13px] max-md:!font-[600] max-md:!mb-[8px]">
                  {method.title}
                </h3>

                {/* Image */}
                <div className="w-full max-w-md aspect-square mb-10 rounded-3xl overflow-hidden border-2 border-white/5 group-hover:border-amber-500/30 transition-all duration-500 max-md:!h-[130px] max-md:!mb-0 max-md:!rounded-[10px] max-md:!aspect-auto">
                  <img
                    src={method.image}
                    alt={method.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed text-lg md:text-xl group-hover:text-white transition-colors max-md:!text-[11px] max-md:!leading-[1.5] max-md:!mt-[8px]">
                  {method.description}
                </p>

                {/* Decorative Glow */}
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none max-md:!rounded-[12px]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
