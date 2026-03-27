// ============================================
// NEW FILE: src/pages/admin/Messages.jsx
// Admin Contact Messages Management
// ============================================
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { format } from "date-fns";
import { Mail, Phone, MessageSquare, CheckCircle, Eye, Trash2, Copy, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, new, read, replied
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("contact_messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => {
        loadMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadMessages = async () => {
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });

    if (!error) {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase.from("contact_messages").update({ status: newStatus }).eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated!");
      loadMessages();
    }
  };

  const updateNotes = async (id, notes) => {
    const { error } = await supabase.from("contact_messages").update({ admin_notes: notes }).eq("id", id);

    if (!error) {
      toast.success("Notes saved!");
      loadMessages();
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message?")) return;

    const { error } = await supabase.from("contact_messages").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Message deleted");
      setSelectedMessage(null);
      loadMessages();
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const filteredMessages = messages.filter((msg) => {
    // Filter by status
    if (filter !== "all" && msg.status !== filter) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return msg.name.toLowerCase().includes(query) || msg.email.toLowerCase().includes(query) || msg.message.toLowerCase().includes(query) || (msg.phone && msg.phone.includes(query));
    }

    return true;
  });

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-800 border-blue-300",
      read: "bg-yellow-100 text-yellow-800 border-yellow-300",
      replied: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusIcon = (status) => {
    if (status === "new") return "🔵";
    if (status === "read") return "👀";
    if (status === "replied") return "✅";
    return "⚪";
  };

  const stats = {
    total: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
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
        <h1 className="text-3xl font-bold max-md:!text-[20px]">Contact Messages</h1>
        <p className="text-gray-600 mt-1 max-md:!text-[13px]">Manage customer inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-md:!grid-cols-2 max-md:!gap-[12px] max-md:!mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Total Messages</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{stats.total}</p>
            </div>
            <MessageSquare className="h-12 w-12 text-gray-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">New</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{stats.new}</p>
            </div>
            <MessageSquare className="h-12 w-12 text-blue-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Read</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{stats.read}</p>
            </div>
            <Eye className="h-12 w-12 text-yellow-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[12px] max-md:!rounded-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm max-md:!text-[12px]">Replied</p>
              <p className="text-3xl font-bold mt-1 max-md:!text-[20px] max-md:!font-bold">{stats.replied}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500 max-md:!h-[32px] max-md:!w-[32px]" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 max-md:!p-[12px] max-md:!mb-4">
        <div className="flex flex-wrap gap-4 items-center max-md:!flex-col max-md:!items-stretch max-md:!gap-[12px]">
          {/* Status Filter */}
          <div className="flex gap-2 max-md:!overflow-x-auto max-md:!pb-1 max-md:!gap-[8px]">
            {["all", "new", "read", "replied"].map((status) => (
              <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap max-md:!text-[12px] max-md:!px-[12px] max-md:!h-[36px] ${filter === status ? "bg-[#8B4513] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && ` (${stats[status]})`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 max-md:!h-4 max-md:!w-4" />
              <input type="text" placeholder="Search messages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent max-md:!h-[40px] max-md:!text-[14px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (message.status === "new") {
                    updateStatus(message.id, "read");
                  }
                }}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all max-md:!p-[14px] max-md:!rounded-[12px] ${selectedMessage?.id === message.id ? "ring-2 ring-[#8B4513]" : ""}`}
              >
                <div className="flex items-start justify-between mb-2 max-md:!mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl max-md:!text-[16px]">{getStatusIcon(message.status)}</span>
                    <p className="font-semibold max-md:!text-[13px] max-md:!font-bold">{message.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(message.status)} max-md:!text-[10px]`}>{message.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1 max-md:!text-[11px] max-md:!text-gray-500 truncate">{message.email}</p>
                <p className="text-xs text-gray-500 mb-2 max-md:!text-[10px]">{format(new Date(message.created_at), "MMM d, h:mm a")}</p>
                <p className="text-sm text-gray-700 line-clamp-2 max-md:!text-[12px] max-md:!leading-[1.5]">{message.message}</p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No messages found</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 max-md:!mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2 max-md:!text-[18px] max-md:!mb-1">{selectedMessage.name}</h2>
                  <p className="text-gray-600 text-sm max-md:!text-[11px]">{format(new Date(selectedMessage.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
                <select value={selectedMessage.status} onChange={(e) => updateStatus(selectedMessage.id, e.target.value)} className={`px-4 py-2 rounded-lg font-semibold text-sm border-2 cursor-pointer ${getStatusColor(selectedMessage.status)} max-md:!text-[12px] max-md:!h-[36px] max-md:!rounded-[8px]`}>
                  <option value="new">🔵 New</option>
                  <option value="read">👀 Read</option>
                  <option value="replied">✅ Replied</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">{selectedMessage.email}</span>
                    </div>
                    <button onClick={() => copyToClipboard(selectedMessage.email, "Email")} className="text-blue-600 hover:text-blue-800">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">{selectedMessage.phone}</span>
                      </div>
                      <button onClick={() => copyToClipboard(selectedMessage.phone, "Phone")} className="text-blue-600 hover:text-blue-800">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Message</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Admin Notes</h3>
                <textarea
                  value={selectedMessage.admin_notes || ""}
                  onChange={(e) => {
                    setSelectedMessage({ ...selectedMessage, admin_notes: e.target.value });
                  }}
                  onBlur={(e) => updateNotes(selectedMessage.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  rows="3"
                  placeholder="Add notes about this message..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 max-md:!flex-col max-md:!gap-2">
                <a href={`mailto:${selectedMessage.email}`} className="flex-1 bg-[#8B4513] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#654321] transition-colors max-md:!h-[44px] max-md:!flex max-md:!items-center max-md:!justify-center max-md:!text-[14px]">
                  📧 Reply via Email
                </a>
                {selectedMessage.phone && (
                  <a href={`tel:${selectedMessage.phone}`} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors max-md:!h-[44px] max-md:!flex max-md:!items-center max-md:!justify-center max-md:!text-[14px]">
                    📞 Call
                  </a>
                )}
                <button onClick={() => deleteMessage(selectedMessage.id)} className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors max-md:!h-[44px] max-md:!flex max-md:!items-center max-md:!justify-center">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
