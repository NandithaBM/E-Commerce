const natural = require('natural');
const TfIdf = natural.TfIdf;

// Manual cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * (vecB[i] || 0), 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return normA && normB ? dot / (normA * normB) : 0;
}

function getSimilarBooks(descriptions, targetIndex, topN = 5) {
  const tfidf = new TfIdf();
  descriptions.forEach(desc => tfidf.addDocument(desc));

  const baseVector = [];
  tfidf.listTerms(targetIndex).forEach(term => baseVector.push(term.tfidf));

  const scores = descriptions.map((_, i) => {
    if (i === targetIndex) return null;
    const compareVector = [];
    tfidf.listTerms(i).forEach(term => compareVector.push(term.tfidf));
    return {
      index: i,
      score: cosineSimilarity(baseVector, compareVector),
    };
  }).filter(Boolean);

  return scores.sort((a, b) => b.score - a.score).slice(0, topN).map(s => s.index);
}

module.exports = getSimilarBooks;

