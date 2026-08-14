/**
 * Dữ liệu GeoJSON quy hoạch sử dụng đất và hệ thống Metro Thủ đô Hà Nội
 * Bản quyền dữ liệu: Sở Quy hoạch - Kiến trúc Hà Nội & Tổng cục Đường sắt đô thị (MRB)
 */

// 1. Dữ liệu Quy hoạch chung Hà Nội (QHC)
export const QHC_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "qhc-1",
      properties: {
        code: "QHC-DT-01",
        name: "Khu vực Đất ở Đô thị Trung tâm",
        category: "Đất ở",
        landUse: "Đất ở đô thị mật độ cao",
        grp: "QHC",
        area: "1.420 ha",
        density: "70%",
        maxFloors: "12 - 25 tầng",
        status: "Đã phê duyệt (QĐ 1259/QĐ-TTg)",
        description: "Khu vực dân cư đô thị cải tạo, chỉnh trang và phát triển nhà ở hỗn hợp hiện đại tại Ba Đình - Đống Đa - Hoàn Kiếm.",
        fc: "#8b2cff"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.815, 21.015],
          [105.845, 21.012],
          [105.865, 21.025],
          [105.860, 21.045],
          [105.830, 21.048],
          [105.810, 21.035],
          [105.815, 21.015]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhc-2",
      properties: {
        code: "QHC-DT-02",
        name: "Khu Đô thị Mới Cầu Giấy - Mỹ Đình",
        category: "Đất ở",
        landUse: "Đất ở đô thị mới kết hợp thương mại dịch vụ",
        grp: "QHC",
        area: "2.150 ha",
        density: "45%",
        maxFloors: "25 - 45 tầng",
        status: "Đang phát triển theo quy hoạch",
        description: "Trung tâm dịch vụ tài chính, thương mại và chuỗi đô thị cao tầng phía Tây Hà Nội.",
        fc: "#a855f7"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.760, 21.010],
          [105.805, 21.012],
          [105.808, 21.048],
          [105.775, 21.055],
          [105.755, 21.035],
          [105.760, 21.010]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhc-3",
      properties: {
        code: "QHC-CC-01",
        name: "Trung tâm Hành chính - Văn hóa Quốc gia Tây Hồ Tây",
        category: "Đất công cộng",
        landUse: "Đất công trình công cộng cấp quốc gia và đô thị",
        grp: "QHC",
        area: "850 ha",
        density: "35%",
        maxFloors: "15 - 35 tầng",
        status: "Đã phê duyệt quy hoạch chi tiết 1/500",
        description: "Trụ sở các bộ ngành trung ương, đại sứ quán, nhà hát Thăng Long và tổ hợp văn hóa quốc tế.",
        fc: "#c084fc"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.785, 21.055],
          [105.815, 21.058],
          [105.820, 21.080],
          [105.790, 21.078],
          [105.785, 21.055]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhc-4",
      properties: {
        code: "QHC-CX-01",
        name: "Hành lang Cây xanh - Công viên TDTT Hồ Tây & Sông Hồng",
        category: "Đất cây xanh",
        landUse: "Đất công viên, cây xanh chuyên đề, thể dục thể thao",
        grp: "QHC",
        area: "1.680 ha",
        density: "5%",
        maxFloors: "1 - 3 tầng",
        status: "Bảo tồn và tôn tạo cảnh quan",
        description: "Lá phổi xanh trung tâm thủ đô bao gồm quần thể mặt nước Hồ Tây và công viên cảnh quan ven sông.",
        fc: "#10b981"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.810, 21.050],
          [105.845, 21.055],
          [105.840, 21.085],
          [105.815, 21.080],
          [105.805, 21.065],
          [105.810, 21.050]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhc-5",
      properties: {
        code: "QHC-GT-01",
        name: "Đầu mối Cảng Hàng không Quốc tế Nội Bài & Logistic",
        category: "Đất giao thông",
        landUse: "Đất hạ tầng giao thông hàng không và logistics vùng",
        grp: "QHC",
        area: "2.230 ha",
        density: "20%",
        maxFloors: "4 tầng",
        status: "Đang mở rộng quy hoạch đến 2030, tầm nhìn 2050",
        description: "Cảng hàng không quốc tế cấp 4F, công suất 60-100 triệu hành khách/năm và khu dịch vụ logistics hiện đại.",
        fc: "#6366f1"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.770, 21.205],
          [105.840, 21.208],
          [105.845, 21.238],
          [105.775, 21.235],
          [105.770, 21.205]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhc-6",
      properties: {
        code: "QHC-HH-01",
        name: "Khu Đô thị Sinh thái Thông minh Đông Anh - Bắc Sông Hồng",
        category: "Đất hỗn hợp",
        landUse: "Đất hỗn hợp nhà ở sinh thái, tài chính và công nghệ cao",
        grp: "QHC",
        area: "3.400 ha",
        density: "30%",
        maxFloors: "10 - 68 tầng (Tháp Tài chính)",
        status: "Đã duyệt quy hoạch phân khu",
        description: "Đô thị thông minh Bắc Hà Nội dọc trục Nhật Tân - Nội Bài, tích hợp trung tâm triển lãm quốc gia.",
        fc: "#9333ea"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.810, 21.110],
          [105.870, 21.115],
          [105.875, 21.165],
          [105.815, 21.160],
          [105.810, 21.110]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhc-7",
      properties: {
        code: "QHC-CN-01",
        name: "Khu Công nghệ cao Hòa Lạc & Đô thị Vệ tinh",
        category: "Đất công nghiệp",
        landUse: "Đất nghiên cứu công nghệ cao, công nghiệp sạch và đại học",
        grp: "QHC",
        area: "1.586 ha",
        density: "30%",
        maxFloors: "5 - 15 tầng",
        status: "Đã vận hành các phân khu chức năng",
        description: "Trung tâm đổi mới sáng tạo quốc gia, các viện nghiên cứu, trường đại học FPT, VJU và tổ hợp công nghiệp phần mềm.",
        fc: "#7c3aed"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.510, 20.990],
          [105.560, 20.995],
          [105.565, 21.040],
          [105.515, 21.035],
          [105.510, 20.990]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhc-8",
      properties: {
        code: "QHC-MN-01",
        name: "Khu vực Trục Mặt nước Cảnh quan Sông Hồng",
        category: "Mặt nước",
        landUse: "Mặt nước, bãi bồi hành lang thoát lũ và công viên sinh thái",
        grp: "QHC",
        area: "4.200 ha",
        density: "5%",
        maxFloors: "1 - 2 tầng",
        status: "Đang lập quy hoạch chi tiết trục cảnh quan sông Hồng",
        description: "Trục cảnh quan trung tâm tương lai của Thủ đô kết nối hai bờ Bắc - Nam sông Hồng.",
        fc: "#0284c7"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.820, 21.090],
          [105.850, 21.070],
          [105.885, 21.040],
          [105.920, 20.980],
          [105.900, 20.975],
          [105.865, 21.030],
          [105.830, 21.060],
          [105.805, 21.085],
          [105.820, 21.090]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhc-9",
      properties: {
        code: "QHC-DT-03",
        name: "Đô thị Hà Đông - Thanh Xuân - Hoàng Mai",
        category: "Đất ở",
        landUse: "Đất ở đô thị kết hợp dịch vụ thương mại Nam Hà Nội",
        grp: "QHC",
        area: "2.850 ha",
        density: "50%",
        maxFloors: "15 - 35 tầng",
        status: "Khu vực đô thị hóa hoàn thiện",
        description: "Khu vực chuỗi đô thị hoàn chỉnh kết nối dọc tuyến metro Cát Linh - Hà Đông và vành đai 3.",
        fc: "#7e22ce"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.760, 20.960],
          [105.830, 20.965],
          [105.850, 21.000],
          [105.790, 20.995],
          [105.755, 20.980],
          [105.760, 20.960]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhc-10",
      properties: {
        code: "QHC-VT-01",
        name: "Đô thị Vệ tinh Phú Xuyên - Cửa ngõ phía Nam",
        category: "Đất hỗn hợp",
        landUse: "Đô thị công nghiệp, đầu mối giao thông và tiếp vận phía Nam",
        grp: "QHC",
        area: "1.920 ha",
        density: "35%",
        maxFloors: "5 - 15 tầng",
        status: "Quy hoạch phân khu đô thị vệ tinh",
        description: "Trung tâm phát triển kinh tế công nghiệp phụ trợ, cảng thủy nội địa và đầu mối giao thông đường cao tốc Bắc Nam.",
        fc: "#6b21a8"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.880, 20.710],
          [105.940, 20.715],
          [105.945, 20.765],
          [105.885, 20.760],
          [105.880, 20.710]
        ]]
      }
    }
  ]
};

// 2. Dữ liệu Quy hoạch phân khu (QHPK)
export const QHPK_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "qhpk-1",
      properties: {
        code: "H1-1",
        name: "Phân khu Đô thị Lịch sử H1-1 (Hoàn Kiếm)",
        category: "Đất ở",
        landUse: "Bảo tồn kiến trúc di sản & thương mại du lịch",
        grp: "QHPK",
        area: "528 ha",
        density: "65%",
        maxFloors: "4 - 8 tầng",
        status: "Đã phê duyệt (QĐ 1345/QĐ-UBND)",
        description: "Khu vực đô thị lịch sử hạn chế phát triển, bảo tồn không gian di sản Hồ Gươm, khu phố cổ 36 phố phường và phố cũ.",
        fc: "#ff5a00"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.845, 21.020],
          [105.865, 21.022],
          [105.862, 21.040],
          [105.842, 21.038],
          [105.845, 21.020]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhpk-2",
      properties: {
        code: "H1-2",
        name: "Phân khu Đô thị Lịch sử H1-2 (Ba Đình)",
        category: "Đất công cộng",
        landUse: "Trung tâm chính trị - hành chính quốc gia",
        grp: "QHPK",
        area: "703 ha",
        density: "50%",
        maxFloors: "5 - 11 tầng",
        status: "Đã phê duyệt (QĐ 1346/QĐ-UBND)",
        description: "Khu trung tâm hành chính chính trị quốc gia, Quảng trường Ba Đình, Hoàng thành Thăng Long và các cơ quan ngoại giao.",
        fc: "#ea580c"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.815, 21.028],
          [105.842, 21.028],
          [105.840, 21.048],
          [105.812, 21.045],
          [105.815, 21.028]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhpk-3",
      properties: {
        code: "H1-3",
        name: "Phân khu Đô thị Lịch sử H1-3 (Đống Đa)",
        category: "Đất ở",
        landUse: "Cải tạo chỉnh trang đô thị cũ & công cộng dịch vụ",
        grp: "QHPK",
        area: "994 ha",
        density: "60%",
        maxFloors: "6 - 15 tầng",
        status: "Đã phê duyệt (QĐ 1347/QĐ-UBND)",
        description: "Khu dân cư đô thị hiện hữu cần cải tạo đồng bộ hạ tầng kỹ thuật, mở rộng mạng lưới giao thông công cộng và công viên cây xanh.",
        fc: "#f97316"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.808, 21.008],
          [105.842, 21.010],
          [105.840, 21.028],
          [105.812, 21.025],
          [105.808, 21.008]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhpk-4",
      properties: {
        code: "H1-4",
        name: "Phân khu Đô thị Lịch sử H1-4 (Hai Bà Trưng)",
        category: "Đất hỗn hợp",
        landUse: "Đô thị hỗn hợp, thương mại - dịch vụ & giáo dục đại học",
        grp: "QHPK",
        area: "1.000 ha",
        density: "55%",
        maxFloors: "6 - 20 tầng",
        status: "Đã phê duyệt (QĐ 1348/QĐ-UBND)",
        description: "Trung tâm cụm trường đại học hàng đầu (Bách Khoa, Kinh Tế, Xây Dựng), bệnh viện tuyến trung ương và các khu đô thị mới.",
        fc: "#fb923c"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.842, 20.995],
          [105.875, 20.998],
          [105.865, 21.022],
          [105.842, 21.020],
          [105.842, 20.995]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhpk-5",
      properties: {
        code: "S1",
        name: "Phân khu Đô thị Mở rộng S1 (Đan Phượng - Bắc Từ Liêm)",
        category: "Đất ở",
        landUse: "Khu đô thị sinh thái mới và trung tâm nghiên cứu đào tạo",
        grp: "QHPK",
        area: "1.890 ha",
        density: "40%",
        maxFloors: "12 - 35 tầng",
        status: "Đã phê duyệt đồ án quy hoạch",
        description: "Khu đô thị hiện đại gắn với trục Tây Thăng Long, phát triển nhà ở chất lượng cao và công viên hồ điều hòa.",
        fc: "#fdba74"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.720, 21.060],
          [105.770, 21.065],
          [105.775, 21.100],
          [105.725, 21.095],
          [105.720, 21.060]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhpk-6",
      properties: {
        code: "S2",
        name: "Phân khu Đô thị S2 (Nam Từ Liêm - Hoài Đức)",
        category: "Đất hỗn hợp",
        landUse: "Tổ hợp đô thị đa chức năng và dịch vụ thể thao quốc tế",
        grp: "QHPK",
        area: "2.350 ha",
        density: "45%",
        maxFloors: "18 - 40 tầng",
        status: "Đang hoàn thiện các khu đô thị thành phần",
        description: "Trung tâm Khu liên hợp thể thao quốc gia Mỹ Đình, đại đô thị thông minh Vinhomes Smart City và chuỗi công viên ven sông Nhuệ.",
        fc: "#ea580c"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.730, 20.995],
          [105.775, 21.000],
          [105.770, 21.045],
          [105.725, 21.040],
          [105.730, 20.995]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhpk-7",
      properties: {
        code: "N10",
        name: "Phân khu Đô thị N10 (Long Biên - Gia Lâm)",
        category: "Đất ở",
        landUse: "Khu đô thị sinh thái dịch vụ chất lượng cao phía Đông",
        grp: "QHPK",
        area: "4.037 ha",
        density: "40%",
        maxFloors: "15 - 35 tầng",
        status: "Đã phê duyệt và đang triển khai hạ tầng",
        description: "Khu đô thị cửa ngõ phía Đông thủ đô với hệ thống trung tâm thương mại lớn Aeon Mall, Vinhomes Riverside và sân bay Gia Lâm.",
        fc: "#c2410c"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.880, 21.015],
          [105.945, 21.020],
          [105.935, 21.070],
          [105.870, 21.065],
          [105.880, 21.015]
        ]]
      }
    },
    {
      type: "Feature",
      id: "qhpk-8",
      properties: {
        code: "GS",
        name: "Phân khu Không gian Xanh Nêm & Hành lang Sinh thái GS",
        category: "Đất cây xanh",
        landUse: "Vành đai xanh, nêm xanh sinh thái cách ly đô thị",
        grp: "QHPK",
        area: "6.660 ha",
        density: "5%",
        maxFloors: "1 - 3 tầng",
        status: "Bảo vệ nghiêm ngặt không gian mở",
        description: "Hành lang xanh phân cách đô thị trung tâm và các chuỗi đô thị vệ tinh, ưu tiên nông nghiệp sạch và công viên dã ngoại.",
        fc: "#059669"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.690, 20.980],
          [105.725, 20.985],
          [105.720, 21.080],
          [105.685, 21.075],
          [105.690, 20.980]
        ]]
      }
    }
  ]
};

// 3. Tuyến Metro Hiện hữu và Đang xây dựng (Line 2A & Line 3)
export const METRO_ACTIVE_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "line-2a",
      properties: {
        name: "Tuyến Metro số 2A (Cát Linh - Hà Đông)",
        code: "Line 2A",
        status: "Đang vận hành thương mại",
        statusType: "operating",
        length: "13.05 km",
        stationsCount: 12,
        speed: "35 - 80 km/h",
        color: "#00a878",
        description: "Tuyến đường sắt đô thị trên cao đầu tiên tại Việt Nam, kết nối quận Đống Đa qua Thanh Xuân đến quận Hà Đông."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [105.8278, 21.0279], // Cát Linh
          [105.8236, 21.0205], // La Thành
          [105.8193, 21.0152], // Thái Hà
          [105.8126, 21.0094], // Láng
          [105.8118, 20.9982], // Thượng Đình
          [105.8033, 20.9906], // Vành đai 3
          [105.7925, 20.9818], // Phùng Khoang
          [105.7820, 20.9734], // Văn Quán
          [105.7735, 20.9658], // Hà Đông
          [105.7610, 20.9572], // La Khê
          [105.7505, 20.9489], // Văn Khê
          [105.7420, 20.9405]  // Yên Nghĩa
        ]
      }
    },
    {
      type: "Feature",
      id: "line-3",
      properties: {
        name: "Tuyến Metro số 3 (Nhổn - Ga Hà Nội)",
        code: "Line 3",
        status: "Đoạn trên cao vận hành / Đoạn ngầm đang thi công",
        statusType: "construction",
        length: "12.5 km (8.5 km trên cao, 4 km ngầm)",
        stationsCount: 12,
        speed: "35 - 80 km/h",
        color: "#ff6b00",
        description: "Tuyến đường sắt huyết mạch nối cửa ngõ phía Tây (Bắc Từ Liêm, Nam Từ Liêm) vào trung tâm lõi Ba Đình, Đống Đa, Hoàn Kiếm."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [105.7335, 21.0632], // Ga 1: Nhổn
          [105.7432, 21.0560], // Ga 2: Minh Khai
          [105.7548, 21.0489], // Ga 3: Phú Diễn
          [105.7665, 21.0425], // Ga 4: Cầu Diễn
          [105.7770, 21.0380], // Ga 5: Lê Đức Thọ
          [105.7865, 21.0362], // Ga 6: Đại học Quốc Gia
          [105.7960, 21.0335], // Ga 7: Chùa Hà
          [105.8035, 21.0305], // Ga 8: Cầu Giấy
          [105.8175, 21.0315], // Ga 9: Kim Mã (Ngầm)
          [105.8278, 21.0279], // Ga 10: Cát Linh (Ngầm - Interchange)
          [105.8365, 21.0282], // Ga 11: Văn Miếu (Ngầm)
          [105.8420, 21.0245]  // Ga 12: Ga Hà Nội (Ngầm)
        ]
      }
    }
  ]
};

// 4. Tuyến Metro Quy hoạch (Line 1, 2, 5, 8)
export const METRO_PLANNED_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "line-1",
      properties: {
        name: "Tuyến Metro số 1 (Yên Viên - Ngọc Hồi)",
        code: "Line 1",
        status: "Quy hoạch chuẩn bị đầu tư",
        statusType: "planned",
        length: "38.7 km",
        stationsCount: 23,
        color: "#ef3cff",
        description: "Tuyến xuyên tâm Bắc - Nam kết nối Yên Viên, Gia Lâm qua cầu Long Biên mới tới Giáp Bát, Văn Điển, Ngọc Hồi."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [105.9050, 21.1050], // Yên Viên
          [105.8820, 21.0650], // Gia Lâm
          [105.8600, 21.0440], // Long Biên
          [105.8420, 21.0245], // Ga Hà Nội
          [105.8410, 20.9850], // Giáp Bát
          [105.8400, 20.9520], // Văn Điển
          [105.8450, 20.9150]  // Ngọc Hồi
        ]
      }
    },
    {
      type: "Feature",
      id: "line-2",
      properties: {
        name: "Tuyến Metro số 2 (Nam Thăng Long - Trần Hưng Đạo - Thượng Đình)",
        code: "Line 2",
        status: "Quy hoạch ưu tiên đầu tư",
        statusType: "planned",
        length: "35.2 km",
        stationsCount: 20,
        color: "#3b82f6",
        description: "Tuyến kết nối KĐT Nam Thăng Long (Ciputra) qua Tây Hồ Tây, Bờ Hồ Hoàn Kiếm đến Thượng Đình."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [105.7950, 21.0950], // Nam Thăng Long
          [105.8050, 21.0650], // Tây Hồ Tây
          [105.8250, 21.0450], // Quán Thánh
          [105.8550, 21.0280], // Hồ Gươm - Hàng Bài
          [105.8520, 21.0180], // Trần Hưng Đạo
          [105.8300, 21.0050], // Kim Liên
          [105.8118, 20.9982]  // Thượng Đình
        ]
      }
    },
    {
      type: "Feature",
      id: "line-5",
      properties: {
        name: "Tuyến Metro số 5 (Văn Cao - Ngọc Khánh - Đại lộ Thăng Long - Hòa Lạc)",
        code: "Line 5",
        status: "Quy hoạch đã phê duyệt Báo cáo NCKT",
        statusType: "planned",
        length: "38.43 km",
        stationsCount: 21,
        color: "#a855f7",
        description: "Tuyến đường sắt đô thị tốc độ cao kết nối trung tâm Ba Đình theo hành lang Đại lộ Thăng Long đến Khu CNC Hòa Lạc."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [105.8160, 21.0420], // Văn Cao
          [105.8120, 21.0310], // Ngọc Khánh
          [105.7950, 21.0150], // Trung Hòa
          [105.7600, 21.0020], // Mễ Trì
          [105.7200, 20.9980], // An Khánh
          [105.6500, 20.9990], // Quốc Oai
          [105.5350, 21.0150]  // Hòa Lạc
        ]
      }
    },
    {
      type: "Feature",
      id: "line-8",
      properties: {
        name: "Tuyến Metro số 8 (Sơn Đồng - Mai Dịch - Vành Đai 3 - Lĩnh Nam - Dương Xá)",
        code: "Line 8",
        status: "Quy hoạch kết nối vành đai",
        statusType: "planned",
        length: "37.0 km",
        stationsCount: 26,
        color: "#f59e0b",
        description: "Tuyến vành đai liên kết chuỗi đô thị Tây Nam và Đông Nam Thủ đô."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [105.7050, 21.0500], // Sơn Đồng
          [105.7800, 21.0400], // Mai Dịch
          [105.8033, 20.9906], // Vành đai 3
          [105.8650, 20.9850], // Lĩnh Nam
          [105.9550, 21.0050]  // Dương Xá (Gia Lâm)
        ]
      }
    }
  ]
};

// 5. Danh sách 24+ Ga Metro Hà Nội
export const METRO_STATIONS_GEOJSON = {
  type: "FeatureCollection",
  features: [
    // Tuyến 2A
    {
      type: "Feature",
      id: "st-2a-01",
      properties: {
        name: "Ga Cát Linh",
        line: "Line 2A & Line 3 (Trung chuyển)",
        type: "Ga trên cao & ngầm liên thông",
        status: "Đang vận hành",
        address: "Phố Cát Linh, P. Cát Linh, Q. Đống Đa",
        connect: "Tuyến 2A + Tuyến 3 + Bus BRT 01"
      },
      geometry: { type: "Point", coordinates: [105.8278, 21.0279] }
    },
    {
      type: "Feature",
      id: "st-2a-02",
      properties: {
        name: "Ga La Thành",
        line: "Line 2A",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Đường Hoàng Cầu, Q. Đống Đa",
        connect: "Tuyến xe buýt nội đô"
      },
      geometry: { type: "Point", coordinates: [105.8236, 21.0205] }
    },
    {
      type: "Feature",
      id: "st-2a-03",
      properties: {
        name: "Ga Thái Hà",
        line: "Line 2A",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Phố Yên Lãng, Q. Đống Đa",
        connect: "Trung tâm thương mại & văn phòng"
      },
      geometry: { type: "Point", coordinates: [105.8193, 21.0152] }
    },
    {
      type: "Feature",
      id: "st-2a-04",
      properties: {
        name: "Ga Láng",
        line: "Line 2A",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Đường Láng ven sông Tô Lịch, Q. Đống Đa",
        connect: "Vành đai 2 đường bộ"
      },
      geometry: { type: "Point", coordinates: [105.8126, 21.0094] }
    },
    {
      type: "Feature",
      id: "st-2a-05",
      properties: {
        name: "Ga Thượng Đình",
        line: "Line 2A & Line 2 (Quy hoạch)",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Đường Nguyễn Trãi, Q. Thanh Xuân",
        connect: "KĐT Royal City, Trường ĐHKHTN, ĐHKHXH&NV"
      },
      geometry: { type: "Point", coordinates: [105.8118, 20.9982] }
    },
    {
      type: "Feature",
      id: "st-2a-06",
      properties: {
        name: "Ga Vành Đai 3",
        line: "Line 2A & Line 8 (Quy hoạch)",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Nút giao Nguyễn Trãi - Khuất Duy Tiến, Q. Thanh Xuân",
        connect: "Vành đai 3 trên cao, ĐH Hà Nội, ĐH KHXH&NV"
      },
      geometry: { type: "Point", coordinates: [105.8033, 20.9906] }
    },
    {
      type: "Feature",
      id: "st-2a-07",
      properties: {
        name: "Ga Phùng Khoang",
        line: "Line 2A",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Đường Nguyễn Trãi, Nam Từ Liêm / Thanh Xuân",
        connect: "Học viện An Ninh, Học viện Bưu chính Viễn thông"
      },
      geometry: { type: "Point", coordinates: [105.7925, 20.9818] }
    },
    {
      type: "Feature",
      id: "st-2a-08",
      properties: {
        name: "Ga Văn Quán",
        line: "Line 2A",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Đường Trần Phú, Q. Hà Đông",
        connect: "KĐT Văn Quán, Học viện Y Dược Cổ Truyền"
      },
      geometry: { type: "Point", coordinates: [105.7820, 20.9734] }
    },
    {
      type: "Feature",
      id: "st-2a-09",
      properties: {
        name: "Ga Hà Đông",
        line: "Line 2A",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Đường Quang Trung, Q. Hà Đông",
        connect: "Bệnh viện Đa khoa Hà Đông, Chợ Hà Đông"
      },
      geometry: { type: "Point", coordinates: [105.7735, 20.9658] }
    },
    {
      type: "Feature",
      id: "st-2a-10",
      properties: {
        name: "Ga La Khê",
        line: "Line 2A",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Đường Quang Trung, P. La Khê, Q. Hà Đông",
        connect: "Khu dân cư Văn Phú, ParkCity"
      },
      geometry: { type: "Point", coordinates: [105.7610, 20.9572] }
    },
    {
      type: "Feature",
      id: "st-2a-11",
      properties: {
        name: "Ga Văn Khê",
        line: "Line 2A",
        type: "Ga trên cao",
        status: "Đang vận hành",
        address: "Đường Quang Trung, P. Phú La, Q. Hà Đông",
        connect: "KĐT Văn Khê, The Pride"
      },
      geometry: { type: "Point", coordinates: [105.7505, 20.9489] }
    },
    {
      type: "Feature",
      id: "st-2a-12",
      properties: {
        name: "Ga Yên Nghĩa",
        line: "Line 2A",
        type: "Ga trên cao - Ga cuối",
        status: "Đang vận hành",
        address: "Bến xe Yên Nghĩa, Quốc lộ 6, Q. Hà Đông",
        connect: "Bến xe khách liên tỉnh Yên Nghĩa, Bus BRT 01"
      },
      geometry: { type: "Point", coordinates: [105.7420, 20.9405] }
    },

    // Tuyến 3
    {
      type: "Feature",
      id: "st-3-01",
      properties: {
        name: "Ga Nhổn",
        line: "Line 3",
        type: "Ga trên cao - Depot",
        status: "Đã vận hành đoạn trên cao",
        address: "Đường Cầu Diễn, P. Minh Khai, Q. Bắc Từ Liêm",
        connect: "Trường Đại học Công nghiệp Hà Nội"
      },
      geometry: { type: "Point", coordinates: [105.7335, 21.0632] }
    },
    {
      type: "Feature",
      id: "st-3-02",
      properties: {
        name: "Ga Minh Khai",
        line: "Line 3",
        type: "Ga trên cao",
        status: "Đã vận hành đoạn trên cao",
        address: "Quốc lộ 32, Q. Bắc Từ Liêm",
        connect: "Khu vực dân cư Phúc Diễn, Minh Khai"
      },
      geometry: { type: "Point", coordinates: [105.7432, 21.0560] }
    },
    {
      type: "Feature",
      id: "st-3-03",
      properties: {
        name: "Ga Phú Diễn",
        line: "Line 3",
        type: "Ga trên cao",
        status: "Đã vận hành đoạn trên cao",
        address: "Quốc lộ 32, Q. Bắc Từ Liêm",
        connect: "Trường ĐH Tài nguyên & Môi trường"
      },
      geometry: { type: "Point", coordinates: [105.7548, 21.0489] }
    },
    {
      type: "Feature",
      id: "st-3-04",
      properties: {
        name: "Ga Cầu Diễn",
        line: "Line 3",
        type: "Ga trên cao",
        status: "Đã vận hành đoạn trên cao",
        address: "Đường Cầu Diễn, Q. Nam Từ Liêm",
        connect: "Chợ Cầu Diễn, khu đô thị Mỹ Đình 1"
      },
      geometry: { type: "Point", coordinates: [105.7665, 21.0425] }
    },
    {
      type: "Feature",
      id: "st-3-05",
      properties: {
        name: "Ga Lê Đức Thọ",
        line: "Line 3",
        type: "Ga trên cao",
        status: "Đã vận hành đoạn trên cao",
        address: "Đường Hồ Tùng Mậu, Q. Nam Từ Liêm",
        connect: "Khu Liên hợp Thể thao Mỹ Đình, ĐH Thương Mại"
      },
      geometry: { type: "Point", coordinates: [105.7770, 21.0380] }
    },
    {
      type: "Feature",
      id: "st-3-06",
      properties: {
        name: "Ga Đại học Quốc Gia",
        line: "Line 3 & Line 8 (Quy hoạch)",
        type: "Ga trên cao",
        status: "Đã vận hành đoạn trên cao",
        address: "Đường Xuân Thủy, Q. Cầu Giấy",
        connect: "ĐHQGHN, ĐH Sư Phạm Hà Nội, ĐH Ngoại Ngữ"
      },
      geometry: { type: "Point", coordinates: [105.7865, 21.0362] }
    },
    {
      type: "Feature",
      id: "st-3-07",
      properties: {
        name: "Ga Chùa Hà",
        line: "Line 3",
        type: "Ga trên cao",
        status: "Đã vận hành đoạn trên cao",
        address: "Đường Cầu Giấy, Q. Cầu Giấy",
        connect: "Di tích Chùa Hà, Học viện Báo chí & Tuyên truyền"
      },
      geometry: { type: "Point", coordinates: [105.7960, 21.0335] }
    },
    {
      type: "Feature",
      id: "st-3-08",
      properties: {
        name: "Ga Cầu Giấy",
        line: "Line 3",
        type: "Ga trên cao (Điểm chuyển tiếp ngầm)",
        status: "Đã vận hành đoạn trên cao",
        address: "Đường Cầu Giấy (Cửa ngõ Đền Voi Phục), Q. Cầu Giấy",
        connect: "Trường ĐH Giao thông Vận tải, Công viên Thủ Lệ"
      },
      geometry: { type: "Point", coordinates: [105.8035, 21.0305] }
    },
    {
      type: "Feature",
      id: "st-3-09",
      properties: {
        name: "Ga Kim Mã",
        line: "Line 3 & Line 5 (Quy hoạch)",
        type: "Ga ngầm sâu 3 tầng",
        status: "Đang thi công phần ngầm",
        address: "Phố Kim Mã (Đối diện KS Daewoo, Lotte Center), Q. Ba Đình",
        connect: "Tổ hợp Lotte Center Hà Nội, Đại sứ quán Nhật Bản"
      },
      geometry: { type: "Point", coordinates: [105.8175, 21.0315] }
    },
    {
      type: "Feature",
      id: "st-3-10",
      properties: {
        name: "Ga Văn Miếu",
        line: "Line 3",
        type: "Ga ngầm",
        status: "Đang thi công phần ngầm",
        address: "Phố Quốc Tử Giám, Q. Đống Đa",
        connect: "Di tích quốc gia đặc biệt Văn Miếu - Quốc Tử Giám"
      },
      geometry: { type: "Point", coordinates: [105.8365, 21.0282] }
    },
    {
      type: "Feature",
      id: "st-3-11",
      properties: {
        name: "Ga Hà Nội",
        line: "Line 3 & Line 1 (Đầu mối quốc gia)",
        type: "Ga ngầm trung tâm & Ga đường sắt quốc gia",
        status: "Đang thi công đoạn ngầm",
        address: "Đường Trần Hưng Đạo / Lê Duẩn, Q. Hoàn Kiếm",
        connect: "Ga xe lửa Hà Nội (Đường sắt Bắc Nam), Bệnh viện Tim Hà Nội"
      },
      geometry: { type: "Point", coordinates: [105.8420, 21.0245] }
    }
  ]
};
