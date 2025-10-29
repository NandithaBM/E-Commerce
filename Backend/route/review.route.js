import express from "express";
import { submitReview, getItemReviews } from "../controllers/review.controller.js";

const router = express.Router();

// Submit a new review
router.post("/submit", submitReview);

// Get all reviews for a specific book/item
router.get("/:itemId", getItemReviews);

export default router;
