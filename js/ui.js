// Elements
const toggle_switch = document.getElementById("toggle_switch");
const messageInput = document.getElementById("messageInput");
const addButton = document.getElementById("addButton");
const copyAllButton = document.getElementById("copyAllButton");
const messagesContainer = document.getElementById("messagesContainer");
const emptyState = document.getElementById("emptyState");

// State
let currentService = "whatsapp";
let messages = [];
let draggedElement = null;

// Initialize the default service
document.body.setAttribute("data-service", "whatsapp");

// Switch Service Handler
toggle_switch.addEventListener("change", () => {
    currentService = toggle_switch.checked ? "viber" : "whatsapp";
    document.body.setAttribute("data-service", currentService);
    console.log(`Service changed to: ${currentService}`);
});

// Add Message Handler
addButton.addEventListener("click", addMessage);

// Copy All Handler
copyAllButton.addEventListener("click", copyAllMessages);

// Enter key in textarea
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addMessage();
    }
});

// Drag & Drop Setup
messagesContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    messagesContainer.classList.add("drag-over");
});

messagesContainer.addEventListener("dragleave", () => {
    messagesContainer.classList.remove("drag-over");
});

messagesContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    messagesContainer.classList.remove("drag-over");
    
    // Reorder messages based on drop position
    if (draggedElement && draggedElement.parentElement === messagesContainer) {
        const allBubbles = Array.from(messagesContainer.querySelectorAll(".message-bubble"));
        const draggedIndex = allBubbles.indexOf(draggedElement);
        
        // Get drop target
        let dropTarget = e.target.closest(".message-bubble");
        if (!dropTarget) return;
        
        const dropIndex = allBubbles.indexOf(dropTarget);
        
        if (draggedIndex !== dropIndex) {
            // Reorder in messages array
            const [movedMessage] = messages.splice(draggedIndex, 1);
            messages.splice(dropIndex, 0, movedMessage);
            
            // Save to localStorage
            saveMessages();
            
            // Update UI
            messagesContainer.innerHTML = "";
            messages.forEach(renderMessage);
        }
    }
});

// Add a new message
function addMessage() {
    const text = messageInput.value.trim();
    
    if (!text) {
        alert("Bitte gib eine Nachricht ein!");
        return;
    }
    
    // Create message object
    const message = {
        id: Date.now(),
        text: text,
        service: currentService
    };
    
    messages.push(message);
    
    // Render the message
    renderMessage(message);
    
    // Save to localStorage
    saveMessages();
    
    // Clear input
    messageInput.value = "";
    messageInput.focus();
    
    // Hide empty state
    if (emptyState) {
        emptyState.style.display = "none";
    }
}

// Render a single message
function renderMessage(message) {
    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.setAttribute("data-id", message.id);
    bubble.draggable = true;
    
    const textSpan = document.createElement("span");
    textSpan.className = "message-text";
    textSpan.textContent = message.text;
    
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "4px";
    buttonContainer.style.flexShrink = "0";
    
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "📋";
    copyBtn.setAttribute("aria-label", "Kopieren");
    copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        copyToClipboard(message.text);
    });
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "Nachricht löschen");
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteMessage(message.id);
    });
    
    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(deleteBtn);
    
    bubble.appendChild(textSpan);
    bubble.appendChild(buttonContainer);
    
    // Drag event listeners
    bubble.addEventListener("dragstart", (e) => {
        draggedElement = bubble;
        bubble.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
    });
    
    bubble.addEventListener("dragend", () => {
        bubble.classList.remove("dragging");
        draggedElement = null;
    });
    
    messagesContainer.appendChild(bubble);
    
    // Auto-scroll to bottom
    messagesContainer.parentElement.scrollTop = messagesContainer.parentElement.scrollHeight;
}

// Copy single message to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Kopiert!", 2000);
    }).catch(err => {
        console.error("Fehler beim Kopieren:", err);
        showToast("Kopieren fehlgeschlagen", 2000);
    });
}

// Copy all messages to clipboard
function copyAllMessages() {
    if (messages.length === 0) {
        showToast("Keine Nachrichten zum Kopieren", 2000);
        return;
    }
    
    const allText = messages.map(msg => msg.text).join("\n\n");
    navigator.clipboard.writeText(allText).then(() => {
        showToast(`${messages.length} Nachricht(en) kopiert!`, 2000);
    }).catch(err => {
        console.error("Fehler beim Kopieren:", err);
        showToast("Kopieren fehlgeschlagen", 2000);
    });
}

// Show toast notification
function showToast(message, duration = 2000) {
    const toast = document.createElement("div");
    toast.className = "copy-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Delete a message
function deleteMessage(id) {
    messages = messages.filter(msg => msg.id !== id);
    
    // Save to localStorage
    saveMessages();
    
    const bubble = document.querySelector(`[data-id="${id}"]`);
    if (bubble) {
        bubble.style.animation = "slideIn 0.3s ease-out reverse";
        setTimeout(() => {
            bubble.remove();
            
            // Show empty state if no messages
            if (messages.length === 0) {
                emptyState.style.display = "block";
            }
        }, 300);
    }
}

// Load messages from localStorage (optional für Zukunft)
function loadMessages() {
    const saved = localStorage.getItem("messages");
    if (saved) {
        try {
            messages = JSON.parse(saved);
            messages.forEach(renderMessage);
            if (messages.length === 0 && emptyState) {
                emptyState.style.display = "block";
            }
        } catch (e) {
            console.error("Error loading messages:", e);
        }
    }
}

// Save messages to localStorage (optional für Zukunft)
function saveMessages() {
    localStorage.setItem("messages", JSON.stringify(messages));
}

// Initialize
loadMessages();
messageInput.focus();
