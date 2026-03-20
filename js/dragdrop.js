// Drag & Drop Manager
const DragDropManager = {
    draggedElement: null,
    draggedMessageId: null,
    draggedOriginalIndex: null,
    
    init() {
        this.enableDragAndDrop();
    },
    
    enableDragAndDrop() {
        const messagesContainer = document.getElementById('messages-container');
        
        // Event-Delegation für Drag & Drop
        messagesContainer.addEventListener('dragstart', (e) => {
            const messageWrapper = e.target.closest('.message-wrapper');
            if (!messageWrapper) return;
            
            this.draggedElement = messageWrapper;
            this.draggedMessageId = messageWrapper.dataset.messageId;
            
            // Index des gezogenen Elements speichern
            const allMessages = Array.from(messagesContainer.children);
            this.draggedOriginalIndex = allMessages.indexOf(messageWrapper);
            
            // Drag-Image setzen
            e.dataTransfer.setData('text/plain', this.draggedMessageId);
            e.dataTransfer.effectAllowed = 'move';
            
            // CSS für Drag-Operation
            messageWrapper.style.opacity = '0.5';
            
            // Für Firefox: Benötigt setDragImage
            const dragImage = document.createElement('div');
            dragImage.textContent = '📦 Nachricht verschieben';
            dragImage.style.cssText = `
                position: absolute;
                top: -1000px;
                background: var(--user-bubble, #25D366);
                color: white;
                padding: 8px 12px;
                border-radius: 18px;
                font-size: 12px;
                white-space: nowrap;
            `;
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, 0, 0);
            setTimeout(() => document.body.removeChild(dragImage), 0);
        });
        
        messagesContainer.addEventListener('dragend', (e) => {
            if (this.draggedElement) {
                this.draggedElement.style.opacity = '';
                this.draggedElement = null;
                this.draggedMessageId = null;
                this.draggedOriginalIndex = null;
            }
            
            // Alle Drag-Over-Effekte entfernen
            document.querySelectorAll('.drag-over').forEach(el => {
                el.classList.remove('drag-over');
            });
        });
        
        messagesContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const targetWrapper = e.target.closest('.message-wrapper');
            if (!targetWrapper || targetWrapper === this.draggedElement) return;
            
            // Entferne vorhandene Klassen
            document.querySelectorAll('.drag-over').forEach(el => {
                el.classList.remove('drag-over');
            });
            
            // Füge Klasse für visuelles Feedback hinzu
            targetWrapper.classList.add('drag-over');
        });
        
        messagesContainer.addEventListener('dragleave', (e) => {
            const targetWrapper = e.target.closest('.message-wrapper');
            if (targetWrapper) {
                targetWrapper.classList.remove('drag-over');
            }
        });
        
        messagesContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            
            const targetWrapper = e.target.closest('.message-wrapper');
            if (!targetWrapper || !this.draggedElement) return;
            
            targetWrapper.classList.remove('drag-over');
            
            const targetMessageId = targetWrapper.dataset.messageId;
            
            if (this.draggedMessageId !== targetMessageId) {
                this.reorderMessages(this.draggedMessageId, targetMessageId);
            }
            
            this.draggedElement.style.opacity = '';
            this.draggedElement = null;
        });
    },
    
    reorderMessages(draggedId, targetId) {
        if (!ConversationManager.activeConversation) return;
        
        const messages = [...ConversationManager.activeConversation.messages];
        const draggedIndex = messages.findIndex(m => m.id === draggedId);
        const targetIndex = messages.findIndex(m => m.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        // Nachricht verschieben
        const [draggedMessage] = messages.splice(draggedIndex, 1);
        messages.splice(targetIndex, 0, draggedMessage);
        
        // Aktualisiere die Nachrichten im Conversation-Objekt
        ConversationManager.activeConversation.messages = messages;
        ConversationManager.updateConversation(ConversationManager.activeConversation);
        
        // UI aktualisieren
        UIManager.renderMessages();
        
        // Optional: Toast-Nachricht
        MessageManager.showToast('Nachricht verschoben', 1500);
    }
};
