import express from 'express';
import Book from '../model/book.model.js';
import getSimilarBooks from '../utils/recommendationEngine.cjs';

const router = express.Router();

router.get('/:bookId', async (req, res) => {
  try {
    const books = await Book.find({});
    const targetBook = books.find(b => b._id.toString() === req.params.bookId);

    if (!targetBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // 1. Content-based Similarity (TF-IDF)
    const descriptions = books.map(b => b.description);
    const index = books.findIndex(b => b._id.toString() === req.params.bookId);
    const similarIndices = getSimilarBooks(descriptions, index);
    const similarBooks = similarIndices.map(i => books[i]);

    // 2. Category-based Similarity
    const sameCategoryBooks = books.filter(
      b => b.category === targetBook.category && b._id.toString() !== req.params.bookId
    );

    // 3. Merge and remove duplicates
    const allRecommendations = [...similarBooks];

    for (let book of sameCategoryBooks) {
      const alreadyIncluded = allRecommendations.some(b => b._id.toString() === book._id.toString());
      if (!alreadyIncluded) {
        allRecommendations.push(book);
      }
    }

    // Optional: Limit results to top N
    const finalRecommendations = allRecommendations.slice(0, 10);

    res.json(finalRecommendations);
  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
