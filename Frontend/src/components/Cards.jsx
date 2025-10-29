import React from "react";
import { useNavigate } from "react-router-dom";

function Cards({ item }) {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(book => book._id === item._id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Book added to cart!");
  };

  const handleBuyNow = () => {
    localStorage.setItem("checkoutItems", JSON.stringify([{ ...item, quantity: 1 }]));
    navigate("/payment");
  };

  return (
  <div className="mt-4 my-3 p-3">
    <div className="card w-92 bg-base-100 shadow-xl hover:scale-105 duration-200 dark:bg-slate-900 dark:text-white dark:border">
      
      {/* ✅ Wrap figure + body in a click-to-detail div */}
      <div onClick={() => navigate(`/book/${item._id}`)} className="cursor-pointer">
        <figure>
          <img src={item.image} alt={item.name} />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {item.name}
            <div className="badge badge-secondary">{item.category}</div>
          </h2>
          <p>{item.title}</p>
          <div className="badge badge-outline mt-2">₹{item.price}</div>
        </div>
      </div>

      {/* ✅ Action Buttons (not wrapped) */}
      <div className="card-actions justify-between px-4 pb-4">
        <div
          className="cursor-pointer px-2 py-1 rounded-full border-[2px] hover:bg-green-500 hover:text-white"
          onClick={handleAddToCart}
        >
          Add to Cart
        </div>
        <div
          className="cursor-pointer px-2 py-1 rounded-full border-[2px] hover:bg-pink-500 hover:text-white"
          onClick={handleBuyNow}
        >
          Buy Now
        </div>
      </div>

    </div>
  </div>
);

}

export default Cards;
