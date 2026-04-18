// ============================================
// UPDATED FILE: src/components/layout/Header.jsx
// Redirect admins to dashboard after login
// ============================================
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const itemCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));

  // 🆕 Redirect admin to dashboard when they log in
  useEffect(() => {
    if (user && profile?.role === "admin") {
      const currentPath = window.location.pathname;
      // Only redirect if they're on the home page or login page
      if (currentPath === "/" || currentPath === "/login") {
        navigate("/admin");
      }
    }
  }, [user, profile, navigate]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="bg-black/95 backdrop-blur-lg text-white border-b border-white/10 max-md:!px-[12px] max-md:!py-[8px] md:px-8 md:py-4 max-md:!h-[50px] w-full flex justify-between items-center transition-all duration-300">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <img src="/logo.png" alt="Herbveda Shilajit" className="max-md:!max-w-[90px] max-md:!max-h-[38px] md:h-10 object-contain" />
        </Link>

        {/* Desktop Navigation - Hide for admins */}
        {profile?.role !== "admin" && (
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        )}

        {/* Admin Navigation */}
        {profile?.role === "admin" && (
          <nav className="hidden md:flex space-x-8">
            <Link to="/admin" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Admin Dashboard
            </Link>
          </nav>
        )}

        {/* Right side icons */}
        <div className="flex items-center gap-[8px] md:gap-6 shrink-0">
          {/* Hide cart for admins */}
          {profile?.role !== "admin" && (
            <Link to="/cart" className="relative group flex items-center">
              <ShoppingCart className="h-5 w-5 max-md:!h-[20px] max-md:!w-[20px] text-gray-300 group-hover:text-white transition-colors" />
              {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">{itemCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <User className="h-5 w-5" />
                <span className="hidden md:block text-sm font-medium">{profile?.full_name || "Account"}</span>
              </button>
              <div className="absolute right-0 pt-4 w-48 hidden group-hover:block z-50">
                <div className="bg-black/90 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl py-2 overflow-hidden">
                  {profile?.role !== "admin" && (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Orders
                      </Link>
                    </>
                  )}
                  {profile?.role === "admin" && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full max-md:!px-[12px] max-md:!py-0 max-md:!h-[32px] max-md:!text-[12px] max-md:!rounded-[20px] max-md:!w-auto hover:bg-gray-200 transition-colors flex items-center justify-center shrink-0">
              Sign In
            </Link>
          )}

          {/* Mobile menu button - Hide for admins */}
          {profile?.role !== "admin" && (
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white flex items-center">
              {isMenuOpen ? <X className="max-md:!h-[20px] max-md:!w-[20px]" /> : <Menu className="max-md:!h-[20px] max-md:!w-[20px]" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu - Only show for non-admins */}
      {isMenuOpen && profile?.role !== "admin" && (
        <div className="absolute top-[52px] right-[12px] z-[100] w-[180px]">
          <div className="bg-black/95 backdrop-blur-md rounded-[10px] py-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-[16px] py-[10px] text-[14px] font-medium text-gray-200 hover:bg-white/10 transition-colors ${
                  index !== navigation.length - 1 ? "border-b border-white/10" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
