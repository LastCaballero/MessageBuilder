// storage.js
const STORAGE_KEY_BUBBLES = "messageBuilder_bubbles";
const STORAGE_KEY_THEME = "messageBuilder_theme";

export function saveBubbles(bubbles) {
  try {
    localStorage.setItem(STORAGE_KEY_BUBBLES, JSON.stringify(bubbles));
  } catch (e) {
    console.warn("Konnte Bubbles nicht speichern:", e);
  }
}

export function loadBubbles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BUBBLES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Konnte Bubbles nicht laden:", e);
    return [];
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch (e) {
    console.warn("Konnte Theme nicht speichern:", e);
  }
}

export function loadTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY_THEME) || "whatsapp";
  } catch (e) {
    console.warn("Konnte Theme nicht laden:", e);
    return "whatsapp";
  }
}
