// ============================================
// UPDATED: src/pages/Checkout.jsx
// With Resend API automatic email sending
// ============================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { db, supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { CreditCard, Wallet, Shield } from "lucide-react";

// Card Payment Form Component
function CardPaymentForm({ formData, total, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleCardPayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe not loaded. Please refresh the page.");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.addressLine1) {
      toast.error("Please fill in all shipping information first");
      return;
    }

    setProcessing(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase configuration missing");
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          metadata: {
            customer_name: formData.fullName,
            customer_email: formData.email,
            customer_phone: formData.phone,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const data = await response.json();
      const { clientSecret } = data;

      if (!clientSecret) {
        throw new Error("No client secret returned from payment intent");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.addressLine1,
              line2: formData.addressLine2 || "",
              city: formData.city,
              state: formData.state,
              postal_code: formData.postalCode,
              country: "PK",
            },
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        onSuccess(paymentIntent.id);
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      onError(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-md:!p-[14px] max-md:!rounded-[12px] max-md:!mx-[14px] max-md:!mb-[14px] max-md:!shadow-[0_1_4px_rgba(0,0,0,0.08)]">
      <h3 className="text-lg font-bold mb-4 max-md:!text-[15px] max-md:!font-bold max-md:!mb-[14px]">Card Payment</h3>

      <div className="border-2 border-gray-300 rounded-lg p-4 mb-4 hover:border-black transition-colors max-md:!h-[40px] max-md:!p-[0_10px] max-md:!mb-[10px] max-md:!border max-md:!border-[#e0e0e0] max-md:!rounded-[8px] max-md:!flex max-md:!items-center">
        <div className="w-full">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#424770",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      <button type="button" onClick={handleCardPayment} disabled={!stripe || processing} className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all max-md:!h-[44px] max-md:!text-[14px] max-md:!font-semibold max-md:!rounded-[10px] max-md:!mt-[8px] max-md:!flex max-md:!items-center max-md:!justify-center max-md:!text-center max-md:!gap-[8px]">
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
            Processing Payment...
          </>
        ) : (
          <span>Pay Rs.{total.toLocaleString()}</span>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 max-md:!mt-[8px] max-md:!text-[11px] max-md:!text-center max-md:!justify-center">
        <Shield className="h-4 w-4 text-green-600" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  );
}

// Main Checkout Component
export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: user?.email || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "Pakistan",
    postalCode: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  // 🆕 Send order confirmation email via Resend
  const sendOrderEmail = async (order, userEmail, userName, items, total) => {
    try {
      console.log("📧 Sending order confirmation email via Resend...");

      const itemsList = items
        .map(
          (item) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs.${(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        `,
        )
        .join("");

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000000; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
            .order-details { background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .items-table { width: 100%; margin: 20px 0; }
            .total { font-size: 24px; font-weight: bold; color: #000000; text-align: right; margin-top: 20px; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your order, ${userName}!</p>
            </div>
            
            <div class="content">
              <p>Dear ${userName},</p>
              
              <p>We've received your order and we're getting it ready. You'll receive another email when your order ships.</p>
              
              <div class="order-details">
                <h2>📦 Order Details</h2>
                <p><strong>Order Number:</strong> ${order.order_number}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Payment Status:</strong> ${order.payment_status === "paid" ? "✅ Paid" : "💵 Cash on Delivery"}</p>
              </div>
              
              <h3>Items Ordered:</h3>
              <table class="items-table">
                ${itemsList}
                <tr>
                  <td colspan="2" class="total">Total: Rs.${total.toLocaleString()}</td>
                </tr>
              </table>
              
              <div class="order-details">
                <h3>📍 Shipping Address</h3>
                <p>
                  ${order.shipping_address.full_name}<br>
                  ${order.shipping_address.address_line1}<br>
                  ${order.shipping_address.address_line2 ? order.shipping_address.address_line2 + "<br>" : ""}
                  ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}<br>
                  Phone: ${order.shipping_address.phone}
                </p>
              </div>
              
              <p style="margin-top: 30px;">If you have any questions, please don't hesitate to contact us!</p>
              
              <p>
                <strong>Contact:</strong><br>
                📞 +92 333 807 1123<br>
                📧 support@healingshilajit.com
              </p>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing Healing Shilajit!</p>
              <p style="font-size: 12px; color: #666;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Call edge function to send email
      const { data, error } = await supabase.functions.invoke("send-order-email", {
        body: {
          to: userEmail,
          subject: `Order Confirmation - ${order.order_number}`,
          html: emailHtml,
          orderId: order.id,
        },
      });

      if (error) {
        console.error("❌ Email sending failed:", error);
        // Fallback: Save notification for manual sending
        await saveNotificationForManualSend(order, userEmail, userName, items, total, emailHtml);
        toast.error("Order placed but email failed. We'll send it manually.");
      } else {
        console.log("✅ Email sent successfully via Resend!");
        toast.success("Order placed! Check your email for confirmation.");
      }
    } catch (error) {
      console.error("❌ Error sending email:", error);
      // Fallback: Save for manual sending
      await saveNotificationForManualSend(order, userEmail, userName, items, total);
      toast.error("Order placed but email failed. We'll send it manually.");
    }
  };

  // Fallback: Save notification for manual sending if automatic email fails
  const saveNotificationForManualSend = async (order, userEmail, userName, items, total, htmlBody = null) => {
    try {
      const itemsList = items.map((item) => `${item.quantity}x ${item.name} - Rs.${(item.price * item.quantity).toLocaleString()}`).join("\n");

      const textBody = `
Dear ${userName},

Thank you for your order! We've received your order and will process it shortly.

ORDER DETAILS:
--------------
Order Number: ${order.order_number}
Order Date: ${new Date().toLocaleDateString()}
Total Amount: Rs.${total.toLocaleString()}

ITEMS ORDERED:
${itemsList}

SHIPPING ADDRESS:
${order.shipping_address.full_name}
${order.shipping_address.address_line1}
${order.shipping_address.address_line2 ? order.shipping_address.address_line2 + "\n" : ""}${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}
Phone: ${order.shipping_address.phone}

PAYMENT STATUS: ${order.payment_status === "paid" ? "Paid Online" : "Cash on Delivery"}

We'll send you another email when your order ships with tracking information.

Thank you for choosing Healing Shilajit!

Best regards,
The Healing Shilajit Team

Contact: +92 333 807 1123
Email: support@healingshilajit.com
      `.trim();

      await supabase.from("order_notifications").insert([
        {
          order_id: order.id,
          customer_email: userEmail,
          customer_name: userName,
          notification_type: "order_placed",
          email_subject: `Order Confirmation - ${order.order_number}`,
          email_body: htmlBody || textBody,
          status: "pending",
        },
      ]);

      console.log("💾 Notification saved for manual sending");
    } catch (err) {
      console.error("❌ Failed to save notification:", err);
    }
  };

  const createOrder = async (paymentStatus, paymentId) => {
    setLoading(true);

    try {
      const orderData = {
        user_id: user.id,
        total_amount: getTotal(),
        status: "pending",
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        stripe_payment_id: paymentId,
        shipping_address: {
          full_name: formData.fullName,
          phone: formData.phone,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.postalCode,
        },
      };

      const { data: order, error: orderError } = await db.createOrder(orderData);
      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image_url,
        quantity: item.quantity,
        price: item.price,
      }));

      await db.createOrderItems(orderItems);

      // 🆕 SEND ORDER CONFIRMATION EMAIL VIA RESEND
      await sendOrderEmail(order, user.email, formData.fullName, items, getTotal());

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to create order. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentId) => {
    createOrder("paid", paymentId);
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
  };

  const handleCOD = () => {
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    createOrder("pending", null);
  };

  const total = getTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 max-md:!pt-[80px] max-md:!px-0 max-md:!pb-12 max-md:!bg-[#f5f5f5]">
      <div className="text-center mb-16 px-4 max-md:!mb-[16px]">
        <div className="inline-block group max-md:flex max-md:flex-col max-md:items-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4 max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[12px]">Checkout</h1>
          <div className="w-full h-2 max-md:!h-[4px] max-md:!w-[60px] bg-amber-500 rounded-full md:hidden"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 max-md:!space-y-0">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[14px] max-md:!rounded-[12px] max-md:!mx-[14px] max-md:!mb-[14px] max-md:!shadow-[0_1_4px_rgba(0,0,0,0.08)]">
            <h2 className="text-xl font-bold mb-6 max-md:!text-[14px] max-md:!font-bold max-md:!mb-[12px]">Shipping Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name *" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />

              <Input label="Phone *" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </div>

            <Input label="Email *" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />

            <Input label="Address Line 1 *" value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} placeholder="Street address" required />

            <Input label="Address Line 2 (Optional)" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} placeholder="Apartment, suite, etc." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="City *" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />

              <Input label="State/Province *" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required />

              <Input label="Postal Code *" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} required />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[14px] max-md:!rounded-[12px] max-md:!mx-[14px] max-md:!mb-[14px] max-md:!shadow-[0_1_4px_rgba(0,0,0,0.08)]">
            <h2 className="text-xl font-bold mb-6 max-md:!text-[14px] max-md:!font-bold max-md:!mb-[12px]">Payment Method</h2>

            <div className="space-y-4 max-md:!space-y-[8px]">
              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "card" ? "border-black bg-gray-50 max-md:!border-[2px] max-md:!border-black" : "border-gray-200 hover:border-gray-300 max-md:!border max-md:!border-[#e0e0e0]"} max-md:!p-[10px_12px] max-md:!rounded-[8px] max-md:!mb-0`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 mr-3 max-md:!w-[18px] max-md:!h-[18px] max-md:!mr-[10px]" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 max-md:!mb-0">
                    <CreditCard className="h-5 w-5 text-black" />
                    <p className="font-semibold max-md:!text-[13px] max-md:!font-medium">Credit/Debit Card</p>
                  </div>
                  <p className="text-sm text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">Pay securely online with Stripe</p>
                </div>
              </label>

              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "cod" ? "border-black bg-gray-50 max-md:!border-[2px] max-md:!border-black" : "border-gray-200 hover:border-gray-300 max-md:!border max-md:!border-[#e0e0e0]"} max-md:!p-[10px_12px] max-md:!rounded-[8px] max-md:!mb-0`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 mr-3 max-md:!w-[18px] max-md:!h-[18px] max-md:!mr-[10px]" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 max-md:!mb-0">
                    <Wallet className="h-5 w-5 text-black" />
                    <p className="font-semibold max-md:!text-[13px] max-md:!font-medium">Cash on Delivery</p>
                  </div>
                  <p className="text-sm text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">Pay when you receive your order</p>
                </div>
              </label>
            </div>
          </div>

          {/* Card Payment */}
          {paymentMethod === "card" && (
            <Elements stripe={stripePromise}>
              <CardPaymentForm formData={formData} total={total} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
            </Elements>
          )}

          {/* COD Button */}
          {paymentMethod === "cod" && (
            <div className="bg-white rounded-lg shadow-md p-6 max-md:!p-[14px] max-md:!rounded-[12px] max-md:!mx-[14px] max-md:!mb-[14px] max-md:!shadow-[0_1_4px_rgba(0,0,0,0.08)]">
              <button onClick={handleCOD} disabled={loading} className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all max-md:!h-[44px] max-md:!text-[14px] max-md:!font-semibold max-md:!rounded-[10px] max-md:!mt-0">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                    Processing...
                  </>
                ) : (
                  <>Place Order (Cash on Delivery)</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 max-md:!p-[14px] max-md:!rounded-[12px] max-md:!mx-[14px] max-md:!mb-[14px] max-md:!static max-md:!shadow-[0_1_4px_rgba(0,0,0,0.08)]">
            <h2 className="text-xl font-bold mb-4 max-md:!text-[14px] max-md:!font-bold max-md:!mb-[12px]">Order Summary</h2>

            <div className="space-y-3 mb-4 max-md:!mb-[10px]">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm max-md:!text-[12px] max-md:!mb-[6px] max-md:!line-height-[1.6]">
                  <span className="max-w-[70%]">
                    {item.quantity}x {item.name}
                  </span>
                  <span>Rs.{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 max-md:!pt-[10px] max-md:!border-t max-md:!border-t-[#e0e0e0] max-md:!mt-[10px]">
              <div className="flex justify-between max-md:!text-[13px]">
                <span>Subtotal</span>
                <span>Rs.{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between max-md:!text-[13px]">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg max-md:!text-[15px] max-md:!pt-[10px] max-md:!font-bold">
                <span>Total</span>
                <span className="text-black">Rs.{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
