// ============================================
// FIXED FILE: src/components/admin/AdminLayout.jsx
// Removed duplicate Mail import
// ============================================
import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, MessageSquare, Mail, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabase";

export default function AdminLayout() {
  const location = useLocation();
  const { signOut, profile } = useAuthStore();
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  // Redirect non-admins
  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    // Load new messages count
    const loadNewMessages = async () => {
      const { count } = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new");

      setNewMessagesCount(count || 0);
    };

    loadNewMessages();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("new_messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => {
        loadNewMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { name: "Messages", href: "/admin/messages", icon: Mail, badge: newMessagesCount },
    { name: "Notifications", href: "/admin/notifications", icon: Mail },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/admin") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-[56px] bg-gray-900 text-white flex items-center justify-between px-4 z-[201] shadow-lg">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          {isMenuOpen ? <X className="h-6 w-6 transition-transform" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar / Mobile Dropdown */}
      <div className={`
        fixed bg-gray-900 text-white z-[200] transition-all duration-300
        max-md:top-[56px] max-md:left-0 max-md:w-full max-md:overflow-hidden
        ${isMenuOpen ? "max-md:max-h-screen" : "max-md:max-h-0"}
        md:w-64 md:min-h-screen md:left-0 md:top-0
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <nav className="mt-6 max-md:mt-0 max-md:pb-4 max-md:bg-gray-950">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-6 py-3 max-md:!py-[12px] max-md:!px-[16px] hover:bg-gray-800 transition-colors ${isActive(item.href) ? "bg-gray-800 border-l-4 border-[#8B4513]" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 max-md:!h-[18px] max-md:!w-[18px]" />
                  <span className="max-md:!text-[14px]">{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center max-md:!text-[10px] max-md:!w-[18px] max-md:!h-[18px] max-md:!p-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="px-6 py-4 md:mt-2">
            <button
              onClick={signOut}
              className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-300
        md:ml-64 p-8 max-md:!p-0 max-md:!pt-[56px] max-md:!px-[14px]
      `}>
        <div className="max-w-7xl mx-auto py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
