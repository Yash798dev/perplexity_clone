const { findAnswer } = require('../utils/qa-engine');
const { validateQuery } = require('../utils/validation.utils');

/**
 * GET /api/search?q=<query>
 * Returns an AI-style answer from the QA knowledge base.
 */
function search(req, res, next) {
  try {
    const query = req.query.q || '';
    const validationError = validateQuery(query);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const answer = findAnswer(query.trim());

    res.json({
      query: query.trim(),
      answer,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { search };
