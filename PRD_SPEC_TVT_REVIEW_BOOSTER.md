# PRODUCT REQUIREMENT DOCUMENT (PRD) & SPECIFICATION
## TVT Review Booster & Reputation Shield (Google Reviews Sentiment Gate)

**Organization**: TVT Agency (`tvtagency.com` / `toilatung.com`)  
**Project**: `tvt-review-booster`  
**Architecture Lead**: Nguyễn Thanh Tùng (Founder)  
**Operations Lead**: Lexi AI (Senior Operations Manager)  
**Target Repository**: `https://github.com/tvt-ai-max/tvt-review-booster`  
**Design Tokens**: Dark Navy `#003189`, Amber Gold `#FA8A1A`, Charcoal `#0D0D1A`, Off-White `#F8FAFC`, Emerald `#16A34A`, Red `#DC2626`

---

## 1. MỤC TIÊU SẢN PHẨM (MISSION & GOALS)
- Xây dựng **Hệ thống phễu lọc đánh giá thông minh (Sentiment Gate & Reputation Shield)** giúp các doanh nghiệp SME, phòng khám, spa, nhà hàng gia tăng đánh giá 5 sao trên Google Maps và **triệt tiêu 100% rủi ro bị bão 1 sao tiêu cực công khai**.
- Cung cấp dưới 2 định dạng:
  1. **Microservice API + Mobile Web App độc lập** (`src/` chạy port `3003` hoặc nhúng qua iframe/QR Code).
  2. **WordPress Companion Plugin** (`wordpress-plugin/tvt-review-booster.php`) cung cấp shortcode `[tvt_review_booster]` và tự sinh mã QR in ấn để bàn / chân trang hóa đơn.
- Tích hợp trực tiếp hệ thống cảnh báo tức thì qua Telegram Bot API để Ban Giám đốc nhận tin ngay khi có khách hàng không hài lòng.

---

## 2. QUY TRÌNH HOẠT ĐỘNG (SENTIMENT GATEWAY FLOW)

```
[Khách quét mã QR tại bàn / Nhận tin nhắn sau dịch vụ]
                     │
                     ▼
[Màn hình Đánh giá Trải nghiệm: Chọn từ 1 đến 5 Sao]
  (Animated Emoji: 1=😡, 2=🙁, 3=😐, 4=😊, 5=🤩)
                     │
       ┌─────────────┴─────────────┐
       ▼ (Nếu chọn 4 - 5 Sao)      ▼ (Nếu chọn 1 - 3 Sao)
[PHỄU ĐẨY ĐÁNH GIÁ GOOGLE MAPS]  [LÁ CHẮN BẢO VỆ UY TÍN NỘI BỘ]
• Lời cảm ơn ấm áp              • Lời xin lỗi chân thành & cầu thị
• Gợi ý mẫu nội dung khen ngợi  • Form góp ý kín nội bộ:
• Nút 1-Click: "ĐÁNH GIÁ TRÊN     - Họ tên & SĐT/Zalo khách
  GOOGLE MAPS" (Mở thẳng URL       - Danh mục (Thái độ, Thời gian,
  https://search.google.com/...)     Chi phí, Chuyên môn)
• Ghi nhận Analytics POSITIVE      - Nội dung chi tiết
                                   │
                                   ▼ (Bấm "GỬI GÓP Ý")
                                • Lưu trữ nội bộ an toàn (JSON/SQLite)
                                • BẮN TELEGRAM CẢNH BÁO KHẨN CẤP 🚨
                                • Hiển thị nút Hotline Zalo VIP giải quyết
```

---

## 3. CẤU TRÚC TỆP TIN DỰ ÁN (FILE STRUCTURE)

```
tvt-review-booster/
├── PRD_SPEC_TVT_REVIEW_BOOSTER.md
├── CLAUDE.md
├── README.md
├── package.json
├── Dockerfile
├── docker-compose.yml
├── src/
│   ├── server.js                  # Express API server (port 3003)
│   ├── config.js                  # Environment & default settings
│   ├── routes/
│   │   ├── api.js                 # API endpoints (/sentiment, /feedback, /stats, /qr)
│   │   └── health.js              # /health check
│   ├── services/
│   │   ├── sentiment-router.js    # Logic phân luồng dựa trên số sao (>=4 -> Google, <4 -> Internal)
│   │   ├── feedback-storage.js    # Lưu trữ feedback vào data/feedback.json (thread-safe)
│   │   ├── telegram-alert.js      # Gửi cảnh báo khẩn cấp định dạng tiếng Việt qua Telegram Bot
│   │   └── qr-generator.js        # Sinh mã QR ảnh PNG/SVG từ link review
│   └── data/
│       └── feedback.json          # Persistent store
├── public/
│   ├── index.html                 # Mobile-first interactive review page
│   ├── style.css                  # TVT Design tokens & responsive styling
│   └── app.js                     # Vanilla JS state machine & animations
├── wordpress-plugin/
│   ├── tvt-review-booster.php     # Pure PHP 8.1+ WP Plugin with [tvt_review_booster]
│   └── readme.txt                 # Plugin documentation
└── tests/
    ├── sentiment-routing.test.js  # Testing routing thresholds (stars logic)
    ├── feedback-api.test.js       # Testing POST /api/v1/feedback
    ├── telegram-alert.test.js     # Testing Telegram payload formatter
    ├── validation.test.js         # Testing phone number and input validation
    └── wp-plugin.test.js          # Testing WP plugin headers and shortcodes
```

---

## 4. CHI TIẾT KỸ THUẬT & API SPECIFICATION
- **API Endpoints**:
  - `GET /health`: Trả về trạng thái server.
  - `POST /api/v1/sentiment`: Nhận `{ rating: 1-5 }`, trả về `{ action: "REDIRECT_GOOGLE"|"SHOW_FEEDBACK_FORM", target_url: "..." }`.
  - `POST /api/v1/feedback`: Nhận `{ name, phone, rating, category, message, place_id }`, lưu vào DB và gửi Telegram cảnh báo.
  - `GET /api/v1/stats`: Thống kê tổng số review, tỷ lệ 5 sao vs khiếu nại kín.
  - `GET /api/v1/qr`: Trả về mã QR dạng PNG để in ấn.
- **Telegram Alert Template**:
  ```
  🚨 [CẢNH BÁO KHIẾU NẠI KHÁCH HÀNG] 🚨
  • Đánh giá: ⭐️ 2/5 Sao
  • Khách hàng: Nguyễn Văn A (0912345678)
  • Vấn đề: Thời gian chờ quá lâu
  • Nội dung: "Tôi đặt lịch lúc 9h nhưng phải đợi đến 10h mới được phục vụ..."
  • Đơn vị: Nha khoa TVT Smile
  👉 Ban Giám đốc cần liên hệ xử lý ngay trước khi khách đăng lên mạng xã hội!
  ```
- **Tests**: 100% tests pass bằng `node --test tests/*.test.js`.
