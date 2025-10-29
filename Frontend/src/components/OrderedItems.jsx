import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OrderedItems() {
  const [orders, setOrders] = useState([]);
  const [reviewTexts, setReviewTexts] = useState({});
  const [ratings, setRatings] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    setOrders([...allOrders].reverse());

    const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const reviewedIds = savedReviews.map((r) => r.orderedAt);
    setSubmittedReviews(reviewedIds);
  }, []);

  const handleCancelOrder = (index) => {
    const updatedOrders = [...orders];
    if (["Ordered", "Shipped"].includes(updatedOrders[index].status)) {
      updatedOrders[index].status = "Cancelled";
      localStorage.setItem("allOrders", JSON.stringify([...updatedOrders].reverse()));
      setOrders(updatedOrders);
      alert("Order has been cancelled.");
    }
  };

  const handleReturnOrder = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = "Return Initiated";
    localStorage.setItem("allOrders", JSON.stringify([...updatedOrders].reverse()));
    setOrders(updatedOrders);
    alert("Return request submitted.");
  };

  const isReturnEligible = (orderedAt) => {
    const orderedDate = new Date(orderedAt);
    const today = new Date();
    const diff = (today - orderedDate) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  };

  const handleTrackOrder = (order) => {
    localStorage.setItem("latestOrder", JSON.stringify(order));
    navigate("/order-tracking");
  };

  const handleOrderAgain = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
    navigate("/cart");
  };

  const handleRatingChange = (index, value) => {
    setRatings((prev) => ({ ...prev, [index]: value }));
  };

  const handleReviewChange = (index, text) => {
    setReviewTexts((prev) => ({ ...prev, [index]: text }));
  };

  const handleSubmitReview = (order, index) => {
    if (!ratings[index]) {
      alert("Please select a star rating.");
      return;
    }

    const newReview = {
      orderedAt: order.orderedAt,
      rating: ratings[index],
      comment: reviewTexts[index] || "",
      items: order.items,
      date: new Date().toISOString(),
    };

    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push(newReview);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    setSubmittedReviews((prev) => [...prev, order.orderedAt]);
    alert("✅ Review submitted successfully!");
  };

  const renderStars = (index) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleRatingChange(index, i)}
          className={`cursor-pointer text-2xl ${
            i <= (ratings[index] || 0) ? "text-yellow-500" : "text-gray-400"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getReviewForOrder = (orderedAt) => {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    return reviews.find((r) => r.orderedAt === orderedAt);
  };

  if (orders.length === 0) {
    return <div className="text-center mt-10 text-red-600">No orders found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📦 All Orders</h1>

      {orders.map((order, index) => {
        const deliveryDate = new Date(order.orderedAt);
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        const showExpectedDate = order.status !== "Cancelled";
        const alreadyReviewed = submittedReviews.includes(order.orderedAt);
        const review = getReviewForOrder(order.orderedAt);

        return (
          <div key={index} className="border p-4 rounded shadow mb-6 bg-white">
            <h2 className="font-semibold mb-2">🛍 Order #{orders.length - index}</h2>
            <p className="text-sm text-gray-600 mb-1">
              🕒 Ordered On: {new Date(order.orderedAt).toLocaleString()}
            </p>
            <p
              className={`text-sm font-medium mb-2 ${
                order.status === "Cancelled"
                  ? "text-red-600"
                  : order.status === "Delivered"
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
            >
              📌 Status: {order.status}
            </p>

            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between border-b py-1 text-sm">
                <span>{item.name} (x{item.quantity})</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="mt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>

            <div className="text-sm mt-2">
              <strong>Payment:</strong> {order.paymentMode}
            </div>
            {showExpectedDate && (
              <div className="text-sm mt-1">
                <strong>📅 Expected Delivery:</strong> {deliveryDate.toDateString()}
              </div>
            )}

            <div className="text-sm mt-2">
              <strong>Shipping Address:</strong>{" "}
              {order.shippingAddress?.label && `${order.shippingAddress.label}: `}
              {order.shippingAddress?.houseNumber}, {order.shippingAddress?.area},{" "}
              {order.shippingAddress?.taluk}, {order.shippingAddress?.district},{" "}
              {order.shippingAddress?.state}, {order.shippingAddress?.country} -{" "}
              {order.shippingAddress?.pincode}
              <br />
              📞 {order.shippingAddress?.primaryPhone}
              {order.shippingAddress?.secondaryPhone &&
                ` / ${order.shippingAddress?.secondaryPhone}`}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              {order.status !== "Cancelled" && (
                <button
                  onClick={() => handleTrackOrder(order)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  🚚 Track Order
                </button>
              )}
              {["Ordered", "Shipped"].includes(order.status) && (
                <button
                  onClick={() => handleCancelOrder(index)}
                  className="bg-red-600 text-white px-4 py-1 rounded"
                >
                  ❌ Cancel Order
                </button>
              )}
              {order.status === "Delivered" && isReturnEligible(order.orderedAt) && (
                <button
                  onClick={() => handleReturnOrder(index)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded"
                >
                  🔄 Return Book
                </button>
              )}
              <button
                onClick={() => handleOrderAgain(order.items)}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                🔁 Order Again
              </button>
            </div>

            {/* ⭐ Review Section */}
            {order.status === "Delivered" && !alreadyReviewed && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-blue-900 mb-2">📝 Leave a Review</h3>
                <div className="flex items-center mb-2">{renderStars(index)}</div>
                <textarea
                  rows="3"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Write your comment..."
                  value={reviewTexts[index] || ""}
                  onChange={(e) => handleReviewChange(index, e.target.value)}
                />
                <button
                  onClick={() => handleSubmitReview(order, index)}
                  className="mt-2 bg-green-700 text-white px-4 py-1 rounded"
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* ✅ Show Submitted Review (if already submitted) */}
            {alreadyReviewed && (
  <div className="mt-4 border-t pt-4">
    <h3 className="font-semibold text-blue-900 mb-2">⭐ Your Review</h3>
    {(() => {
      const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
      const review = allReviews.find(r => r.orderedAt === order.orderedAt);
      return review ? (
        <div>
          <div className="text-yellow-500 text-xl">
            {"★".repeat(review.rating)}{" "}
            <span className="text-gray-400">
              {"★".repeat(5 - review.rating)}
            </span>
          </div>
          <p className="mt-1 text-gray-800">{review.comment}</p>
          <p className="text-xs text-gray-500">
            Reviewed on: {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
      ) : null;
    })()}
  </div>
)}

          </div>
        );
      })}
    </div>
  );
}

export default OrderedItems;
