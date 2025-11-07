// Modern Multi-Page Portfolio - 2024 JavaScript
// Dr. Addi Ait-Mlouk - Latest Web Development Trends & Interactions

class ModernPortfolio {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.currentPage = this.getCurrentPage();
        this.loadingComplete = false;
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.initLoading();
        this.initNavigation();
        this.initScrollProgress();
        this.initBackToTop();
        this.initAnimations();
        this.initInteractions();
        this.initPerformance();
        this.initAccessibility();
    }

    // ===== LOADING SYSTEM =====
    initLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        // Reduced loading time for faster page loads
        const minLoadTime = 300;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - elapsedTime);

            setTimeout(() => {
                this.hideLoading(loadingScreen);
            }, remainingTime);
        });
    }

    hideLoading(loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
            this.loadingComplete = true;
            this.initPostLoad();
        }, 500);
    }

    initPostLoad() {
        // Initialize components that need DOM to be fully loaded
        this.initScrollToTop();
        this.initStatCounters();
        this.initPageTransitions();
        this.triggerEntranceAnimations();
    }


    // ===== ENHANCED THEME SYSTEM =====
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
        this.updateThemeIcon();
        
        // Force a repaint to ensure theme changes are applied
        setTimeout(() => {
            document.body.style.display = 'none';
            document.body.offsetHeight; // Trigger reflow
            document.body.style.display = '';
        }, 50);
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.triggerThemeTransition();
    }

    updateThemeIcon() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        const lightIcon = toggleBtn.querySelector('.light-icon');
        const darkIcon = toggleBtn.querySelector('.dark-icon');

        if (this.theme === 'dark') {
            lightIcon.style.opacity = '0';
            darkIcon.style.opacity = '1';
        } else {
            lightIcon.style.opacity = '1';
            darkIcon.style.opacity = '0';
        }
    }

    triggerThemeTransition() {
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // ===== NAVIGATION SYSTEM =====
    initNavigation() {
        const navbar = document.getElementById('main-navbar');
        const themeToggle = document.getElementById('theme-toggle');
        const navLinks = document.querySelectorAll('.nav-link');

        // Scroll handler for navbar
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavbar = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });

        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
                this.addButtonRipple(themeToggle);
            });
        }

        // Active nav link highlighting
        this.updateActiveNavLink();
        
        // Smooth scrolling for same-page anchors
        navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', this.handleSmoothScroll.bind(this));
            }
        });
    }

    updateActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';
        return fileName.replace('.html', '') || 'home';
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // ===== SCROLL PROGRESS INDICATOR =====
    initScrollProgress() {
        
        // Remove any existing progress bars first
        const existingProgress = document.querySelector('.scroll-progress');
        if (existingProgress) {
            existingProgress.remove();
        }
        
        // Create scroll progress elements with explicit styling
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress';
        
        // Force styling to ensure visibility
        progressContainer.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 6px !important;
            z-index: 10000 !important;
            background: rgba(37, 99, 235, 0.15) !important;
            backdrop-filter: blur(10px) !important;
            border-bottom: 1px solid rgba(37, 99, 235, 0.2) !important;
            box-shadow: 0 2px 10px rgba(37, 99, 235, 0.1) !important;
            display: block !important;
            visibility: visible !important;
        `;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        
        // Force styling for progress bar
        progressBar.style.cssText = `
            height: 100% !important;
            background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%) !important;
            width: 0% !important;
            transition: width 0.25s ease-out !important;
            box-shadow: 0 0 15px rgba(37, 99, 235, 0.6), 0 2px 6px rgba(37, 99, 235, 0.3) !important;
            position: relative !important;
            display: block !important;
            visibility: visible !important;
        `;
        
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        
        
        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            
            progressBar.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`;
        });
        
        // Test initial setup
    }

    // ===== BACK TO TOP BUTTON =====
    initBackToTop() {
        // Create back to top button
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        
        document.body.appendChild(backToTop);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Click handler
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Keyboard accessibility
        backToTop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ===== ANIMATIONS & INTERACTIONS =====
    initAnimations() {
        // Initialize AOS with custom settings
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });
        }

        // Custom scroll animations
        this.initScrollAnimations();
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special animations for specific elements
                    if (entry.target.classList.contains('stat-item')) {
                        this.animateStatCounter(entry.target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll(
            '.highlight-card, .quick-card, .profile-card, .stat-item, .hero-badge'
        );
        
        animatedElements.forEach(el => observer.observe(el));
    }

    triggerEntranceAnimations() {
        // Stagger animations for multiple elements
        const cards = document.querySelectorAll('.quick-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animationDelay = `${index * 100}ms`;
                card.classList.add('fade-in-up');
            }, 200);
        });
    }

    // ===== STAT COUNTERS =====
    initStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(current + increment, target);
            
            // Easing function for smoother animation
            const progress = step / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const displayValue = Math.floor(target * easeOut);
            
            element.textContent = displayValue;
            
            if (step >= steps) {
                clearInterval(timer);
                element.textContent = target;
            }
        }, duration / steps);
    }

    animateStatCounter(statItem) {
        const number = statItem.querySelector('.stat-number[data-count]');
        if (number) {
            setTimeout(() => {
                this.animateCounter(number);
            }, 300);
        }
    }

    // ===== INTERACTIONS =====
    initInteractions() {
        // Button ripple effects
        this.initButtonRipples();
        
        // Card hover effects
        this.initCardEffects();
        
        // Tooltip system
        this.initTooltips();
        
        // Form interactions
        this.initFormInteractions();
        
        // Keyboard navigation
        this.initKeyboardNavigation();
    }

    initButtonRipples() {
        const buttons = document.querySelectorAll('.btn, .modern-btn-primary, .modern-btn-outline, .social-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.addButtonRipple(button, e);
            });
        });
    }

    addButtonRipple(button, e = null) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        let x, y;
        if (e) {
            x = e.clientX - rect.left - size / 2;
            y = e.clientY - rect.top - size / 2;
        } else {
            x = rect.width / 2 - size / 2;
            y = rect.height / 2 - size / 2;
        }

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;

        // Ensure button has relative positioning
        if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        button.style.overflow = 'hidden';

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    initCardEffects() {
        const cards = document.querySelectorAll('.highlight-card, .quick-card, .profile-card');
        
        cards.forEach(card => {
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 768) return; // Skip on mobile

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${-rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(10px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s ease';
                setTimeout(() => {
                    card.style.transition = '';
                }, 500);
            });

            // Hover glow effect
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.highlight-icon, .card-icon');
                if (icon) {
                    icon.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.4)';
                }
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.highlight-icon, .card-icon');
                if (icon) {
                    icon.style.boxShadow = '';
                }
            });
        });
    }

    initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (window.innerWidth <= 768) return; // Skip on mobile
                this.showTooltip(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip(element);
            });
        });
    }

    showTooltip(element) {
        // Tooltips are handled by CSS, just add accessibility
        element.setAttribute('aria-describedby', 'tooltip');
    }

    hideTooltip(element) {
        element.removeAttribute('aria-describedby');
    }

    initFormInteractions() {
        const formElements = document.querySelectorAll('input, textarea, select');
        
        formElements.forEach(element => {
            // Focus effects
            element.addEventListener('focus', () => {
                element.parentElement.classList.add('focused');
            });
            
            element.addEventListener('blur', () => {
                element.parentElement.classList.remove('focused');
                if (element.value) {
                    element.parentElement.classList.add('filled');
                } else {
                    element.parentElement.classList.remove('filled');
                }
            });
            
            // Real-time validation
            element.addEventListener('input', () => {
                this.validateField(element);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldContainer = field.parentElement;
        
        // Remove previous validation classes
        fieldContainer.classList.remove('valid', 'invalid');
        
        // Basic validation
        if (field.required && !value) {
            fieldContainer.classList.add('invalid');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                fieldContainer.classList.add('invalid');
                return false;
            }
        }
        
        if (value) {
            fieldContainer.classList.add('valid');
        }
        
        return true;
    }

    // ===== SCROLL TO TOP =====
    initScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');
        if (!scrollBtn) return;

        let isVisible = false;

        window.addEventListener('scroll', () => {
            const shouldShow = window.scrollY > 400;
            
            if (shouldShow && !isVisible) {
                scrollBtn.classList.add('visible');
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                scrollBtn.classList.remove('visible');
                isVisible = false;
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.addButtonRipple(scrollBtn);
        });
    }

    // ===== PAGE TRANSITIONS =====
    initPageTransitions() {
        const links = document.querySelectorAll('a[href$=".html"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(link.getAttribute('href'));
            });
        });
    }

    navigateToPage(url) {
        // Add page transition effect
        document.body.style.opacity = '0.7';
        document.body.style.transform = 'scale(0.98)';
        document.body.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // ===== KEYBOARD NAVIGATION =====
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals/menus
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Tab navigation improvements
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    closeAllModals() {
        // Close mobile menu
        const mobileMenu = document.querySelector('.navbar-collapse.show');
        if (mobileMenu) {
            const bsCollapse = new bootstrap.Collapse(mobileMenu);
            bsCollapse.hide();
        }
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    initPerformance() {
        // Lazy load images
        this.initLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Monitor performance
        this.monitorPerformance();
        
        // Optimize for low-end devices
        this.optimizeForLowEnd();
    }

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    preloadCriticalResources() {
        // Preload next page resources
        const criticalPages = ['about.html', 'research.html', 'contact.html'];
        
        criticalPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        if (typeof window.performance === 'undefined') return;

        window.addEventListener('load', () => {
            // Monitor loading performance
            const perfData = performance.getEntriesByType('navigation')[0];
            const paintEntries = performance.getEntriesByType('paint');
            

            // Web Vitals monitoring (if available)
            this.monitorWebVitals();
        });
    }

    monitorWebVitals() {
        // Monitor Core Web Vitals silently
        if ('web-vitals' in window) {
            const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;
            const silentCallback = () => {};
            
            getCLS(silentCallback);
            getFID(silentCallback);
            getFCP(silentCallback);
            getLCP(silentCallback);
            getTTFB(silentCallback);
        }
    }

    optimizeForLowEnd() {
        // Reduce animations on low-end devices
        const isLowEnd = navigator.hardwareConcurrency < 4 || 
                         navigator.deviceMemory < 2;
        
        if (isLowEnd) {
            document.body.classList.add('reduced-motion');
            
            // Disable heavy animations
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach(orb => {
                orb.style.animation = 'none';
            });
        }
        
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.style.animationPlayState = 'paused';
            } else {
                document.body.style.animationPlayState = 'running';
            }
        });
    }

    // ===== ACCESSIBILITY =====
    initAccessibility() {
        // Announce page changes to screen readers
        this.announcePageChange();
        
        // Skip link functionality
        this.initSkipLinks();
        
        // Focus management
        this.initFocusManagement();
        
        // ARIA live regions
        this.initLiveRegions();
    }

    announcePageChange() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = `${document.title} page loaded`;
        document.body.appendChild(announcement);
        
        setTimeout(() => announcement.remove(), 1000);
    }

    initSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    initFocusManagement() {
        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    initLiveRegions() {
        // Create live region for dynamic content announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.id = 'live-region';
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
    }

    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    // ===== UTILITY METHODS =====
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== ERROR HANDLING =====
    handleError(error, context = '') {
        console.error(`Portfolio Error ${context}:`, error);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: error.message,
                fatal: false
            });
        }
    }
}

// CSS Animations injection
const modernAnimations = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
}

.animate-in {
    animation: fade-in-up 0.6s ease-out forwards;
}

.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

.keyboard-navigation *:focus {
    outline: 2px solid var(--primary-color) !important;
    outline-offset: 2px !important;
}

.sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}

.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}

.loaded {
    opacity: 1;
}
`;

// Inject animations
const styleSheet = document.createElement('style');
styleSheet.textContent = modernAnimations;
document.head.appendChild(styleSheet);

// Initialize the portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.modernPortfolio = new ModernPortfolio();
    
});

// Export for global access
window.ModernPortfolio = ModernPortfolio;