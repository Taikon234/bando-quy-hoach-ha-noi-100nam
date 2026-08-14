import React, { useState, useEffect, useCallback } from "react";
import { landPriceService } from "../services/landPriceService.js";

export function LandPriceModal({
  isOpen,
  onClose,
  initialZoningCode = "",
  onSelectZoningCodeOnMap,
}) {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [landType, setLandType] = useState("all");
  const [zoningCode, setZoningCode] = useState(initialZoningCode);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("pricePos1");
  const [sortOrder, setSortOrder] = useState("desc");

  const [districtsList, setDistrictsList] = useState([]);
  const [landTypesList, setLandTypesList] = useState([]);
  const [pricesData, setPricesData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync initial zoning filter when prop changes
  useEffect(() => {
    if (initialZoningCode) {
      setZoningCode(initialZoningCode);
    }
  }, [initialZoningCode]);

  // Load filter options on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [dList, tList] = await Promise.all([
          landPriceService.getDistricts(),
          landPriceService.getLandTypes(),
        ]);
        setDistrictsList(dList);
        setLandTypesList(tList);
      } catch (err) {
        console.error("Lỗi tải bộ lọc giá đất:", err);
      }
    };
    loadFilters();
  }, []);

  // Fetch land prices with debounce
  const fetchPrices = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);

    try {
      const res = await landPriceService.getLandPrices({
        search,
        district,
        landType,
        zoningCode,
        page,
        limit,
        sortBy,
        sortOrder,
      });

      if (res.success) {
        setPricesData(res.data);
        setPagination(res.pagination);
      } else {
        setError(res.error || "Không thể tải bảng giá đất");
      }
    } catch (err) {
      setError(err.message || "Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }, [isOpen, search, district, landType, zoningCode, page, limit, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrices();
    }, 150);
    return () => clearTimeout(timer);
  }, [fetchPrices]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content land-price-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <span className="title-icon">💰</span>
              Bảng Khung Giá Đất Thành Phố Hà Nội
            </h2>
            <p className="modal-subtitle">
              Căn cứ Quyết định 30/2019/QĐ-UBND và các văn bản điều chỉnh áp
              dụng cho giai đoạn 2024 - 2026
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Đóng">
            ✕
          </button>
        </div>

        {/* CONTROLS & FILTERS */}
        <div className="modal-toolbar land-price-toolbar">
          <div className="toolbar-row">
            {/* Search Input */}
            <div className="modal-search-box flex-grow">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm tên đường, phố, quận, khu vực..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  className="clear-search-btn"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* District Filter */}
            <div className="filter-select-group">
              <label>Quận/Huyện:</label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setPage(1);
                }}
              >
                {districtsList.map((d) => (
                  <option key={d} value={d}>
                    {d === "all" ? "Tất cả quận/huyện" : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Land Type Filter */}
            <div className="filter-select-group">
              <label>Loại đất:</label>
              <select
                value={landType}
                onChange={(e) => {
                  setLandType(e.target.value);
                  setPage(1);
                }}
              >
                {landTypesList.map((t) => (
                  <option key={t} value={t}>
                    {t === "all" ? "Tất cả loại đất" : t}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="filter-select-group">
              <label>Sắp xếp:</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                  setPage(1);
                }}
              >
                <option value="pricePos1-desc">Giá VT1: Cao → Thấp</option>
                <option value="pricePos1-asc">Giá VT1: Thấp → Cao</option>
                <option value="street-asc">Tên đường: A → Z</option>
                <option value="district-asc">Quận/Huyện: A → Z</option>
              </select>
            </div>
          </div>

          {/* Active zoning filter banner */}
          {zoningCode && (
            <div className="active-zoning-filter-banner">
              <span>
                Đang lọc theo mã quy hoạch: <b>{zoningCode}</b>
              </span>
              <button
                className="btn-clear-pill"
                onClick={() => {
                  setZoningCode("");
                  setPage(1);
                }}
              >
                Xóa lọc quy hoạch ✕
              </button>
            </div>
          )}
        </div>

        {/* TABLE CONTENT */}
        <div className="modal-body table-body-wrapper">
          {loading ? (
            <div className="table-loading-state">
              <div className="spinner"></div>
              <p>Đang tra cứu cơ sở dữ liệu giá đất Hà Nội...</p>
            </div>
          ) : error ? (
            <div className="table-error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button className="btn-action-retry" onClick={fetchPrices}>
                Thử lại
              </button>
            </div>
          ) : pricesData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <h3>Không tìm thấy tuyến đường nào phù hợp</h3>
              <p>Hãy thử tìm với từ khóa khác hoặc bỏ các bộ lọc.</p>
              <button
                className="reset-filter-btn"
                onClick={() => {
                  setSearch("");
                  setDistrict("all");
                  setLandType("all");
                  setZoningCode("");
                  setPage(1);
                }}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="land-price-table-container">
              <table className="land-price-table">
                <thead>
                  <tr>
                    <th style={{ width: "45px" }}>STT</th>
                    <th>Tuyến đường / Phố</th>
                    <th>Quận / Huyện</th>
                    <th>Vị trí 1 (Mặt phố)</th>
                    <th>Vị trí 2 (Ngõ &gt; 3.5m)</th>
                    <th>Vị trí 3 (Ngõ 2 - 3.5m)</th>
                    <th>Vị trí 4 (Ngõ &lt; 2m)</th>
                    <th>Mã Quy hoạch</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pricesData.map((item, idx) => {
                    const stt = (pagination.page - 1) * pagination.limit + idx + 1;

                    return (
                      <tr key={item.id}>
                        <td className="text-center font-mono">{stt}</td>
                        <td>
                          <div className="street-name">{item.street}</div>
                          <div className="street-from-to">{item.fromTo}</div>
                          <span className="land-type-tag">{item.landType}</span>
                        </td>
                        <td>
                          <span className="district-badge">{item.district}</span>
                        </td>
                        <td className="price-col price-pos1">
                          {item.pricePos1.toLocaleString("vi-VN")}
                          <span className="price-unit"> tr/m²</span>
                        </td>
                        <td className="price-col">
                          {item.pricePos2.toLocaleString("vi-VN")}
                          <span className="price-unit"> tr/m²</span>
                        </td>
                        <td className="price-col">
                          {item.pricePos3.toLocaleString("vi-VN")}
                          <span className="price-unit"> tr/m²</span>
                        </td>
                        <td className="price-col">
                          {item.pricePos4.toLocaleString("vi-VN")}
                          <span className="price-unit"> tr/m²</span>
                        </td>
                        <td>
                          <span className="zoning-pill">{item.zoningCode}</span>
                        </td>
                        <td>
                          <button
                            className="btn-table-action"
                            onClick={() => {
                              onClose();
                              onSelectZoningCodeOnMap(item.zoningCode);
                            }}
                            title={`Xem khu vực quy hoạch ${item.zoningCode} trên bản đồ`}
                          >
                            🗺️ Bản đồ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER & PAGINATION */}
        <div className="modal-footer land-price-footer">
          <div className="pagination-info">
            Hiển thị <b>{pricesData.length}</b> trên tổng số{" "}
            <b>{pagination.total}</b> tuyến đường
          </div>

          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Trước
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show current, first, last, and near pages
                return (
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - pagination.page) <= 1
                );
              })
              .map((p, i, arr) => {
                const prev = arr[i - 1];
                return (
                  <React.Fragment key={p}>
                    {prev && p - prev > 1 && (
                      <span className="page-ellipsis">...</span>
                    )}
                    <button
                      className={`page-btn ${
                        pagination.page === p ? "active" : ""
                      }`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              className="page-btn"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
            >
              Sau ›
            </button>
          </div>

          <button className="btn-close-modal" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
