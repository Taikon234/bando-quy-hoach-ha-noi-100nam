/**
 * LocalStorage Bookmarks Manager for Hanoi Planning Map
 */

const STORAGE_KEY = "hanoi_planning_bookmarks_v1";

/**
 * Lấy danh sách bookmark đã lưu
 * @returns {Array<Object>}
 */
export function getBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Lỗi đọc bookmark từ localStorage:", err);
    return [];
  }
}

/**
 * Kiểm tra xem một mã quy hoạch đã được bookmark chưa
 * @param {string} code
 * @returns {boolean}
 */
export function isZoneBookmarked(code) {
  if (!code) return false;
  const list = getBookmarks();
  return list.some((item) => item.code === code);
}

/**
 * Thêm một khu vực vào danh sách yêu thích
 * @param {Object} zoneInfo
 * @returns {Array<Object>} Danh sách mới
 */
export function addBookmark(zoneInfo) {
  if (!zoneInfo || !zoneInfo.code) return getBookmarks();
  const list = getBookmarks();

  if (list.some((item) => item.code === zoneInfo.code)) {
    return list;
  }

  const newItem = {
    code: zoneInfo.code,
    name: zoneInfo.name || `Khu quy hoạch ${zoneInfo.code}`,
    category: zoneInfo.category || "Quy hoạch",
    grp: zoneInfo.grp || "QHPK",
    area: zoneInfo.area || "",
    savedAt: new Date().toISOString(),
    center: zoneInfo.center || null,
  };

  const updated = [newItem, ...list];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Lỗi lưu bookmark:", err);
  }
  return updated;
}

/**
 * Xóa một khu vực khỏi danh sách yêu thích
 * @param {string} code
 * @returns {Array<Object>} Danh sách mới
 */
export function removeBookmark(code) {
  if (!code) return getBookmarks();
  const list = getBookmarks();
  const updated = list.filter((item) => item.code !== code);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Lỗi xóa bookmark:", err);
  }
  return updated;
}

/**
 * Toggle bookmark (Thêm nếu chưa có, xóa nếu đã có)
 * @param {Object} zoneInfo
 * @returns {{ isBookmarked: boolean, bookmarks: Array<Object> }}
 */
export function toggleBookmark(zoneInfo) {
  if (!zoneInfo || !zoneInfo.code) {
    return { isBookmarked: false, bookmarks: getBookmarks() };
  }

  if (isZoneBookmarked(zoneInfo.code)) {
    const updated = removeBookmark(zoneInfo.code);
    return { isBookmarked: false, bookmarks: updated };
  } else {
    const updated = addBookmark(zoneInfo);
    return { isBookmarked: true, bookmarks: updated };
  }
}
