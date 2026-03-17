// theme.js
import { saveTheme, loadTheme } from "./storage.js";

export function initThemeSwitch(buttonElement) {
  let currentTheme = loadTheme();
  applyTheme(currentTheme, buttonElement);

  buttonElement.addEventListener("click", () => {
    currentTheme = currentTheme === "whatsapp" ? "viber" : "whatsapp";
    applyTheme(currentTheme, buttonElement);
    saveTheme(currentTheme);
  });
}

function applyTheme(theme, buttonElement) {
  const waLink = document.getElementById("theme-whatsapp");
  const viLink = document.getElementById("theme-viber");

  if (theme === "whatsapp") {
    waLink.disabled = false;
    viLink.disabled = true;
    buttonElement.textContent = "W";
  } else {
    waLink.disabled = true;
    viLink.disabled = false;
    buttonElement.textContent = "V";
  }
}
