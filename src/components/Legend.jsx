import React, { useState } from "react";

export function Legend({ layers }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="gis-floating-legend">
      <div
        className="legend-header-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title="Bật/tắt chú giải bản đồ"
      >
        <span className="legend-icon">ⓘ</span>
        <span className="legend-title-text">Chú giải ký hiệu</span>
        <span className="legend-toggle-arrow">{isExpanded ? "▼" : "▲"}</span>
      </div>

      {isExpanded && (
        <div className="legend-body-content">
          {/* QUY HOẠCH */}
          <div className="legend-group">
            <div className="legend-group-title">Phân loại Đồ án</div>
            <div className="legend-items-list">
              {layers.qhc && (
                <div className="legend-item-row">
                  <span
                    className="legend-color-box"
                    style={{ background: "#8b2cff" }}
                  ></span>
                  <span>Quy hoạch chung (QHC)</span>
                </div>
              )}
              {layers.qhpk && (
                <div className="legend-item-row">
                  <span
                    className="legend-color-box"
                    style={{ background: "#ff5a00" }}
                  ></span>
                  <span>Quy hoạch phân khu (QHPK)</span>
                </div>
              )}
              <div className="legend-item-row">
                <span
                  className="legend-color-box"
                  style={{ background: "#10b981" }}
                ></span>
                <span>Cây xanh & Công viên</span>
              </div>
              <div className="legend-item-row">
                <span
                  className="legend-color-box"
                  style={{ background: "#0284c7" }}
                ></span>
                <span>Mặt nước & Sông hồ</span>
              </div>
            </div>
          </div>

          {/* ĐƯỜNG SẮT METRO */}
          {(layers.metro || layers.metroPlan || layers.stations) && (
            <div className="legend-group">
              <div className="legend-group-title">Đường sắt Đô thị (Metro)</div>
              <div className="legend-items-list">
                {layers.metro && (
                  <>
                    <div className="legend-item-row">
                      <span className="legend-line-sample line-operating"></span>
                      <span>Đang khai thác (Line 2A)</span>
                    </div>
                    <div className="legend-item-row">
                      <span className="legend-line-sample line-construction"></span>
                      <span>Đang xây dựng (Line 3)</span>
                    </div>
                  </>
                )}
                {layers.metroPlan && (
                  <div className="legend-item-row">
                    <span className="legend-line-sample line-planned"></span>
                    <span>Quy hoạch (Line 1, 2, 5, 8)</span>
                  </div>
                )}
                {layers.stations && (
                  <div className="legend-item-row">
                    <span className="legend-station-dot"></span>
                    <span>Ga Đường sắt Đô thị</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
