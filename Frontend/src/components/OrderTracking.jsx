import React, { useEffect, useState } from "react";

function OrderTracking() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("latestOrder"));
    if (!storedOrder) return;

    // Calculate status based on date
    const orderedDate = new Date(storedOrder.orderedAt);
    const today = new Date();
    const diffDays = Math.floor((today - orderedDate) / (1000 * 60 * 60 * 24));

    let newStatus = storedOrder.status;
    if (storedOrder.status !== "Cancelled") {
      if (diffDays >= 4) newStatus = "Delivered";
      else if (diffDays >= 3) newStatus = "Out for Delivery";
      else if (diffDays >= 2) newStatus = "Shipped";
      else if (diffDays >= 1) newStatus = "Packed";
      else newStatus = "Ordered";
    }

    const updatedOrder = { ...storedOrder, status: newStatus };
    setOrder(updatedOrder);
    localStorage.setItem("latestOrder", JSON.stringify(updatedOrder));

    // OPTIONAL: Also update in allOrders
    const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    const updatedAll = allOrders.map((o) =>
      o.orderedAt === storedOrder.orderedAt ? updatedOrder : o
    );
    localStorage.setItem("allOrders", JSON.stringify(updatedAll));
  }, []);

  if (!order) return <div className="text-center mt-10">No recent order found.</div>;

  const deliveryDate = new Date(order.orderedAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5); // assume 5-day delivery

  const stages = ["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const currentStage = stages.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Order Tracking</h1>

      {/* Order Summary */}
      <div className="mb-6 border p-4 rounded bg-white">
        <h2 className="font-semibold text-lg mb-2">🛍 Items</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>{item.name} (Qty: {item.quantity})</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="mt-2 font-bold">Total: ₹{order.total}</div>
        <div className="mt-2">🪙 Payment: {order.paymentMode}</div>
        <div className="mt-2">🕒 Ordered On: {new Date(order.orderedAt).toLocaleString()}</div>
        {order.status !== "Cancelled" && (
          <div className="mt-2">
            📅 Expected Delivery: {deliveryDate.toDateString()}
          </div>
        )}
      </div>

      {/* Address */}
      <div className="border p-4 rounded bg-gray-100">
        <h2 className="font-semibold text-lg mb-2">📍 Shipping Address</h2>
        <p>
          {order.shippingAddress.label && <strong>{order.shippingAddress.label}: </strong>}
          {order.shippingAddress.houseNumber}, {order.shippingAddress.area}, {order.shippingAddress.taluk}, {order.shippingAddress.district}, {order.shippingAddress.state}, {order.shippingAddress.country} - {order.shippingAddress.pincode}
        </p>
        <p>📞 {order.shippingAddress.primaryPhone}</p>
      </div>

      {/* Delivery Stages */}
      {order.status !== "Cancelled" && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">🚚 Delivery Status</h2>
          <ul className="space-y-2">
            {stages.map((stage, index) => (
              <li
                key={stage}
                className={`p-2 rounded border ${
                  index <= currentStage ? "bg-green-100 border-green-500" : "bg-white"
                }`}
              >
                {index <= currentStage ? "✅" : "⏳"} {stage}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
  