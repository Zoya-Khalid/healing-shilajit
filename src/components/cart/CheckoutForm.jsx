// ============================================
// FILE: src/components/cart/CheckoutForm.jsx
// ============================================
import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

export default function CheckoutForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
    paymentMethod: "card",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />

        <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
      </div>

      <Input label="Address Line 1" value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} required />

      <Input label="Address Line 2 (Optional)" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />

        <Input label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required />

        <Input label="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} required />
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Payment Method</h2>

      <div className="space-y-2 mb-6">
        <label className="flex items-center">
          <input type="radio" name="payment" value="card" checked={formData.paymentMethod === "card"} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="mr-2" />
          Credit/Debit Card
        </label>

        <label className="flex items-center">
          <input type="radio" name="payment" value="cod" checked={formData.paymentMethod === "cod"} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="mr-2" />
          Cash on Delivery
        </label>
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </Button>
    </form>
  );
}
