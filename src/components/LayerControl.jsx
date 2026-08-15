import React from "react";
import { LAYER_DEFINITIONS, QUICK_DESTINATIONS } from "../mapConfig.js";

export function LayerControl({
  isOpen,
  onToggleOpen,
  layers,
  onToggleLayer,
  onShowAllLayers,
  onHideAllLayers,
  onSelectDestination,
  onOpenZoningList,
  onOpenLandPrice,
  onOpenStats,
}) {
  return (
    <>
      <aside className={`gis-layer-control ${isOpen ? "open" : "collapsed"}`}>
        <div className="layer-control-header">
          <div className="layer-title-wrapper">
            <span className="layers-badge-icon">▱</span>
            <h2>Lớp Bản Đồ Quy Hoạch</h2>
          </div>

          <div className="header-layer-buttons">
            <button
              className="btn-layer-batch"
              onClick={onShowAllLayers}
              title="Bật tất cả các lớp bản đồ"
            >
              Hiện tất cả
            </button>
            <button
              className="btn-layer-batch"
              onClick={onHideAllLayers}
              title="Ẩn tất cả các lớp bản đồ"
            >
              Ẩn tất cả
            </button>
            <button
              className="btn-collapse-drawer"
              onClick={onToggleOpen}
              title="Thu gọn bảng điều khiển"
              aria-label="Thu gọn"
            >
              ‹
            </button>
          </div>
        </div>

        <div className="layer-control-body">
          {/* LAYER TOGGLES */}
          <div className="layer-items-group">
            <LayerCheckbox
              color={LAYER_DEFINITIONS.qhc.color}
              label={LAYER_DEFINITIONS.qhc.label}
              checked={layers.qhc}
              onChange={() => onToggleLayer("qhc")}
            />

            <LayerCheckbox
              color={LAYER_DEFINITIONS.qhpk.color}
              label={LAYER_DEFINITIONS.qhpk.label}
              checked={layers.qhpk}
              onChange={() => onToggleLayer("qhpk")}
            />

            <LayerCheckbox
              color={LAYER_DEFINITIONS.metro.color}
              label={LAYER_DEFINITIONS.metro.label}
              checked={layers.metro}
              onChange={() => onToggleLayer("metro")}
            />

            <LayerCheckbox
              gradient
              label={LAYER_DEFINITIONS.metroPlan.label}
              checked={layers.metroPlan}
              onChange={() => onToggleLayer("metroPlan")}
            />

            <LayerCheckbox
              circle
              label={LAYER_DEFINITIONS.stations.label}
              checked={layers.stations}
              onChange={() => onToggleLayer("stations")}
            />

            <LayerCheckbox
              road
              label={LAYER_DEFINITIONS.roads.label}
              checked={layers.roads}
              onChange={() => onToggleLayer("roads")}
            />
          </div>

          <div className="drawer-divider"></div>

          {/* QUICK SHORTCUTS */}
          <div className="quick-section-heading">⚡ Tra cứu nhanh:</div>
          <div className="quick-shortcuts-row">
            <button className="shortcut-card-btn" onClick={onOpenZoningList}>
              <span>📑</span> Đồ án QH
            </button>
            <button className="shortcut-card-btn" onClick={onOpenLandPrice}>
              <span>💰</span> Bảng giá đất
            </button>
            <button className="shortcut-card-btn" onClick={onOpenStats}>
              <span>📊</span> Chỉ tiêu Q%
            </button>
          </div>

          <div className="drawer-divider"></div>

          {/* QUICK DESTINATIONS */}
          <div className="quick-section-heading">✥ Đến nhanh khu vực:</div>
          <div className="quick-dest-grid">
            {QUICK_DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                className="dest-chip-btn"
                onClick={() => onSelectDestination(dest)}
                title={dest.description}
              >
                {dest.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* FLOAT BUTTON TO REOPEN WHEN COLLAPSED */}
      {!isOpen && (
        <button
          className="gis-layer-reopen-btn"
          onClick={onToggleOpen}
          title="Mở danh sách lớp bản đồ"
          aria-label="Mở lớp bản đồ"
        >
          <span className="reopen-icon">▱</span>
          <span className="reopen-text">Lớp bản đồ</span>
          <span className="reopen-arrow">›</span>
        </button>
      )}
    </>
  );
}

function LayerCheckbox({
  color,
  gradient,
  circle,
  road,
  label,
  checked,
  onChange,
}) {
  return (
    <label className="gis-layer-item">
      {gradient ? (
        <span className="layer-swatch swatch-gradient"></span>
      ) : circle ? (
        <span className="layer-swatch swatch-circle"></span>
      ) : road ? (
        <span className="layer-swatch swatch-road"></span>
      ) : (
        <span
          className="layer-swatch"
          style={{
            background: color,
          }}
        ></span>
      )}

      <span className="layer-item-title">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span className="layer-custom-checkbox">{checked ? "✓" : ""}</span>
    </label>
  );
}
