import React from "react";
import { formatDistance, formatArea } from "../utils/geoUtils.js";

export function MeasureTool({
  isActive,
  mode, // 'distance' | 'area'
  onChangeMode,
  pointsCount = 0,
  measuredValue = 0,
  onUndoPoint,
  onClearMeasure,
  onClose,
}) {
  if (!isActive) return null;

  return (
    <div className="gis-measure-toolbar">
      <div className="measure-mode-tabs">
        <button
          className={`measure-tab-btn ${mode === "distance" ? "active" : ""}`}
          onClick={() => onChangeMode("distance")}
          title="Đo độ dài tuyến đường / khoảng cách"
        >
          <span className="tab-icon">📏</span>
          <span>Đo Khoảng cách</span>
        </button>

        <button
          className={`measure-tab-btn ${mode === "area" ? "active" : ""}`}
          onClick={() => onChangeMode("area")}
          title="Đo diện tích thửa đất / vùng quy hoạch"
        >
          <span className="tab-icon">⬡</span>
          <span>Đo Diện tích</span>
        </button>
      </div>

      <div className="measure-stats-badge">
        <div className="stats-metric-col">
          <span className="metric-title">
            {mode === "distance" ? "Tổng khoảng cách" : "Tổng diện tích"}
          </span>
          <span className="metric-number">
            {pointsCount < (mode === "distance" ? 2 : 3)
              ? "Click lên bản đồ..."
              : mode === "distance"
              ? formatDistance(measuredValue)
              : formatArea(measuredValue)}
          </span>
        </div>
        <div className="metric-points-count">
          Đã chọn: <b>{pointsCount}</b> điểm
        </div>
      </div>

      <div className="measure-actions-row">
        <button
          className="btn-measure-act"
          onClick={onUndoPoint}
          disabled={pointsCount === 0}
          title="Hoàn tác điểm vừa chấm"
        >
          ↩ Hoàn tác
        </button>

        <button
          className="btn-measure-act"
          onClick={onClearMeasure}
          disabled={pointsCount === 0}
          title="Xóa toàn bộ các điểm đo"
        >
          🗑️ Xóa
        </button>

        <button
          className="btn-measure-close"
          onClick={onClose}
          title="Đóng công cụ đo đạc"
        >
          ✕ Kết thúc
        </button>
      </div>

      <div className="measure-hint-text">
        {mode === "distance"
          ? "Click liên tiếp các điểm trên bản đồ để đo khoảng cách đường gấp khúc."
          : "Click từ 3 điểm trở lên để tạo đa giác và tính diện tích tự động."}
      </div>
    </div>
  );
}
