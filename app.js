/* THEME SWITCHER */
document.getElementById("theme-switcher").addEventListener("click", () => {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === "whatsapp" ? "viber" : "whatsapp";
});

/* ELEMENTE */
const chatArea = document.getElementById("chat-area");
const input = document.getElementById("message-input");
const select = document.getElementById("conversation-select");
const contextMenu = document.getElementById("context-menu");

let conversations = JSON.parse(localStorage.getItem("conversations") || "{}");
let currentConversation = null;
let contextTarget = null;

/* SPEICHERN */
function save() {
    localStorage.setItem("conversations", JSON.stringify(conversations));
}

/* DROPDOWN AKTUALISIEREN */
function refreshDropdown() {
    select.innerHTML = "";
    Object.keys(conversations).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    });
}

/* CHAT LADEN */
function loadConversation(name) {
    currentConversation = name;
    chatArea.innerHTML = "";

    conversations[name].forEach(msg => {
        addMessage(msg.text, msg.sender, false, msg.id);
    });

    save();
}

/* NACHRICHT HINZUFÜGEN */
function addMessage(text, sender, saveMsg = true, existingId = null) {
    const id = existingId || (Date.now() + Math.random()).toString();

    const div = document.createElement("div");
    div.classList.add("bubble", sender);
    div.dataset.id = id;
    div.textContent = text;
    div.draggable = true;

    /* Kontextmenü */
    div.addEventListener("contextmenu", e => {
        e.preventDefault();
        contextTarget = div;
        showContextMenu(e.pageX, e.pageY);
    });

    /* Drag & Drop Events */
    div.addEventListener("dragstart", e => {
        e.dataTransfer.setData("id", id);
        div.classList.add("dragging");
    });

    div.addEventListener("dragend", () => {
        div.classList.remove("dragging");
    });

    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;

    if (saveMsg && currentConversation) {
        conversations[currentConversation].push({ id, text, sender });
        save();
    }
}

/* KONTEXTMENÜ */
function showContextMenu(x, y) {
    contextMenu.style.left = x + "px";
    contextMenu.style.top = y + "px";
    contextMenu.style.display = "block";
}

document.body.addEventListener("click", () => {
    contextMenu.style.display = "none";
});

/* KONTEXTMENÜ-AKTIONEN */
contextMenu.addEventListener("click", e => {
    if (!contextTarget) return;

    const action = e.target.dataset.action;

    if (action === "copy") {
        navigator.clipboard.writeText(contextTarget.textContent || "");
    }

    if (action === "delete") {
        const id = contextTarget.dataset.id;
        conversations[currentConversation] =
            conversations[currentConversation].filter(m => m.id !== id);
        contextTarget.remove();
        save();
    }

    contextMenu.style.display = "none";
});

/* SENDEN */
document.getElementById("send-me").addEventListener("click", () => {
    if (input.value.trim() !== "") {
        addMessage(input.value.trim(), "me");
        input.value = "";
    }
});

document.getElementById("send-partner").addEventListener("click", () => {
    if (input.value.trim() !== "") {
        addMessage(input.value.trim(), "partner");
        input.value = "";
    }
});

/* NEUES GESPRÄCH */
document.getElementById("new-conversation-btn").addEventListener("click", () => {
    const name = prompt("Name des neuen Gesprächs:");
    if (!name) return;

    if (!conversations[name]) {
        conversations[name] = [];
    }
    refreshDropdown();
    select.value = name;
    loadConversation(name);
});

/* GESPRÄCH LÖSCHEN */
document.getElementById("delete-conversation-btn").addEventListener("click", () => {
    if (!currentConversation) return;

    if (confirm("Gespräch wirklich löschen?")) {
        delete conversations[currentConversation];
        save();
        refreshDropdown();
        chatArea.innerHTML = "";
        currentConversation = null;
    }
});

/* DROPDOWN WECHSEL */
select.addEventListener("change", () => {
    if (select.value) {
        loadConversation(select.value);
    }
});

/* DRAG & DROP IM CHAT-BEREICH */
chatArea.addEventListener("dragover", e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(chatArea, e.clientY);
    const dragging = document.querySelector(".bubble.dragging");
    if (!dragging) return;

    if (afterElement == null) {
        chatArea.appendChild(dragging);
    } else {
        chatArea.insertBefore(dragging, afterElement);
    }
});

chatArea.addEventListener("drop", () => {
    // Reihenfolge im Speicher aktualisieren
    if (!currentConversation) return;

    const ids = [...chatArea.querySelectorAll(".bubble")].map(b => b.dataset.id);
    conversations[currentConversation].sort(
        (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)
    );
    save();
});

function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll(".bubble:not(.dragging)")];

    return elements.reduce(
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

/* INIT */
refreshDropdown();
if (Object.keys(conversations).length > 0) {
    const first = Object.keys(conversations)[0];
    select.value = first;
    loadConversation(first);
}
