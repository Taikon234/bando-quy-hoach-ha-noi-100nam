import React, { useState, useEffect } from "react";
import { getBookmarks, removeBookmark } from "../utils/bookmarkUtils.js";
import { classifyLandUse } from "../mapConfig.js";

export function BookmarkPanel({
  isOpen,
  onClose,
  onSelectBookmarkOnMap,
  onBookmarksChanged,
}) {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setBookmarks(getBookmarks());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemove = (e, code) => {
    e.stopPropagation();
    const updated = removeBookmark(code);
    setBookmarks(updated);
    if (onBookmarksChanged) onBookmarksChanged();
  };

  const handleSelect = (item) => {
    onClose();
    if (onSelectBookmarkOnMap) {
      onSelectBookmarkOnMap(item);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content bookmark-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <span className="title-icon">⭐</span>
              Khu Vực Quy Hoạch Đã Lưu ({bookmarks.length})
            </h2>
            <p className="modal-subtitle">
              Danh sách các khu vực quy hoạch yêu thích được lưu trên thiết bị của
              bạn
            </p>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            title="Đóng"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="modal-body bookmark-body">
          {bookmarks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>Chưa có khu vực quy hoạch nào được lưu</h3>
              <p>
                Khi tra cứu trên bản đồ hoặc danh sách quy hoạch, nhấn vào biểu
                tượng <b>⭐ Yêu thích</b> để lưu lại và xem nhanh tại đây.
              </p>
            </div>
          ) : (
            <div className="bookmarks-list">
              {bookmarks.map((item) => {
                const { icon, label } = classifyLandUse(item.category || item.name);
                const dateStr = item.savedAt
                  ? new Date(item.savedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <div
                    key={item.code}
                    className="bookmark-card-item"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="bm-left">
                      <span className="bm-icon">{icon}</span>
                      <div className="bm-info">
                        <div className="bm-title-row">
                          <span className="bm-title">{item.name}</span>
                          <span className="bm-code-pill">{item.code}</span>
                        </div>
                        <div className="bm-meta">
                          <span>{label}</span>
                          {item.area && <span>· Diện tích: {item.area}</span>}
                          {dateStr && <span>· Lưu ngày: {dateStr}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="bm-actions">
                      <button
                        className="btn-bm-fly"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(item);
                        }}
                        title="Xem trên bản đồ"
                      >
                        🗺️ Xem
                      </button>

                      <button
                        className="btn-bm-delete"
                        onClick={(e) => handleRemove(e, item.code)}
                        title="Xóa khỏi danh sách lưu"
                        aria-label="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <span className="footer-info">
            Dữ liệu được lưu an toàn trong bộ nhớ cục bộ (Local Storage).
          </span>
          <button className="btn-close-modal" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
