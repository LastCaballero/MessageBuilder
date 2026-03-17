// app.js
import { saveBubbles, loadBubbles } from "./storage.js";
import { initThemeSwitch } from "./theme.js";
import { copyTextToClipboard } from "./clipboard.js";
import { enableDragAndDrop } from "./dragdrop.js";

const bubbleListEl = document.getElementById("bubbleList");
const addBubbleBtn = document.getElementById("addBubbleBtn");
const copyAllBtn = document.getElementById("copyAllBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const themeSwitchBtn = document.getElementById("themeSwitch");

let bubbles = []; // { id: string, text: string }

init();

function init() {
  initThemeSwitch(themeSwitchBtn);

  bubbles = loadBubbles();
  renderAllBubbles();

  addBubbleBtn.addEventListener("click", () => {
    addBubble("");
  });

  copyAllBtn.addEventListener("click", () => {
    const allText = bubbles
      .map((b) => b.text.trim())
      .filter((t) => t.length > 0)
      .join("\n\n");
    copyTextToClipboard(allText);
  });

  deleteAllBtn.addEventListener("click", () => {
    if (!bubbles.length) return;
    const confirmDelete = confirm("Alle Nachrichten-Bubbles löschen?");
    if (!confirmDelete) return;
    bubbles = [];
    saveBubbles(bubbles);
    renderAllBubbles();
  });

  enableDragAndDrop(bubbleListEl, handleReorder);
}

function addBubble(initialText) {
  const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  const bubble = { id, text: initialText || "" };
  bubbles.push(bubble);
  saveBubbles(bubbles);
  renderBubble(bubble);
}

function renderAllBubbles() {
  bubbleListEl.innerHTML = "";
  bubbles.forEach((b) => renderBubble(b));
}

function renderBubble(bubble) {
  const item = document.createElement("div");
  item.className = "bubble-item";
  item.dataset.id = bubble.id;
  item.draggable = true;

  const handle = document.createElement("div");
  handle.className = "bubble-drag-handle";
  handle.textContent = "⋮";

  const card = document.createElement("div");
  card.className = "bubble-card";

  const textarea = document.createElement("textarea");
  textarea.className = "bubble-textarea";
  textarea.value = bubble.text;

  textarea.addEventListener("input", () => {
    const idx = bubbles.findIndex((b) => b.id === bubble.id);
    if (idx !== -1) {
      bubbles[idx].text = textarea.value;
      saveBubbles(bubbles);
    }
  });

  const actions = document.createElement("div");
  actions.className = "bubble-actions";

  const copyBtn = document.createElement("button");
  copyBtn.className = "btn small secondary";
  copyBtn.textContent = "Kopieren";
  copyBtn.addEventListener("click", () => {
    copyTextToClipboard(textarea.value.trim());
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn small danger";
  deleteBtn.textContent = "Löschen";
  deleteBtn.addEventListener("click", () => {
    bubbles = bubbles.filter((b) => b.id !== bubble.id);
    saveBubbles(bubbles);
    item.remove();
  });

  actions.appendChild(copyBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(textarea);
  card.appendChild(actions);

  item.appendChild(handle);
  item.appendChild(card);

  bubbleListEl.appendChild(item);
}

function handleReorder(newOrderIds) {
  const idToBubble = new Map(bubbles.map((b) => [b.id, b]));
  const reordered = [];
  newOrderIds.forEach((id) => {
    const b = idToBubble.get(id);
    if (b) reordered.push(b);
  });
  bubbles = reordered;
  saveBubbles(bubbles);
}
