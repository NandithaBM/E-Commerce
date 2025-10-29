import React, { useEffect, useState } from "react";
import axios from "axios";

function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/reviews/${bookId}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchReviews();
  }, [bookId]);

  if (reviews.length === 0) {
    return <p className="text-gray-500 mt-4">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">⭐ Reviews & Ratings</h3>
      {reviews.map((review, i) => (
        <div key={i} className="border-b py-3">
          <p className="font-semibold text-blue-800">{review.userName || "Anonymous"}</p>
          <p className="text-yellow-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
          <p>{review.comment}</p>
          <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default BookReviews;
