import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
  LAYER_DEFINITIONS,
  classifyLandUse,
} from "./mapConfig.js";

import { Header } from "./components/Header.jsx";
import { SearchBox } from "./components/SearchBox.jsx";
import { FilterPanel } from "./components/FilterPanel.jsx";
import { LayerControl } from "./components/LayerControl.jsx";
import { Legend } from "./components/Legend.jsx";
import { DetailPanel } from "./components/DetailPanel.jsx";
import { BookmarkPanel } from "./components/BookmarkPanel.jsx";
import { MeasureTool } from "./components/MeasureTool.jsx";

import { ZoningListModal } from "./components/ZoningListModal.jsx";
import { ZoningDetailModal } from "./components/ZoningDetailModal.jsx";
import { LandPriceModal } from "./components/LandPriceModal.jsx";
import { ZoningStatsModal } from "./components/ZoningStatsModal.jsx";
import { GuideModal } from "./components/GuideModal.jsx";
import { FaqModal } from "./components/FaqModal.jsx";

import {
  getFeatureCenter,
  getFeatureBounds,
  calculatePolylineLength,
  calculatePolygonArea,
} from "./utils/geoUtils.js";
import {
  getInitialMapStateFromUrl,
  syncMapStateToUrl,
  shareMapLocation,
} from "./utils/urlStateUtils.js";
import { getBookmarks } from "./utils/bookmarkUtils.js";
import { escapeHtml } from "./utils/sanitizeUtils.js";

function App() {
  const mapContainer = useRef(null);
  const overlayCanvasRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const popupRef = useRef(null);

  // Initial URL params
  const initialUrlState = useRef(getInitialMapStateFromUrl());

  // 1. Layer visibility states
  const [layers, setLayers] = useState({
    qhc: true,
    qhpk: true,
    metro: true,
    metroPlan: true,
    stations: true,
    roads: true,
  });

  // 2. Real-time Filter states
  const [filters, setFilters] = useState({
    grp: "all", // 'all' | 'QHC' | 'QHPK'
    landUse: "all", // 'all' | 'residential' | 'green' | 'water' | 'public' | 'traffic' | 'industrial'
    metroStatus: "all", // 'all' | 'operating' | 'construction'
  });

  // 3. Theme mode
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("hanoi_map_dark") === "true";
    } catch {
      return false;
    }
  });

  // 4. Panels & Drawers
  const [isLayerControlOpen, setIsLayerControlOpen] = useState(() => window.innerWidth > 900);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(() => getBookmarks().length);

  // 5. Measurement tool states
  const [isMeasuringActive, setIsMeasuringActive] = useState(false);
  const [measureMode, setMeasureMode] = useState("distance"); // 'distance' | 'area'
  const [measurePoints, setMeasurePoints] = useState([]);
  const [measuredValue, setMeasuredValue] = useState(0);

  // 6. Modals
  const [isZoningListOpen, setIsZoningListOpen] = useState(false);
  const [isZoningDetailOpen, setIsZoningDetailOpen] = useState(false);
  const [isLandPriceOpen, setIsLandPriceOpen] = useState(false);
  const [selectedZoningCodeForPrice, setSelectedZoningCodeForPrice] = useState("");
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const [isMapReady, setIsMapReady] = useState(false);
  const [globalToast, setGlobalToast] = useState("");

  const showToast = useCallback((msg, duration = 3000) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(""), duration);
  }, []);

  // Global Escape key listener to close active modals & panels
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsZoningListOpen(false);
        setIsZoningDetailOpen(false);
        setIsLandPriceOpen(false);
        setIsStatsOpen(false);
        setIsGuideOpen(false);
        setIsFaqOpen(false);
        setIsBookmarksOpen(false);
        setIsFilterPanelOpen(false);
        setIsMeasuringActive(false);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Map resize trigger on drawer/panel toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.resize();
    }, 250);
    return () => clearTimeout(timer);
  }, [isLayerControlOpen, isDetailPanelOpen, isFilterPanelOpen]);

  // Sync Dark mode to Body & LocalStorage
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

  // Sync Dark mode tiles on MapLibre
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

  // Camera flyTo helper
  const goTo = useCallback((lon, lat, zoom = 13.5, duration = 1200) => {
    mapRef.current?.flyTo({
      center: [lon, lat],
      zoom,
      essential: true,
      duration,
    });
  }, []);

  // Reset to Hanoi center
  const goCenter = useCallback(() => {
    const defaultCenter = initialUrlState.current?.center || HANOI_CENTER;
    const defaultZoom = initialUrlState.current?.zoom || DEFAULT_ZOOM;
    goTo(defaultCenter[0], defaultCenter[1], defaultZoom);
  }, [goTo]);

  // Select feature and highlight it
  const handleSelectFeature = useCallback(
    (feature, openDetail = true) => {
      const map = mapRef.current;
      if (!map || !feature) return;

      setSelectedFeature(feature);
      if (openDetail) {
        setIsDetailPanelOpen(true);
      }

      const center = getFeatureCenter(feature);
      goTo(center[0], center[1], 14);

      // Highlight GeoJSON
      const highlightSource = map.getSource("highlight-data");
      if (highlightSource) {
        highlightSource.setData({
          type: "FeatureCollection",
          features: [feature],
        });
      }

      // Sync URL
      syncMapStateToUrl(center, 14, feature.properties?.code);

      // Clean Popup
      const props = feature.properties || {};
      const { icon, label } = classifyLandUse(props.category || props.name);

      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({
        maxWidth: "320px",
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
              <span class="popup-code">${escapeHtml(props.code || "")}</span>
            </div>
            <h3 class="popup-title">${escapeHtml(props.name || "")}</h3>
            <div class="popup-category">
              <span class="category-icon">${icon}</span>
              <span class="category-text"><b>${escapeHtml(label)}</b> · ${escapeHtml(props.landUse || "")}</span>
            </div>
            <div class="popup-grid">
              <div class="grid-item">
                <span class="grid-label">Diện tích:</span>
                <span class="grid-value">${escapeHtml(props.area || "Đang cập nhật")}</span>
              </div>
              <div class="grid-item">
                <span class="grid-label">Mật độ XD:</span>
                <span class="grid-value">${escapeHtml(props.density || "Chuẩn QC")}</span>
              </div>
            </div>
            <div class="popup-btn-row">
              <button class="popup-btn-action" onclick="window.__hanoiGisBridge.openDetail('${escapeHtml(props.code)}')">
                📊 Chi tiết
              </button>
              <button class="popup-btn-action btn-price-action" onclick="window.__hanoiGisBridge.openLandPrice('${escapeHtml(props.code)}')">
                💰 Giá đất
              </button>
            </div>
          </div>
        `)
        .addTo(map);
    },
    [goTo]
  );

  // Register secure window bridge for MapLibre Popups
  useEffect(() => {
    window.__hanoiGisBridge = {
      openDetail: (code) => {
        const allFeatures = [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features];
        const match = allFeatures.find((f) => f.properties?.code === code);
        if (match) {
          setSelectedFeature(match);
          setIsDetailPanelOpen(true);
        }
      },
      openLandPrice: (code) => {
        setSelectedZoningCodeForPrice(code || "");
        setIsLandPriceOpen(true);
      },
    };

    return () => {
      delete window.__hanoiGisBridge;
    };
  }, []);

  const handleSelectFeatureRef = useRef(handleSelectFeature);
  useEffect(() => {
    handleSelectFeatureRef.current = handleSelectFeature;
  }, [handleSelectFeature]);

  // Computed count of matched planning zones for FilterPanel
  const matchedZonesCount = useMemo(() => {
    const allFeatures = [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features];
    return allFeatures.filter((f) => {
      if (filters.grp !== "all" && f.properties?.grp !== filters.grp) return false;
      if (filters.landUse !== "all") {
        const cat = f.properties?.category || "";
        if (filters.landUse === "residential" && cat !== "Đất ở") return false;
        if (filters.landUse === "green" && cat !== "Đất cây xanh") return false;
        if (filters.landUse === "water" && cat !== "Mặt nước") return false;
        if (filters.landUse === "public" && cat !== "Đất công cộng") return false;
        if (filters.landUse === "traffic" && cat !== "Đất giao thông") return false;
        if (filters.landUse === "industrial" && cat !== "Đất công nghiệp") return false;
      }
      return true;
    }).length;
  }, [filters]);

  // Render Planning Polygons using HTML5 Canvas Overlay (Guaranteed 100% reliable)
  const renderCanvasPolygons = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    const map = mapRef.current;
    if (!canvas || !map) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawPolygonGeometry = (geom, fillColor, strokeColor, lineWidth = 2.5) => {
      ctx.save();
      ctx.beginPath();

      const drawRing = (ring) => {
        for (let i = 0; i < ring.length; i++) {
          const pt = map.project(ring[i]);
          const x = pt.x * dpr;
          const y = pt.y * dpr;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
      };

      if (geom.type === "Polygon") {
        geom.coordinates.forEach((ring) => drawRing(ring));
      } else if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((polygon) => {
          polygon.forEach((ring) => drawRing(ring));
        });
      }

      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill("evenodd");
      }
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth * dpr;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke();
      }
      ctx.restore();
    };

    // Filter check helper
    const matchesLandUse = (category) => {
      if (filters.landUse === "all") return true;
      const cat = (category || "").toLowerCase();
      if (filters.landUse === "residential") return /ở|dân cư|đô thị/.test(cat);
      if (filters.landUse === "green") return /cây xanh|công viên|thể thao|tdtt/.test(cat);
      if (filters.landUse === "water") return /sông|hồ|mặt nước/.test(cat);
      if (filters.landUse === "public") return /công cộng|thương mại|dịch vụ/.test(cat);
      if (filters.landUse === "traffic") return /giao thông|hạ tầng|sân bay/.test(cat);
      if (filters.landUse === "industrial") return /công nghiệp|công nghệ/.test(cat);
      return true;
    };

    // 1. Draw QHC Polygons (Purple overlay)
    const isQHCVisible = layers.qhc && (filters.grp === "all" || filters.grp === "QHC");
    if (isQHCVisible) {
      QHC_GEOJSON.features.forEach((feat) => {
        if (!matchesLandUse(feat.properties?.category)) return;
        drawPolygonGeometry(
          feat.geometry,
          "rgba(139, 44, 255, 0.22)", // Soft purple fill
          "rgba(139, 44, 255, 0.95)", // High-contrast purple outline
          3.0
        );
      });
    }

    // 2. Draw QHPK Polygons (Orange overlay)
    const isQHPKVisible = layers.qhpk && (filters.grp === "all" || filters.grp === "QHPK");
    if (isQHPKVisible) {
      QHPK_GEOJSON.features.forEach((feat) => {
        if (!matchesLandUse(feat.properties?.category)) return;
        drawPolygonGeometry(
          feat.geometry,
          "rgba(255, 90, 0, 0.25)", // Soft orange fill
          "rgba(255, 90, 0, 0.95)", // High-contrast orange outline
          3.0
        );
      });
    }

    // 3. Highlight Selected Feature
    if (selectedFeature && selectedFeature.geometry) {
      drawPolygonGeometry(
        selectedFeature.geometry,
        "rgba(0, 242, 254, 0.35)",
        "#00f2fe",
        4.5
      );
    }
  }, [layers, filters, selectedFeature]);

  // Connect canvas redraw to MapLibre camera motion events
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let animFrameId = null;
    const scheduleRedraw = () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(() => {
        renderCanvasPolygons();
      });
    };

    map.on("move", scheduleRedraw);
    map.on("zoom", scheduleRedraw);
    map.on("resize", scheduleRedraw);
    map.on("rotate", scheduleRedraw);
    map.on("pitch", scheduleRedraw);
    map.on("idle", scheduleRedraw);

    // Initial render
    scheduleRedraw();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      map.off("move", scheduleRedraw);
      map.off("zoom", scheduleRedraw);
      map.off("resize", scheduleRedraw);
      map.off("rotate", scheduleRedraw);
      map.off("pitch", scheduleRedraw);
      map.off("idle", scheduleRedraw);
    };
  }, [renderCanvasPolygons, isMapReady]);

  // Update Metro visibility on MapLibre
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    const setVisibility = (layerId, isVisible) => {
      try {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, "visibility", isVisible ? "visible" : "none");
        }
      } catch (e) {
        console.warn("Set visibility error:", layerId, e);
      }
    };

    const isMetroActiveVisible =
      layers.metro &&
      (filters.metroStatus === "all" || filters.metroStatus === "operating");
    const isMetroConstVisible =
      layers.metro &&
      (filters.metroStatus === "all" || filters.metroStatus === "construction");

    setVisibility("metro-active-operating", isMetroActiveVisible);
    setVisibility("metro-active-construction", isMetroConstVisible);
    setVisibility("metro-planned-lines", layers.metroPlan && filters.metroStatus === "all");
    setVisibility("metro-stations-circle-outer", layers.stations);
    setVisibility("metro-stations-circle-inner", layers.stations);
  }, [layers, filters, isMapReady]);

  // Handle Measurement Layer updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    const source = map.getSource("measure-data-source");
    if (!source) return;

    if (!isMeasuringActive || measurePoints.length === 0) {
      source.setData({ type: "FeatureCollection", features: [] });
      setMeasuredValue(0);
      return;
    }

    const features = [];

    // 1. Point markers
    measurePoints.forEach((pt, i) => {
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: pt },
        properties: { index: i + 1 },
      });
    });

    // 2. Line or Polygon
    if (measureMode === "distance" && measurePoints.length >= 2) {
      features.push({
        type: "Feature",
        geometry: { type: "LineString", coordinates: measurePoints },
        properties: {},
      });
      const dist = calculatePolylineLength(measurePoints);
      setMeasuredValue(dist);
    } else if (measureMode === "area" && measurePoints.length >= 3) {
      const closedCoords = [...measurePoints, measurePoints[0]];
      features.push({
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [closedCoords] },
        properties: {},
      });
      const area = calculatePolygonArea(measurePoints);
      setMeasuredValue(area);
    }

    source.setData({ type: "FeatureCollection", features });
  }, [isMeasuringActive, measureMode, measurePoints, isMapReady]);

  // Initialize MapLibre GL ONCE on mount
  useEffect(() => {
    if (mapRef.current) return;

    const initialCenter = initialUrlState.current?.center || HANOI_CENTER;
    const initialZoom = initialUrlState.current?.zoom || DEFAULT_ZOOM;
    const initialDark = localStorage.getItem("hanoi_map_dark") === "true";

    const map = new maplibregl.Map({
      container: mapContainer.current,
      center: initialCenter,
      zoom: initialZoom,
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
        },
        layers: [
          // 1. Basemaps
          {
            id: "basemap-light",
            type: "raster",
            source: "osm-basemap",
            layout: { visibility: initialDark ? "none" : "visible" },
            paint: { "raster-opacity": 0.95 },
          },
          {
            id: "basemap-dark",
            type: "raster",
            source: "carto-dark",
            layout: { visibility: initialDark ? "visible" : "none" },
            paint: { "raster-opacity": 0.98 },
          },
        ],
      },
    });

    mapRef.current = map;
    window.__hanoiMap = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }),
      "bottom-left"
    );

    // Function to safely setup metro & measure layers in MapLibre
    const setupPlanningLayers = (mapInstance) => {
      if (!mapInstance) return;

      console.log("=== setupMetroAndMeasureLayers executing ===");

      // 1. Remove old layers if exist
      const layerIds = [
        "search-highlight-fill",
        "search-highlight-line",
        "metro-active-operating",
        "metro-active-construction",
        "metro-planned-lines",
        "metro-stations-circle-outer",
        "metro-stations-circle-inner",
        "measure-fill",
        "measure-lines",
        "measure-points",
      ];
      layerIds.forEach((id) => {
        if (mapInstance.getLayer(id)) {
          try {
            mapInstance.removeLayer(id);
          } catch (e) {
            console.warn("Remove layer error:", id, e);
          }
        }
      });

      // 2. Remove old sources if exist
      const sourceIds = [
        "metro-active-data",
        "metro-planned-data",
        "metro-stations-data",
        "highlight-data",
        "measure-data-source",
      ];
      sourceIds.forEach((id) => {
        if (mapInstance.getSource(id)) {
          try {
            mapInstance.removeSource(id);
          } catch (e) {
            console.warn("Remove source error:", id, e);
          }
        }
      });

      // 3. Add fresh clean GeoJSON sources
      mapInstance.addSource("metro-active-data", {
        type: "geojson",
        data: JSON.parse(JSON.stringify(METRO_ACTIVE_GEOJSON)),
      });

      mapInstance.addSource("metro-planned-data", {
        type: "geojson",
        data: JSON.parse(JSON.stringify(METRO_PLANNED_GEOJSON)),
      });

      mapInstance.addSource("metro-stations-data", {
        type: "geojson",
        data: JSON.parse(JSON.stringify(METRO_STATIONS_GEOJSON)),
      });

      mapInstance.addSource("highlight-data", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      mapInstance.addSource("measure-data-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // 4. Highlight Selection Layer
      mapInstance.addLayer({
        id: "search-highlight-fill",
        type: "fill",
        source: "highlight-data",
        layout: { visibility: "visible" },
        paint: {
          "fill-color": "#00f2fe",
          "fill-opacity": 0.55,
        },
      });

      mapInstance.addLayer({
        id: "search-highlight-line",
        type: "line",
        source: "highlight-data",
        layout: { visibility: "visible" },
        paint: {
          "line-color": "#0284c7",
          "line-width": 4,
          "line-opacity": 1,
        },
      });

      // 5. Active Metro Lines
      mapInstance.addLayer({
        id: "metro-active-operating",
        type: "line",
        source: "metro-active-data",
        filter: ["==", ["get", "statusType"], "operating"],
        layout: { visibility: "visible" },
        paint: {
          "line-color": "#00a878",
          "line-width": 4.5,
          "line-opacity": 0.95,
        },
      });

      mapInstance.addLayer({
        id: "metro-active-construction",
        type: "line",
        source: "metro-active-data",
        filter: ["==", ["get", "statusType"], "construction"],
        layout: { visibility: "visible" },
        paint: {
          "line-color": "#ff6b00",
          "line-width": 4.5,
          "line-dasharray": [3, 2],
          "line-opacity": 0.95,
        },
      });

      // 6. Planned Metro Lines
      mapInstance.addLayer({
        id: "metro-planned-lines",
        type: "line",
        source: "metro-planned-data",
        layout: { visibility: "visible" },
        paint: {
          "line-color": "#ef3cff",
          "line-width": 3.5,
          "line-dasharray": [2, 2],
          "line-opacity": 0.85,
        },
      });

      // 7. Metro Stations
      mapInstance.addLayer({
        id: "metro-stations-circle-outer",
        type: "circle",
        source: "metro-stations-data",
        layout: { visibility: "visible" },
        paint: {
          "circle-radius": 7.5,
          "circle-color": "#ff9800",
          "circle-stroke-width": 2.5,
          "circle-stroke-color": "#ffffff",
        },
      });

      mapInstance.addLayer({
        id: "metro-stations-circle-inner",
        type: "circle",
        source: "metro-stations-data",
        layout: { visibility: "visible" },
        paint: {
          "circle-radius": 3.5,
          "circle-color": "#ffffff",
        },
      });

      // 8. Measurement Layer
      mapInstance.addLayer({
        id: "measure-fill",
        type: "fill",
        source: "measure-data-source",
        filter: ["==", "$type", "Polygon"],
        layout: { visibility: "visible" },
        paint: {
          "fill-color": "#ef2029",
          "fill-opacity": 0.3,
        },
      });

      mapInstance.addLayer({
        id: "measure-lines",
        type: "line",
        source: "measure-data-source",
        filter: ["==", "$type", "LineString"],
        layout: { visibility: "visible" },
        paint: {
          "line-color": "#ef2029",
          "line-width": 3.5,
          "line-dasharray": [2, 2],
        },
      });

      mapInstance.addLayer({
        id: "measure-points",
        type: "circle",
        source: "measure-data-source",
        filter: ["==", "$type", "Point"],
        layout: { visibility: "visible" },
        paint: {
          "circle-radius": 6,
          "circle-color": "#ef2029",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      console.log("=== Metro & Measurement Layers Setup Successfully ===");
    };

    map.on("load", () => {
      console.log("=== MapLibre Map Loaded ===");
      setupPlanningLayers(map);
      setIsMapReady(true);

      // If initial zone is in URL, select it
      if (initialUrlState.current?.zoneCode) {
        const allFeatures = [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features];
        const match = allFeatures.find(
          (f) => f.properties?.code === initialUrlState.current.zoneCode
        );
        if (match) {
          handleSelectFeatureRef.current?.(match, true);
        }
      }
    });

    // Sync URL when map camera finishes moving
    map.on("moveend", () => {
      const c = map.getCenter();
      const z = map.getZoom();
      syncMapStateToUrl([c.lng, c.lat], z);
    });

    // Point in Polygon hit-testing helper for canvas click selection
    const isPointInPolygon = (point, vs) => {
      const x = point[0], y = point[1];
      let inside = false;
      for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    const isPointInFeature = (point, feat) => {
      if (!feat || !feat.geometry) return false;
      const { type, coordinates } = feat.geometry;
      if (type === "Polygon") {
        return isPointInPolygon(point, coordinates[0]);
      }
      if (type === "MultiPolygon") {
        return coordinates.some((poly) => isPointInPolygon(point, poly[0]));
      }
      return false;
    };

    // Map click for Measuring Tool and Planning Zones
    map.on("click", (e) => {
      if (window.__isMeasuringActive) {
        const pt = [e.lngLat.lng, e.lngLat.lat];
        setMeasurePoints((prev) => [...prev, pt]);
        return;
      }

      const clickCoords = [e.lngLat.lng, e.lngLat.lat];

      // 1. Check QHPK features (detailed zones)
      for (const feat of QHPK_GEOJSON.features) {
        if (isPointInFeature(clickCoords, feat)) {
          handleSelectFeatureRef.current?.(feat, true);
          return;
        }
      }

      // 2. Check QHC features
      for (const feat of QHC_GEOJSON.features) {
        if (isPointInFeature(clickCoords, feat)) {
          handleSelectFeatureRef.current?.(feat, true);
          return;
        }
      }
    });

    // Map click for Metro Stations
    map.on("click", "metro-stations-circle-outer", (e) => {
      if (window.__isMeasuringActive) return;
      const feat = e.features?.[0];
      if (!feat) return;
      const p = feat.properties || {};
      const coords = feat.geometry.coordinates;

      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({ offset: 12, className: "custom-maplibre-popup" })
        .setLngLat(coords)
        .setHTML(`
          <div class="custom-popup">
            <div class="popup-header">
              <span class="popup-badge" style="background:#ffedd5;color:#c2410c;">Ga Metro</span>
              <span class="popup-code">Tuyến ${escapeHtml(p.line || "")}</span>
            </div>
            <h3 class="popup-title">${escapeHtml(p.name || "")}</h3>
            <p style="margin:0 0 6px;color:#64748b;font-size:11.5px;">📍 ${escapeHtml(p.address || p.status || "")}</p>
          </div>
        `)
        .addTo(map);
    });

    // Map click for Metro Lines
    const metroLineLayers = ["metro-active-operating", "metro-active-construction", "metro-planned-lines"];
    metroLineLayers.forEach((layerId) => {
      map.on("click", layerId, (e) => {
        if (window.__isMeasuringActive) return;
        const feat = e.features?.[0];
        if (!feat) return;
        const p = feat.properties || {};

        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new maplibregl.Popup({ offset: 12, className: "custom-maplibre-popup" })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .setHTML(`
            <div class="custom-popup">
              <div class="popup-header">
                <span class="popup-badge" style="background:#dcfce7;color:#15803d;">Đường sắt Đô thị</span>
                <span class="popup-code">${escapeHtml(p.code || "")}</span>
              </div>
              <h3 class="popup-title">${escapeHtml(p.name || "")}</h3>
              <p style="margin:0 0 4px;color:#475569;font-size:12px;"><b>Trạng thái:</b> ${escapeHtml(p.status || "")}</p>
              ${p.length ? `<p style="margin:0;color:#64748b;font-size:11.5px;">Chiều dài: ${escapeHtml(p.length)}</p>` : ""}
            </div>
          `)
          .addTo(map);
      });
    });

    // Hover cursor styling
    const interactiveLayers = [
      "qhc-fill",
      "qhc-outline",
      "qhpk-fill",
      "qhpk-outline",
      "metro-stations-circle-outer",
      "metro-active-operating",
      "metro-active-construction",
      "metro-planned-lines",
    ];

    interactiveLayers.forEach((layerId) => {
      map.on("mouseenter", layerId, () => {
        if (!window.__isMeasuringActive) {
          map.getCanvas().style.cursor = "pointer";
        }
      });
      map.on("mouseleave", layerId, () => {
        if (!window.__isMeasuringActive) {
          map.getCanvas().style.cursor = "";
        }
      });
    });

    return () => {
      if (popupRef.current) popupRef.current.remove();
      if (userMarkerRef.current) userMarkerRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Window debug function to inspect planning layers from console
  useEffect(() => {
    window.debugPlanningLayers = () => {
      const map = mapRef.current;
      if (!map) {
        console.log("Map not initialized yet");
        return;
      }
      console.log("=== PLANNING LAYERS DEBUG ===");
      console.log("QHC Source:", map.getSource("qhc-data")?._data);
      console.log("QHPK Source:", map.getSource("qhpk-data")?._data);
      console.log("All Layers in Map:", map.getStyle().layers.map(l => ({ id: l.id, type: l.type, visibility: map.getLayoutProperty(l.id, "visibility") || "visible" })));
    };
  }, []);

  // Keep measuring state synced with window bridge
  useEffect(() => {
    window.__isMeasuringActive = isMeasuringActive;
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = isMeasuringActive
        ? "crosshair"
        : "";
    }
  }, [isMeasuringActive]);

  // GPS Geolocation handler
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      showToast("Trình duyệt không hỗ trợ định vị Geolocation.");
      return;
    }

    showToast("Đang xác định vị trí của bạn...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lon = position.coords.longitude;
        const lat = position.coords.latitude;

        goTo(lon, lat, 15);

        if (userMarkerRef.current) userMarkerRef.current.remove();

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

        showToast("Đã xác định vị trí hiện tại thành công! 📍");
      },
      (error) => {
        console.warn("Geolocation failed:", error);
        showToast("Không thể truy cập vị trí. Hãy kiểm tra quyền của trình duyệt.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [goTo, showToast]);

  // Share current map location
  const handleShareMap = useCallback(() => {
    shareMapLocation({
      title: "Bản đồ Quy hoạch Sử dụng đất Hà Nội",
      text: "Xem bản đồ quy hoạch Thủ đô Hà Nội:",
      onSuccess: (msg) => showToast(msg),
      onError: (msg) => showToast(msg),
    });
  }, [showToast]);

  // Search Autocomplete selection handler
  const handleSelectSearchResult = useCallback(
    (item) => {
      if (item.type === "zoning" && item.feature) {
        handleSelectFeature(item.feature, true);
      } else if (item.type === "station" && item.coordinates) {
        goTo(item.coordinates[0], item.coordinates[1], 16);
      } else if (item.type === "destination" && item.coordinates) {
        goTo(item.coordinates[0], item.coordinates[1], item.zoom || 13);
      } else if (item.coordinates) {
        goTo(item.coordinates[0], item.coordinates[1], 14);
      }
    },
    [handleSelectFeature, goTo]
  );

  return (
    <div className={dark ? "app dark" : "app"}>
      {/* 1. PROFESSIONAL GIS HEADER */}
      <Header
        dark={dark}
        onToggleDark={() => setDark(!dark)}
        bookmarkCount={bookmarkCount}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenZoningList={() => setIsZoningListOpen(true)}
        onOpenLandPrice={() => {
          setSelectedZoningCodeForPrice("");
          setIsLandPriceOpen(true);
        }}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onLocateMe={handleLocateMe}
        onShareMap={handleShareMap}
        onToggleMeasureTool={() => {
          setIsMeasuringActive((prev) => !prev);
          setMeasurePoints([]);
        }}
        isMeasuringActive={isMeasuringActive}
        onToggleFilterPanel={() => setIsFilterPanelOpen((prev) => !prev)}
        isFilterPanelOpen={isFilterPanelOpen}
        onGoCenter={goCenter}
      />

      {/* 2. HERO SEARCH BAR */}
      <section className="hero-search-bar-section">
        <div className="hero-search-content">
          <div className="hero-search-titles">
            <h1 className="hero-heading">Bản đồ quy hoạch sử dụng đất Hà Nội</h1>
            <p className="hero-subtext">
              Hơn 127.000 vùng chức năng · Quy hoạch chung + Phân khu đô thị đến 2050
            </p>
          </div>

          <SearchBox
            onSelectResult={handleSelectSearchResult}
            onSearchSubmit={(q) => showToast(`Đang tìm kiếm: ${q}`)}
            onResetSearch={() => {
              const highlightSource = mapRef.current?.getSource("highlight-data");
              if (highlightSource) {
                highlightSource.setData({ type: "FeatureCollection", features: [] });
              }
            }}
          />
        </div>
      </section>

      {/* 3. MAIN MAP CONTAINER */}
      <main className="map-wrapper" style={{ position: "relative", overflow: "hidden" }}>
        <div ref={mapContainer} className="map" />
        <canvas
          ref={overlayCanvasRef}
          className="planning-canvas-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* LEFT: LAYER CONTROL DRAWER */}
        <LayerControl
          isOpen={isLayerControlOpen}
          onToggleOpen={() => setIsLayerControlOpen(!isLayerControlOpen)}
          layers={layers}
          onToggleLayer={(key) =>
            setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
          }
          onShowAllLayers={() =>
            setLayers({
              qhc: true,
              qhpk: true,
              metro: true,
              metroPlan: true,
              stations: true,
              roads: true,
            })
          }
          onHideAllLayers={() =>
            setLayers({
              qhc: false,
              qhpk: false,
              metro: false,
              metroPlan: false,
              stations: false,
              roads: false,
            })
          }
          onSelectDestination={(dest) =>
            goTo(dest.coordinates[0], dest.coordinates[1], dest.zoom)
          }
          onOpenZoningList={() => setIsZoningListOpen(true)}
          onOpenLandPrice={() => {
            setSelectedZoningCodeForPrice("");
            setIsLandPriceOpen(true);
          }}
          onOpenStats={() => setIsStatsOpen(true)}
        />

        {/* FILTER PANEL */}
        <FilterPanel
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          filters={filters}
          onChangeFilters={setFilters}
          onResetFilters={() =>
            setFilters({ grp: "all", landUse: "all", metroStatus: "all" })
          }
          matchedCount={matchedZonesCount}
          totalCount={
            QHC_GEOJSON.features.length + QHPK_GEOJSON.features.length
          }
        />

        {/* MEASUREMENT FLOATING TOOLBAR */}
        <MeasureTool
          isActive={isMeasuringActive}
          mode={measureMode}
          onChangeMode={(m) => {
            setMeasureMode(m);
            setMeasurePoints([]);
          }}
          pointsCount={measurePoints.length}
          measuredValue={measuredValue}
          onUndoPoint={() =>
            setMeasurePoints((prev) => prev.slice(0, prev.length - 1))
          }
          onClearMeasure={() => setMeasurePoints([])}
          onClose={() => {
            setIsMeasuringActive(false);
            setMeasurePoints([]);
          }}
        />

        {/* RIGHT: DETAIL SIDE PANEL */}
        <DetailPanel
          isOpen={isDetailPanelOpen}
          feature={selectedFeature}
          onClose={() => setIsDetailPanelOpen(false)}
          onFlyToFeature={(feat) => {
            const center = getFeatureCenter(feat);
            goTo(center[0], center[1], 15);
          }}
          onOpenFullLandPrice={(code) => {
            setSelectedZoningCodeForPrice(code || "");
            setIsLandPriceOpen(true);
          }}
          onOpenFullZoningDetail={(feat) => {
            setSelectedFeature(feat);
            setIsZoningDetailOpen(true);
          }}
          onBookmarkChanged={() => setBookmarkCount(getBookmarks().length)}
        />

        {/* DYNAMIC FLOATING LEGEND */}
        <Legend layers={layers} />

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
          contributors · MapLibre GL · Quy hoạch Thủ đô Hà Nội
        </div>
      </main>

      {/* 4. MODALS */}
      {/* BOOKMARK PANEL MODAL */}
      <BookmarkPanel
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        onSelectBookmarkOnMap={(item) => {
          const allFeatures = [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features];
          const match = allFeatures.find((f) => f.properties?.code === item.code);
          if (match) {
            handleSelectFeature(match, true);
          } else if (item.center) {
            goTo(item.center[0], item.center[1], 14);
          }
        }}
        onBookmarksChanged={() => setBookmarkCount(getBookmarks().length)}
      />

      {/* ZONING LIST MODAL */}
      <ZoningListModal
        isOpen={isZoningListOpen}
        onClose={() => setIsZoningListOpen(false)}
        onSelectZoneOnMap={(feat) => handleSelectFeature(feat, true)}
        onViewZoneDetail={(feat) => {
          setSelectedFeature(feat);
          setIsZoningDetailOpen(true);
        }}
        onViewLandPrice={(code) => {
          setSelectedZoningCodeForPrice(code);
          setIsLandPriceOpen(true);
        }}
      />

      {/* ZONING DETAIL MODAL */}
      <ZoningDetailModal
        isOpen={isZoningDetailOpen}
        feature={selectedFeature}
        onClose={() => setIsZoningDetailOpen(false)}
        onSelectZoneOnMap={(feat) => handleSelectFeature(feat, true)}
        onOpenFullLandPrice={(code) => {
          setSelectedZoningCodeForPrice(code);
          setIsLandPriceOpen(true);
        }}
      />

      {/* LAND PRICE TABLE MODAL */}
      <LandPriceModal
        isOpen={isLandPriceOpen}
        onClose={() => setIsLandPriceOpen(false)}
        initialZoningCode={selectedZoningCodeForPrice}
        onSelectZoningCodeOnMap={(code) => {
          const allFeatures = [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features];
          const match = allFeatures.find((f) => f.properties?.code === code);
          if (match) {
            handleSelectFeature(match, true);
          }
        }}
      />

      {/* ZONING STATS MODAL (Q%) */}
      <ZoningStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        onSelectZoneOnMap={(feat) => handleSelectFeature(feat, true)}
      />

      {/* GUIDE MODAL */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* FAQ MODAL */}
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />

      {/* GLOBAL TOAST NOTIFICATION */}
      {globalToast && <div className="gis-global-toast">{globalToast}</div>}
    </div>
  );
}

export default App;
