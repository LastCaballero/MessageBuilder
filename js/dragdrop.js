// dragdrop.js
export function enableDragAndDrop(container, onReorder) {
  let draggedEl = null;

  container.addEventListener("dragstart", (e) => {
    const item = e.target.closest(".bubble-item");
    if (!item) return;
    draggedEl = item;
    item.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });

  container.addEventListener("dragend", (e) => {
    const item = e.target.closest(".bubble-item");
    if (item) item.classList.remove("dragging");
    draggedEl = null;
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const dragging = container.querySelector(".dragging");
    if (!dragging) return;

    if (afterElement == null) {
      container.appendChild(dragging);
    } else {
      container.insertBefore(dragging, afterElement);
    }
  });

  container.addEventListener("drop", () => {
    if (typeof onReorder === "function") {
      const order = Array.from(container.querySelectorAll(".bubble-item")).map(
        (el) => el.dataset.id
      );
      onReorder(order);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".bubble-item:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}
