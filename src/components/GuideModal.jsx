import React from "react";

export function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content guide-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <span className="title-icon">📖</span>
              Hướng dẫn Sử dụng Bản đồ Quy hoạch & Tra cứu Giá đất
            </h2>
            <p className="modal-subtitle">
              Các bước tra cứu quy hoạch, định vị bất động sản và kiểm tra bảng giá
              đất Hà Nội
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Đóng">
            ✕
          </button>
        </div>

        <div className="modal-body guide-body">
          <div className="guide-step-card">
            <div className="step-badge">Bước 1</div>
            <div className="step-content">
              <h3>Di chuyển & Xem bản đồ quy hoạch</h3>
              <p>
                Sử dụng chuột kéo thả hoặc touchpad để di chuyển đến khu vực cần
                tra cứu. Bạn có thể dùng nút <b>+ / -</b> ở góc trên bên phải hoặc
                con lăn chuột để phóng to/thu nhỏ.
              </p>
            </div>
          </div>

          <div className="guide-step-card">
            <div className="step-badge">Bước 2</div>
            <div className="step-content">
              <h3>Bật / Tắt các lớp bản đồ chuyên đề</h3>
              <p>
                Sử dụng bảng điều khiển bên trái để bật/tắt độc lập các lớp:
                <b> Quy hoạch chung (QHC)</b>, <b>Phân khu (QHPK)</b>,{" "}
                <b>Tuyến Metro hiện hữu & Đang xây</b>, <b>Metro quy hoạch</b>,{" "}
                <b>Ga Metro</b> và <b>Nền rõ đường/nhãn</b>.
              </p>
            </div>
          </div>

          <div className="guide-step-card">
            <div className="step-badge">Bước 3</div>
            <div className="step-content">
              <h3>Tìm kiếm loại đất & Địa điểm nhanh</h3>
              <p>
                Nhập từ khóa loại đất vào ô tìm kiếm (ví dụ: <i>Đất ở</i>,{" "}
                <i>Đất cây xanh</i>, <i>Đất công cộng</i>, <i>Hòa Lạc</i>,{" "}
                <i>Nội Bài</i>, <i>Ga Cát Linh</i>). Bản đồ sẽ tự động làm nổi bật
                vùng tìm kiếm và hiển thị thông tin quy hoạch tương ứng.
              </p>
            </div>
          </div>

          <div className="guide-step-card">
            <div className="step-badge">Bước 4</div>
            <div className="step-content">
              <h3>Xem thông tin chi tiết, Bảng giá đất & Chỉ tiêu Q%</h3>
              <p>
                Click trực tiếp vào bất kỳ vùng quy hoạch nào trên bản đồ để mở
                thẻ thông tin. Từ đó, bạn có thể click nút <b>Bảng giá đất</b> để
                xem khung giá áp dụng cho tuyến đường lân cận hoặc <b>Chỉ tiêu Q%</b>{" "}
                để xem cơ cấu phân bổ đất đai.
              </p>
            </div>
          </div>

          <div className="guide-step-card">
            <div className="step-badge">Bước 5</div>
            <div className="step-content">
              <h3>Định vị vị trí hiện tại (GPS)</h3>
              <p>
                Nhấn nút <b>⌖ Vị trí của tôi</b> để cấp quyền định vị. Bản đồ sẽ
                đánh dấu vị trí hiện tại của bạn và giúp bạn biết vị trí đó thuộc
                quy hoạch loại đất nào.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close-modal" onClick={onClose}>
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
