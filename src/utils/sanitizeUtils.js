/**
 * Sanitization & Security Utilities for Hanoi Planning Map
 * Prevents XSS when rendering dynamic HTML strings or popups.
 */

const ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

const ESCAPE_REGEX = /[&<>"'/]/g;

/**
 * Escape chuỗi văn bản an toàn chống XSS
 * @param {string|any} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(ESCAPE_REGEX, (match) => ESCAPE_MAP[match]);
}

/**
 * Làm sạch chuỗi tìm kiếm loại bỏ ký tự lạ
 * @param {string} str
 * @returns {string}
 */
export function cleanSearchQuery(str) {
  if (!str) return "";
  return str.trim().replace(/[<>]/g, "");
}
