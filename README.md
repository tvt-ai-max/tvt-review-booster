# TVT Review Booster & Reputation Shield

Intelligent Google Reviews sentiment gating, reputation protection, and internal private feedback capture microservice for TVT Agency clients.

## Overview
- **Positive Path (4-5 Stars)**: Guides happy clients to post a verified 5-star review on Google Maps with copyable review snippets.
- **Shield Path (1-3 Stars)**: Prevents public 1-star reviews by redirecting unhappy clients to a private internal feedback form.
- **Instant Telegram Alert**: Dispatches high-priority alerts with customer contact info immediately to the business owner to resolve issues proactively.
- **Companion WordPress Plugin**: Provides shortcode `[tvt_review_booster place_id="..."]` and QR code generator for printable tent cards.

## Quick Start

```bash
npm install
npm start
```

Default port: `3003`. Open `http://localhost:3003` in a browser.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3003` | Server port |
| `GOOGLE_PLACE_ID` | `YOUR_GOOGLE_PLACE_ID` | Google Maps Place ID |
| `MIN_STARS_FOR_GOOGLE` | `4` | Minimum stars to route to Google |
| `TELEGRAM_BOT_TOKEN` | _(empty)_ | Telegram Bot API token |
| `TELEGRAM_CHAT_ID` | _(empty)_ | Telegram chat ID for alerts |
| `BASE_URL` | `http://localhost:3003` | Public-facing base URL |

Create a `.env` file in the project root to configure these values.

## API Documentation

### `GET /health`

Health check endpoint.

```bash
curl http://localhost:3003/health
```

Response:
```json
{ "status": "ok", "timestamp": "2024-01-15T10:00:00.000Z", "uptime": 123.45 }
```

### `POST /api/v1/sentiment`

Evaluates a customer rating and returns the appropriate routing action.

```bash
curl -X POST http://localhost:3003/api/v1/sentiment \
  -H "Content-Type: application/json" \
  -d '{"rating": 5}'
```

Response (4-5 stars):
```json
{
  "action": "REDIRECT_GOOGLE",
  "target_url": "https://search.google.com/local/writereview?placeid=YOUR_GOOGLE_PLACE_ID",
  "rating": 5
}
```

Response (1-3 stars):
```json
{ "action": "SHOW_FEEDBACK_FORM", "rating": 2 }
```

### `POST /api/v1/feedback`

Submits private customer feedback. Triggers a Telegram alert to the business owner.

```bash
curl -X POST http://localhost:3003/api/v1/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "rating": 2,
    "category": "Thời gian chờ",
    "message": "Tôi đợi quá lâu."
  }'
```

Response:
```json
{ "success": true, "id": "uuid-here" }
```

**Validation rules:**
- `name`: Required, non-empty string
- `phone`: Required, valid Vietnamese phone number (`09x`, `03x`, `05x`, `07x`, `08x`, or `+84...`)
- `rating`: Required, 1-5
- `category`: Required (e.g., "Thái độ phục vụ", "Thời gian chờ", "Chất lượng dịch vụ", "Chi phí")
- `message`: Required, non-empty string

### `GET /api/v1/stats`

Returns aggregated feedback statistics.

```bash
curl http://localhost:3003/api/v1/stats
```

Response:
```json
{ "total": 10, "positive": 7, "negative": 3, "feedbacks": [...] }
```

### `GET /api/v1/qr`

Returns a QR code PNG image pointing to the review page.

```bash
curl http://localhost:3003/api/v1/qr -o qr-code.png
```

Optional query parameter: `?url=https://your-custom-url.com`

## Docker

```bash
docker-compose up -d
```

The service runs on port `3003` with a health check configured.

## WordPress Plugin

### Installation

1. Upload the `wordpress-plugin/` folder to `/wp-content/plugins/tvt-review-booster/`
2. Activate the plugin in WordPress admin
3. Configure at **Settings > TVT Review Booster**

### Shortcode

```
[tvt_review_booster]
```

With custom attributes:

```
[tvt_review_booster place_id="ChIJxxxxxx" min_stars="4" api_url="https://your-api.com"]
```

## Testing

```bash
npm test
```

Runs 68 tests across 5 test files covering:
- Sentiment routing thresholds
- Feedback API endpoints and persistence
- Telegram alert message formatting
- Vietnamese phone number validation
- WordPress plugin structure and shortcode registration

## License

MIT — TVT Agency
