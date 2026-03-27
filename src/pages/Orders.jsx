// ============================================
// FILE: src/pages/Orders.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { db } from "../lib/supabase";
import { Package } from "lucide-react";
import { format } from "date-fns";

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await db.getUserOrders(user.id);
    setOrders(data || []);
    setLoading(false);
  };

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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600">Start shopping to see your orders here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      <div className="text-center mb-16 px-4 max-md:!mb-[16px]">
        <div className="inline-block group max-md:flex max-md:flex-col max-md:items-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4 max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[12px]">My Orders</h1>
          <div className="w-full h-2 max-md:!h-[4px] max-md:!w-[60px] bg-amber-500 rounded-full md:hidden"></div>
        </div>
      </div>

      <div className="space-y-4 max-md:!space-y-0 max-md:!flex max-md:!flex-col max-md:!gap-[12px] max-md:!mt-2 max-md:!pb-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6 max-md:!p-[14px] max-md:!rounded-[12px] max-md:!mx-[14px] max-md:!shadow-sm">
            <div className="flex justify-between items-start mb-4 max-md:!mb-2">
              <div>
                <h3 className="font-bold max-md:!text-[13px] max-md:!font-bold max-md:!leading-tight">Order #{order.order_number}</h3>
                <p className="text-sm text-gray-600 max-md:!text-[11px] max-md:!text-gray-500 max-md:!mt-1">{format(new Date(order.created_at), "MMMM d, yyyy")}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold max-md:!text-[11px] max-md:!px-[10px] max-md:!py-[3px] max-md:!rounded-full max-md:!float-right ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-4 max-md:!mb-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 max-md:!space-x-3">
                  <img src={item.product_image || "https://via.placeholder.com/64"} alt={item.product_name} className="w-16 h-16 object-cover rounded max-md:!w-[50px] max-md:!h-[50px] max-md:!rounded-[8px]" />
                  <div className="flex-grow">
                    <p className="font-semibold max-md:!text-[12px] max-md:!leading-tight">{item.product_name}</p>
                    <p className="text-sm text-gray-600 max-md:!text-[10px]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold max-md:!text-[12px]">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between items-center max-md:!pt-3 max-md:!mt-2 max-md:!text-[13px] max-md:!font-semibold">
              <span className="font-bold max-md:!font-semibold">Total:</span>
              <span className="text-xl font-bold text-black max-md:!text-[13px] max-md:!font-bold">Rs.{order.total_amount}</span>
            </div>

            {order.tracking_number && (
              <div className="mt-4 p-3 bg-blue-50 rounded max-md:!mt-3 max-md:!p-[10px] max-md:!rounded-[8px]">
                <p className="text-sm max-md:!text-[11px] max-md:!leading-normal">
                  <strong className="max-md:!font-bold">Tracking Number:</strong> {order.tracking_number}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
