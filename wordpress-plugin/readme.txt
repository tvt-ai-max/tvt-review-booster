=== TVT Review Booster ===
Contributors: tvtagency
Tags: google reviews, reputation management, sentiment gate, feedback, telegram alerts
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 8.1
Stable tag: 1.0.0
License: MIT

Intelligent Google Reviews sentiment gate & reputation shield for Vietnamese SME businesses.

== Description ==

TVT Review Booster routes customer ratings intelligently:

* **4-5 star ratings** → Directed to leave a public Google Maps review with suggested templates
* **1-3 star ratings** → Routed to a private internal feedback form with instant Telegram alerts

This protects your public brand reputation while capturing valuable customer feedback.

== Installation ==

1. Upload the `tvt-review-booster` folder to `/wp-content/plugins/`
2. Activate the plugin through the Plugins menu in WordPress
3. Go to Settings > TVT Review Booster to configure your Google Place ID and API server URL
4. Use the shortcode `[tvt_review_booster]` on any page or post

== Shortcode ==

Basic usage:
`[tvt_review_booster]`

With custom attributes:
`[tvt_review_booster place_id="YOUR_PLACE_ID" min_stars="4" api_url="https://your-api.com"]`

**Attributes:**
* `place_id` - Your Google Place ID (default: from settings)
* `min_stars` - Minimum star rating to redirect to Google (default: 4)
* `api_url` - API server URL (default: from settings)
* `width` - iframe width (default: 100%)
* `height` - iframe height (default: 700)

== Changelog ==

= 1.0.0 =
* Initial release
* Sentiment gate with 5-star rating picker
* Private feedback form with Telegram alerts
* QR code generator for tent cards
* WordPress admin settings page
