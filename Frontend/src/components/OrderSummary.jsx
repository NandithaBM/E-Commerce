import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function OrderSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const user = JSON.parse(localStorage.getItem("Users"));
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    area: "",
    taluk: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
    label: "",
    primaryPhone: "", // required
    secondaryPhone: "", // optional
  });

  useEffect(() => {
    if (user?.address?.length > 0) {
      setAddresses(user.address);
      setSelectedIndex(user.address.length - 1); // use last as default
    }
  }, []);

  const handleAddAddress = async () => {
    if (!newAddress.primaryPhone.trim()) {
      alert("Primary phone number is required.");
      return;
    }

    try {
      const res = await axios.put("http://localhost:4001/user/add-address", {
        userId: user._id,
        newAddress,
      });

      const updatedAddresses = res.data.address;
      setAddresses(updatedAddresses);
      setSelectedIndex(updatedAddresses.length - 1);
      setShowAddForm(false);

      const updatedUser = { ...user, address: updatedAddresses };
      localStorage.setItem("Users", JSON.stringify(updatedUser));
      alert("✅ Address added!");
    } catch (err) {
      console.error("Add address error:", err);
      alert("❌ Failed to add address");
    }
  };

  const handlePlaceOrder = () => {
    if (selectedIndex === null) {
      alert("Please select a shipping address");
      return;
    }

    const selectedAddress = addresses[selectedIndex];
    localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
    localStorage.setItem("selectedShippingAddress", JSON.stringify(selectedAddress));

    navigate("/payment", {
      state: {
        cartItems,
        shippingAddress: selectedAddress,
      },
    });
  };

  if (!cartItems.length) {
    return (
      <div className="text-center text-red-600 mt-10">
        No cart items found. Please go back to cart.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧾 Order Summary</h1>

      {/* Shipping Address */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">📦 Shipping Address</h2>

        {addresses.length === 0 ? (
          <p className="text-red-600">No saved addresses. Please add one.</p>
        ) : isChanging ? (
          addresses.map((addr, i) => (
            <div key={i} className="mb-2 border p-3 rounded bg-white">
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="address"
                  value={i}
                  checked={selectedIndex === i}
                  onChange={() => setSelectedIndex(i)}
                />
                <div className="text-sm text-blue-900">
                  <strong>{addr.label || `Address ${i + 1}`}:</strong><br />
                  {addr.houseNumber}, {addr.area}, {addr.taluk}, {addr.district},<br />
                  {addr.state}, {addr.country} - {addr.pincode}<br />
                  📞 {addr.primaryPhone}
                  {addr.secondaryPhone && ` / ${addr.secondaryPhone}`}
                </div>
              </label>
            </div>
          ))
        ) : (
          <div className="border p-3 rounded bg-white text-sm text-blue-900">
            {addresses[selectedIndex]?.label && (
              <strong>{addresses[selectedIndex]?.label}: </strong>
            )}
            {addresses[selectedIndex]?.houseNumber},{" "}
            {addresses[selectedIndex]?.area},{" "}
            {addresses[selectedIndex]?.taluk},{" "}
            {addresses[selectedIndex]?.district},{" "}
            {addresses[selectedIndex]?.state},{" "}
            {addresses[selectedIndex]?.country} -{" "}
            {addresses[selectedIndex]?.pincode}
            <br />
            📞 {addresses[selectedIndex]?.primaryPhone}
            {addresses[selectedIndex]?.secondaryPhone &&
              ` / ${addresses[selectedIndex]?.secondaryPhone}`}
          </div>
        )}

        {/* Address Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setIsChanging(!isChanging)}
            className="text-blue-600 underline"
          >
            {isChanging ? "Cancel Change" : "Change Address"}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-green-600 underline"
          >
            Add New Address
          </button>
        </div>
      </div>

      {/* New Address Form */}
      {showAddForm && (
        <div className="mt-4 border p-4 rounded bg-white shadow">
          <h3 className="font-semibold mb-2">🆕 Add New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "houseNumber",
              "area",
              "taluk",
              "district",
              "state",
              "country",
              "pincode",
              "label",
              "primaryPhone",
              "secondaryPhone",
            ].map((field) => (
              <input
                key={field}
                type="text"
                required={field === "primaryPhone"}
                placeholder={
                  field === "primaryPhone"
                    ? "Primary Phone (required)"
                    : field === "secondaryPhone"
                    ? "Secondary Phone (optional)"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={newAddress[field]}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, [field]: e.target.value })
                }
                className="input input-bordered p-2 border rounded"
              />
            ))}
          </div>
          <button
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAddAddress}
          >
            ➕ Save Address
          </button>
        </div>
      )}

      {/* Cart Summary */}
      <div className="bg-white border p-4 rounded shadow mt-6 text-blue-900">
        <h2 className="text-lg font-semibold mb-3">🛒 Items</h2>
        {cartItems.map((item, i) => (
          <div key={i} className="flex justify-between mb-2">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-blue-900">
          <span>Total</span>
          <span>₹{cartItems.reduce((sum, item) => sum + item.price, 0)}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded"
        >
          ✅ Confirm & Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;
