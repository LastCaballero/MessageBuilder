// UI Manager
const UIManager = {
    init() {
        this.conversationSelect = document.getElementById('conversation-select');
        this.messagesContainer = document.getElementById('messages-container');
        this.conversationInfo = document.getElementById('conversation-info');
        this.messageInput = document.getElementById('message-input');
        this.sendBtn = document.getElementById('send-btn');
        this.newConversationBtn = document.getElementById('new-conversation-btn');
        this.deleteConversationBtn = document.getElementById('delete-conversation-btn');
        this.typeUserBtn = document.getElementById('message-type-user');
        this.typePartnerBtn = document.getElementById('message-type-partner');
    },
    
    updateConversationSelect() {
        this.conversationSelect.innerHTML = '<option value="">-- Gespräch auswählen oder erstellen --</option>';
        
        ConversationManager.conversations.forEach(conv => {
            const option = document.createElement('option');
            option.value = conv.id;
            option.textContent = `${conv.name} (${conv.messages.length} Nachr.)`;
            if (ConversationManager.activeConversation && conv.id === ConversationManager.activeConversation.id) {
                option.selected = true;
            }
            this.conversationSelect.appendChild(option);
        });
    },
    
    updateConversationInfo() {
        if (ConversationManager.activeConversation) {
            const msgCount = ConversationManager.activeConversation.messages.length;
            const created = new Date(ConversationManager.activeConversation.created).toLocaleDateString('de-DE');
            this.conversationInfo.textContent = `💬 ${msgCount} Nachricht(en) · Erstellt: ${created}`;
        } else {
            this.conversationInfo.textContent = '✨ Kein Gespräch ausgewählt';
        }
    },
    
    renderMessages() {
        if (!ConversationManager.activeConversation || ConversationManager.activeConversation.messages.length === 0) {
            this.messagesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💬</div>
                    <p>Keine Nachrichten</p>
                    <small>Schreibe deine erste Nachricht</small>
                </div>
            `;
            return;
        }
        
        this.messagesContainer.innerHTML = '';
        
        ConversationManager.activeConversation.messages.forEach(message => {
            const messageWrapper = document.createElement('div');
            messageWrapper.className = `message-wrapper ${message.type}`;
            
            const bubble = document.createElement('div');
            bubble.className = `message-bubble ${message.type}`;
            bubble.innerHTML = `
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <div class="message-time">${message.timestamp}${message.edited ? ' · bearbeitet' : ''}</div>
            `;
            
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            actions.innerHTML = `
                <button class="action-btn copy-btn" data-id="${message.id}">📋 Kopieren</button>
                <button class="action-btn edit-btn" data-id="${message.id}">✏️ Editieren</button>
                <button class="action-btn delete-btn" data-id="${message.id}">🗑 Löschen</button>
            `;
            
            messageWrapper.appendChild(bubble);
            messageWrapper.appendChild(actions);
            this.messagesContainer.appendChild(messageWrapper);
        });
        
        // Event-Listener für Actions
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const messageId = btn.dataset.id;
                const message = ConversationManager.activeConversation.messages.find(m => m.id === messageId);
                if (message) {
                    MessageManager.copyToClipboard(message.text);
                }
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const messageId = btn.dataset.id;
                const message = ConversationManager.activeConversation.messages.find(m => m.id === messageId);
                if (message) {
                    const newText = prompt('Nachricht bearbeiten:', message.text);
                    if (newText && newText.trim()) {
                        ConversationManager.updateMessage(
                            ConversationManager.activeConversation.id,
                            messageId,
                            newText.trim()
                        );
                        this.renderMessages();
                        this.updateConversationInfo();
                    }
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Nachricht wirklich löschen?')) {
                    const messageId = btn.dataset.id;
                    ConversationManager.deleteMessage(
                        ConversationManager.activeConversation.id,
                        messageId
                    );
                    this.renderMessages();
                    this.updateConversationInfo();
                    this.updateConversationSelect();
                }
            });
        });
        
        // Automatisch nach unten scrollen
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    clearInput() {
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
    },
    
    adjustTextareaHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 100) + 'px';
    }
};
