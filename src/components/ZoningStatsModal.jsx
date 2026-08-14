import React, { useEffect, useState } from "react";
import { zoningStatsService, ZONING_METRICS_MAP } from "../services/zoningStatsService.js";

export function ZoningStatsModal({ isOpen, onClose, onSelectZoneOnMap }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedZoneCode, setSelectedZoneCode] = useState("H1-1");

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    const loadStats = async () => {
      try {
        const res = await zoningStatsService.getOverallStats();
        if (isMounted && res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Lỗi tải thống kê Q%:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const selectedZoneMetric = ZONING_METRICS_MAP[selectedZoneCode] || null;

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content zoning-stats-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <span className="title-icon">📊</span>
              Thống kê Chỉ tiêu Quy hoạch Q% Thủ đô Hà Nội
            </h2>
            <p className="modal-subtitle">
              Cơ cấu phân bổ quỹ đất đô thị và tỷ lệ hoàn thành đồ án quy hoạch
              (QCVN 01:2021/BXD & QĐ 1259/QĐ-TTg)
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Đóng">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body stats-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tính toán chỉ tiêu và thống kê Q%...</p>
            </div>
          ) : (
            <>
              {/* TOP KPI CARDS */}
              <div className="kpi-banner-grid">
                <div className="kpi-banner-card card-glow-purple">
                  <div className="kpi-top">
                    <span className="kpi-badge">Chỉ tiêu trọng điểm</span>
                    <span className="kpi-icon">🎯</span>
                  </div>
                  <div className="kpi-number">
                    {stats?.overallCoverageQ || 88.5}%
                  </div>
                  <div className="kpi-name">
                    Q% Độ phủ quy hoạch phân khu
                  </div>
                  <div className="kpi-sub">
                    297.236 / 335.860 ha diện tích tự nhiên
                  </div>
                </div>

                <div className="kpi-banner-card card-glow-green">
                  <div className="kpi-top">
                    <span className="kpi-badge">Tiến độ phê duyệt</span>
                    <span className="kpi-icon">✅</span>
                  </div>
                  <div className="kpi-number">
                    {stats?.subdivisionApprovalRateQ || 90.5}%
                  </div>
                  <div className="kpi-name">Q% Đồ án phân khu đã duyệt</div>
                  <div className="kpi-sub">
                    38 / 42 đồ án quy hoạch phân khu
                  </div>
                </div>

                <div className="kpi-banner-card card-glow-amber">
                  <div className="kpi-top">
                    <span className="kpi-badge">Quy mô đất đô thị</span>
                    <span className="kpi-icon">🏙️</span>
                  </div>
                  <div className="kpi-number">297.2k</div>
                  <div className="kpi-name">Héc-ta diện tích quy hoạch</div>
                  <div className="kpi-sub">
                    Dân số dự kiến: ~9.5 triệu người
                  </div>
                </div>

                <div className="kpi-banner-card card-glow-indigo">
                  <div className="kpi-top">
                    <span className="kpi-badge">Không gian xanh</span>
                    <span className="kpi-icon">🌳</span>
                  </div>
                  <div className="kpi-number">24.8%</div>
                  <div className="kpi-name">Q% Cây xanh & Mặt nước</div>
                  <div className="kpi-sub">
                    Đạt chỉ tiêu &gt; 12m² cây xanh/người
                  </div>
                </div>
              </div>

              {/* 2-COLUMN SECTION: ALLOCATION BREAKDOWN & REGIONAL STATS */}
              <div className="stats-two-col">
                {/* LEFT: CITYWIDE ALLOCATION BREAKDOWN */}
                <div className="stats-col-box">
                  <div className="box-header">
                    <span className="box-icon">📈</span>
                    <h3>Cơ cấu Phân bổ Quỹ đất Thành phố (Q%)</h3>
                  </div>
                  <p className="box-description">
                    Tỷ lệ diện tích phân bổ cho từng chức năng theo đồ án Quy hoạch
                    chung xây dựng Thủ đô:
                  </p>

                  <div className="distribution-list">
                    {stats?.allocationDistribution?.map((item) => (
                      <div key={item.key} className="dist-item">
                        <div className="dist-header">
                          <div className="dist-title">
                            <span
                              className="color-dot"
                              style={{ background: item.color }}
                            ></span>
                            <span className="dist-label">{item.label}</span>
                          </div>
                          <div className="dist-values">
                            <span className="dist-area">
                              {(item.targetAreaHa / 1000).toFixed(1)}k ha
                            </span>
                            <span className="dist-pct">{item.percentage}%</span>
                          </div>
                        </div>

                        <div className="dist-progress-bar">
                          <div
                            className="dist-progress-fill"
                            style={{
                              width: `${item.percentage}%`,
                              background: item.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: REGIONAL ANALYSIS */}
                <div className="stats-col-box">
                  <div className="box-header">
                    <span className="box-icon">🗺️</span>
                    <h3>Thống kê Q% theo Phân vùng Không gian</h3>
                  </div>
                  <p className="box-description">
                    Độ phủ quy hoạch và tỷ lệ đất ở tại các khu vực trọng điểm:
                  </p>

                  <div className="regional-table-wrapper">
                    <table className="regional-table">
                      <thead>
                        <tr>
                          <th>Phân vùng</th>
                          <th>Diện tích</th>
                          <th>Độ phủ Q%</th>
                          <th>% Đất ở</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.regionalStats?.map((reg, idx) => (
                          <tr key={idx}>
                            <td>
                              <b>{reg.name}</b>
                            </td>
                            <td>{(reg.areaHa).toLocaleString("vi-VN")} ha</td>
                            <td>
                              <span className="q-badge">{reg.coverageQ}%</span>
                            </td>
                            <td>{reg.residentialRatio}%</td>
                            <td>
                              <span className="status-pill-sub">
                                {reg.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ZONE SELECTOR & INSPECTOR */}
              <div className="stats-zone-inspector">
                <div className="inspector-header">
                  <div className="inspector-title">
                    <span className="inspector-icon">🔍</span>
                    <h3>Tra cứu Chỉ tiêu Q% theo từng Phân khu / Đồ án</h3>
                  </div>
                  <div className="inspector-select">
                    <label>Chọn phân khu:</label>
                    <select
                      value={selectedZoneCode}
                      onChange={(e) => setSelectedZoneCode(e.target.value)}
                    >
                      {Object.keys(ZONING_METRICS_MAP).map((code) => (
                        <option key={code} value={code}>
                          {code} - {ZONING_METRICS_MAP[code].name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedZoneMetric && (
                  <div className="inspector-content-card">
                    <div className="zone-meta-row">
                      <div>
                        <h4>{selectedZoneMetric.name}</h4>
                        <p>{selectedZoneMetric.description}</p>
                      </div>
                      <div className="zone-coverage-badge">
                        <span className="cov-label">Q% Tiến độ đồ án</span>
                        <span className="cov-value">
                          {selectedZoneMetric.planningCoverageQ}%
                        </span>
                      </div>
                    </div>

                    <div className="zone-metrics-grid">
                      <div className="metric-chip">
                        <span className="mc-label">Mật độ xây dựng (Net)</span>
                        <span className="mc-val">
                          {selectedZoneMetric.maxDensity}
                        </span>
                      </div>
                      <div className="metric-chip">
                        <span className="mc-label">Hệ số sử dụng đất FAR</span>
                        <span className="mc-val">{selectedZoneMetric.maxFAR}</span>
                      </div>
                      <div className="metric-chip">
                        <span className="mc-label">Quy mô dân số</span>
                        <span className="mc-val">
                          {selectedZoneMetric.targetPopulation}
                        </span>
                      </div>
                      <div className="metric-chip">
                        <span className="mc-label">Tỷ lệ thực hiện</span>
                        <span className="mc-val text-success">
                          {selectedZoneMetric.implementationRate}
                        </span>
                      </div>
                    </div>

                    <div className="zone-ratios-detail">
                      <h5>Cơ cấu phân bổ đất đai tại {selectedZoneMetric.code}:</h5>
                      <div className="ratios-flex">
                        {selectedZoneMetric.landUseRatios.residential && (
                          <div className="ratio-badge badge-res">
                            🏠 Đất ở: {selectedZoneMetric.landUseRatios.residential}%
                          </div>
                        )}
                        {selectedZoneMetric.landUseRatios.publicCommercial && (
                          <div className="ratio-badge badge-pub">
                            🏢 Công cộng/TM:{" "}
                            {selectedZoneMetric.landUseRatios.publicCommercial}%
                          </div>
                        )}
                        {selectedZoneMetric.landUseRatios.greenWater && (
                          <div className="ratio-badge badge-grn">
                            🌳 Cây xanh/Nước:{" "}
                            {selectedZoneMetric.landUseRatios.greenWater}%
                          </div>
                        )}
                        {selectedZoneMetric.landUseRatios.transportation && (
                          <div className="ratio-badge badge-tra">
                            🚦 Giao thông:{" "}
                            {selectedZoneMetric.landUseRatios.transportation}%
                          </div>
                        )}
                        {selectedZoneMetric.landUseRatios.industrialTech && (
                          <div className="ratio-badge badge-ind">
                            🏭 Công nghệ/CN:{" "}
                            {selectedZoneMetric.landUseRatios.industrialTech}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <span className="footer-info">
            Nguồn: Viện Quy hoạch Xây dựng Hà Nội (HUPI) & Sở Quy hoạch - Kiến
            trúc
          </span>
          <button className="btn-close-modal" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
