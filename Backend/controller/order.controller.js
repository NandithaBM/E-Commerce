import Order from "../model/order.model.js";

export const placeOrder = async (req, res) => {
  const { userId, cartItems, shippingAddress } = req.body;

  if (!userId || !shippingAddress || !cartItems?.length) {
    return res.status(400).json({ message: "Incomplete order details" });
  }

  try {
    const order = new Order({
      userId,
      items: cartItems.map(item => ({
        bookId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      shippingAddress,
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Order placement failed:", err.message);
    res.status(500).json({ message: "Failed to place order" });
  }
};
