import React, { useEffect, useState } from "react";

function Checkout() {
  const [book, setBook] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("selectedBook"));
    setBook(data);
  }, []);

  return (
    <div className="p-8">
      {book ? (
        <div className="bg-white dark:bg-slate-800 p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>
          <img src={book.image} alt={book.name} className="w-48" />
          <h2 className="text-xl mt-2">{book.name}</h2>
          <p>{book.title}</p>
          <p className="mt-2 font-bold">${book.price}</p>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Confirm Purchase
          </button>
        </div>
      ) : (
        <p>Loading book details...</p>
      )}
    </div>
  );
}

export default Checkout;
