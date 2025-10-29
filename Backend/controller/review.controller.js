import Review from "../models/review.model.js";

// Submit a review
export const submitReview = async (req, res) => {
  try {
    const { userId, orderId, itemId, rating, comment } = req.body;

    const existing = await Review.findOne({ userId, orderId, itemId });
    if (existing) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    const review = new Review({ userId, orderId, itemId, rating, comment });
    await review.save();
    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    console.error("Submit review error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reviews for a specific item (book)
export const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ itemId }).populate("userId", "fullname");
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
