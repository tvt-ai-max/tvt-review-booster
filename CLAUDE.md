# CLAUDE.md — TVT Review Booster & Reputation Shield

## Project Overview
This repository contains the TVT Review Booster & Reputation Shield microservice and WordPress companion plugin. It intelligently routes customers: 4-5 star positive ratings are directed to leave a public Google Maps review, while 1-3 star negative ratings are routed to a private internal feedback form with immediate high-priority Telegram alerts to the business owner, protecting public brand reputation.

## Tech Stack & Architecture
- **Backend**: Node.js (CommonJS), Express, CORS, Helmet, Rate Limiter (`port 3003`).
- **Frontend**: Mobile-first responsive HTML5/CSS3/Vanilla JS with TVT Agency Design Tokens.
- **WordPress Companion**: Pure PHP 8.1+ plugin registering shortcode `[tvt_review_booster]`.
- **Integrations**: Telegram Bot API for instant grievance alerts, QRCode generation for in-store tent cards.
- **Testing**: Node.js built-in test runner (`node --test tests/*.test.js`).

## Design Tokens (TVT Agency Brand)
- Navy Blue: `#003189`
- Amber Gold: `#FA8A1A`
- Dark Charcoal: `#0D0D1A`
- Off-White: `#F8FAFC`
- Emerald Green (Success): `#16A34A`
- Crimson Red (Alert): `#DC2626`

## Implementation Checklist
1. `src/server.js` & `src/config.js`:
   - Express app on port 3003, static file serving (`public/`), rate limiter, CORS, routes.
2. `src/routes/api.js`:
   - `POST /api/v1/sentiment`: Evaluates rating (1-5), returns action (`REDIRECT_GOOGLE` or `SHOW_FEEDBACK_FORM`) and Google Maps target URL.
   - `POST /api/v1/feedback`: Validates Vietnamese phone, saves feedback, triggers Telegram alert.
   - `GET /api/v1/stats`: Returns aggregated stats (total, positive, negative).
   - `GET /api/v1/qr`: Generates QR code PNG buffer.
3. `src/services/sentiment-router.js`:
   - Threshold evaluation (default min_stars: 4).
   - Generates Google Review link `https://search.google.com/local/writereview?placeid=${placeId}`.
4. `src/services/feedback-storage.js`:
   - Thread-safe local JSON persistence in `data/feedback.json`.
5. `src/services/telegram-alert.js`:
   - Formatted Vietnamese Telegram message dispatcher with siren emoji 🚨 and details.
6. `src/services/qr-generator.js`:
   - Generates QR code data URL / buffer using `qrcode` npm package.
7. `public/`:
   - `index.html`: Mobile-optimized screen with 5-star selector and dynamic reactive UI.
   - `style.css`: TVT design tokens, animated emojis, smooth state transitions.
   - `app.js`: State management (RATING -> POSITIVE_REDIRECT | NEGATIVE_FORM -> SUBMITTED).
8. `wordpress-plugin/tvt-review-booster.php`:
   - Shortcode `[tvt_review_booster place_id="" min_stars="4"]`, admin settings.
9. `tests/`:
   - `tests/sentiment-routing.test.js`: Validates threshold logic (1-3 stars vs 4-5 stars).
   - `tests/feedback-api.test.js`: Validates API request/response and persistence.
   - `tests/telegram-alert.test.js`: Validates message formatting and alert triggers.
   - `tests/validation.test.js`: Validates VN phone regex and required fields.
   - `tests/wp-plugin.test.js`: Validates WP plugin file structure and shortcode regex.
10. `Dockerfile` & `docker-compose.yml`:
   - Production Docker container on port 3003 with healthcheck.

## Verification Command
```bash
npm test
```
All tests must pass with 0 failures before pushing.
