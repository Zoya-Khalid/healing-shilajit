// ============================================
// FILE: src/components/layout/Footer.jsx
// ============================================
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20 rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] max-md:!rounded-t-[12px] max-md:!mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 max-md:!px-[16px] max-md:!py-[20px]">
        {/* Desktop: 4-column grid | Mobile: brand + 3-col row + copyright */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-md:!block">
          
          {/* Brand Section — full width on mobile */}
          <div className="max-md:!border-b max-md:border-white/10 max-md:!pb-[12px] max-md:!mb-[12px]">
            <h3 className="text-lg font-bold mb-4 max-md:!text-[13px] max-md:!font-[600] max-md:!mb-[6px]">Herbveda Shilajit</h3>
            <p className="text-gray-400 text-sm max-md:!text-[12px] max-md:!leading-[1.5]" style={{ color: 'rgba(255,255,255,0.7)' }}>Premium quality Himalayan Shilajit sourced from 17,000 feet, lab-tested and certified for purity.</p>
          </div>

          {/* Quick Links + Customer Service + Contact Us — 3 column grid on mobile */}
          <div className="contents max-md:!grid max-md:!grid-cols-3 max-md:!gap-[12px] max-md:!border-b max-md:border-white/10 max-md:!pb-[12px] max-md:!mb-[12px]">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 max-md:!text-[12px] max-md:!font-[600] max-md:!mb-[6px]">Quick Links</h3>
              <ul className="space-y-2 max-md:!space-y-0">
                <li>
                  <Link to="/products" className="text-gray-400 hover:text-white max-md:!text-[11px] max-md:!py-[2px] max-md:!block">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/certifications" className="text-gray-400 hover:text-white max-md:!text-[11px] max-md:!py-[2px] max-md:!block">
                    Certifications
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white max-md:!text-[11px] max-md:!py-[2px] max-md:!block">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white max-md:!text-[11px] max-md:!py-[2px] max-md:!block">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-bold mb-4 max-md:!text-[12px] max-md:!font-[600] max-md:!mb-[6px]">Customer Service</h3>
              <ul className="space-y-2 max-md:!space-y-0">
                <li>
                  <Link to="/shipping" className="text-gray-400 hover:text-white max-md:!text-[11px] max-md:!py-[2px] max-md:!block">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-gray-400 hover:text-white max-md:!text-[11px] max-md:!py-[2px] max-md:!block">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white max-md:!text-[11px] max-md:!py-[2px] max-md:!block">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white max-md:!text-[11px] max-md:!py-[2px] max-md:!block">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-bold mb-4 max-md:!text-[12px] max-md:!font-[600] max-md:!mb-[6px]">Contact Us</h3>
              <ul className="space-y-2 max-md:!space-y-[2px]">
                <li className="flex items-center space-x-2 max-md:!space-x-0">
                  <Phone className="h-4 w-4 max-md:!w-[12px] max-md:!h-[12px] max-md:!mr-[4px] flex-shrink-0" />
                  <span className="text-gray-400 max-md:!text-[11px]">+92 333 807 1123</span>
                </li>
                <li className="flex items-center space-x-2 max-md:!space-x-0">
                  <Mail className="h-4 w-4 max-md:!w-[12px] max-md:!h-[12px] max-md:!mr-[4px] flex-shrink-0" />
                  <span className="text-gray-400 max-md:!text-[11px] max-md:break-all">support@herbvedashilajit.com</span>
                </li>
              </ul>
              <div className="flex space-x-4 mt-4 max-md:!gap-[10px] max-md:!space-x-0 max-md:!mt-[8px]">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-6 w-6 max-md:!w-[18px] max-md:!h-[18px]" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-6 w-6 max-md:!w-[18px] max-md:!h-[18px]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm max-md:!mt-[12px] max-md:!pt-[12px] max-md:!text-[11px] max-md:!px-[16px]">
          <p>&copy; {new Date().getFullYear()} Herbveda Shilajit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
