/**
 * URL State Synchronization & Sharing Utilities
 * Parses and updates lat, lng, zoom, zone parameters in the browser address bar.
 */

/**
 * Đọc trạng thái ban đầu từ URL Query Parameters
 */
export function getInitialMapStateFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get("lat"));
    const lng = parseFloat(params.get("lng"));
    const zoom = parseFloat(params.get("zoom"));
    const zone = params.get("zone");

    const state = {};
    if (!isNaN(lat) && !isNaN(lng)) {
      state.center = [lng, lat];
    }
    if (!isNaN(zoom)) {
      state.zoom = zoom;
    }
    if (zone) {
      state.zoneCode = zone;
    }

    return Object.keys(state).length > 0 ? state : null;
  } catch (err) {
    console.warn("Lỗi đọc URL state:", err);
    return null;
  }
}

/**
 * Cập nhật trạng thái bản đồ vào URL (không reload trang)
 */
export function syncMapStateToUrl(center, zoom, zoneCode = null) {
  try {
    const url = new URL(window.location.href);
    if (center && center.length === 2) {
      url.searchParams.set("lng", center[0].toFixed(5));
      url.searchParams.set("lat", center[1].toFixed(5));
    }
    if (zoom) {
      url.searchParams.set("zoom", zoom.toFixed(1));
    }
    if (zoneCode) {
      url.searchParams.set("zone", zoneCode);
    } else {
      url.searchParams.delete("zone");
    }

    window.history.replaceState(null, "", url.toString());
  } catch (err) {
    console.warn("Lỗi đồng bộ URL:", err);
  }
}

/**
 * Chia sẻ vị trí bản đồ hiện tại qua Web Share API hoặc Copy link
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.text
 * @param {Function} options.onSuccess
 * @param {Function} options.onError
 */
export async function shareMapLocation({
  title = "Bản đồ Quy hoạch Sử dụng đất Hà Nội",
  text = "Xem chi tiết quy hoạch sử dụng đất Thủ đô Hà Nội:",
  onSuccess,
  onError,
}) {
  const currentUrl = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: currentUrl,
      });
      if (onSuccess) onSuccess("Đã chia sẻ liên kết thành công!");
      return;
    } catch (err) {
      if (err.name === "AbortError") return; // Người dùng tự hủy
      console.warn("Web Share API failed, fallback to copy:", err);
    }
  }

  // Fallback sang Clipboard copy
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(currentUrl);
      if (onSuccess) onSuccess("Đã sao chép liên kết vào bộ nhớ tạm!");
    } else {
      const input = document.createElement("textarea");
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      if (onSuccess) onSuccess("Đã sao chép liên kết!");
    }
  } catch (err) {
    if (onError) onError("Không thể sao chép liên kết tự động.");
  }
}
