/**
 * GIS Geometry & Mathematical Utilities for Hanoi Planning Map
 * Calculations: Haversine distance, Geodesic Polygon Area, Centroid & Bounding Box
 */

import { HANOI_CENTER } from "../mapConfig.js";

// Bán kính trái đất tính theo mét (WGS84 mean radius)
const EARTH_RADIUS_METERS = 6371008.8;

/**
 * Chuyển độ (degrees) sang radian
 */
export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Tính khoảng cách Haversine giữa 2 điểm tọa độ [lon, lat]
 * @param {[number, number]} coord1 [lon, lat]
 * @param {[number, number]} coord2 [lon, lat]
 * @returns {number} Khoảng cách tính bằng mét
 */
export function calculateHaversineDistance(coord1, coord2) {
  if (!coord1 || !coord2) return 0;
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Định dạng khoảng cách theo đơn vị mét hoặc km
 * @param {number} meters
 * @returns {string} ví dụ: "450 m" hoặc "3.2 km"
 */
export function formatDistance(meters) {
  if (meters == null || isNaN(meters)) return "0 m";
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Tính tổng độ dài đường gấp khúc (Polyline / Multi-segment)
 * @param {Array<[number, number]>} coords Mảng các điểm [lon, lat]
 * @returns {number} Tổng khoảng cách tính bằng mét
 */
export function calculatePolylineLength(coords) {
  if (!coords || coords.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += calculateHaversineDistance(coords[i], coords[i + 1]);
  }
  return total;
}

/**
 * Tính diện tích Polygon theo hình học cầu (Spherical Excess)
 * @param {Array<[number, number]>} ring Vòng tọa độ khép kín [lon, lat]
 * @returns {number} Diện tích tính bằng mét vuông (m²)
 */
export function calculatePolygonArea(ring) {
  if (!ring || ring.length < 3) return 0;

  // Đảm bảo vòng khép kín
  let coords = [...ring];
  if (
    coords[0][0] !== coords[coords.length - 1][0] ||
    coords[0][1] !== coords[coords.length - 1][1]
  ) {
    coords.push(coords[0]);
  }

  if (coords.length < 4) return 0;

  let totalAngle = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = coords[i];
    const p2 = coords[i + 1];
    totalAngle +=
      toRadians(p2[0] - p1[0]) *
      (2 + Math.sin(toRadians(p1[1])) + Math.sin(toRadians(p2[1])));
  }

  let area = (Math.abs(totalAngle) * EARTH_RADIUS_METERS * EARTH_RADIUS_METERS) / 2;
  return Math.abs(area);
}

/**
 * Định dạng diện tích theo đơn vị m² hoặc ha (héc-ta)
 * @param {number} sqMeters
 * @returns {string} ví dụ: "1,250 m²" hoặc "45.2 ha"
 */
export function formatArea(sqMeters) {
  if (sqMeters == null || isNaN(sqMeters)) return "0 m²";
  if (sqMeters >= 10000) {
    const ha = sqMeters / 10000;
    return `${ha.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} ha`;
  }
  return `${Math.round(sqMeters).toLocaleString("vi-VN")} m²`;
}

/**
 * Trích xuất tất cả các tọa độ điểm từ một GeoJSON Geometry
 */
export function extractCoordinates(geometry) {
  if (!geometry) return [];
  const coords = [];

  const traverse = (geom) => {
    if (geom.type === "Point") {
      coords.push(geom.coordinates);
    } else if (geom.type === "LineString" || geom.type === "MultiPoint") {
      coords.push(...geom.coordinates);
    } else if (geom.type === "Polygon" || geom.type === "MultiLineString") {
      geom.coordinates.forEach((ring) => coords.push(...ring));
    } else if (geom.type === "MultiPolygon") {
      geom.coordinates.forEach((poly) =>
        poly.forEach((ring) => coords.push(...ring))
      );
    } else if (geom.type === "GeometryCollection") {
      geom.geometries.forEach(traverse);
    }
  };

  traverse(geometry);
  return coords;
}

/**
 * Tính Bounding Box [ [minX, minY], [maxX, maxY] ] từ GeoJSON Feature
 */
export function getFeatureBounds(feature) {
  if (!feature || !feature.geometry) return null;
  const coords = extractCoordinates(feature.geometry);
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

/**
 * Tính tâm (Centroid / Center point) của GeoJSON Feature
 */
export function getFeatureCenter(feature) {
  if (!feature || !feature.geometry) return HANOI_CENTER;
  if (feature.geometry.type === "Point") {
    return feature.geometry.coordinates;
  }

  const coords = extractCoordinates(feature.geometry);
  if (coords.length === 0) return HANOI_CENTER;

  // Tính arithmetic mean
  let sumX = 0,
    sumY = 0;
  coords.forEach(([x, y]) => {
    sumX += x;
    sumY += y;
  });

  return [sumX / coords.length, sumY / coords.length];
}

/**
 * Tìm các tiện ích & hạ tầng lân cận một vị trí (Nearby analysis)
 * @param {[number, number]} centerCoords Tọa độ tâm [lon, lat]
 * @param {Object} stationsGeoJSON Dữ liệu ga Metro
 * @param {Object} metroLinesGeoJSON Dữ liệu tuyến Metro
 * @param {number} limit Số lượng kết quả
 */
export function findNearbyInfrastructure(
  centerCoords,
  stationsGeoJSON,
  metroLinesGeoJSON,
  limit = 5
) {
  if (!centerCoords) return { nearestStations: [], nearestLines: [] };

  // 1. Tìm ga Metro gần nhất
  const stationResults = [];
  if (stationsGeoJSON && stationsGeoJSON.features) {
    stationsGeoJSON.features.forEach((f) => {
      if (f.geometry && f.geometry.coordinates) {
        const dist = calculateHaversineDistance(
          centerCoords,
          f.geometry.coordinates
        );
        stationResults.push({
          name: f.properties?.name || "Ga Metro",
          line: f.properties?.line || "",
          type: f.properties?.type || "",
          address: f.properties?.address || "",
          distanceMeters: dist,
          distanceFormatted: formatDistance(dist),
          coordinates: f.geometry.coordinates,
        });
      }
    });
  }

  stationResults.sort((a, b) => a.distanceMeters - b.distanceMeters);

  // 2. Tìm tuyến Metro gần nhất
  const lineResults = [];
  if (metroLinesGeoJSON && metroLinesGeoJSON.features) {
    metroLinesGeoJSON.features.forEach((f) => {
      if (f.geometry) {
        const coords = extractCoordinates(f.geometry);
        let minLineDist = Infinity;
        coords.forEach((pt) => {
          const d = calculateHaversineDistance(centerCoords, pt);
          if (d < minLineDist) minLineDist = d;
        });

        lineResults.push({
          name: f.properties?.name || "Tuyến Metro",
          code: f.properties?.code || "",
          status: f.properties?.status || "",
          distanceMeters: minLineDist,
          distanceFormatted: formatDistance(minLineDist),
        });
      }
    });
  }

  lineResults.sort((a, b) => a.distanceMeters - b.distanceMeters);

  return {
    nearestStations: stationResults.slice(0, limit),
    nearestLines: lineResults.slice(0, 3),
  };
}
