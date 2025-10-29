import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleQuantityChange = (id, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
    navigate("/payment");
  };

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 p-4 mb-4 rounded shadow">
            <div className="flex items-center gap-6">
              <img src={item.image} alt={item.name} className="w-28" />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p>{item.title}</p>
                <p className="font-bold">Price: ₹{item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, -1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >-</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >+</button>
                </div>
                <button
                  className="mt-2 px-4 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <div className="mt-6 text-right">
          <h3 className="text-xl font-bold mb-4">Total: ₹{getTotal()}</h3>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/order-summary", { state: { cartItems } })}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
