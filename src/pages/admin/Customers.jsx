// ============================================
// FILE: src/pages/admin/Customers.jsx (or src/admin/Customers.jsx)
// ============================================
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { format } from "date-fns";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("role", "customer").order("created_at", { ascending: false });

    setCustomers(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-md:!px-0">
      <h1 className="text-3xl font-bold mb-8 max-md:!text-[20px] max-md:!mb-6">Customers</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden max-md:!bg-transparent max-md:!shadow-none max-md:!rounded-none">
        <table className="w-full max-md:!block">
          <thead className="bg-gray-50 max-md:!hidden">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 max-md:!block max-md:!divide-y-0">
            {customers.map((customer) => (
              <tr key={customer.id} className="max-md:!flex max-md:!justify-between max-md:!items-center max-md:!p-[12px] max-md:!bg-white max-md:!mb-[8px] max-md:!rounded-[10px] max-md:!shadow-sm">
                <td className="px-6 py-4 max-md:!p-0">
                  <div className="font-semibold max-md:!text-[13px] max-md:!font-bold">{customer.full_name || "N/A"}</div>
                  <div className="hidden max-md:!block max-md:!text-[11px] max-md:!text-gray-500">{customer.email}</div>
                </td>
                <td className="px-6 py-4 max-md:!hidden">{customer.email}</td>
                <td className="px-6 py-4 max-md:!p-0 text-right">
                  <div className="max-md:!text-[11px] max-md:!text-gray-400">{format(new Date(customer.created_at), "MMM d, yyyy")}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
