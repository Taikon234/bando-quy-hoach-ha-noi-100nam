import React, { useState, useEffect } from "react";
import { classifyLandUse } from "../mapConfig.js";
import { zoningStatsService } from "../services/zoningStatsService.js";
import { landPriceService } from "../services/landPriceService.js";
import {
  METRO_STATIONS_GEOJSON,
  METRO_ACTIVE_GEOJSON,
} from "../data/hanoiZoningData.js";
import { getFeatureCenter, findNearbyInfrastructure } from "../utils/geoUtils.js";
import { isZoneBookmarked, toggleBookmark } from "../utils/bookmarkUtils.js";
import { shareMapLocation } from "../utils/urlStateUtils.js";

export function DetailPanel({
  isOpen,
  feature,
  onClose,
  onFlyToFeature,
  onOpenFullLandPrice,
  onOpenFullZoningDetail,
  onBookmarkChanged,
}) {
  const [stats, setStats] = useState(null);
  const [landPrices, setLandPrices] = useState([]);
  const [nearby, setNearby] = useState({ nearestStations: [], nearestLines: [] });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const props = feature?.properties || {};
  const { icon, label } = classifyLandUse(props.category || props.name);

  useEffect(() => {
    if (!isOpen || !feature) return;

    let isMounted = true;
    setLoading(true);
    const code = props.code;

    // Check bookmark state
    setIsBookmarked(isZoneBookmarked(code));

    // Calculate nearby infrastructure
    const center = getFeatureCenter(feature);
    const nearbyData = findNearbyInfrastructure(
      center,
      METRO_STATIONS_GEOJSON,
      METRO_ACTIVE_GEOJSON,
      4
    );
    setNearby(nearbyData);

    const loadData = async () => {
      try {
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

  const handleBookmarkToggle = () => {
    const center = getFeatureCenter(feature);
    const result = toggleBookmark({
      code: props.code,
      name: props.name,
      category: props.category || label,
      grp: props.grp,
      area: props.area,
      center,
    });
    setIsBookmarked(result.isBookmarked);
    if (onBookmarkChanged) onBookmarkChanged();

    setToastMessage(
      result.isBookmarked ? "Đã lưu vào danh sách yêu thích ⭐" : "Đã bỏ lưu khu vực"
    );
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleShare = () => {
    shareMapLocation({
      title: `Quy hoạch ${props.code}: ${props.name}`,
      text: `Xem thông tin quy hoạch và giá đất khu vực ${props.name} (${props.code}):`,
      onSuccess: (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
      },
      onError: (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
      },
    });
  };

  return (
    <aside className="gis-detail-panel" aria-label="Chi tiết khu vực quy hoạch">
      {/* HEADER */}
      <div className="detail-panel-header">
        <div className="panel-badge-row">
          <span
            className={`detail-type-badge ${
              props.grp === "QHPK" ? "badge-qhpk" : "badge-qhc"
            }`}
          >
            {props.grp === "QHPK"
              ? "Phân khu (QHPK)"
              : "Quy hoạch chung (QHC)"}
          </span>
          <span className="detail-code-badge">{props.code}</span>
        </div>

        <div className="panel-top-actions">
          <button
            className={`btn-icon-action ${isBookmarked ? "bookmarked" : ""}`}
            onClick={handleBookmarkToggle}
            title={isBookmarked ? "Bỏ lưu yêu thích" : "Lưu vào mục yêu thích"}
            aria-label="Yêu thích"
          >
            {isBookmarked ? "⭐" : "☆"}
          </button>

          <button
            className="btn-icon-action"
            onClick={handleShare}
            title="Chia sẻ liên kết khu vực này"
            aria-label="Chia sẻ"
          >
            🔗
          </button>

          <button
            className="btn-icon-action"
            onClick={onClose}
            title="Đóng bảng thông tin"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="detail-panel-body">
        {/* TITLE & CATEGORY */}
        <div className="detail-main-title-block">
          <h2 className="detail-zone-title">{props.name}</h2>
          <div className="detail-category-tag">
            <span className="category-emoji">{icon}</span>
            <span className="category-name">
              <b>{label}</b> · {props.landUse || "Quy hoạch đô thị"}
            </span>
          </div>
          {props.description && (
            <p className="detail-zone-desc">{props.description}</p>
          )}
        </div>

        {/* KPI METRICS */}
        <div className="detail-section-card">
          <div className="card-section-header">
            <span className="sec-icon">📐</span>
            <h4>Chỉ tiêu Quy chuẩn Kỹ thuật</h4>
          </div>

          <div className="detail-kpis-grid">
            <div className="kpi-mini-box">
              <span className="kpi-mini-label">Diện tích</span>
              <span className="kpi-mini-val">{props.area || "Đang cập nhật"}</span>
            </div>

            <div className="kpi-mini-box">
              <span className="kpi-mini-label">Mật độ XD</span>
              <span className="kpi-mini-val">{props.density || "Chuẩn QC"}</span>
            </div>

            <div className="kpi-mini-box">
              <span className="kpi-mini-label">Hệ số FAR</span>
              <span className="kpi-mini-val">{stats?.maxFAR || "3.0 - 5.5"}</span>
            </div>

            <div className="kpi-mini-box">
              <span className="kpi-mini-label">Tầng cao</span>
              <span className="kpi-mini-val">
                {props.maxFloors || "Theo TKĐT"}
              </span>
            </div>

            <div className="kpi-mini-box">
              <span className="kpi-mini-label">Dân số</span>
              <span className="kpi-mini-val">
                {stats?.targetPopulation || "Theo quy hoạch"}
              </span>
            </div>

            <div className="kpi-mini-box">
              <span className="kpi-mini-label">Tiến độ Q%</span>
              <span className="kpi-mini-val text-success">
                {stats?.implementationRate || "85.0%"}
              </span>
            </div>
          </div>
        </div>

        {/* Q% LAND USE ALLOCATION BREAKDOWN */}
        <div className="detail-section-card">
          <div className="card-section-header">
            <span className="sec-icon">📊</span>
            <h4>Cơ cấu Phân bổ Đất đai (Q%)</h4>
            <span className="tag-source">QCVN 01:2021</span>
          </div>

          {loading ? (
            <div className="loading-state-mini">Đang tính toán chỉ tiêu Q%...</div>
          ) : (
            <div className="q-bars-compact">
              {stats?.landUseRatios?.residential && (
                <div className="q-bar-item">
                  <div className="q-bar-label-row">
                    <span>🏠 Đất ở / Đô thị</span>
                    <b>{stats.landUseRatios.residential}%</b>
                  </div>
                  <div className="q-track">
                    <div
                      className="q-fill fill-purple"
                      style={{ width: `${stats.landUseRatios.residential}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {stats?.landUseRatios?.publicCommercial && (
                <div className="q-bar-item">
                  <div className="q-bar-label-row">
                    <span>🏢 Công cộng / Thương mại</span>
                    <b>{stats.landUseRatios.publicCommercial}%</b>
                  </div>
                  <div className="q-track">
                    <div
                      className="q-fill fill-amber"
                      style={{ width: `${stats.landUseRatios.publicCommercial}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {stats?.landUseRatios?.greenWater && (
                <div className="q-bar-item">
                  <div className="q-bar-label-row">
                    <span>🌳 Cây xanh & Mặt nước</span>
                    <b>{stats.landUseRatios.greenWater}%</b>
                  </div>
                  <div className="q-track">
                    <div
                      className="q-fill fill-green"
                      style={{ width: `${stats.landUseRatios.greenWater}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {stats?.landUseRatios?.transportation && (
                <div className="q-bar-item">
                  <div className="q-bar-label-row">
                    <span>🚦 Giao thông / Hạ tầng</span>
                    <b>{stats.landUseRatios.transportation}%</b>
                  </div>
                  <div className="q-track">
                    <div
                      className="q-fill fill-indigo"
                      style={{ width: `${stats.landUseRatios.transportation}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {stats?.landUseRatios?.industrialTech && (
                <div className="q-bar-item">
                  <div className="q-bar-label-row">
                    <span>🏭 Công nghiệp / KCNC</span>
                    <b>{stats.landUseRatios.industrialTech}%</b>
                  </div>
                  <div className="q-track">
                    <div
                      className="q-fill fill-violet"
                      style={{ width: `${stats.landUseRatios.industrialTech}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* NEARBY INFRASTRUCTURE (QUANH ĐÂY) */}
        <div className="detail-section-card">
          <div className="card-section-header">
            <span className="sec-icon">📍</span>
            <h4>Hạ tầng & Tiện ích Lân cận (Quanh đây)</h4>
          </div>

          <div className="nearby-items-list">
            {nearby.nearestStations.length > 0 ? (
              nearby.nearestStations.map((st, i) => (
                <div key={i} className="nearby-row">
                  <div className="nearby-icon">🚉</div>
                  <div className="nearby-info">
                    <div className="nearby-name">{st.name}</div>
                    <div className="nearby-sub">
                      Tuyến {st.line} · {st.address || "Khai thác"}
                    </div>
                  </div>
                  <span className="nearby-distance-tag">
                    {st.distanceFormatted}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-nearby">Đang quét hạ tầng lân cận...</div>
            )}
          </div>
        </div>

        {/* ASSOCIATED LAND PRICES */}
        <div className="detail-section-card">
          <div className="card-section-header">
            <span className="sec-icon">💰</span>
            <h4>Khung Giá Đất Tuyến Đường Lân Cận</h4>
          </div>

          {loading ? (
            <div className="loading-state-mini">Đang tải giá đất...</div>
          ) : landPrices.length === 0 ? (
            <div className="empty-nearby">
              Chưa có giá đất riêng cho {props.code}. Tham khảo bảng giá quận.
            </div>
          ) : (
            <div className="land-prices-mini-list">
              {landPrices.slice(0, 3).map((lp) => (
                <div key={lp.id} className="price-item-mini">
                  <div className="price-street-info">
                    <b>{lp.street}</b>
                    <span className="price-from-to">{lp.fromTo}</span>
                  </div>
                  <div className="price-values-stack">
                    <span className="price-main">
                      VT1: {lp.pricePos1.toLocaleString("vi-VN")} tr/m²
                    </span>
                    <span className="price-sub">
                      VT2: {lp.pricePos2.toLocaleString("vi-VN")} tr/m²
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className="btn-view-all-prices-link"
            onClick={() => onOpenFullLandPrice(props.code)}
          >
            Mở toàn bộ bảng giá đất TP Hà Nội →
          </button>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="detail-panel-footer">
        <button
          className="btn-footer-action btn-fly"
          onClick={() => onFlyToFeature(feature)}
          title="Định vị trung tâm vùng quy hoạch"
        >
          🗺️ Định vị
        </button>

        <button
          className="btn-footer-action btn-full-detail"
          onClick={() => onOpenFullZoningDetail(feature)}
          title="Mở hồ sơ chi tiết quy hoạch"
        >
          📄 Hồ sơ chi tiết
        </button>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="panel-toast-badge">{toastMessage}</div>
      )}
    </aside>
  );
}
