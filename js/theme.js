// Theme Manager
const ThemeManager = {
    currentTheme: 'whatsapp',
    
    init() {
        this.currentTheme = StorageManager.getTheme() || 'whatsapp';
        this.applyTheme(this.currentTheme);
    },
    
    applyTheme(theme) {
        const themeStylesheet = document.getElementById('theme-stylesheet');
        const isWhatsApp = theme === 'whatsapp';
        
        themeStylesheet.href = isWhatsApp ? 'css/theme-whatsapp.css' : 'css/theme-viber.css';
        this.currentTheme = theme;
        StorageManager.setTheme(theme);
        
        // Aktiviere den richtigen Button
        document.getElementById('theme-whatsapp').classList.toggle('active', isWhatsApp);
        document.getElementById('theme-viber').classList.toggle('active', !isWhatsApp);
    },
    
    setTheme(theme) {
        this.applyTheme(theme);
    }
};
