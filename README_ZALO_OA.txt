# Sổ tay sức khỏe – Tích hợp Zalo OA Menu

## 1) Triển khai
- Upload toàn bộ thư mục này lên hosting HTTPS (ví dụ: Cloudflare Pages, Firebase Hosting, GitHub Pages + Cloudflare).
- Đảm bảo URL có dạng: `https://ten-mien-cua-ban/...`

## 2) Gắn vào Menu OA
- Truy cập: OA Manager (https://oa.zalo.me/manage) → **Cài đặt** → **Cấu hình Menu**.
- Thêm mục **Mở website** và dán URL tới `index.html`, ví dụ:
  `https://ten-mien-cua-ban/index.html?age=18-59&conds=htn,dm2`
- Lưu & Xuất bản menu.

## 3) Deep-link tham số
- `age`: `0-5` | `6-17` | `18-59` | `60+`
- `conds`: danh sách id cách nhau dấu phẩy, ví dụ: `htn,dm2`.
- Ví dụ đầy đủ: `...?age=60+&conds=htn,dyslipidemia`

## 4) Offline
- Lần đầu người dùng mở từ Zalo có mạng, Service Worker sẽ tải cache → những lần sau **vẫn dùng được khi mất sóng**.

## 5) Lưu ý nhúng trong WebView Zalo
- Ứng dụng này không chặn nhúng; không đặt `X-Frame-Options: DENY`.
- Nếu áp dụng CSP, vui lòng thêm: `frame-ancestors https://*.zalo.me https://*.zalo.vn 'self';`

## 6) Theo dõi truy cập (tùy chọn)
- Thêm các tham số theo dõi: `utm_source=zalo_oa&utm_campaign=menu_sotay`.
- Hoặc cấu hình endpoint log của Trạm Y tế để ghi nhận truy cập.

—