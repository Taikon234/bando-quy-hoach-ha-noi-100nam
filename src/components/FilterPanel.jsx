import React from "react";

export const LAND_USE_FILTER_OPTIONS = [
  { id: "all", label: "Tất cả loại đất", icon: "🌐" },
  { id: "residential", label: "Đất ở / Đô thị", icon: "🏠", color: "#8b2cff" },
  { id: "green", label: "Cây xanh / TDTT", icon: "🌳", color: "#10b981" },
  { id: "water", label: "Mặt nước / Sông hồ", icon: "💧", color: "#0284c7" },
  { id: "public", label: "Công cộng / Dịch vụ", icon: "🏢", color: "#f59e0b" },
  { id: "traffic", label: "Giao thông / Hạ tầng", icon: "🚦", color: "#6366f1" },
  { id: "industrial", label: "Công nghiệp / KCNC", icon: "🏭", color: "#7c3aed" },
];

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onChangeFilters,
  onResetFilters,
  matchedCount = 0,
  totalCount = 0,
}) {
  if (!isOpen) return null;

  const handleGroupChange = (grp) => {
    onChangeFilters({ ...filters, grp });
  };

  const handleLandUseChange = (landUse) => {
    onChangeFilters({ ...filters, landUse });
  };

  const handleMetroChange = (metroStatus) => {
    onChangeFilters({ ...filters, metroStatus });
  };

  const isFiltered =
    filters.grp !== "all" ||
    filters.landUse !== "all" ||
    filters.metroStatus !== "all";

  return (
    <div className="gis-filter-panel">
      <div className="filter-panel-header">
        <div className="filter-header-title">
          <span className="filter-icon">⚡</span>
          <h3>Bộ Lọc Quy Hoạch Nâng Cao</h3>
        </div>
        <button
          className="btn-icon-close"
          onClick={onClose}
          title="Đóng bộ lọc"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>

      <div className="filter-panel-body">
        {/* 1. LOẠI ĐỒ ÁN QUY HOẠCH */}
        <div className="filter-section">
          <div className="filter-section-title">Loại đồ án quy hoạch</div>
          <div className="filter-btn-group">
            <button
              className={`filter-toggle-btn ${
                filters.grp === "all" ? "active" : ""
              }`}
              onClick={() => handleGroupChange("all")}
            >
              Tất cả
            </button>
            <button
              className={`filter-toggle-btn ${
                filters.grp === "QHC" ? "active" : ""
              }`}
              onClick={() => handleGroupChange("QHC")}
            >
              <span className="dot dot-qhc"></span> QHC (Chung)
            </button>
            <button
              className={`filter-toggle-btn ${
                filters.grp === "QHPK" ? "active" : ""
              }`}
              onClick={() => handleGroupChange("QHPK")}
            >
              <span className="dot dot-qhpk"></span> QHPK (Phân khu)
            </button>
          </div>
        </div>

        {/* 2. CHỨC NĂNG SỬ DỤNG ĐẤT */}
        <div className="filter-section">
          <div className="filter-section-title">Chức năng sử dụng đất</div>
          <div className="filter-chip-grid">
            {LAND_USE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className={`filter-chip ${
                  filters.landUse === opt.id ? "active" : ""
                }`}
                onClick={() => handleLandUseChange(opt.id)}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. HẠ TẦNG METRO */}
        <div className="filter-section">
          <div className="filter-section-title">Hạ tầng Đường sắt đô thị (Metro)</div>
          <div className="filter-btn-group">
            <button
              className={`filter-toggle-btn ${
                filters.metroStatus === "all" ? "active" : ""
              }`}
              onClick={() => handleMetroChange("all")}
            >
              Tất cả
            </button>
            <button
              className={`filter-toggle-btn ${
                filters.metroStatus === "operating" ? "active" : ""
              }`}
              onClick={() => handleMetroChange("operating")}
            >
              <i className="rail-indicator green"></i> Đang chạy (Line 2A)
            </button>
            <button
              className={`filter-toggle-btn ${
                filters.metroStatus === "construction" ? "active" : ""
              }`}
              onClick={() => handleMetroChange("construction")}
            >
              <i className="rail-indicator orange"></i> Đang xây (Line 3)
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="filter-panel-footer">
        <div className="filter-result-info">
          Phù hợp: <b>{matchedCount}</b> / {totalCount} vùng
        </div>

        {isFiltered && (
          <button className="btn-reset-filters" onClick={onResetFilters}>
            Xóa bộ lọc ✕
          </button>
        )}
      </div>
    </div>
  );
}
