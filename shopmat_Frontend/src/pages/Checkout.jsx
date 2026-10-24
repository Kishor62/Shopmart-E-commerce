import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, FileText, Lock } from "lucide-react";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill all shipping details");
      return;
    }

    // Here you can send data to backend
    console.log("Order Placed:", { formData, paymentMethod, items, total: subtotal });

    alert("Order placed successfully!");
    clearCart();
    navigate("/"); // Redirect to home after order
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700">Your cart is empty</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-5">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-blue-500" size={20} />
              <h2 className="font-semibold text-slate-800">Shipping Address</h2>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-blue-500" size={20} />
              <h2 className="font-semibold text-slate-800">Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* Credit/Debit Card */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-5 h-5 text-blue-500"
                  />
                  <div>
                    <p className="font-medium text-slate-800">Credit/Debit Card</p>
                    <p className="text-xs text-slate-500">Visa, Mastercard, Rupay</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">VISA</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">MC</span>
                </div>
              </label>

              {/* UPI */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="w-5 h-5 text-blue-500"
                  />
                  <div>
                    <p className="font-medium text-slate-800">UPI</p>
                    <p className="text-xs text-slate-500">Pay via any UPI app</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-orange-500">UPI</span>
              </label>

              {/* Cash on Delivery */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-5 h-5 text-blue-500"
                  />
                  <div>
                    <p className="font-medium text-slate-800">Cash on Delivery</p>
                    <p className="text-xs text-slate-500">Pay in cash when your order arrives</p>
                  </div>
                </div>
                <span className="text-xl">💵</span>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-blue-500" size={20} />
              <h2 className="font-semibold text-slate-800">Order Summary</h2>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Items Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-slate-800">Total Amount</span>
                <span className="font-bold text-slate-900">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <Lock size={18} />
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;