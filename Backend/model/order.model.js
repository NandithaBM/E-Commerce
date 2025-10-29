import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  shippingAddress: {
    houseNumber: String,
    area: String,
    taluk: String,
    district: String,
    state: String,
    country: String,
    pincode: String,
    label: String,
  },
  status: { type: String, default: "Processing" },
  placedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
