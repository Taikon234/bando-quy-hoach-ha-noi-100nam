import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  QHC_GEOJSON,
  QHPK_GEOJSON,
  METRO_ACTIVE_GEOJSON,
  METRO_PLANNED_GEOJSON,
  METRO_STATIONS_GEOJSON,
} from "../data/hanoiZoningData.js";
import { QUICK_DESTINATIONS, classifyLandUse } from "../mapConfig.js";
import { cleanSearchQuery } from "../utils/sanitizeUtils.js";

export function SearchBox({ onSelectResult, onSearchSubmit, onResetSearch }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchStatus, setSearchStatus] = useState(null); // 'success' | 'empty' | null
  const [statusMessage, setStatusMessage] = useState("");

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Tạo Search Index một lần duy nhất (Memoized)
  const searchIndex = useMemo(() => {
    const items = [];

    // 1. Quick Destinations & Districts
    QUICK_DESTINATIONS.forEach((d) => {
      items.push({
        id: `dest-${d.id}`,
        type: "destination",
        categoryName: "Địa danh & Quận huyện",
        icon: "📍",
        title: d.name,
        subtitle: d.description,
        coordinates: d.coordinates,
        zoom: d.zoom || 13,
        searchText: `${d.name} ${d.description}`.toLowerCase(),
      });
    });

    // 2. Metro Stations
    METRO_STATIONS_GEOJSON.features.forEach((f) => {
      const p = f.properties;
      items.push({
        id: `station-${f.id || p.name}`,
        type: "station",
        categoryName: "Ga Đường Sắt Đô Thị",
        icon: "🚉",
        title: p.name,
        subtitle: `Tuyến ${p.line} · ${p.address || p.status}`,
        coordinates: f.geometry.coordinates,
        zoom: 15.5,
        feature: f,
        searchText: `${p.name} ${p.line} ${p.address} ga metro`.toLowerCase(),
      });
    });

    // 3. Metro Lines
    [...METRO_ACTIVE_GEOJSON.features, ...METRO_PLANNED_GEOJSON.features].forEach(
      (f) => {
        const p = f.properties;
        items.push({
          id: `metro-line-${f.id || p.code}`,
          type: "metro_line",
          categoryName: "Tuyến Metro",
          icon: "🚇",
          title: p.name,
          subtitle: `${p.status} · Chiều dài: ${p.length || "Đang cập nhật"}`,
          zoom: 13,
          feature: f,
          searchText: `${p.name} ${p.code} ${p.status} metro`.toLowerCase(),
        });
      }
    );

    // 4. Planning Zones (QHC & QHPK)
    [...QHC_GEOJSON.features, ...QHPK_GEOJSON.features].forEach((f) => {
      const p = f.properties;
      const { icon, label } = classifyLandUse(p.category || p.name);
      items.push({
        id: `zone-${p.code || f.id}`,
        type: "zoning",
        categoryName:
          p.grp === "QHPK"
            ? "Quy hoạch phân khu (QHPK)"
            : "Quy hoạch chung (QHC)",
        icon: icon,
        title: p.name,
        code: p.code,
        subtitle: `Mã: ${p.code} · ${label} · ${p.area || ""}`,
        feature: f,
        searchText: `${p.name} ${p.code} ${p.category} ${p.landUse} ${label} ${p.description}`.toLowerCase(),
      });
    });

    return items;
  }, []);

  // Lọc kết quả autocomplete theo từ khóa
  const searchResults = useMemo(() => {
    const q = cleanSearchQuery(query).toLowerCase();
    if (!q || q.length < 2) return [];

    return searchIndex
      .filter((item) => item.searchText.includes(q))
      .slice(0, 8); // Giới hạn 8 kết quả nhanh nhất
  }, [query, searchIndex]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setQuery(item.title);
    setIsOpen(false);
    setHighlightedIndex(-1);
    setSearchStatus("success");
    setStatusMessage(`Đã chuyển tới: ${item.title}`);
    setTimeout(() => setSearchStatus(null), 3000);

    if (onSelectResult) {
      onSelectResult(item);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen && searchResults.length > 0) {
        setIsOpen(true);
        return;
      }
      setHighlightedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && searchResults[highlightedIndex]) {
        handleSelect(searchResults[highlightedIndex]);
      } else if (searchResults.length > 0) {
        handleSelect(searchResults[0]);
      } else if (onSearchSubmit) {
        onSearchSubmit(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    setSearchStatus(null);
    if (onResetSearch) onResetSearch();
    inputRef.current?.focus();
  };

  return (
    <div className="search-autocomplete-wrapper">
      <div className="search-input-pill">
        <span className="search-leading-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm quy hoạch (H1-1, S2...), loại đất, tên đường, ga Metro..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (searchResults.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-label="Tìm kiếm quy hoạch và địa điểm"
        />

        {query && (
          <button
            className="search-clear-btn"
            onClick={handleClear}
            title="Xóa tìm kiếm"
            aria-label="Xóa từ khóa"
          >
            ✕
          </button>
        )}

        <button
          className="search-submit-action-btn"
          onClick={() => {
            if (searchResults.length > 0) {
              handleSelect(searchResults[0]);
            } else if (onSearchSubmit) {
              onSearchSubmit(query);
            }
          }}
        >
          Tìm
        </button>
      </div>

      {/* AUTOCOMPLETE DROPDOWN */}
      {isOpen && searchResults.length > 0 && (
        <div ref={dropdownRef} className="autocomplete-dropdown" role="listbox">
          {searchResults.map((item, idx) => (
            <div
              key={item.id}
              className={`autocomplete-item ${
                highlightedIndex === idx ? "highlighted" : ""
              }`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              role="option"
              aria-selected={highlightedIndex === idx}
            >
              <span className="item-icon">{item.icon}</span>
              <div className="item-text">
                <div className="item-title-row">
                  <span className="item-title">{item.title}</span>
                  {item.code && (
                    <span className="item-code-badge">{item.code}</span>
                  )}
                </div>
                <div className="item-subtitle">{item.subtitle}</div>
              </div>
              <span className="item-category-tag">{item.categoryName}</span>
            </div>
          ))}
        </div>
      )}

      {/* SEARCH STATUS TOAST */}
      {searchStatus && (
        <div className={`search-toast toast-${searchStatus}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}
