import React from "react";

export function Header({
  dark,
  onToggleDark,
  bookmarkCount = 0,
  onOpenBookmarks,
  onOpenZoningList,
  onOpenLandPrice,
  onOpenStats,
  onOpenGuide,
  onOpenFaq,
  onLocateMe,
  onShareMap,
  onToggleMeasureTool,
  isMeasuringActive = false,
  onToggleFilterPanel,
  isFilterPanelOpen = false,
  onGoCenter,
}) {
  return (
    <header className="gis-header">
      {/* LEFT: BRAND LOGO */}
      <div className="header-left">
        <div className="gis-brand" onClick={onGoCenter} title="Về trung tâm Hà Nội">
          <div className="brand-logo-badge">
            <span className="brand-icon">🗺️</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">Bản đồ Quy hoạch Hà Nội</span>
            <span className="brand-subtitle">WebGIS Tra cứu Quy hoạch & Giá đất</span>
          </div>
        </div>
      </div>

      {/* CENTER: NAV LINKS */}
      <nav className="header-center-nav" aria-label="Main Navigation">
        <button
          className="nav-link-btn"
          onClick={onOpenZoningList}
          title="Xem danh sách toàn bộ các đồ án quy hoạch"
        >
          <span className="nav-icon">📑</span>
          <span>Quy hoạch</span>
        </button>

        <button
          className="nav-link-btn"
          onClick={onOpenLandPrice}
          title="Tra cứu bảng khung giá đất Hà Nội"
        >
          <span className="nav-icon">💰</span>
          <span>Bảng giá đất</span>
        </button>

        <button
          className="nav-link-btn"
          onClick={onOpenStats}
          title="Dashboard thống kê chỉ tiêu Q%"
        >
          <span className="nav-icon">📊</span>
          <span>Chỉ tiêu Q%</span>
        </button>

        <button
          className="nav-link-btn"
          onClick={onOpenGuide}
          title="Hướng dẫn sử dụng bản đồ"
        >
          <span className="nav-icon">📖</span>
          <span>Hướng dẫn</span>
        </button>

        <button
          className="nav-link-btn"
          onClick={onOpenFaq}
          title="Câu hỏi thường gặp"
        >
          <span className="nav-icon">❓</span>
          <span>FAQ</span>
        </button>
      </nav>

      {/* RIGHT: TOOLBAR ACTIONS */}
      <div className="header-right-actions">
        {/* Measure Tool Toggle */}
        <button
          className={`gis-action-btn ${isMeasuringActive ? "btn-active-tool" : ""}`}
          onClick={onToggleMeasureTool}
          title="Công cụ đo khoảng cách và diện tích GIS"
          aria-label="Đo đạc GIS"
        >
          <span className="action-icon">📏</span>
          <span className="action-text">Đo đạc</span>
        </button>

        {/* Filter Panel Toggle */}
        <button
          className={`gis-action-btn ${isFilterPanelOpen ? "btn-active-tool" : ""}`}
          onClick={onToggleFilterPanel}
          title="Bộ lọc nâng cao theo loại đất & hạ tầng"
          aria-label="Bộ lọc quy hoạch"
        >
          <span className="action-icon">⚡</span>
          <span className="action-text">Bộ lọc</span>
        </button>

        {/* Bookmarks Toggle */}
        <button
          className="gis-action-btn btn-bookmark"
          onClick={onOpenBookmarks}
          title="Khu vực quy hoạch đã lưu"
          aria-label="Khu vực yêu thích"
        >
          <span className="action-icon">⭐</span>
          <span className="action-text">Đã lưu</span>
          {bookmarkCount > 0 && (
            <span className="bookmark-counter-badge">{bookmarkCount}</span>
          )}
        </button>

        {/* Share Button */}
        <button
          className="gis-action-btn"
          onClick={onShareMap}
          title="Chia sẻ vị trí bản đồ hiện tại"
          aria-label="Chia sẻ vị trí"
        >
          <span className="action-icon">🔗</span>
          <span className="action-text">Chia sẻ</span>
        </button>

        {/* GPS Locate Me */}
        <button
          className="gis-action-btn btn-locate"
          onClick={onLocateMe}
          title="Xác định vị trí hiện tại của tôi (GPS)"
          aria-label="Vị trí của tôi"
        >
          <span className="action-icon">⌖</span>
          <span className="action-text">Vị trí</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          className="gis-action-btn btn-theme"
          onClick={onToggleDark}
          title={dark ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
          aria-label="Đổi giao diện"
        >
          <span className="action-icon">{dark ? "☀" : "☾"}</span>
        </button>

        {/* Open Map / Go Center button */}
        <button className="btn-primary-open" onClick={onGoCenter}>
          Mở bản đồ
        </button>
      </div>
    </header>
  );
}
