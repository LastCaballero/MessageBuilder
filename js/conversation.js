// Conversation Manager
const ConversationManager = {
    conversations: [],
    activeConversation: null,
    
    init() {
        this.conversations = StorageManager.getConversations();
        const activeId = StorageManager.getActiveConversationId();
        
        if (activeId) {
            this.activeConversation = this.conversations.find(c => c.id === activeId);
        }
        
        if (!this.activeConversation && this.conversations.length > 0) {
            this.activeConversation = this.conversations[0];
            StorageManager.setActiveConversationId(this.activeConversation.id);
        }
    },
    
    createConversation(name) {
        const newConversation = {
            id: Date.now().toString(),
            name: name || `Gespräch ${this.conversations.length + 1}`,
            created: new Date().toISOString(),
            messages: []
        };
        
        this.conversations.unshift(newConversation);
        this.activeConversation = newConversation;
        StorageManager.saveConversations(this.conversations);
        StorageManager.setActiveConversationId(newConversation.id);
        
        return newConversation;
    },
    
    deleteConversation(id) {
        const index = this.conversations.findIndex(c => c.id === id);
        if (index !== -1) {
            this.conversations.splice(index, 1);
            StorageManager.saveConversations(this.conversations);
            
            if (this.conversations.length > 0) {
                this.activeConversation = this.conversations[0];
                StorageManager.setActiveConversationId(this.activeConversation.id);
            } else {
                this.activeConversation = null;
                StorageManager.setActiveConversationId(null);
            }
            
            return true;
        }
        return false;
    },
    
    getConversation(id) {
        return this.conversations.find(c => c.id === id);
    },
    
    updateConversation(conversation) {
        const index = this.conversations.findIndex(c => c.id === conversation.id);
        if (index !== -1) {
            this.conversations[index] = conversation;
            StorageManager.saveConversations(this.conversations);
            if (this.activeConversation && this.activeConversation.id === conversation.id) {
                this.activeConversation = conversation;
            }
        }
    },
    
    addMessage(conversationId, message) {
        const conversation = this.getConversation(conversationId);
        if (conversation) {
            conversation.messages.push(message);
            this.updateConversation(conversation);
            return message;
        }
        return null;
    },
    
    updateMessage(conversationId, messageId, updatedText) {
        const conversation = this.getConversation(conversationId);
        if (conversation) {
            const message = conversation.messages.find(m => m.id === messageId);
            if (message) {
                message.text = updatedText;
                message.edited = true;
                message.editedAt = new Date().toISOString();
                this.updateConversation(conversation);
                return true;
            }
        }
        return false;
    },
    
    deleteMessage(conversationId, messageId) {
        const conversation = this.getConversation(conversationId);
        if (conversation) {
            const index = conversation.messages.findIndex(m => m.id === messageId);
            if (index !== -1) {
                conversation.messages.splice(index, 1);
                this.updateConversation(conversation);
                return true;
            }
        }
        return false;
    }
};
