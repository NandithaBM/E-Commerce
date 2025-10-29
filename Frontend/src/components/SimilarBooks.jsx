import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function SimilarBooks({ bookId }) {
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/recommend/${bookId}`);
        setRecommended(res.data);
      } catch (err) {
        console.error("Failed to load recommendations", err);
      }
    };
    fetchRecommendations();
  }, [bookId]);

  if (!recommended.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">📚 You may also like</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {recommended.map((book) => (
          <Link
            to={`/book/${book._id}`}
            key={book._id}
            className="p-4 border rounded hover:shadow bg-white dark:bg-slate-800"
          >
            <h3 className="font-bold">{book.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {book.description.slice(0, 80)}...
            </p>
            <p className="mt-1 text-green-600 font-semibold">₹{book.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SimilarBooks;
