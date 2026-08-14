# Bản đồ quy hoạch Hà Nội - React + MapLibre

Project này dựng bản đồ theo hướng của:
https://locsummer.github.io/bando-quy-hoach-ha-noi/

Dữ liệu Vector Tiles:
- Quy hoạch: https://gateway.datviet.ai/api/tiles/hanoi/{z}/{x}/{y}.pbf
- Basemap: https://gateway.datviet.ai/api/tiles/basemap-hanoi/{z}/{x}/{y}.pbf
- TileJSON: https://gateway.datviet.ai/api/tiles/hanoi/tilejson.json
- Font glyphs: https://gateway.datviet.ai/font/{fontstack}/{range}.pbf

## Chạy

```bash
npm install
npm run dev
```

Mở http://localhost:5173

## Điểm quan trọng

Layer quy hoạch là `zoning`. Các thuộc tính chính:
- `name`
- `grp`: QHC / QHPK
- `lno`
- `fc`: màu vùng

MapLibre đọc MVT/PBF trực tiếp, không cần convert từng tile sang JSON.
Vite proxy `/api` và `/font` giúp tránh CORS khi chạy localhost.
