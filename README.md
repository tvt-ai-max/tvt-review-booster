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
Default port: `3003`.

## Testing
```bash
npm test
```
Runs the automated test suite verifying sentiment routing, feedback persistence, and Telegram notification payloads.
