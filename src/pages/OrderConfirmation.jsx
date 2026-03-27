// ============================================
// FILE: src/pages/OrderConfirmation.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { db } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    const { data: orders } = await db.getUserOrders(user.id);
    const foundOrder = orders?.find((o) => o.id === orderId);
    setOrder(foundOrder);
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">Thank you for your order. We've sent a confirmation email to your inbox.</p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h2 className="font-bold mb-4">Order Details</h2>
          <p>
            <strong>Order Number:</strong> {order.order_number}
          </p>
          <p>
            <strong>Total:</strong> ${order.total_amount}
          </p>
          <p>
            <strong>Status:</strong> <span className="capitalize">{order.status}</span>
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/orders">
            <button className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-[#111111]">View Order History</button>
          </Link>

          <Link to="/products">
            <button className="w-full border-2 border-black text-black px-6 py-3 rounded-lg hover:bg-black hover:text-white">Continue Shopping</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
