import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [order, setOrder] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showSuccess, setShowSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    const address = JSON.parse(localStorage.getItem("selectedShippingAddress"));

    if (items.length === 0 || !address) {
      alert("Checkout information missing!");
      navigate("/");
    } else {
      setOrder(items);
      setShippingAddress(address);
    }
  }, [navigate]);

  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const upiID = "xxxxxxxxxxxxxxxxxxx";
  const name = encodeURIComponent("BookStore");
  const upiLink = `upi://pay?pa=${upiID}&pn=${name}&am=${total}&cu=INR`;

  const handleSimulatePayment = () => {
    setTimeout(() => {
      const audio = new Audio("/success.mp3");
      audio.play();
      setShowSuccess(true);

      // Prepare order object
      const orderData = {
        items: order,
        shippingAddress,
        total,
        paymentMode: paymentMethod === "cod" ? "Cash on Delivery" : "Online",
        orderedAt: new Date().toISOString(),
        status: "Ordered"
      };

      // Save to localStorage
      localStorage.setItem("latestOrder", JSON.stringify(orderData));

      const existingOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
      localStorage.setItem("allOrders", JSON.stringify([...existingOrders, orderData]));

      // Clean up and navigate
      setTimeout(() => {
        localStorage.removeItem("checkoutItems");
        localStorage.removeItem("cart");
        navigate("/order-tracking");
      }, 3000);
    }, 500);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">💳 Payment Page</h1>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Order Summary */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">🛍 Order Summary</h2>
          {order.map((item, index) => (
            <div key={index} className="border-b pb-3 mb-3">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p>{item.title}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ₹{item.price * item.quantity}</p>
            </div>
          ))}
          <h2 className="text-xl font-bold mt-4">Grand Total: ₹{total}</h2>

          {/* Address */}
          {shippingAddress && (
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h2 className="font-semibold text-lg mb-1">📦 Shipping Address</h2>
              <p>
                {shippingAddress.label && <strong>{shippingAddress.label}: </strong>}
                {shippingAddress.houseNumber}, {shippingAddress.area}, {shippingAddress.taluk},{" "}
                {shippingAddress.district}, {shippingAddress.state}, {shippingAddress.country} -{" "}
                {shippingAddress.pincode}
                <br />
                📞 {shippingAddress.primaryPhone}
                {shippingAddress.secondaryPhone && ` / ${shippingAddress.secondaryPhone}`}
              </p>
            </div>
          )}

          {/* Payment Options */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Choose Payment Method:</h3>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI / Google Pay
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery (COD)
            </label>
          </div>

          {/* Payment Execution */}
          {paymentMethod === "upi" ? (
            isMobile ? (
              <a
                href={upiLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSimulatePayment}
              >
                <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded">
                  Make Payment via UPI
                </button>
              </a>
            ) : (
              <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded">
                <p>⚠️ UPI works only on mobile. Click below if you've paid.</p>
                <button
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                  onClick={handleSimulatePayment}
                >
                  I’ve Paid – Confirm
                </button>
              </div>
            )
          ) : (
            <button
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSimulatePayment}
            >
              Confirm Cash on Delivery
            </button>
          )}

          {/* Confirmation Message */}
          {showSuccess && (
            <div className="mt-6 p-4 bg-green-100 text-green-800 rounded text-center font-bold animate-pulse">
              ✅ Order Confirmed! Redirecting...
            </div>
          )}
        </div>

        {/* QR Code Section */}
        {paymentMethod === "upi" && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Or Scan QR</h2>
            <p className="mb-4">Scan using any UPI app</p>
            <img
              src="/gpay-qr.jpg"
              alt="Google Pay QR"
              className="mx-auto w-56 h-56 border rounded"
            />
            <p className="mt-4 font-semibold">
              UPI ID: <span className="text-blue-700">{upiID}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
