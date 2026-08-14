import React, { useState, useMemo } from "react";
import { QHC_GEOJSON, QHPK_GEOJSON } from "../data/hanoiZoningData.js";
import { classifyLandUse } from "../mapConfig.js";

export function ZoningListModal({
  isOpen,
  onClose,
  onSelectZoneOnMap,
  onViewZoneDetail,
  onViewLandPrice,
}) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'QHC' | 'QHPK' | 'residential' | 'green' | 'public'

  const allZoningFeatures = useMemo(() => {
    return [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features];
  }, []);

  const filteredFeatures = useMemo(() => {
    return allZoningFeatures.filter((f) => {
      const p = f.properties;
      const q = search.trim().toLowerCase();

      // Search match
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.landUse?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Tab filter
      if (activeTab === "all") return true;
      if (activeTab === "QHC") return p.grp === "QHC";
      if (activeTab === "QHPK") return p.grp === "QHPK";
      if (activeTab === "residential")
        return (
          p.category?.toLowerCase().includes("ở") ||
          p.name?.toLowerCase().includes("ở")
        );
      if (activeTab === "green")
        return (
          p.category?.toLowerCase().includes("cây xanh") ||
          p.category?.toLowerCase().includes("nước")
        );
      if (activeTab === "public")
        return (
          p.category?.toLowerCase().includes("công cộng") ||
          p.category?.toLowerCase().includes("hỗn hợp")
        );
      return true;
    });
  }, [allZoningFeatures, search, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content zoning-list-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <span className="title-icon">📑</span>
              Danh sách Quy hoạch Sử dụng đất Hà Nội
            </h2>
            <p className="modal-subtitle">
              Tra cứu đồ án Quy hoạch chung (QHC) và Quy hoạch phân khu (QHPK)
              Thủ đô
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Đóng">
            ✕
          </button>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="modal-toolbar">
          <div className="modal-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm theo tên khu vực, mã đồ án, loại đất..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="clear-search-btn"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-chips">
            <button
              className={`chip-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả ({allZoningFeatures.length})
            </button>
            <button
              className={`chip-btn ${activeTab === "QHC" ? "active" : ""}`}
              onClick={() => setActiveTab("QHC")}
            >
              QHC Chung ({QHC_GEOJSON.features.length})
            </button>
            <button
              className={`chip-btn ${activeTab === "QHPK" ? "active" : ""}`}
              onClick={() => setActiveTab("QHPK")}
            >
              QHPK Phân khu ({QHPK_GEOJSON.features.length})
            </button>
            <button
              className={`chip-btn ${
                activeTab === "residential" ? "active" : ""
              }`}
              onClick={() => setActiveTab("residential")}
            >
              🏠 Đất ở
            </button>
            <button
              className={`chip-btn ${activeTab === "green" ? "active" : ""}`}
              onClick={() => setActiveTab("green")}
            >
              🌳 Cây xanh / Mặt nước
            </button>
            <button
              className={`chip-btn ${activeTab === "public" ? "active" : ""}`}
              onClick={() => setActiveTab("public")}
            >
              🏢 Công cộng / Hỗn hợp
            </button>
          </div>
        </div>

        {/* LIST CONTENT */}
        <div className="modal-body zoning-grid-list">
          {filteredFeatures.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>Không tìm thấy khu vực quy hoạch phù hợp</h3>
              <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác.</p>
              <button
                className="reset-filter-btn"
                onClick={() => {
                  setSearch("");
                  setActiveTab("all");
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            filteredFeatures.map((f) => {
              const p = f.properties;
              const { icon, label } = classifyLandUse(p.category || p.name);

              return (
                <div key={f.id || p.code} className="zoning-card">
                  <div className="card-top">
                    <span
                      className={`card-badge ${
                        p.grp === "QHPK" ? "badge-qhpk" : "badge-qhc"
                      }`}
                    >
                      {p.grp === "QHPK"
                        ? "Phân khu (QHPK)"
                        : "Quy hoạch chung (QHC)"}
                    </span>
                    <span className="card-code">{p.code}</span>
                  </div>

                  <h3 className="card-title">{p.name}</h3>

                  <div className="card-category">
                    <span className="category-emoji">{icon}</span>
                    <span className="category-name">{label}</span>
                    <span className="category-divider">·</span>
                    <span className="category-landuse">{p.landUse}</span>
                  </div>

                  <div className="card-stats-grid">
                    <div className="stat-col">
                      <span className="stat-label">Diện tích</span>
                      <span className="stat-value">{p.area || "Đang duyệt"}</span>
                    </div>
                    <div className="stat-col">
                      <span className="stat-label">Mật độ XD</span>
                      <span className="stat-value">{p.density || "Chuẩn QC"}</span>
                    </div>
                    <div className="stat-col">
                      <span className="stat-label">Tầng cao</span>
                      <span className="stat-value">
                        {p.maxFloors || "Theo TKĐT"}
                      </span>
                    </div>
                  </div>

                  <p className="card-desc">{p.description}</p>

                  <div className="card-footer-actions">
                    <button
                      className="btn-action btn-map"
                      onClick={() => {
                        onClose();
                        onSelectZoneOnMap(f);
                      }}
                      title="Xem vị trí trên bản đồ"
                    >
                      🗺️ Xem bản đồ
                    </button>

                    <button
                      className="btn-action btn-detail"
                      onClick={() => onViewZoneDetail(f)}
                      title="Xem chi tiết và chỉ tiêu Q%"
                    >
                      📊 Chỉ tiêu Q%
                    </button>

                    <button
                      className="btn-action btn-price"
                      onClick={() => {
                        onClose();
                        onViewLandPrice(p.code);
                      }}
                      title="Xem bảng giá đất khu vực này"
                    >
                      💰 Bảng giá đất
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="modal-footer">
          <span className="footer-info">
            Hiển thị <b>{filteredFeatures.length}</b> / {allZoningFeatures.length}{" "}
            đồ án quy hoạch
          </span>
          <button className="btn-close-modal" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
