const config = require('../config');

function evaluateRating(rating, options = {}) {
  const minStars = options.minStars || config.MIN_STARS_FOR_GOOGLE;
  const placeId = options.placeId || config.GOOGLE_PLACE_ID;
  const numRating = parseInt(rating, 10);

  if (!numRating || numRating < 1 || numRating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  if (numRating >= minStars) {
    return {
      action: 'REDIRECT_GOOGLE',
      target_url: `https://search.google.com/local/writereview?placeid=${placeId}`,
      rating: numRating,
    };
  }

  return {
    action: 'SHOW_FEEDBACK_FORM',
    rating: numRating,
  };
}

module.exports = { evaluateRating };
