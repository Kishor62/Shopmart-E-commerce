// Escape user input before using it inside a RegExp (prevents ReDoS / regex injection)
export const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
