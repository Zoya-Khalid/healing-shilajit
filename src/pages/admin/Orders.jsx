// ============================================
// FIXED FILE: src/pages/admin/Orders.jsx
// Works without email service - focuses on order management
// ============================================
import React, { useEffect, useState } from "react";
import { admin, supabase } from "../../lib/supabase";
import { format } from "date-fns";
import { Mail, Package, Truck, CheckCircle, XCircle, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await admin.getAllOrders();
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await admin.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated!");
      loadOrders();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const { error } = await supabase.from("orders").update({ payment_status: paymentStatus }).eq("id", orderId);

      if (error) throw error;

      toast.success("Payment status updated!");
      loadOrders();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const addTrackingNumber = async (orderId, trackingNumber) => {
    if (!trackingNumber) {
      toast.error("Please enter a tracking number");
      return;
    }

    try {
      await admin.updateOrderStatus(orderId, "shipped", trackingNumber);
      toast.success("Tracking number added!");
      loadOrders();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      processing: "bg-blue-100 text-blue-800 border-blue-300",
      shipped: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
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
    <div>
      <div className="mb-8 max-md:!mb-6">
        <h1 className="text-3xl font-bold max-md:!text-[20px]">Order Management</h1>
        <p className="text-gray-600 mt-1 max-md:!text-[13px]">Track and manage customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-md:!grid-cols-2 max-md:!gap-[12px] max-md:!mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Total Orders</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{orders.length}</p>
            </div>
            <Package className="h-12 w-12 text-blue-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Pending</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{orders.filter((o) => o.status === "pending").length}</p>
            </div>
            <Package className="h-12 w-12 text-yellow-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Shipped</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{orders.filter((o) => o.status === "shipped").length}</p>
            </div>
            <Truck className="h-12 w-12 text-purple-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Delivered</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden max-md:!rounded-[12px] max-md:!mb-[12px]">
            <div className="p-6 max-md:!p-[14px]">
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4 max-md:!gap-[10px] max-md:!mb-3">
                <div className="min-w-[200px]">
                  <h3 className="text-xl font-bold text-gray-900 max-md:!text-[13px] max-md:!font-bold">Order #{order.order_number}</h3>
                  <p className="text-sm text-gray-600 mt-1 max-md:!text-[11px] max-md:!text-gray-500">{format(new Date(order.created_at), "MMM d, yyyy h:mm a")}</p>
                  <div className="flex items-center gap-2 mt-2 max-md:!mt-1">
                    <Mail className="h-4 w-4 text-gray-400 max-md:!h-3 max-md:!w-3" />
                    <span className="text-sm text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">
                      {order.profiles?.full_name} ({order.profiles?.email})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-md:!flex-row max-md:!w-full max-md:!gap-[8px]">
                  {/* Order Status */}
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 cursor-pointer ${getStatusColor(order.status)} max-md:!text-[12px] max-md:!h-[36px] max-md:!rounded-[8px] max-md:!w-auto max-md:!px-[8px]`}>
                    <option value="pending">⏳ Pending</option>
                    <option value="processing">📦 Proc</option>
                    <option value="shipped">🚚 Ship</option>
                    <option value="delivered">✅ Deliv</option>
                    <option value="cancelled">❌ Cancl</option>
                  </select>

                  {/* Payment Status */}
                  <select value={order.payment_status} onChange={(e) => updatePaymentStatus(order.id, e.target.value)} className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer ${getPaymentStatusColor(order.payment_status)} max-md:!text-[12px] max-md:!h-[36px] max-md:!rounded-[8px] max-md:!w-auto max-md:!px-[8px]`}>
                    <option value="pending">💳 Pend</option>
                    <option value="paid">✅ Paid</option>
                    <option value="failed">❌ Fail</option>
                    <option value="refunded">↩️ Refnd</option>
                  </select>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 max-md:!p-[10px] max-md:!mb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-md:!gap-2">
                  <div>
                    <p className="text-sm text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">Payment Method</p>
                    <p className="font-semibold capitalize max-md:!text-[12px]">{order.payment_method || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">Transaction ID</p>
                    <p className="font-semibold text-xs max-md:!text-[11px] truncate">{order.stripe_payment_id || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">Total Amount</p>
                    <p className="font-semibold text-lg text-[#8B4513] max-md:!text-[14px] max-md:!font-bold max-md:!text-orange-600">Rs.{parseFloat(order.total_amount).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border rounded-lg p-4 mb-4 max-md:!p-[10px] max-md:!mb-3">
                <h4 className="font-semibold mb-3 max-md:!text-[13px] max-md:!font-semibold max-md:!mb-2">Order Items:</h4>
                <div className="space-y-2 max-md:!space-y-1">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm max-md:!text-[12px]">
                      <span className="text-gray-700">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="font-semibold">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between items-center font-bold max-md:!pt-2 max-md:!mt-2 max-md:!text-[13px]">
                  <span>Total:</span>
                  <span className="text-[#8B4513] text-lg max-md:!text-[14px]">Rs.{parseFloat(order.total_amount).toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 max-md:!p-[10px] max-md:!mb-3">
                <h4 className="font-semibold text-blue-900 mb-2 max-md:!text-[13px] max-md:!font-semibold">📍 Shipping Address:</h4>
                <div className="text-sm text-blue-800 max-md:!text-[12px] max-md:!leading-[1.6]">
                  <p className="font-semibold">{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.address_line1}</p>
                  {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                  <p className="mt-1">📞 Phone: {order.shipping_address.phone}</p>
                </div>
              </div>

              {/* Tracking Number */}
              {order.status === "shipped" || order.tracking_number ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  {order.tracking_number ? (
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">📦 Tracking Number:</h4>
                      <p className="text-purple-800 font-mono text-lg">{order.tracking_number}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter tracking number..."
                        className="flex-1 px-4 py-2 border rounded-lg"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addTrackingNumber(order.id, e.target.value);
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousSibling;
                          addTrackingNumber(order.id, input.value);
                        }}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-semibold"
                      >
                        Add Tracking
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
