// ============================================
// FIXED FILE: src/pages/admin/Dashboard.jsx
// Added Recent Reviews and Messages Display
// ============================================
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { admin, supabase } from "../../lib/supabase";
import { DollarSign, ShoppingBag, Users, Package, Star, MessageSquare, Mail } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Load stats
    const statsData = await admin.getDashboardStats();
    setStats(statsData);

    // Load recent reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select(
        `
        *,
        profiles (full_name, email),
        products (name)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(5);
    setRecentReviews(reviews || []);

    // Load recent orders
    const { data: orders } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles (full_name, email)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(5);
    setRecentOrders(orders || []);

    setLoading(false);
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: `Rs.${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Package,
      color: "bg-yellow-500",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  return (
    <div className="max-md:!px-0">
      <h1 className="text-3xl font-bold mb-8 max-md:!text-[20px] max-md:!mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-md:!grid-cols-2 max-md:!gap-[12px] max-md:!mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 max-md:!text-[12px] max-md:!mb-0">{stat.title}</p>
                  <p className="text-3xl font-bold max-md:!text-[20px] max-md:!font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full max-md:!p-[8px]`}>
                  <Icon className="h-6 w-6 text-white max-md:!h-[20px] max-md:!w-[20px]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[14px] max-md:!rounded-[12px]">
          <div className="flex justify-between items-center mb-4 max-md:!mb-3">
            <h2 className="text-xl font-bold flex items-center gap-2 max-md:!text-[15px]">
              <ShoppingBag className="h-5 w-5 text-[#8B4513] max-md:!h-[18px] max-md:!w-[18px]" />
              Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-[#8B4513] hover:underline text-sm max-md:!text-[12px]">
              View All →
            </Link>
          </div>

          <div className="space-y-3 max-md:!space-y-0">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="border-b pb-3 last:border-0 max-md:!py-[10px] max-md:!border-b-[#f0f0f0]">
                  <div className="flex justify-between items-start max-md:!flex-wrap max-md:!gap-[6px]">
                    <div className="max-md:!flex-1 max-md:!min-w-[140px]">
                      <p className="font-semibold text-sm max-md:!text-[11px] max-md:!font-semibold">{order.order_number}</p>
                      <p className="text-xs text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">{order.profiles?.full_name}</p>
                      <p className="text-xs text-gray-500 max-md:!text-[10px]">{format(new Date(order.created_at), "MMM d, h:mm a")}</p>
                    </div>
                    <div className="text-right max-md:!text-left max-md:!w-full max-md:!flex max-md:!justify-between max-md:!items-center">
                      <p className="font-bold text-[#8B4513] max-md:!text-[12px] max-md:!font-semibold">Rs.{parseFloat(order.total_amount).toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)} max-md:!text-[10px] max-md:!px-[8px] max-md:!py-[2px] max-md:!rounded-[20px]`}>{order.status}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 max-md:!text-[13px]">No recent orders</p>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[14px] max-md:!rounded-[12px]">
          <div className="flex justify-between items-center mb-4 max-md:!mb-3">
            <h2 className="text-xl font-bold flex items-center gap-2 max-md:!text-[15px]">
              <Star className="h-5 w-5 text-yellow-500 max-md:!h-[18px] max-md:!w-[18px]" />
              Recent Reviews
            </h2>
            <Link to="/admin/reviews" className="text-[#8B4513] hover:underline text-sm max-md:!text-[12px]">
              View All →
            </Link>
          </div>

          <div className="space-y-3 max-md:!space-y-0">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => (
                <div key={review.id} className="border-b pb-3 last:border-0 max-md:!py-[10px] max-md:!border-b-[#f0f0f0]">
                  <div className="flex items-start gap-2 max-md:!gap-3">
                    <div className="flex text-yellow-400 mt-1 max-md:!mt-0">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current max-md:!h-[14px] max-md:!w-[14px]" />
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm max-md:!text-[13px] max-md:!font-semibold">{review.profiles?.full_name}</p>
                      <p className="text-xs text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">{review.products?.name}</p>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2 max-md:!text-[12px] max-md:!leading-[1.5]">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-1 max-md:!text-[10px]">{format(new Date(review.created_at), "MMM d, yyyy")}</p>
                      {!review.admin_response && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded mt-1 inline-block max-md:!text-[10px] max-md:!px-[8px] max-md:!py-[2px]">Needs Response</span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 max-md:!text-[13px]">No reviews yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[14px] max-md:!rounded-[12px]">
        <h2 className="text-xl font-bold mb-4 max-md:!text-[15px] max-md:!mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-md:!gap-[10px]">
          <Link to="/admin/products" className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-[#8B4513] hover:bg-amber-50 transition-all max-md:!p-[12px] max-md:!rounded-[10px]">
            <Package className="h-8 w-8 text-[#8B4513] mb-2 max-md:!h-[28px] max-md:!w-[28px] max-md:!mb-[6px]" />
            <span className="font-semibold text-sm max-md:!text-[12px]">Add Product</span>
          </Link>

          <Link to="/admin/orders" className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-[#8B4513] hover:bg-amber-50 transition-all max-md:!p-[12px] max-md:!rounded-[10px]">
            <ShoppingBag className="h-8 w-8 text-[#8B4513] mb-2 max-md:!h-[28px] max-md:!w-[28px] max-md:!mb-[6px]" />
            <span className="font-semibold text-sm max-md:!text-[12px]">View Orders</span>
          </Link>

          <Link to="/admin/reviews" className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-[#8B4513] hover:bg-amber-50 transition-all max-md:!p-[12px] max-md:!rounded-[10px]">
             <MessageSquare className="h-8 w-8 text-[#8B4513] mb-2 max-md:!h-[28px] max-md:!w-[28px] max-md:!mb-[6px]" />
            <span className="font-semibold text-sm max-md:!text-[12px]">Manage Reviews</span>
          </Link>

          <Link to="/admin/customers" className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-[#8B4513] hover:bg-amber-50 transition-all max-md:!p-[12px] max-md:!rounded-[10px]">
            <Users className="h-8 w-8 text-[#8B4513] mb-2 max-md:!h-[28px] max-md:!w-[28px] max-md:!mb-[6px]" />
            <span className="font-semibold text-sm max-md:!text-[12px]">View Customers</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
