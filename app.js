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
        addMessage(msg.text, msg.sender, false);
    });

    save();
}

/* NACHRICHT HINZUFÜGEN */
function addMessage(text, sender, saveMsg = true) {
    const div = document.createElement("div");
    div.classList.add("bubble", sender);
    div.textContent = text;

    div.addEventListener("contextmenu", e => {
        e.preventDefault();
        contextTarget = div;
        showContextMenu(e.pageX, e.pageY);
    });

    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;

    if (saveMsg && currentConversation) {
        conversations[currentConversation].push({ text, sender });
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
        navigator.clipboard.writeText(contextTarget.textContent);
    }

    if (action === "delete") {
        const text = contextTarget.textContent;
        conversations[currentConversation] =
            conversations[currentConversation].filter(m => m.text !== text);
        contextTarget.remove();
        save();
    }

    contextMenu.style.display = "none";
});

/* SENDEN */
document.getElementById("send-me").addEventListener("click", () => {
    if (input.value.trim() !== "") {
        addMessage(input.value, "me");
        input.value = "";
    }
});

document.getElementById("send-partner").addEventListener("click", () => {
    if (input.value.trim() !== "") {
        addMessage(input.value, "partner");
        input.value = "";
    }
});

/* NEUES GESPRÄCH */
document.getElementById("new-conversation-btn").addEventListener("click", () => {
    const name = prompt("Name des neuen Gesprächs:");
    if (!name) return;

    conversations[name] = [];
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
    loadConversation(select.value);
});

/* INIT */
refreshDropdown();
if (Object.keys(conversations).length > 0) {
    const first = Object.keys(conversations)[0];
    select.value = first;
    loadConversation(first);
}