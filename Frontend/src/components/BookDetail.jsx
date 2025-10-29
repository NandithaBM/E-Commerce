import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SimilarBooks from "./SimilarBooks";
import BookReviews from "./BookReviews"; 

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/book/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <div className="p-6 text-center">📦 Loading book details...</div>;
  if (!book) return <div className="p-6 text-center text-red-600">Book not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{book.name || book.title}</h1>
      <p className="text-gray-600 mb-2">Author: {book.author}</p>
      <p className="mb-4">{book.description || "No description available."}</p>
      <p className="font-semibold text-green-600 mb-2">Price: ₹{book.price}</p>

      {book.image && (
        <img
          src={book.image}
          alt={book.name}
          className="w-48 h-auto rounded-md shadow mb-4"
        />
      )}

      {/* ⭐️ Show Similar Books Here */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">📚 Recommended Books</h2>
        <SimilarBooks bookId={book._id} />
        <BookReviews bookId={book._id} />
      </div>
    </div>
  );
}

export default BookDetail;
