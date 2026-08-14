import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Dữ liệu quy hoạch trên website được cập nhật từ nguồn nào?",
    a: "Dữ liệu được chuẩn hóa dựa trên Đồ án Quy hoạch chung xây dựng Thủ đô Hà Nội đến năm 2030 và tầm nhìn đến năm 2050 (Quyết định số 1259/QĐ-TTg của Thủ tướng Chính phủ) và các Đồ án Quy hoạch phân khu đô thị (H1-1, H1-2, H1-3, H1-4, S1..S5, N1..N11) do UBND TP Hà Nội phê duyệt."
  },
  {
    q: "Bảng giá đất trên website được tính như thế nào?",
    a: "Khung giá đất hiển thị trên hệ thống được trích xuất từ Bảng giá đất Thành phố Hà Nội (ban hành kèm Quyết định số 30/2019/QĐ-UBND và các quy định sửa đổi bổ sung áp dụng cho giai đoạn 2024 - 2026), chia thành 4 vị trí từ mặt phố đến các cấp ngõ."
  },
  {
    q: "Chỉ số Q% có ý nghĩa gì trong quy hoạch?",
    a: "Chỉ số Q% đại diện cho Tỷ lệ % phân bổ cơ cấu sử dụng đất (Đất ở, Đất cây xanh, Đất giao thông, Đất công cộng) theo Quy chuẩn kỹ thuật quốc gia QCVN 01:2021/BXD và Tỷ lệ hoàn thành phê duyệt đồ án quy hoạch phân khu tại từng quận, huyện."
  },
  {
    q: "Tôi có thể xem quy hoạch trên điện thoại di động không?",
    a: "Có. Website được thiết kế tương thích hoàn toàn (responsive) trên mọi thiết bị: Máy tính để bàn, Máy tính bảng (iPad/Tablet) và Điện thoại di động (iPhone/Android). Bảng điều khiển bên trái có thể thu gọn mượt mà."
  },
  {
    q: "Làm thế nào để biết thửa đất của tôi có bị dính quy hoạch đường mở rộng không?",
    a: "Bạn có thể bật lớp 'Nền rõ đường / nhãn' và 'Quy hoạch chung / Phân khu', sau đó nhấn nút 'Vị trí của tôi' hoặc tìm kiếm tuyến đường của bạn để đối chiếu ranh giới quy hoạch màu tím (QHC) hoặc màu cam (QHPK)."
  }
];

export function FaqModal({ isOpen, onClose }) {
  const [openIdx, setOpenIdx] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content faq-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <span className="title-icon">❓</span>
              Câu hỏi thường gặp (FAQ)
            </h2>
            <p className="modal-subtitle">
              Giải đáp thắc mắc về tra cứu quy hoạch, khung giá đất và các chỉ tiêu
              đô thị
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Đóng">
            ✕
          </button>
        </div>

        <div className="modal-body faq-body">
          <div className="faq-list">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className={`faq-card ${openIdx === idx ? "expanded" : ""}`}
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span className="faq-arrow">{openIdx === idx ? "▲" : "▼"}</span>
                </div>
                {openIdx === idx && (
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close-modal" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
