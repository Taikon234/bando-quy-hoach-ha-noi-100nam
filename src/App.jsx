import React, { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

import {
  QHC_GEOJSON,
  QHPK_GEOJSON,
  METRO_ACTIVE_GEOJSON,
  METRO_PLANNED_GEOJSON,
  METRO_STATIONS_GEOJSON,
} from "./data/hanoiZoningData.js";

import {
  HANOI_CENTER,
  DEFAULT_ZOOM,
  QUICK_DESTINATIONS,
  LAYER_DEFINITIONS,
  classifyLandUse,
} from "./mapConfig.js";

import { ZoningListModal } from "./components/ZoningListModal.jsx";
import { ZoningDetailModal } from "./components/ZoningDetailModal.jsx";
import { LandPriceModal } from "./components/LandPriceModal.jsx";
import { ZoningStatsModal } from "./components/ZoningStatsModal.jsx";
import { GuideModal } from "./components/GuideModal.jsx";
import { FaqModal } from "./components/FaqModal.jsx";

// Helper tính bounding box từ GeoJSON geometry
function getFeatureBounds(feature) {
  const coords = [];
  const extract = (geom) => {
    if (geom.type === "Point") coords.push(geom.coordinates);
    else if (geom.type === "LineString" || geom.type === "MultiPoint")
      coords.push(...geom.coordinates);
    else if (geom.type === "Polygon" || geom.type === "MultiLineString")
      geom.coordinates.forEach((ring) => coords.push(...ring));
    else if (geom.type === "MultiPolygon")
      geom.coordinates.forEach((poly) =>
        poly.forEach((ring) => coords.push(...ring))
      );
  };
  extract(feature.geometry);
  if (coords.length === 0) return null;

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  coords.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });
  return [
    [minX, minY],
    [maxX, maxY],
  ];
}

function getFeatureCenter(feature) {
  if (feature.geometry.type === "Point") return feature.geometry.coordinates;
  const bounds = getFeatureBounds(feature);
  if (!bounds) return HANOI_CENTER;
  return [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
}

function App() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const popupRef = useRef(null);

  // Layer toggles
  const [layers, setLayers] = useState({
    qhc: true,
    qhpk: true,
    metro: true,
    metroPlan: true,
    stations: true,
    roads: true,
  });

  // Search state
  const [search, setSearch] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [searchStatus, setSearchStatus] = useState(null); // 'success' | 'error' | null

  // Dark mode state
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("hanoi_map_dark") === "true";
    } catch {
      return false;
    }
  });

  // UI Panels & Modals State
  const [showPanel, setShowPanel] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  const [isZoningListOpen, setIsZoningListOpen] = useState(false);
  const [isZoningDetailOpen, setIsZoningDetailOpen] = useState(false);
  const [selectedZoningFeature, setSelectedZoningFeature] = useState(null);

  const [isLandPriceOpen, setIsLandPriceOpen] = useState(false);
  const [selectedZoningCodeForPrice, setSelectedZoningCodeForPrice] = useState("");

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  // Sync dark mode to localStorage and body
  useEffect(() => {
    try {
      localStorage.setItem("hanoi_map_dark", dark ? "true" : "false");
    } catch (e) {
      console.warn(e);
    }
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  // Update Basemap tile style when Dark mode changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    if (map.getLayer("basemap-light")) {
      map.setLayoutProperty(
        "basemap-light",
        "visibility",
        dark ? "none" : "visible"
      );
    }
    if (map.getLayer("basemap-dark")) {
      map.setLayoutProperty(
        "basemap-dark",
        "visibility",
        dark ? "visible" : "none"
      );
    }
  }, [dark, isMapReady]);

  // Update layer visibility when state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    // QHC layers
    if (map.getLayer("qhc-fill")) {
      map.setLayoutProperty(
        "qhc-fill",
        "visibility",
        layers.qhc ? "visible" : "none"
      );
    }
    if (map.getLayer("qhc-line")) {
      map.setLayoutProperty(
        "qhc-line",
        "visibility",
        layers.qhc ? "visible" : "none"
      );
    }

    // QHPK layers
    if (map.getLayer("qhpk-fill")) {
      map.setLayoutProperty(
        "qhpk-fill",
        "visibility",
        layers.qhpk ? "visible" : "none"
      );
    }
    if (map.getLayer("qhpk-line")) {
      map.setLayoutProperty(
        "qhpk-line",
        "visibility",
        layers.qhpk ? "visible" : "none"
      );
    }

    // Metro Active layers
    if (map.getLayer("metro-active-operating")) {
      map.setLayoutProperty(
        "metro-active-operating",
        "visibility",
        layers.metro ? "visible" : "none"
      );
    }
    if (map.getLayer("metro-active-construction")) {
      map.setLayoutProperty(
        "metro-active-construction",
        "visibility",
        layers.metro ? "visible" : "none"
      );
    }

    // Metro Planned layers
    if (map.getLayer("metro-planned-lines")) {
      map.setLayoutProperty(
        "metro-planned-lines",
        "visibility",
        layers.metroPlan ? "visible" : "none"
      );
    }

    // Stations layers
    if (map.getLayer("metro-stations-circle-outer")) {
      map.setLayoutProperty(
        "metro-stations-circle-outer",
        "visibility",
        layers.stations ? "visible" : "none"
      );
    }
    if (map.getLayer("metro-stations-circle-inner")) {
      map.setLayoutProperty(
        "metro-stations-circle-inner",
        "visibility",
        layers.stations ? "visible" : "none"
      );
    }

    // Roads & Labels overlay
    if (map.getLayer("roads-labels-overlay")) {
      map.setLayoutProperty(
        "roads-labels-overlay",
        "visibility",
        layers.roads ? "visible" : "none"
      );
    }
  }, [layers, isMapReady]);

  // Di chuyển camera mượt mà
  const goTo = useCallback((lon, lat, zoom = 13) => {
    mapRef.current?.flyTo({
      center: [lon, lat],
      zoom,
      essential: true,
      duration: 1400,
    });
  }, []);

  // Về trung tâm Hà Nội
  const goCenter = useCallback(() => {
    goTo(HANOI_CENTER[0], HANOI_CENTER[1], DEFAULT_ZOOM);
  }, [goTo]);

  // Chọn vùng quy hoạch và bay đến trên bản đồ
  const handleSelectZoneOnMap = useCallback(
    (feature) => {
      const map = mapRef.current;
      if (!map || !feature) return;

      const center = getFeatureCenter(feature);
      goTo(center[0], center[1], 13.5);

      // Highlight feature
      const highlightSource = map.getSource("highlight-data");
      if (highlightSource) {
        highlightSource.setData({
          type: "FeatureCollection",
          features: [feature],
        });
      }

      // Show popup
      const props = feature.properties || {};
      const { icon, label } = classifyLandUse(props.category || props.name);

      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({
        maxWidth: "340px",
        offset: 12,
        className: "custom-maplibre-popup",
      })
        .setLngLat(center)
        .setHTML(`
          <div class="custom-popup zoning-popup">
            <div class="popup-header">
              <span class="popup-badge ${
                props.grp === "QHPK" ? "badge-qhpk" : "badge-qhc"
              }">
                ${props.grp === "QHPK" ? "Phân khu (QHPK)" : "Quy hoạch chung (QHC)"}
              </span>
              <span class="popup-code">${props.code || ""}</span>
            </div>
            <h3 class="popup-title">${props.name}</h3>
            <div class="popup-category">
              <span class="category-icon">${icon}</span>
              <span class="category-text"><b>${label}</b> · ${props.landUse || ""}</span>
            </div>
            <div class="popup-grid">
              <div class="grid-item">
                <span class="grid-label">Diện tích:</span>
                <span class="grid-value">${props.area || "Đang cập nhật"}</span>
              </div>
              <div class="grid-item">
                <span class="grid-label">Mật độ XD:</span>
                <span class="grid-value">${props.density || "Chuẩn QC"}</span>
              </div>
            </div>
            <div class="popup-btn-row">
              <button class="popup-btn-action" onclick="window.__hanoiMapApp.openDetail('${props.code}')">
                📊 Chi tiết & Q%
              </button>
              <button class="popup-btn-action btn-price-action" onclick="window.__hanoiMapApp.openLandPrice('${props.code}')">
                💰 Giá đất
              </button>
            </div>
          </div>
        `)
        .addTo(map);
    },
    [goTo]
  );

  // Chọn theo mã code từ bảng giá đất
  const handleSelectZoningCodeOnMap = useCallback(
    (code) => {
      const allFeatures = [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features];
      const match = allFeatures.find((f) => f.properties?.code === code);
      if (match) {
        handleSelectZoneOnMap(match);
      } else {
        goCenter();
      }
    },
    [handleSelectZoneOnMap, goCenter]
  );

  // Đăng ký window bridge để popup HTML có thể gọi ngược lại React
  useEffect(() => {
    window.__hanoiMapApp = {
      openDetail: (code) => {
        const allFeatures = [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features];
        const match = allFeatures.find((f) => f.properties?.code === code);
        if (match) {
          setSelectedZoningFeature(match);
          setIsZoningDetailOpen(true);
        }
      },
      openLandPrice: (code) => {
        setSelectedZoningCodeForPrice(code || "");
        setIsLandPriceOpen(true);
      },
      openStats: () => {
        setIsStatsOpen(true);
      },
    };

    return () => {
      delete window.__hanoiMapApp;
    };
  }, []);

  // Khởi tạo MapLibre GL Map duy nhất
  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      center: HANOI_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 8,
      maxZoom: 18,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          "osm-basemap": {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
          "carto-dark": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution: "© CartoDB, © OpenStreetMap",
          },
          "roads-labels": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
          },
          "qhc-data": {
            type: "geojson",
            data: QHC_GEOJSON,
          },
          "qhpk-data": {
            type: "geojson",
            data: QHPK_GEOJSON,
          },
          "metro-active-data": {
            type: "geojson",
            data: METRO_ACTIVE_GEOJSON,
          },
          "metro-planned-data": {
            type: "geojson",
            data: METRO_PLANNED_GEOJSON,
          },
          "metro-stations-data": {
            type: "geojson",
            data: METRO_STATIONS_GEOJSON,
          },
          "highlight-data": {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          },
        },
        layers: [
          // 1. Basemaps (Light & Dark)
          {
            id: "basemap-light",
            type: "raster",
            source: "osm-basemap",
            layout: {
              visibility: dark ? "none" : "visible",
            },
            paint: {
              "raster-opacity": 0.95,
            },
          },
          {
            id: "basemap-dark",
            type: "raster",
            source: "carto-dark",
            layout: {
              visibility: dark ? "visible" : "none",
            },
            paint: {
              "raster-opacity": 0.98,
            },
          },

          // 2. QHC Quy hoạch chung (Màu tím)
          {
            id: "qhc-fill",
            type: "fill",
            source: "qhc-data",
            paint: {
              "fill-color": ["coalesce", ["get", "fc"], "#8b2cff"],
              "fill-opacity": 0.42,
            },
          },
          {
            id: "qhc-line",
            type: "line",
            source: "qhc-data",
            paint: {
              "line-color": "#6b21a8",
              "line-width": 2,
              "line-opacity": 0.85,
            },
          },

          // 3. QHPK Quy hoạch phân khu (Màu cam)
          {
            id: "qhpk-fill",
            type: "fill",
            source: "qhpk-data",
            paint: {
              "fill-color": ["coalesce", ["get", "fc"], "#ff5a00"],
              "fill-opacity": 0.48,
            },
          },
          {
            id: "qhpk-line",
            type: "line",
            source: "qhpk-data",
            paint: {
              "line-color": "#c2410c",
              "line-width": 2,
              "line-opacity": 0.9,
            },
          },

          // 4. Highlight Layer cho Tìm kiếm
          {
            id: "search-highlight-fill",
            type: "fill",
            source: "highlight-data",
            paint: {
              "fill-color": "#00f2fe",
              "fill-opacity": 0.55,
            },
          },
          {
            id: "search-highlight-line",
            type: "line",
            source: "highlight-data",
            paint: {
              "line-color": "#0284c7",
              "line-width": 4,
              "line-opacity": 1,
            },
          },

          // 5. Metro Hiện hữu / Đang xây (Line 2A & 3)
          {
            id: "metro-active-operating",
            type: "line",
            source: "metro-active-data",
            filter: ["==", ["get", "statusType"], "operating"],
            paint: {
              "line-color": "#00a878",
              "line-width": 4.5,
              "line-opacity": 0.95,
            },
          },
          {
            id: "metro-active-construction",
            type: "line",
            source: "metro-active-data",
            filter: ["==", ["get", "statusType"], "construction"],
            paint: {
              "line-color": "#ff6b00",
              "line-width": 4.5,
              "line-dasharray": [3, 2],
              "line-opacity": 0.95,
            },
          },

          // 6. Tuyến Metro Quy hoạch (Line 1, 2, 5, 8)
          {
            id: "metro-planned-lines",
            type: "line",
            source: "metro-planned-data",
            paint: {
              "line-color": ["coalesce", ["get", "color"], "#ef3cff"],
              "line-width": 3.5,
              "line-dasharray": [2, 2],
              "line-opacity": 0.85,
            },
          },

          // 7. Ga Metro (Circle markers)
          {
            id: "metro-stations-circle-outer",
            type: "circle",
            source: "metro-stations-data",
            paint: {
              "circle-radius": 7.5,
              "circle-color": "#ff9800",
              "circle-stroke-width": 2.5,
              "circle-stroke-color": "#ffffff",
            },
          },
          {
            id: "metro-stations-circle-inner",
            type: "circle",
            source: "metro-stations-data",
            paint: {
              "circle-radius": 3.5,
              "circle-color": "#ffffff",
            },
          },

          // 8. Nhãn đường / Ga overlay
          {
            id: "roads-labels-overlay",
            type: "raster",
            source: "roads-labels",
            layout: {
              visibility: "visible",
            },
            paint: {
              "raster-opacity": 0.85,
            },
          },
        ],
      },
    });

    mapRef.current = map;

    // Thêm các Controls chuẩn
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 120,
        unit: "metric",
      }),
      "bottom-left"
    );

    map.on("load", () => {
      setIsMapReady(true);
    });

    // Helper tạo popup quy hoạch
    const showZoningPopup = (e, feature) => {
      if (!feature) return;
      const props = feature.properties || {};
      const { icon, label } = classifyLandUse(props.category || props.name);

      const html = `
        <div class="custom-popup zoning-popup">
          <div class="popup-header">
            <span class="popup-badge ${
              props.grp === "QHPK" ? "badge-qhpk" : "badge-qhc"
            }">
              ${props.grp === "QHPK" ? "Phân khu (QHPK)" : "Quy hoạch chung (QHC)"}
            </span>
            <span class="popup-code">${props.code || ""}</span>
          </div>
          <h3 class="popup-title">${props.name || "Khu vực quy hoạch"}</h3>
          <div class="popup-category">
            <span class="category-icon">${icon}</span>
            <span class="category-text"><b>${label}</b> · ${props.landUse || ""}</span>
          </div>
          <div class="popup-grid">
            <div class="grid-item">
              <span class="grid-label">Diện tích:</span>
              <span class="grid-value">${props.area || "Đang cập nhật"}</span>
            </div>
            <div class="grid-item">
              <span class="grid-label">Mật độ XD:</span>
              <span class="grid-value">${props.density || "Chuẩn quy chuẩn"}</span>
            </div>
            <div class="grid-item">
              <span class="grid-label">Tầng cao:</span>
              <span class="grid-value">${props.maxFloors || "Theo thiết kế đô thị"}</span>
            </div>
            <div class="grid-item">
              <span class="grid-label">Trạng thái:</span>
              <span class="grid-value status-active">${props.status || "Đã phê duyệt"}</span>
            </div>
          </div>
          ${
            props.description
              ? `<div class="popup-desc">${props.description}</div>`
              : ""
          }
          <div class="popup-btn-row">
            <button class="popup-btn-action" onclick="window.__hanoiMapApp.openDetail('${props.code}')">
              📊 Chi tiết & Q%
            </button>
            <button class="popup-btn-action btn-price-action" onclick="window.__hanoiMapApp.openLandPrice('${props.code}')">
              💰 Giá đất
            </button>
          </div>
        </div>
      `;

      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({
        maxWidth: "340px",
        offset: 12,
        className: "custom-maplibre-popup",
      })
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map);
    };

    // Helper tạo popup Ga Metro
    const showStationPopup = (e, feature) => {
      if (!feature) return;
      const props = feature.properties || {};
      const html = `
        <div class="custom-popup station-popup">
          <div class="popup-header">
            <span class="popup-badge badge-station">🚉 Ga Đường Sắt Đô Thị</span>
            <span class="popup-code">${props.status || "Khai thác"}</span>
          </div>
          <h3 class="popup-title">${props.name}</h3>
          <div class="station-meta">
            <div class="meta-row"><b>Tuyến:</b> ${props.line}</div>
            <div class="meta-row"><b>Loại ga:</b> ${props.type || "Ga trên cao"}</div>
            <div class="meta-row"><b>Địa chỉ:</b> ${props.address || ""}</div>
            <div class="meta-row"><b>Kết nối:</b> ${props.connect || ""}</div>
          </div>
        </div>
      `;

      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({
        maxWidth: "320px",
        offset: 12,
        className: "custom-maplibre-popup",
      })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(html)
        .addTo(map);
    };

    // Helper tạo popup Tuyến Metro
    const showLinePopup = (e, feature) => {
      if (!feature) return;
      const props = feature.properties || {};
      const html = `
        <div class="custom-popup metro-line-popup">
          <div class="popup-header">
            <span class="popup-badge badge-metro">🚇 Tuyến Metro</span>
            <span class="popup-code">${props.code}</span>
          </div>
          <h3 class="popup-title">${props.name}</h3>
          <div class="station-meta">
            <div class="meta-row"><b>Trạng thái:</b> ${props.status}</div>
            <div class="meta-row"><b>Chiều dài:</b> ${props.length || ""}</div>
            <div class="meta-row"><b>Số lượng ga:</b> ${
              props.stationsCount ? props.stationsCount + " ga" : ""
            }</div>
            <div class="meta-row"><b>Mô tả:</b> ${props.description || ""}</div>
          </div>
        </div>
      `;

      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({
        maxWidth: "320px",
        offset: 12,
        className: "custom-maplibre-popup",
      })
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map);
    };

    // Click events
    map.on("click", "qhc-fill", (e) => {
      showZoningPopup(e, e.features?.[0]);
    });

    map.on("click", "qhpk-fill", (e) => {
      showZoningPopup(e, e.features?.[0]);
    });

    map.on("click", "metro-stations-circle-outer", (e) => {
      showStationPopup(e, e.features?.[0]);
    });

    map.on("click", "metro-active-operating", (e) => {
      showLinePopup(e, e.features?.[0]);
    });

    map.on("click", "metro-active-construction", (e) => {
      showLinePopup(e, e.features?.[0]);
    });

    map.on("click", "metro-planned-lines", (e) => {
      showLinePopup(e, e.features?.[0]);
    });

    // Hover cursor styling
    const interactiveLayers = [
      "qhc-fill",
      "qhpk-fill",
      "metro-stations-circle-outer",
      "metro-active-operating",
      "metro-active-construction",
      "metro-planned-lines",
    ];

    interactiveLayers.forEach((layerId) => {
      map.on("mouseenter", layerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layerId, () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      if (popupRef.current) popupRef.current.remove();
      if (userMarkerRef.current) userMarkerRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [dark]);

  // Bật/tắt layer
  const toggleLayer = useCallback((key) => {
    setLayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Vị trí của tôi
  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setSearchStatus("error");
      setSearchMessage("Trình duyệt của bạn không hỗ trợ định vị Geolocation.");
      setTimeout(() => setSearchMessage(""), 4000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lon = position.coords.longitude;
        const lat = position.coords.latitude;

        goTo(lon, lat, 15);

        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        const el = document.createElement("div");
        el.className = "user-location-marker";

        userMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([lon, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 15 }).setHTML(
              "<div style='padding:5px;font-weight:600;'>📍 Vị trí hiện tại của bạn</div>"
            )
          )
          .addTo(mapRef.current);

        setSearchStatus("success");
        setSearchMessage("Đã xác định được vị trí của bạn!");
        setTimeout(() => setSearchMessage(""), 3000);
      },
      (error) => {
        console.warn("Geolocation denied or failed:", error);
        setSearchStatus("error");
        setSearchMessage(
          "Không thể truy cập vị trí. Hãy kiểm tra quyền cấp phép vị trí của trình duyệt."
        );
        setTimeout(() => setSearchMessage(""), 4500);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [goTo]);

  // Tìm kiếm loại đất & địa điểm
  const searchPlace = useCallback(() => {
    const keyword = search.trim().toLowerCase();
    const map = mapRef.current;

    if (!keyword) {
      goCenter();
      return;
    }

    // 1. Tìm trong Quick Destinations
    const matchedQuick = QUICK_DESTINATIONS.find((item) =>
      item.name.toLowerCase().includes(keyword)
    );
    if (matchedQuick) {
      goTo(
        matchedQuick.coordinates[0],
        matchedQuick.coordinates[1],
        matchedQuick.zoom
      );
      setSearchStatus("success");
      setSearchMessage(`Đã chuyển tới: ${matchedQuick.name}`);
      setTimeout(() => setSearchMessage(""), 3500);
      return;
    }

    // 2. Tìm trong Ga Metro
    const matchedStation = METRO_STATIONS_GEOJSON.features.find((f) => {
      const p = f.properties;
      return (
        p.name.toLowerCase().includes(keyword) ||
        p.line.toLowerCase().includes(keyword) ||
        p.address.toLowerCase().includes(keyword)
      );
    });
    if (matchedStation) {
      const [lon, lat] = matchedStation.geometry.coordinates;
      goTo(lon, lat, 15);

      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({
        maxWidth: "320px",
        offset: 12,
        className: "custom-maplibre-popup",
      })
        .setLngLat([lon, lat])
        .setHTML(`
          <div class="custom-popup station-popup">
            <div class="popup-header">
              <span class="popup-badge badge-station">🚉 Ga Đường Sắt Đô Thị</span>
              <span class="popup-code">${matchedStation.properties.status}</span>
            </div>
            <h3 class="popup-title">${matchedStation.properties.name}</h3>
            <div class="station-meta">
              <div class="meta-row"><b>Tuyến:</b> ${matchedStation.properties.line}</div>
              <div class="meta-row"><b>Địa chỉ:</b> ${matchedStation.properties.address}</div>
            </div>
          </div>
        `)
        .addTo(map);

      setSearchStatus("success");
      setSearchMessage(`Tìm thấy ga: ${matchedStation.properties.name}`);
      setTimeout(() => setSearchMessage(""), 3500);
      return;
    }

    // 3. Tìm trong Lớp Quy hoạch (QHC & QHPK)
    const allFeatures = [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features];

    const matchedFeatures = allFeatures.filter((f) => {
      const p = f.properties;
      return (
        p.name?.toLowerCase().includes(keyword) ||
        p.category?.toLowerCase().includes(keyword) ||
        p.landUse?.toLowerCase().includes(keyword) ||
        p.code?.toLowerCase().includes(keyword) ||
        p.description?.toLowerCase().includes(keyword)
      );
    });

    if (matchedFeatures.length > 0) {
      handleSelectZoneOnMap(matchedFeatures[0]);
      setSearchStatus("success");
      setSearchMessage(
        `Tìm thấy ${matchedFeatures.length} khu vực phù hợp: ${matchedFeatures[0].properties.name}`
      );
      setTimeout(() => setSearchMessage(""), 4500);
      return;
    }

    // Không tìm thấy
    setSearchStatus("error");
    setSearchMessage(
      `Không tìm thấy dữ liệu phù hợp với "${search}". Hãy thử: Đất ở, Đất cây xanh, Đất công cộng, Đất giao thông, Đất hỗn hợp...`
    );
    setTimeout(() => setSearchMessage(""), 5000);
  }, [search, goTo, goCenter, handleSelectZoneOnMap]);

  return (
    <div className={dark ? "app dark" : "app"}>
      {/* HEADER */}
      <header className="header">
        <div className="logo" onClick={goCenter} style={{ cursor: "pointer" }}>
          <span className="logo-square"></span>
          <span>Ankaponq</span>
        </div>

        <nav>
          <span onClick={() => setIsGuideOpen(true)}>Tính năng</span>
          <span onClick={() => setIsZoningListOpen(true)}>Quy hoạch</span>
          <span onClick={() => setIsLandPriceOpen(true)}>Bảng giá</span>
          <span onClick={() => setIsStatsOpen(true)}>Chỉ tiêu Q%</span>
          <span onClick={() => setIsGuideOpen(true)}>Hướng dẫn</span>
          <span onClick={() => setIsFaqOpen(true)}>FAQ</span>
        </nav>

        <button className="open-map" onClick={goCenter}>
          Mở bản đồ
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>Bản đồ quy hoạch sử dụng đất Hà Nội</h1>
          <p>Hơn 127.000 vùng chức năng · Quy hoạch chung + Phân khu</p>
        </div>

        <div className="search-container">
          <div className="search-box">
            <input
              id="land-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchPlace();
                }
              }}
              placeholder="Tìm loại đất (Đất ở, cây xanh, công cộng...)..."
            />
            <button id="search-submit-btn" onClick={searchPlace}>
              Tìm
            </button>
          </div>

          {searchMessage && (
            <div
              className={`search-toast ${
                searchStatus === "success" ? "toast-success" : "toast-error"
              }`}
            >
              {searchMessage}
            </div>
          )}
        </div>
      </section>

      {/* MAP WRAPPER */}
      <main className="map-wrapper">
        <div ref={mapContainer} className="map" />

        {/* LAYER PANEL */}
        <aside className={showPanel ? "layer-panel" : "layer-panel collapsed"}>
          <div className="panel-header">
            <div>
              <h2>
                <span className="layers-icon">▱</span>
                Lớp bản đồ Quy hoạch
              </h2>
            </div>

            <div className="header-actions">
              <button
                className="icon-btn"
                title={dark ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
                onClick={() => setDark(!dark)}
              >
                {dark ? "☀" : "☾"}
              </button>
              <button
                className="icon-btn"
                title="Thu gọn bảng điều khiển"
                onClick={() => setShowPanel(false)}
              >
                ‹
              </button>
            </div>
          </div>

          <div className="divider"></div>

          <div className="layer-list">
            <LayerItem
              color={LAYER_DEFINITIONS.qhc.color}
              label={LAYER_DEFINITIONS.qhc.label}
              checked={layers.qhc}
              onChange={() => toggleLayer("qhc")}
            />

            <LayerItem
              color={LAYER_DEFINITIONS.qhpk.color}
              label={LAYER_DEFINITIONS.qhpk.label}
              checked={layers.qhpk}
              onChange={() => toggleLayer("qhpk")}
            />

            <LayerItem
              color={LAYER_DEFINITIONS.metro.color}
              label={LAYER_DEFINITIONS.metro.label}
              checked={layers.metro}
              onChange={() => toggleLayer("metro")}
            />

            <LayerItem
              gradient
              label={LAYER_DEFINITIONS.metroPlan.label}
              checked={layers.metroPlan}
              onChange={() => toggleLayer("metroPlan")}
            />

            <LayerItem
              circle
              label={LAYER_DEFINITIONS.stations.label}
              checked={layers.stations}
              onChange={() => toggleLayer("stations")}
            />

            <LayerItem
              road
              label={LAYER_DEFINITIONS.roads.label}
              checked={layers.roads}
              onChange={() => toggleLayer("roads")}
            />
          </div>

          <div className="divider"></div>

          {/* QUICK SHORTCUTS TO MODALS */}
          <div className="quick-title">⚡ Tra cứu nhanh:</div>
          <div className="shortcuts-row">
            <button
              className="shortcut-btn"
              onClick={() => setIsZoningListOpen(true)}
            >
              📑 Đồ án QH
            </button>
            <button
              className="shortcut-btn"
              onClick={() => {
                setSelectedZoningCodeForPrice("");
                setIsLandPriceOpen(true);
              }}
            >
              💰 Bảng giá đất
            </button>
            <button
              className="shortcut-btn"
              onClick={() => setIsStatsOpen(true)}
            >
              📊 Chỉ tiêu Q%
            </button>
          </div>

          <div className="divider"></div>

          <div className="quick-title">✥ Đến nhanh địa điểm:</div>

          <div className="quick-grid">
            {QUICK_DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                onClick={() =>
                  goTo(dest.coordinates[0], dest.coordinates[1], dest.zoom)
                }
                title={dest.description}
              >
                {dest.name}
              </button>
            ))}
          </div>

          <div className="divider"></div>

          <div className="legend-title">ⓘ Chú giải đường sắt & màu sắc:</div>

          <div className="rail-legend">
            <span>
              <i className="rail green"></i>
              Đang chạy
            </span>

            <span>
              <i className="rail orange"></i>
              Đang xây
            </span>

            <span>
              <i className="rail blue"></i>
              Quy hoạch
            </span>
          </div>

          <div className="color-legend-grid">
            <span className="legend-chip">
              <i style={{ background: "#8b2cff" }}></i> QHC (Tím)
            </span>
            <span className="legend-chip">
              <i style={{ background: "#ff5a00" }}></i> QHPK (Cam)
            </span>
            <span className="legend-chip">
              <i style={{ background: "#10b981" }}></i> Cây xanh
            </span>
            <span className="legend-chip">
              <i style={{ background: "#0284c7" }}></i> Mặt nước
            </span>
          </div>

          <button className="location-btn" onClick={locateMe}>
            ⌖ Vị trí của tôi
          </button>
        </aside>

        {/* TOGGLE PANEL BUTTON WHEN COLLAPSED */}
        {!showPanel && (
          <button
            className="panel-toggle"
            title="Mở bảng điều khiển"
            onClick={() => setShowPanel(true)}
          >
            ›
          </button>
        )}

        {/* MAP FOOTER ATTRIBUTION */}
        <div className="map-footer">
          ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap
          </a>{" "}
          contributors · MapLibre GL · Quy hoạch Thủ đô Hà Nội tầm nhìn 2050
        </div>
      </main>

      {/* 1. ZONING LIST MODAL */}
      <ZoningListModal
        isOpen={isZoningListOpen}
        onClose={() => setIsZoningListOpen(false)}
        onSelectZoneOnMap={handleSelectZoneOnMap}
        onViewZoneDetail={(feat) => {
          setSelectedZoningFeature(feat);
          setIsZoningDetailOpen(true);
        }}
        onViewLandPrice={(code) => {
          setSelectedZoningCodeForPrice(code);
          setIsLandPriceOpen(true);
        }}
      />

      {/* 2. ZONING DETAIL MODAL */}
      <ZoningDetailModal
        isOpen={isZoningDetailOpen}
        feature={selectedZoningFeature}
        onClose={() => setIsZoningDetailOpen(false)}
        onSelectZoneOnMap={handleSelectZoneOnMap}
        onOpenFullLandPrice={(code) => {
          setSelectedZoningCodeForPrice(code);
          setIsLandPriceOpen(true);
        }}
      />

      {/* 3. LAND PRICE TABLE MODAL */}
      <LandPriceModal
        isOpen={isLandPriceOpen}
        onClose={() => setIsLandPriceOpen(false)}
        initialZoningCode={selectedZoningCodeForPrice}
        onSelectZoningCodeOnMap={handleSelectZoningCodeOnMap}
      />

      {/* 4. ZONING STATS MODAL (Q%) */}
      <ZoningStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        onSelectZoneOnMap={handleSelectZoneOnMap}
      />

      {/* 5. GUIDE MODAL */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* 6. FAQ MODAL */}
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </div>
  );
}

function LayerItem({
  color,
  gradient,
  circle,
  road,
  label,
  checked,
  onChange,
}) {
  return (
    <label className="layer-item">
      {gradient ? (
        <span className="color-box gradient"></span>
      ) : circle ? (
        <span className="color-box circle"></span>
      ) : road ? (
        <span className="color-box road"></span>
      ) : (
        <span
          className="color-box"
          style={{
            background: color,
          }}
        ></span>
      )}

      <span className="layer-label">{label}</span>

      <input type="checkbox" checked={checked} onChange={onChange} />

      <span className="custom-check">{checked ? "✓" : ""}</span>
    </label>
  );
}

export default App;
