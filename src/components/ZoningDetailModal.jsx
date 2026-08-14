import React, { useEffect, useState } from "react";
import { classifyLandUse } from "../mapConfig.js";
import { zoningStatsService } from "../services/zoningStatsService.js";
import { landPriceService } from "../services/landPriceService.js";

export function ZoningDetailModal({
  isOpen,
  feature,
  onClose,
  onSelectZoneOnMap,
  onOpenFullLandPrice,
}) {
  const [stats, setStats] = useState(null);
  const [landPrices, setLandPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const props = feature?.properties || {};
  const { icon, label } = classifyLandUse(props.category || props.name);

  useEffect(() => {
    if (!isOpen || !feature) return;

    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const code = props.code;
        const [statsData, pricesData] = await Promise.all([
          zoningStatsService.getStatsByZoningCode(code),
          landPriceService.getLandPricesByZoningCode(code),
        ]);

        if (isMounted) {
          setStats(statsData);
          setLandPrices(pricesData);
        }
      } catch (err) {
        console.error("Lỗi tải chi tiết quy hoạch:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, feature, props.code]);

  if (!isOpen || !feature) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content zoning-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="header-meta">
            <span
              className={`popup-badge ${
                props.grp === "QHPK" ? "badge-qhpk" : "badge-qhc"
              }`}
            >
              {props.grp === "QHPK"
                ? "Đồ án Phân khu (QHPK)"
                : "Đồ án Quy hoạch chung (QHC)"}
            </span>
            <span className="code-pill">{props.code}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Đóng">
            ✕
          </button>
        </div>

        <div className="modal-body detail-body">
          <div className="detail-title-section">
            <h2>{props.name}</h2>
            <div className="detail-category-row">
              <span className="category-emoji-lg">{icon}</span>
              <span className="category-title-text">
                <b>{label}</b> — {props.landUse}
              </span>
            </div>
            <p className="detail-description">{props.description}</p>
          </div>

          {/* KPI GRID */}
          <div className="detail-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Tổng diện tích</span>
              <span className="kpi-value">{props.area || "Đang cập nhật"}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Mật độ xây dựng (Net)</span>
              <span className="kpi-value">{props.density || "Chuẩn QC"}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Hệ số SD đất (FAR)</span>
              <span className="kpi-value">{stats?.maxFAR || "3.0 - 5.5"}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Tầng cao tối đa</span>
              <span className="kpi-value">
                {props.maxFloors || "Theo thiết kế đô thị"}
              </span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Quy mô dân số</span>
              <span className="kpi-value">
                {stats?.targetPopulation || "Theo quy chuẩn"}
              </span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Tiến độ quy hoạch</span>
              <span className="kpi-value text-success">
                {stats?.implementationRate || "85.0%"}
              </span>
            </div>
          </div>

          {/* Q% PLANNING RATIOS SECTION */}
          <div className="section-block">
            <div className="section-heading">
              <span className="section-icon">📊</span>
              <h3>Chỉ tiêu Cơ cấu Phân bổ Sử dụng đất (Q%)</h3>
              <span className="section-tag">QCVN 01:2021/BXD</span>
            </div>

            {loading ? (
              <div className="loading-state">Đang tính toán chỉ tiêu Q%...</div>
            ) : (
              <div className="q-ratio-bars">
                {stats?.landUseRatios?.residential && (
                  <div className="ratio-row">
                    <div className="ratio-info">
                      <span className="ratio-name">🏠 Đất ở / Đô thị</span>
                      <span className="ratio-pct">
                        {stats.landUseRatios.residential}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill fill-purple"
                        style={{
                          width: `${stats.landUseRatios.residential}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {stats?.landUseRatios?.publicCommercial && (
                  <div className="ratio-row">
                    <div className="ratio-info">
                      <span className="ratio-name">
                        🏢 Đất công cộng / Dịch vụ thương mại
                      </span>
                      <span className="ratio-pct">
                        {stats.landUseRatios.publicCommercial}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill fill-amber"
                        style={{
                          width: `${stats.landUseRatios.publicCommercial}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {stats?.landUseRatios?.greenWater && (
                  <div className="ratio-row">
                    <div className="ratio-info">
                      <span className="ratio-name">
                        🌳 Cây xanh, công viên & Mặt nước
                      </span>
                      <span className="ratio-pct">
                        {stats.landUseRatios.greenWater}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill fill-green"
                        style={{
                          width: `${stats.landUseRatios.greenWater}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {stats?.landUseRatios?.transportation && (
                  <div className="ratio-row">
                    <div className="ratio-info">
                      <span className="ratio-name">
                        🚦 Giao thông & Hạ tầng kỹ thuật
                      </span>
                      <span className="ratio-pct">
                        {stats.landUseRatios.transportation}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill fill-indigo"
                        style={{
                          width: `${stats.landUseRatios.transportation}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {stats?.landUseRatios?.industrialTech && (
                  <div className="ratio-row">
                    <div className="ratio-info">
                      <span className="ratio-name">
                        🏭 Đất Công nghiệp & Công nghệ cao
                      </span>
                      <span className="ratio-pct">
                        {stats.landUseRatios.industrialTech}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill fill-violet"
                        style={{
                          width: `${stats.landUseRatios.industrialTech}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ASSOCIATED LAND PRICES TABLE */}
          <div className="section-block">
            <div className="section-heading">
              <span className="section-icon">💰</span>
              <h3>Bảng giá đất áp dụng tại khu vực ({props.code})</h3>
              <button
                className="btn-link-action"
                onClick={() => {
                  onClose();
                  onOpenFullLandPrice(props.code);
                }}
              >
                Xem toàn bộ giá đất TP →
              </button>
            </div>

            {loading ? (
              <div className="loading-state">Đang tải bảng giá đất...</div>
            ) : landPrices.length === 0 ? (
              <div className="empty-sub-state">
                Chưa có dữ liệu giá đất riêng cho mã {props.code}. Tham khảo bảng
                giá chung của Quận.
              </div>
            ) : (
              <div className="mini-price-table-wrapper">
                <table className="mini-price-table">
                  <thead>
                    <tr>
                      <th>Tuyến đường / Phố</th>
                      <th>Quận</th>
                      <th>VT 1 (Mặt phố)</th>
                      <th>VT 2 (Ngõ &gt; 3.5m)</th>
                      <th>VT 3 (Ngõ 2-3.5m)</th>
                      <th>VT 4 (Ngõ &lt; 2m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landPrices.map((lp) => (
                      <tr key={lp.id}>
                        <td>
                          <b>{lp.street}</b>
                          <div className="table-subtext">{lp.fromTo}</div>
                        </td>
                        <td>{lp.district}</td>
                        <td className="price-highlight">
                          {lp.pricePos1.toLocaleString("vi-VN")} tr/m²
                        </td>
                        <td>{lp.pricePos2.toLocaleString("vi-VN")} tr/m²</td>
                        <td>{lp.pricePos3.toLocaleString("vi-VN")} tr/m²</td>
                        <td>{lp.pricePos4.toLocaleString("vi-VN")} tr/m²</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* LEGAL & METRIC FOOTNOTE */}
          <div className="legal-footnote">
            <b>Căn cứ pháp lý:</b> {props.status || "Đã phê duyệt theo Quyết định của Thủ tướng Chính phủ và UBND TP Hà Nội."}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn-action-primary"
            onClick={() => {
              onClose();
              onSelectZoneOnMap(feature);
            }}
          >
            🗺️ Xem vị trí trên bản đồ
          </button>
          <button className="btn-close-modal" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
