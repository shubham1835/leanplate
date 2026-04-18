/** Format rupees: 1234 → ₹1,234 */
export const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/** Capitalise first letter */
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/** goal key → display label: FAT_LOSS → Fat Loss */
export const formatGoal = (g) =>
  g?.split("_").map(capitalize).join(" ") ?? "";

/** Date → "Today, 8:00 AM" style */
export const formatOrderDate = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const timeStr = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === today.toDateString())     return `Today, ${timeStr}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeStr}`;
  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${timeStr}`;
};

/** Compute points earned from order amount */
export const computePoints = (amount, ratePerHundred = 1) =>
  Math.floor(amount / 100) * ratePerHundred;

/** WhatsApp link builder */
export const waLink = (number, message) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
