/**
 * Service tra cứu và xử lý nghiệp vụ Bảng giá đất Hà Nội
 * Thiết kế theo mô hình Service Layer - Dễ dàng chuyển sang gọi REST/GraphQL API trong tương lai.
 */

import { LAND_PRICES } from "../data/landPriceData.js";

// Endpoint API tương lai nếu có backend:
// const API_BASE_URL = process.env.VITE_API_URL || '/api/v1/land-prices';

export const landPriceService = {
  /**
   * Lấy danh sách giá đất với bộ lọc, tìm kiếm và phân trang
   */
  async getLandPrices({
    search = "",
    district = "all",
    landType = "all",
    zoningCode = "",
    page = 1,
    limit = 10,
    sortBy = "pricePos1",
    sortOrder = "desc",
  } = {}) {
    // Giả lập network delay ngắn cho trải nghiệm thực tế
    await new Promise((res) => setTimeout(res, 80));

    try {
      let filtered = [...LAND_PRICES];

      // Lọc theo từ khóa tìm kiếm (tên đường, quận, ghi chú)
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.street.toLowerCase().includes(q) ||
            item.district.toLowerCase().includes(q) ||
            item.fromTo.toLowerCase().includes(q) ||
            item.zoningName?.toLowerCase().includes(q) ||
            item.zoningCode?.toLowerCase().includes(q)
        );
      }

      // Lọc theo Quận/Huyện
      if (district && district !== "all") {
        filtered = filtered.filter(
          (item) => item.district.toLowerCase() === district.toLowerCase()
        );
      }

      // Lọc theo loại đất
      if (landType && landType !== "all") {
        filtered = filtered.filter(
          (item) => item.landType.toLowerCase() === landType.toLowerCase()
        );
      }

      // Lọc theo mã phân khu quy hoạch nếu có
      if (zoningCode) {
        filtered = filtered.filter(
          (item) => item.zoningCode === zoningCode
        );
      }

      // Sắp xếp
      filtered.sort((a, b) => {
        let valA = a[sortBy] ?? 0;
        let valB = b[sortBy] ?? 0;
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const currentPage = Math.max(1, Math.min(page, totalPages));
      const startIndex = (currentPage - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: paginatedData,
        pagination: {
          page: currentPage,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      console.error("Lỗi khi tải bảng giá đất:", error);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        error: error.message || "Lỗi không xác định khi tải bảng giá đất",
      };
    }
  },

  /**
   * Lấy danh sách tất cả các quận/huyện có trong dữ liệu
   */
  async getDistricts() {
    const set = new Set(LAND_PRICES.map((item) => item.district));
    return ["all", ...Array.from(set)];
  },

  /**
   * Lấy danh sách loại đất
   */
  async getLandTypes() {
    const set = new Set(LAND_PRICES.map((item) => item.landType));
    return ["all", ...Array.from(set)];
  },

  /**
   * Lấy thông tin giá đất tương ứng của một vùng quy hoạch theo mã (code)
   */
  async getLandPricesByZoningCode(zoningCode) {
    if (!zoningCode) return [];
    return LAND_PRICES.filter(
      (item) => item.zoningCode === zoningCode
    );
  }
};
