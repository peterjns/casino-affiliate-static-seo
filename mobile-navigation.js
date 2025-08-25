/**
 * Mobile Navigation JavaScript
 * Optimized for iOS and Android devices with touch interactions
 */

class MobileNavigation {
    constructor() {
        this.init();
        this.bindEvents();
        this.handleResize();
    }

    init() {
        this.mobileNav = document.querySelector('.mobile-nav');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.mobileMenuButton = document.querySelector('.mobile-menu-button');
        this.mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
        this.body = document.body;
        this.isMenuOpen = false;
        
        // Create overlay for menu
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-menu-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(this.overlay);
    }

    bindEvents() {
        // Menu toggle
        if (this.mobileMenuButton) {
            this.mobileMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }

        // Close menu when clicking overlay
        this.overlay.addEventListener('click', () => {
            this.closeMenu();
        });

        // Close menu when clicking menu items
        this.mobileMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Prevent scroll when menu is open (iOS fix)
        document.addEventListener('touchmove', (e) => {
            if (this.isMenuOpen && !this.mobileMenu.contains(e.target)) {
                e.preventDefault();
            }
        }, { passive: false });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        this.mobileMenu.classList.add('active');
        this.overlay.style.opacity = '1';
        this.overlay.style.visibility = 'visible';
        this.body.style.overflow = 'hidden';
        
        // Update button icon
        if (this.mobileMenuButton) {
            this.mobileMenuButton.innerHTML = '<i class="fas fa-times"></i>';
        }

        // Add animation to menu items
        this.mobileMenuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.overlay.style.opacity = '0';
        this.overlay.style.visibility = 'hidden';
        this.body.style.overflow = '';
        
        // Update button icon
        if (this.mobileMenuButton) {
            this.mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
        }

        // Reset menu items animation
        this.mobileMenuItems.forEach(item => {
            item.style.transition = '';
            item.style.opacity = '';
            item.style.transform = '';
        });
    }

    handleResize() {
        // Close menu on desktop
        if (window.innerWidth >= 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }

    // Method to highlight active page
    setActivePage(pageName) {
        this.mobileMenuItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent.toLowerCase().includes(pageName.toLowerCase())) {
                item.classList.add('active');
            }
        });
    }
}

// Touch gesture handling for better mobile UX
class TouchGestureHandler {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.threshold = 50;
        this.init();
    }

    init() {
        document.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!this.startX || !this.startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = this.startX - endX;
            const diffY = this.startY - endY;

            // Swipe right to open menu (from left edge)
            if (Math.abs(diffX) > Math.abs(diffY) && 
                diffX < -this.threshold && 
                this.startX < 50 && 
                window.mobileNav && 
                !window.mobileNav.isMenuOpen) {
                window.mobileNav.openMenu();
            }

            // Swipe left to close menu
            if (Math.abs(diffX) > Math.abs(diffY) && 
                diffX > this.threshold && 
                window.mobileNav && 
                window.mobileNav.isMenuOpen) {
                window.mobileNav.closeMenu();
            }

            this.startX = 0;
            this.startY = 0;
        }, { passive: true });
    }
}

// Smooth scrolling for anchor links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Viewport height fix for mobile browsers
class ViewportFix {
    constructor() {
        this.init();
    }

    init() {
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 100);
        });
    }
}

// Performance optimization for scroll events
class ScrollOptimizer {
    constructor() {
        this.ticking = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (mobileNav) {
            if (scrollY > 100) {
                mobileNav.style.background = 'rgba(102, 126, 234, 0.95)';
                mobileNav.style.backdropFilter = 'blur(20px)';
            } else {
                mobileNav.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                mobileNav.style.backdropFilter = 'blur(10px)';
            }
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing mobile navigation...');
    
    // Check if mobile nav elements exist
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    console.log('Mobile nav elements:', { mobileNav, mobileMenuButton, mobileMenu });
    
    if (mobileNav && mobileMenuButton && mobileMenu) {
        // Initialize mobile navigation
        window.mobileNav = new MobileNavigation();
        console.log('Mobile navigation initialized');
        
        // Initialize touch gestures
        new TouchGestureHandler();
        
        // Initialize smooth scrolling
        new SmoothScroll();
        
        // Initialize viewport fix
        new ViewportFix();
        
        // Initialize scroll optimizer
        new ScrollOptimizer();
        
        // Set active page based on current URL
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        if (currentPage && window.mobileNav) {
            window.mobileNav.setActivePage(currentPage);
        }
    } else {
        console.error('Mobile navigation elements not found');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileNavigation,
        TouchGestureHandler,
        SmoothScroll,
        ViewportFix,
        ScrollOptimizer
    };
}
