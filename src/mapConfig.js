export const HANOI_CENTER = [105.8542, 21.0285];
export const DEFAULT_ZOOM = 11;

export const QUICK_DESTINATIONS = [
  {
    id: "center",
    name: "Trung tâm Hà Nội",
    coordinates: [105.8542, 21.0285],
    zoom: 13,
    description: "Khu vực Hoàn Kiếm, Ba Đình và lõi đô thị lịch sử"
  },
  {
    id: "north",
    name: "Cực phía Bắc",
    coordinates: [105.8500, 21.4800],
    zoom: 11,
    description: "Khu vực Sóc Sơn, rừng phòng hộ và hồ Đồng Quan"
  },
  {
    id: "west",
    name: "Cực phía Tây",
    coordinates: [105.4500, 21.0300],
    zoom: 11,
    description: "Khu vực Ba Vì, KĐT Hòa Lạc và chuỗi sinh thái Tây Hà Nội"
  },
  {
    id: "red_river",
    name: "Trục Sông Hồng",
    coordinates: [105.8450, 21.0800],
    zoom: 12,
    description: "Trục không gian cảnh quan trung tâm kết nối hai bờ sông Hồng"
  },
  {
    id: "noi_bai",
    name: "Sân bay Nội Bài",
    coordinates: [105.8040, 21.2210],
    zoom: 13,
    description: "Cảng hàng không quốc tế Nội Bài và trung tâm Logistics"
  },
  {
    id: "south",
    name: "Phía Nam (Phú Xuyên)",
    coordinates: [105.9100, 20.7400],
    zoom: 12,
    description: "Đô thị vệ tinh Phú Xuyên - Cửa ngõ kết nối phía Nam"
  }
];

export const LAYER_DEFINITIONS = {
  qhc: {
    id: "qhc",
    label: "Quy hoạch chung (QHC)",
    color: "#8b2cff",
    type: "fill"
  },
  qhpk: {
    id: "qhpk",
    label: "Phân khu (QHPK)",
    color: "#ff5a00",
    type: "fill"
  },
  metro: {
    id: "metro",
    label: "Metro hiện hữu / đang xây",
    color: "#00a878",
    type: "line"
  },
  metroPlan: {
    id: "metroPlan",
    label: "Tuyến Metro quy hoạch",
    color: "#ef3cff",
    gradient: true,
    type: "line"
  },
  stations: {
    id: "stations",
    label: "Ga Metro",
    color: "#ff9800",
    circle: true,
    type: "circle"
  },
  roads: {
    id: "roads",
    label: "Nền rõ đường / nhãn",
    color: "#64748b",
    road: true,
    type: "raster"
  }
};

export function classifyLandUse(name = "") {
  const s = (name || "").toLowerCase();
  if (/ở|dân cư|nhà ở|đô thị/.test(s)) return { icon: "🏠", label: "Đất ở / Đô thị", color: "#8b2cff" };
  if (/cây xanh|công viên|thể thao|tdtt|vườn hoa|sinh thái/.test(s)) return { icon: "🌳", label: "Cây xanh / TDTT", color: "#10b981" };
  if (/sông|hồ|kênh|mặt nước|thủy/.test(s)) return { icon: "💧", label: "Mặt nước", color: "#0284c7" };
  if (/giao thông|đường sắt|bến xe|nhà ga|hạ tầng|sân bay/.test(s)) return { icon: "🚦", label: "Giao thông / Hạ tầng", color: "#6366f1" };
  if (/công nghiệp|công nghệ cao|kho|ttcn/.test(s)) return { icon: "🏭", label: "Công nghiệp / Công nghệ", color: "#7c3aed" };
  if (/nông nghiệp|trồng lúa|rừng|lâm nghiệp/.test(s)) return { icon: "🌾", label: "Nông - lâm nghiệp", color: "#84cc16" };
  if (/quốc phòng|an ninh|quân sự/.test(s)) return { icon: "🛡️", label: "An ninh / Quốc phòng", color: "#dc2626" };
  if (/trường|giáo dục|y tế|bệnh viện|công cộng|dịch vụ|thương mại|hành chính/.test(s)) return { icon: "🏢", label: "Công cộng / Dịch vụ", color: "#f59e0b" };
  return { icon: "📍", label: "Chức năng khác", color: "#94a3b8" };
}