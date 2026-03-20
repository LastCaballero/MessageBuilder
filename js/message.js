// Message Manager
const MessageManager = {
    currentMessageType: 'user', // 'user' or 'partner'
    
    createMessage(text, type) {
        const now = new Date();
        return {
            id: Date.now().toString(),
            text: text.trim(),
            type: type,
            timestamp: now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            date: now.toISOString(),
            edited: false
        };
    },
    
    setMessageType(type) {
        this.currentMessageType = type;
    },
    
    getCurrentMessageType() {
        return this.currentMessageType;
    },
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Nachricht kopiert!');
        }).catch(() => {
            this.showToast('Konnte nicht kopieren');
        });
    },
    
    showToast(message, duration = 2000) {
        // Einfache Toast-Nachricht
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }
};
