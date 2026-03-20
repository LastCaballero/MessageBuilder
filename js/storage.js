// Storage Manager
const StorageManager = {
    STORAGE_KEY: 'message_builder_data',
    
    getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            return {
                conversations: [],
                activeConversationId: null,
                theme: 'whatsapp'
            };
        }
        return JSON.parse(data);
    },
    
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },
    
    getConversations() {
        return this.getData().conversations;
    },
    
    saveConversations(conversations) {
        const data = this.getData();
        data.conversations = conversations;
        this.saveData(data);
    },
    
    getActiveConversationId() {
        return this.getData().activeConversationId;
    },
    
    setActiveConversationId(id) {
        const data = this.getData();
        data.activeConversationId = id;
        this.saveData(data);
    },
    
    getTheme() {
        return this.getData().theme;
    },
    
    setTheme(theme) {
        const data = this.getData();
        data.theme = theme;
        this.saveData(data);
    }
};
