/**
 * Enhanced Theme Initialization Script
 * Must be loaded in <head> before page renders to prevent flash
 */
(function() {
    try {
        const savedTheme = localStorage.getItem('theme') || 'light';

        // Robust DOM element checking and setting
        function setThemeOnElement(element, theme) {
            if (element && typeof element.setAttribute === 'function') {
                element.setAttribute('data-theme', theme);
                return true;
            }
            return false;
        }

        // Set theme on document element immediately
        setThemeOnElement(document.documentElement, savedTheme);

        // Handle body element
        function initializeBodyTheme() {
            if (document.body) {
                setThemeOnElement(document.body, savedTheme);

                // Add class-based styling for immediate effect
                if (savedTheme === 'dark') {
                    document.body.classList.add('dark-theme');
                    document.documentElement.classList.add('dark-theme');
                } else {
                    document.body.classList.add('light-theme');
                    document.documentElement.classList.add('light-theme');
                }
            }
        }

        // Initialize immediately if body exists, otherwise wait
        if (document.body) {
            initializeBodyTheme();
        } else {
            // Multiple fallback approaches
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeBodyTheme);
            } else {
                // DOM is already ready
                setTimeout(initializeBodyTheme, 0);
            }

            // Additional fallback
            window.addEventListener('load', initializeBodyTheme);
        }

    } catch (error) {
        console.error('Theme initialization error:', error);
        // Fallback: set light theme
        if (document.documentElement) {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
})();
