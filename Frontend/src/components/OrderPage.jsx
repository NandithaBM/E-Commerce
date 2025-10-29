// src/components/OrderPage.jsx
import React, { useEffect, useState } from "react";

function OrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
    if (latestOrder) {
      setOrders([latestOrder]);
    }
  }, []);

  useEffect(() => {
    const updateStatusByDate = () => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const orderedDate = new Date(order.orderedAt);
          const today = new Date();
          const diffInDays = Math.floor(
            (today - orderedDate) / (1000 * 60 * 60 * 24)
          );

          let status = "Ordered";
          if (diffInDays >= 3) status = "Delivered";
          else if (diffInDays === 2) status = "Out for Delivery";
          else if (diffInDays === 1) status = "Shipped";

          return { ...order, status };
        })
      );
    };

    updateStatusByDate();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-red-600 text-xl">
        No recent orders found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Order Details</h1>
      {orders.map((order, index) => (
        <div
          key={index}
          className="border p-4 mb-6 rounded shadow bg-white text-blue-900"
        >
          <p className="text-lg mb-2">
            <strong>Order Date:</strong>{" "}
            {new Date(order.orderedAt).toLocaleDateString()}
          </p>
          <p className="text-green-700 font-semibold mb-3">
            📦 Status: {order.status}
          </p>
          <h2 className="font-semibold mb-1">Shipping Address:</h2>
          <p>
            {order.shippingAddress?.label && (
              <strong>{order.shippingAddress.label}: </strong>
            )}
            {order.shippingAddress?.houseNumber}, {order.shippingAddress?.area},{" "}
            {order.shippingAddress?.taluk}, {order.shippingAddress?.district},{" "}
            {order.shippingAddress?.state}, {order.shippingAddress?.country} -{" "}
            {order.shippingAddress?.pincode}
          </p>
          <p className="mt-1">
            📞 Phone: {order.shippingAddress?.primaryPhone}
            {order.shippingAddress?.secondaryPhone &&
              `, ${order.shippingAddress?.secondaryPhone}`}
          </p>

          <h2 className="mt-4 font-semibold">Items:</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span>{item.name}</span>
              <span>
                ₹{item.price} x {item.quantity}
              </span>
            </div>
          ))}
          <div className="flex justify-between mt-3 font-bold">
            <span>Total:</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderPage;
