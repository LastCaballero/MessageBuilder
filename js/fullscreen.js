// Fullscreen Manager - Aktualisiert mit besserer Integration
const FullscreenManager = {
    isFullscreen: false,
    fullscreenBtn: null,
    
    init() {
        this.createFullscreenButton();
        this.checkFullscreenSupport();
        this.addEventListeners();
        this.adjustHeaderPadding();
    },
    
    createFullscreenButton() {
        // Button erstellen
        this.fullscreenBtn = document.createElement('button');
        this.fullscreenBtn.id = 'fullscreen-btn';
        this.fullscreenBtn.className = 'fullscreen-btn';
        this.fullscreenBtn.innerHTML = '⛶';
        this.fullscreenBtn.title = 'Vollbildmodus';
        this.fullscreenBtn.setAttribute('aria-label', 'Vollbildmodus');
        
        // Zum Header hinzufügen (rechts positioniert)
        const header = document.querySelector('.header');
        header.appendChild(this.fullscreenBtn);
        
        // CSS-Klasse für Header anpassen
        header.classList.add('has-fullscreen-btn');
    },
    
    adjustHeaderPadding() {
        // Stelle sicher, dass der Header genug Platz hat
        const header = document.querySelector('.header');
        if (header) {
            const style = window.getComputedStyle(header);
            const currentPadding = parseInt(style.paddingRight);
            if (currentPadding < 50) {
                header.style.paddingRight = '50px';
            }
        }
    },
    
    checkFullscreenSupport() {
        const fullscreenEnabled = document.fullscreenEnabled || 
                                  document.webkitFullscreenEnabled || 
                                  document.mozFullScreenEnabled ||
                                  document.msFullscreenEnabled;
        
        if (!fullscreenEnabled) {
            if (this.fullscreenBtn) {
                this.fullscreenBtn.style.display = 'none';
            }
            console.log('Fullscreen wird nicht unterstützt');
        }
    },
    
    addEventListeners() {
        if (!this.fullscreenBtn) return;
        
        this.fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFullscreen();
        });
        
        // Fullscreen-Änderungen abfangen
        document.addEventListener('fullscreenchange', () => this.updateButtonState());
        document.addEventListener('webkitfullscreenchange', () => this.updateButtonState());
        document.addEventListener('mozfullscreenchange', () => this.updateButtonState());
        document.addEventListener('MSFullscreenChange', () => this.updateButtonState());
        
        // Bei Smartphone: Orientation Change - ggf. Fullscreen anpassen
        window.addEventListener('orientationchange', () => {
            if (this.isFullscreen) {
                setTimeout(() => this.adjustForFullscreen(), 100);
            }
        });
        
        // Bei Resize: Header-Padding anpassen
        window.addEventListener('resize', () => {
            this.adjustHeaderPadding();
        });
    },
    
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    },
    
    enterFullscreen() {
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        
        this.isFullscreen = true;
        this.updateButtonState();
        this.adjustForFullscreen();
        
        // Toast-Nachricht
        if (window.MessageManager) {
            MessageManager.showToast('Vollbildmodus aktiviert', 1500);
        }
    },
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        this.isFullscreen = false;
        this.updateButtonState();
        this.adjustForFullscreen();
        
        // Toast-Nachricht
        if (window.MessageManager) {
            MessageManager.showToast('Vollbildmodus beendet', 1500);
        }
    },
    
    updateButtonState() {
        this.isFullscreen = !!(document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement ||
                               document.msFullscreenElement);
        
        if (this.fullscreenBtn) {
            if (this.isFullscreen) {
                this.fullscreenBtn.innerHTML = '✕';
                this.fullscreenBtn.title = 'Vollbild beenden';
                this.fullscreenBtn.classList.add('fullscreen-active');
            } else {
                this.fullscreenBtn.innerHTML = '⛶';
                this.fullscreenBtn.title = 'Vollbildmodus';
                this.fullscreenBtn.classList.remove('fullscreen-active');
            }
        }
    },
    
    adjustForFullscreen() {
        // Anpassungen für Fullscreen-Modus
        if (this.isFullscreen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Zusätzlicher Padding für sicheren Bereich (Notch, etc.)
            document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
            document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        
        // UI neu anpassen
        setTimeout(() => {
            if (window.UIManager && UIManager.renderMessages) {
                UIManager.renderMessages();
            }
        }, 100);
    },
    
    // Für iOS: Verhindert das Zoomen im Fullscreen
    preventZoom() {
        document.addEventListener('touchmove', (e) => {
            if (this.isFullscreen && e.scale !== 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
};
