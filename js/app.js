// Main App - Aktualisierte Initialisierung mit Fullscreen
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    StorageManager.getData();
    ConversationManager.init();
    ThemeManager.init();
    UIManager.init();
    
    // Render initial UI
    UIManager.updateConversationSelect();
    UIManager.updateConversationInfo();
    UIManager.renderMessages();
    
    // Initialize Drag & Drop
    DragDropManager.init();
    
    // Initialize Fullscreen
    FullscreenManager.init();
    FullscreenManager.preventZoom();
    
    // ... Rest des Codes bleibt unverändert (alle Event-Listener von vorher) ...
    
    // Event: Send Message
    const sendMessage = () => {
        if (!ConversationManager.activeConversation) {
            MessageManager.showToast('Bitte erstelle oder wähle zuerst ein Gespräch!');
            return;
        }
        
        const text = UIManager.messageInput.value.trim();
        if (!text) return;
        
        const message = MessageManager.createMessage(text, MessageManager.getCurrentMessageType());
        ConversationManager.addMessage(ConversationManager.activeConversation.id, message);
        
        UIManager.clearInput();
        UIManager.updateConversationSelect();
        UIManager.updateConversationInfo();
        UIManager.renderMessages();
    };
    
    UIManager.sendBtn.addEventListener('click', sendMessage);
    
    UIManager.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    UIManager.messageInput.addEventListener('input', () => {
        UIManager.adjustTextareaHeight();
    });
    
    // Event: New Conversation
    UIManager.newConversationBtn.addEventListener('click', () => {
        const name = prompt('Name des Gesprächs:', `Gespräch ${ConversationManager.conversations.length + 1}`);
        if (name !== null) {
            ConversationManager.createConversation(name || undefined);
            UIManager.updateConversationSelect();
            UIManager.updateConversationInfo();
            UIManager.renderMessages();
            MessageManager.showToast(`Gespräch "${name}" erstellt!`);
        }
    });
    
    // Event: Delete Conversation
    UIManager.deleteConversationBtn.addEventListener('click', () => {
        if (!ConversationManager.activeConversation) {
            MessageManager.showToast('Kein Gespräch zum Löschen ausgewählt');
            return;
        }
        
        if (confirm(`Gespräch "${ConversationManager.activeConversation.name}" wirklich löschen?`)) {
            ConversationManager.deleteConversation(ConversationManager.activeConversation.id);
            UIManager.updateConversationSelect();
            UIManager.updateConversationInfo();
            UIManager.renderMessages();
            MessageManager.showToast('Gespräch gelöscht');
        }
    });
    
    // Event: Conversation Select
    UIManager.conversationSelect.addEventListener('change', (e) => {
        const conversationId = e.target.value;
        if (conversationId) {
            const conversation = ConversationManager.getConversation(conversationId);
            if (conversation) {
                ConversationManager.activeConversation = conversation;
                StorageManager.setActiveConversationId(conversationId);
                UIManager.updateConversationInfo();
                UIManager.renderMessages();
            }
        }
    });
    
    // Event: Message Type Selection
    UIManager.typeUserBtn.addEventListener('click', () => {
        MessageManager.setMessageType('user');
        UIManager.typeUserBtn.classList.add('active');
        UIManager.typePartnerBtn.classList.remove('active');
    });
    
    UIManager.typePartnerBtn.addEventListener('click', () => {
        MessageManager.setMessageType('partner');
        UIManager.typePartnerBtn.classList.add('active');
        UIManager.typeUserBtn.classList.remove('active');
    });
    
    // Event: Theme Switching
    document.getElementById('theme-whatsapp').addEventListener('click', () => {
        ThemeManager.setTheme('whatsapp');
    });
    
    document.getElementById('theme-viber').addEventListener('click', () => {
        ThemeManager.setTheme('viber');
    });
});