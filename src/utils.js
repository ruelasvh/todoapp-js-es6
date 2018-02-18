/**
 * Encode HTML for display
 * @param str String to escape
 * @returns {void|string|*} String escaped with entity codes
 */
export const escape = str => str.replace(/[&<]/g, char => char === '&' ? '&amp;' : '&lt;')