// ============================================
// NEW FILE: src/pages/admin/Notifications.jsx
// View and manually send order confirmation emails
// ============================================
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { format } from "date-fns";
import { Mail, Send, CheckCircle, XCircle, Clock, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const { data, error } = await supabase
      .from("order_notifications")
      .select(
        `
        *,
        orders (
          order_number,
          total_amount,
          status
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (!error) {
      setNotifications(data || []);
    }
    setLoading(false);
  };

  const copyEmailContent = (notification) => {
    const emailContent = `To: ${notification.customer_email}
Subject: ${notification.email_subject}

${notification.email_body}`;

    navigator.clipboard.writeText(emailContent);
    toast.success("Email content copied! Paste it in your email client.");
  };

  const markAsSent = async (id) => {
    const { error } = await supabase
      .from("order_notifications")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      toast.success("Marked as sent!");
      loadNotifications();
    }
  };

  const getStatusIcon = (status) => {
    if (status === "sent") return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === "failed") return <XCircle className="h-5 w-5 text-red-600" />;
    return <Clock className="h-5 w-5 text-yellow-600" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
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
        <h1 className="text-3xl font-bold max-md:!text-[20px]">Email Notifications</h1>
        <p className="text-gray-600 mt-1 max-md:!text-[13px]">Order confirmation emails to send</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-md:!p-[14px] max-md:!mb-6">
        <h3 className="font-semibold text-blue-900 mb-2 max-md:!text-[14px]">📧 How to Send Emails:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside max-md:!text-[12px]">
          <li>Click on any pending notification below</li>
          <li>Click "Copy Email Content" button</li>
          <li>Open your email client (Gmail, Outlook, etc.)</li>
          <li>Paste the content (To, Subject, and Body will be included)</li>
          <li>Send the email</li>
          <li>Come back and click "Mark as Sent"</li>
        </ol>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-md:!grid-cols-2 max-md:!gap-[12px] max-md:!mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Pending</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{notifications.filter((n) => n.status === "pending").length}</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Sent</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{notifications.filter((n) => n.status === "sent").length}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px] max-md:!col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Total</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{notifications.length}</p>
            </div>
            <Mail className="h-12 w-12 text-blue-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
          {notifications.map((notification) => (
            <div key={notification.id} onClick={() => setSelectedNotification(notification)} className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all max-md:!p-[14px] max-md:!rounded-[12px] ${selectedNotification?.id === notification.id ? "ring-2 ring-[#8B4513]" : ""}`}>
              <div className="flex items-start justify-between mb-2 max-md:!mb-1">
                <div className="flex items-center gap-2">
                  <div className="max-md:!scale-75 origin-left">{getStatusIcon(notification.status)}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(notification.status)} max-md:!text-[10px]`}>{notification.status}</span>
                </div>
              </div>
              <p className="font-semibold text-sm max-md:!text-[13px] max-md:!font-bold">{notification.customer_name}</p>
              <p className="text-xs text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">{notification.customer_email}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500 max-md:!text-[10px]">{notification.orders?.order_number}</p>
                <p className="text-xs text-gray-500 max-md:!text-[10px]">{format(new Date(notification.created_at), "MMM d, h:mm a")}</p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selectedNotification ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 max-md:!flex-col max-md:!gap-4 max-md:!mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2 max-md:!text-[18px] max-md:!mb-1">{selectedNotification.customer_name}</h2>
                  <p className="text-gray-600 max-md:!text-[12px]">{selectedNotification.customer_email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="max-md:!scale-90 origin-left">{getStatusIcon(selectedNotification.status)}</div>
                    <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedNotification.status)} max-md:!text-[11px] max-md:!px-[8px]`}>{selectedNotification.status}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600 max-md:!text-left max-md:!w-full max-md:!bg-gray-50 max-md:!p-[10px] max-md:!rounded-[8px] max-md:!text-[11px]">
                  <p>Order: {selectedNotification.orders?.order_number}</p>
                  <p>Amount: Rs.{parseFloat(selectedNotification.orders?.total_amount).toLocaleString()}</p>
                  <p>{format(new Date(selectedNotification.created_at), "MMM d, yyyy h:mm a")}</p>
                </div>
              </div>

              {/* Email Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-md:!p-[10px] max-md:!mb-4">
                <h3 className="font-semibold mb-2 max-md:!text-[13px]">📧 Email Preview:</h3>
                <div className="bg-white rounded p-4 border max-md:!p-[10px]">
                  <p className="text-sm text-gray-600 mb-1 max-md:!text-[11px]">
                    <strong>To:</strong> {selectedNotification.customer_email}
                  </p>
                  <p className="text-sm text-gray-600 mb-3 max-md:!text-[11px]">
                    <strong>Subject:</strong> {selectedNotification.email_subject}
                  </p>
                  <div className="border-t pt-3 max-md:!pt-2">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans max-md:!text-[12px] max-md:!leading-[1.5]">{selectedNotification.email_body}</pre>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 max-md:!flex-col max-md:!gap-2">
                <button onClick={() => copyEmailContent(selectedNotification)} className="flex-1 bg-gradient-to-r from-[#8B4513] to-[#654321] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all max-md:!h-[44px] max-md:!text-[14px]">
                  <Copy className="h-5 w-5 inline mr-2" />
                  Copy Email Content
                </button>

                {selectedNotification.status === "pending" && (
                  <button onClick={() => markAsSent(selectedNotification.id)} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all max-md:!h-[44px] max-md:!text-[14px]">
                    <CheckCircle className="h-5 w-5 inline mr-2" />
                    Mark as Sent
                  </button>
                )}

                {selectedNotification.status === "sent" && (
                  <div className="flex-1 bg-green-100 text-green-800 py-3 rounded-lg font-semibold text-center max-md:!py-2 max-md:!text-[13px]">
                    ✅ Email Sent
                    {selectedNotification.sent_at && <span className="block text-xs mt-1 max-md:!text-[10px]">{format(new Date(selectedNotification.sent_at), "MMM d, h:mm a")}</span>}
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>💡 Quick Send:</strong> Click "Copy Email Content" → Open Gmail/Outlook → Paste (Ctrl+V) → Send → Come back and click "Mark as Sent"
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select a notification to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
