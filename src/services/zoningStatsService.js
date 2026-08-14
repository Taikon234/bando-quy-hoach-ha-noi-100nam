/**
 * Service tính toán và cung cấp chỉ tiêu Quy hoạch Q% (Planning Ratios & Allocation Stats)
 * Căn cứ: Quy chuẩn kỹ thuật quốc gia về Quy hoạch xây dựng QCVN 01:2021/BXD
 * và Đồ án Quy hoạch chung xây dựng Thủ đô Hà Nội đến năm 2030, tầm nhìn 2050 (QĐ 1259/QĐ-TTg).
 */

import { QHC_GEOJSON, QHPK_GEOJSON } from "../data/hanoiZoningData.js";

// Dữ liệu chỉ tiêu Q% chi tiết cho từng phân khu và vùng quy hoạch
export const ZONING_METRICS_MAP = {
  "H1-1": {
    code: "H1-1",
    name: "Phân khu Đô thị Lịch sử H1-1 (Hoàn Kiếm)",
    planningCoverageQ: 98.5, // % Hoàn thành quy hoạch
    landUseRatios: {
      residential: 42.0,
      publicCommercial: 28.5,
      greenWater: 18.0,
      transportation: 11.5,
    },
    maxFAR: "2.5 - 4.0",
    maxDensity: "65%",
    targetPopulation: "160.000 người",
    implementationRate: "96.2%",
    description: "Khu vực đô thị lịch sử bảo tồn, ưu tiên không gian công cộng, thương mại du lịch và giảm mật độ dân số."
  },
  "H1-2": {
    code: "H1-2",
    name: "Phân khu Đô thị Lịch sử H1-2 (Ba Đình)",
    planningCoverageQ: 95.0,
    landUseRatios: {
      publicCommercial: 45.0,
      residential: 30.0,
      greenWater: 15.0,
      transportation: 10.0,
    },
    maxFAR: "3.0 - 5.5",
    maxDensity: "50%",
    targetPopulation: "160.000 người",
    implementationRate: "92.0%",
    description: "Trung tâm chính trị hành chính quốc gia, cơ quan ngoại giao và công trình công cộng cấp đô thị."
  },
  "H1-3": {
    code: "H1-3",
    name: "Phân khu Đô thị Lịch sử H1-3 (Đống Đa)",
    planningCoverageQ: 92.0,
    landUseRatios: {
      residential: 52.0,
      publicCommercial: 22.0,
      transportation: 14.5,
      greenWater: 11.5,
    },
    maxFAR: "3.5 - 6.0",
    maxDensity: "60%",
    targetPopulation: "255.000 người",
    implementationRate: "89.5%",
    description: "Khu vực cải tạo chỉnh trang, tái thiết chung cư cũ và bổ sung công viên, trường học, bãi đỗ xe."
  },
  "H1-4": {
    code: "H1-4",
    name: "Phân khu Đô thị Lịch sử H1-4 (Hai Bà Trưng)",
    planningCoverageQ: 90.5,
    landUseRatios: {
      residential: 48.0,
      publicCommercial: 25.0,
      transportation: 15.0,
      greenWater: 12.0,
    },
    maxFAR: "3.5 - 6.5",
    maxDensity: "55%",
    targetPopulation: "257.000 người",
    implementationRate: "88.0%",
    description: "Tập trung các viện trường đại học đầu ngành, bệnh viện trung ương và các khu đô thị mới ven sông Hồng."
  },
  "S1": {
    code: "S1",
    name: "Phân khu Đô thị S1 (Đan Phượng - Bắc Từ Liêm)",
    planningCoverageQ: 85.0,
    landUseRatios: {
      residential: 38.0,
      greenWater: 28.0,
      transportation: 20.0,
      publicCommercial: 14.0,
    },
    maxFAR: "2.0 - 4.5",
    maxDensity: "40%",
    targetPopulation: "180.000 người",
    implementationRate: "75.0%",
    description: "Khu đô thị sinh thái phát triển mới theo định hướng TOD dọc trục đường Tây Thăng Long."
  },
  "S2": {
    code: "S2",
    name: "Phân khu Đô thị S2 (Nam Từ Liêm - Hoài Đức)",
    planningCoverageQ: 88.0,
    landUseRatios: {
      residential: 36.0,
      publicCommercial: 26.0,
      transportation: 22.0,
      greenWater: 16.0,
    },
    maxFAR: "3.0 - 7.0",
    maxDensity: "45%",
    targetPopulation: "250.000 người",
    implementationRate: "82.5%",
    description: "Đại đô thị thông minh phía Tây, tổ hợp dịch vụ thể thao quốc tế và trung tâm hành chính mới."
  },
  "N10": {
    code: "N10",
    name: "Phân khu Đô thị N10 (Long Biên - Gia Lâm)",
    planningCoverageQ: 91.0,
    landUseRatios: {
      residential: 35.0,
      greenWater: 30.0,
      transportation: 20.0,
      publicCommercial: 15.0,
    },
    maxFAR: "2.0 - 4.5",
    maxDensity: "40%",
    targetPopulation: "350.000 người",
    implementationRate: "86.0%",
    description: "Đô thị sinh thái ven sông Đuống, dịch vụ chất lượng cao kết hợp trung tâm logistics phía Đông."
  },
  "GS": {
    code: "GS",
    name: "Phân khu Không gian Xanh Nêm GS",
    planningCoverageQ: 96.0,
    landUseRatios: {
      greenWater: 72.0,
      agricultureEco: 18.0,
      transportation: 6.0,
      publicCommercial: 4.0,
    },
    maxFAR: "0.2 - 0.8",
    maxDensity: "5 - 15%",
    targetPopulation: "Không gian mở sinh thái",
    implementationRate: "94.0%",
    description: "Hành lang xanh cách ly nghiêm ngặt, lá phổi cân bằng sinh thái giữa đô thị trung tâm và chuỗi vệ tinh."
  },
  "QHC-DT-01": {
    code: "QHC-DT-01",
    name: "Khu vực Đất ở Đô thị Trung tâm",
    planningCoverageQ: 96.0,
    landUseRatios: {
      residential: 55.0,
      publicCommercial: 22.0,
      transportation: 13.0,
      greenWater: 10.0,
    },
    maxFAR: "4.0 - 8.0",
    maxDensity: "70%",
    targetPopulation: "850.000 người",
    implementationRate: "94.0%",
    description: "Khu vực lõi lịch sử 4 quận nội thành Hà Nội."
  },
  "QHC-DT-02": {
    code: "QHC-DT-02",
    name: "Khu Đô thị Mới Cầu Giấy - Mỹ Đình",
    planningCoverageQ: 89.0,
    landUseRatios: {
      residential: 40.0,
      publicCommercial: 30.0,
      transportation: 18.0,
      greenWater: 12.0,
    },
    maxFAR: "4.5 - 9.0",
    maxDensity: "45%",
    targetPopulation: "420.000 người",
    implementationRate: "88.0%",
    description: "Trung tâm tài chính, văn phòng, giáo dục cao tầng phía Tây."
  },
  "QHC-CC-01": {
    code: "QHC-CC-01",
    name: "Trung tâm Hành chính - Văn hóa Quốc gia Tây Hồ Tây",
    planningCoverageQ: 94.0,
    landUseRatios: {
      publicCommercial: 60.0,
      greenWater: 20.0,
      transportation: 12.0,
      residential: 8.0,
    },
    maxFAR: "3.0 - 6.0",
    maxDensity: "35%",
    targetPopulation: "Khu hành chính tập trung",
    implementationRate: "80.0%",
    description: "Trụ sở các bộ ngành trung ương và tổ hợp đại sứ quán."
  },
  "QHC-CX-01": {
    code: "QHC-CX-01",
    name: "Hành lang Cây xanh - Công viên TDTT Hồ Tây & Sông Hồng",
    planningCoverageQ: 98.0,
    landUseRatios: {
      greenWater: 85.0,
      publicCommercial: 8.0,
      transportation: 5.0,
      residential: 2.0,
    },
    maxFAR: "0.2 - 0.5",
    maxDensity: "5%",
    targetPopulation: "Khu sinh thái cảnh quan",
    implementationRate: "95.0%",
    description: "Quần thể mặt nước Hồ Tây và công viên công cộng ven sông."
  },
  "QHC-GT-01": {
    code: "QHC-GT-01",
    name: "Đầu mối Cảng Hàng không Quốc tế Nội Bài & Logistic",
    planningCoverageQ: 87.0,
    landUseRatios: {
      transportation: 65.0,
      publicCommercial: 20.0,
      greenWater: 10.0,
      residential: 5.0,
    },
    maxFAR: "1.5 - 3.0",
    maxDensity: "20%",
    targetPopulation: "Đầu mối giao thông quốc tế",
    implementationRate: "78.0%",
    description: "Cảng hàng không quốc tế cấp 4F và trung tâm logistics hàng không."
  },
  "QHC-HH-01": {
    code: "QHC-HH-01",
    name: "Khu Đô thị Sinh thái Thông minh Đông Anh - Bắc Sông Hồng",
    planningCoverageQ: 82.0,
    landUseRatios: {
      residential: 35.0,
      greenWater: 28.0,
      publicCommercial: 22.0,
      transportation: 15.0,
    },
    maxFAR: "3.0 - 7.5",
    maxDensity: "30%",
    targetPopulation: "380.000 người",
    implementationRate: "65.0%",
    description: "Đô thị thông minh dọc trục Nhật Tân - Nội Bài gắn với Tháp tài chính 108 tầng."
  },
  "QHC-CN-01": {
    code: "QHC-CN-01",
    name: "Khu Công nghệ cao Hòa Lạc & Đô thị Vệ tinh",
    planningCoverageQ: 85.0,
    landUseRatios: {
      industrialTech: 55.0,
      publicCommercial: 20.0,
      greenWater: 15.0,
      transportation: 10.0,
    },
    maxFAR: "1.5 - 4.0",
    maxDensity: "30%",
    targetPopulation: "220.000 kỹ sư, sinh viên",
    implementationRate: "72.0%",
    description: "Trung tâm đổi mới sáng tạo quốc gia và chuỗi đại học nghiên cứu."
  },
  "QHC-MN-01": {
    code: "QHC-MN-01",
    name: "Khu vực Trục Mặt nước Cảnh quan Sông Hồng",
    planningCoverageQ: 90.0,
    landUseRatios: {
      greenWater: 80.0,
      transportation: 12.0,
      publicCommercial: 6.0,
      residential: 2.0,
    },
    maxFAR: "0.2 - 0.6",
    maxDensity: "5%",
    targetPopulation: "Trục cảnh quan mở",
    implementationRate: "60.0%",
    description: "Trục cảnh quan trung tâm kết nối hai bờ Bắc - Nam sông Hồng."
  },
  "QHC-DT-03": {
    code: "QHC-DT-03",
    name: "Đô thị Hà Đông - Thanh Xuân - Hoàng Mai",
    planningCoverageQ: 93.0,
    landUseRatios: {
      residential: 48.0,
      publicCommercial: 24.0,
      transportation: 18.0,
      greenWater: 10.0,
    },
    maxFAR: "3.5 - 7.0",
    maxDensity: "50%",
    targetPopulation: "600.000 người",
    implementationRate: "90.0%",
    description: "Chuỗi đô thị phát triển mạnh mẽ dọc tuyến Metro 2A và vành đai 3."
  },
  "QHC-VT-01": {
    code: "QHC-VT-01",
    name: "Đô thị Vệ tinh Phú Xuyên - Cửa ngõ phía Nam",
    planningCoverageQ: 78.0,
    landUseRatios: {
      industrialTech: 35.0,
      residential: 30.0,
      transportation: 20.0,
      greenWater: 15.0,
    },
    maxFAR: "1.5 - 3.5",
    maxDensity: "35%",
    targetPopulation: "120.000 người",
    implementationRate: "55.0%",
    description: "Đô thị công nghiệp phụ trợ, cảng thủy và đầu mối giao thông phía Nam."
  }
};

export const zoningStatsService = {
  /**
   * Lấy thống kê chỉ tiêu Q% toàn thành phố Hà Nội
   */
  async getOverallStats() {
    await new Promise((res) => setTimeout(res, 60));

    return {
      success: true,
      data: {
        totalNaturalAreaHa: 335860, // Tổng diện tích tự nhiên Hà Nội
        plannedAreaHa: 297236, // Diện tích đã duyệt quy hoạch
        overallCoverageQ: 88.5, // Q% Độ phủ quy hoạch phân khu
        approvedSubdivisions: 38,
        totalSubdivisions: 42,
        subdivisionApprovalRateQ: 90.5, // Q% Tỷ lệ phân khu đã duyệt
        
        // Cơ cấu phân bổ đất đai toàn thành phố (Q% Land Allocation)
        allocationDistribution: [
          { key: "residential", label: "Đất ở đô thị & nông thôn", percentage: 32.5, color: "#8b2cff", targetAreaHa: 96600 },
          { key: "greenWater", label: "Cây xanh, mặt nước & TDTT", percentage: 24.8, color: "#10b981", targetAreaHa: 73700 },
          { key: "transportation", label: "Giao thông & hạ tầng kỹ thuật", percentage: 18.2, color: "#6366f1", targetAreaHa: 54100 },
          { key: "publicCommercial", label: "Công cộng, dịch vụ & giáo dục", percentage: 12.0, color: "#f59e0b", targetAreaHa: 35600 },
          { key: "industrialTech", label: "Công nghiệp & Công nghệ cao", percentage: 7.5, color: "#7c3aed", targetAreaHa: 22300 },
          { key: "securityOther", label: "An ninh, quốc phòng & chuyên dùng", percentage: 5.0, color: "#ef4444", targetAreaHa: 14900 },
        ],

        // Thống kê theo phân vùng đô thị
        regionalStats: [
          { name: "4 Quận Lõi Lịch sử (H1-1..H1-4)", areaHa: 3225, coverageQ: 96.2, residentialRatio: 45.5, status: "Hoàn thiện 100%" },
          { name: "Khu vực Mở rộng Phía Tây (S1..S4)", areaHa: 12500, coverageQ: 86.5, residentialRatio: 38.0, status: "Đang triển khai" },
          { name: "Khu vực Bắc Sông Hồng (N1..N11)", areaHa: 24000, coverageQ: 82.0, residentialRatio: 34.5, status: "Đang mở rộng" },
          { name: "5 Đô thị Vệ tinh (Hòa Lạc, Sóc Sơn...)", areaHa: 45000, coverageQ: 75.0, residentialRatio: 28.0, status: "Quy hoạch ưu tiên" },
          { name: "Vành đai xanh & Hành lang GS/GN", areaHa: 68000, coverageQ: 95.0, residentialRatio: 5.0, status: "Bảo tồn nghiêm ngặt" },
        ]
      }
    };
  },

  /**
   * Lấy chi tiết chỉ tiêu Q% của một khu vực quy hoạch theo mã code
   */
  async getStatsByZoningCode(code) {
    if (!code) return null;
    return ZONING_METRICS_MAP[code] || {
      code,
      name: `Khu vực quy hoạch ${code}`,
      planningCoverageQ: 85.0,
      landUseRatios: {
        residential: 40.0,
        publicCommercial: 25.0,
        greenWater: 20.0,
        transportation: 15.0,
      },
      maxFAR: "3.0 - 5.0",
      maxDensity: "50%",
      targetPopulation: "Đang cập nhật",
      implementationRate: "80.0%",
      description: "Đang hoàn thiện đồ án quy hoạch phân khu chi tiết 1/2000."
    };
  }
};
