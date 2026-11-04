const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { evaluateRating } = require('../src/services/sentiment-router');

describe('Sentiment Router', () => {
  it('returns REDIRECT_GOOGLE for 5-star rating', () => {
    const result = evaluateRating(5);
    assert.equal(result.action, 'REDIRECT_GOOGLE');
    assert.equal(result.rating, 5);
    assert.ok(result.target_url.includes('search.google.com/local/writereview'));
  });

  it('returns REDIRECT_GOOGLE for 4-star rating', () => {
    const result = evaluateRating(4);
    assert.equal(result.action, 'REDIRECT_GOOGLE');
    assert.equal(result.rating, 4);
  });

  it('returns SHOW_FEEDBACK_FORM for 3-star rating', () => {
    const result = evaluateRating(3);
    assert.equal(result.action, 'SHOW_FEEDBACK_FORM');
    assert.equal(result.rating, 3);
    assert.equal(result.target_url, undefined);
  });

  it('returns SHOW_FEEDBACK_FORM for 2-star rating', () => {
    const result = evaluateRating(2);
    assert.equal(result.action, 'SHOW_FEEDBACK_FORM');
    assert.equal(result.rating, 2);
  });

  it('returns SHOW_FEEDBACK_FORM for 1-star rating', () => {
    const result = evaluateRating(1);
    assert.equal(result.action, 'SHOW_FEEDBACK_FORM');
    assert.equal(result.rating, 1);
  });

  it('uses custom place_id in Google review URL', () => {
    const result = evaluateRating(5, { placeId: 'ChIJTestPlace123' });
    assert.ok(result.target_url.includes('placeid=ChIJTestPlace123'));
  });

  it('supports custom threshold via minStars', () => {
    const result3stars = evaluateRating(3, { minStars: 3 });
    assert.equal(result3stars.action, 'REDIRECT_GOOGLE');

    const result2stars = evaluateRating(2, { minStars: 3 });
    assert.equal(result2stars.action, 'SHOW_FEEDBACK_FORM');
  });

  it('throws error for invalid rating 0', () => {
    assert.throws(() => evaluateRating(0), { message: 'Rating must be between 1 and 5' });
  });

  it('throws error for invalid rating 6', () => {
    assert.throws(() => evaluateRating(6), { message: 'Rating must be between 1 and 5' });
  });

  it('throws error for non-numeric rating', () => {
    assert.throws(() => evaluateRating('abc'), { message: 'Rating must be between 1 and 5' });
  });

  it('accepts string rating and converts to number', () => {
    const result = evaluateRating('5');
    assert.equal(result.action, 'REDIRECT_GOOGLE');
    assert.equal(result.rating, 5);
  });
});
