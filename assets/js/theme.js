/**
 * Theme and UI Interactions Manager
 *
 * Purpose: Manages the application's visual theme (Light/Dark mode),
 *          persisting user preference and handling scroll-based header effects.
 *          Also handles the mobile menu interactions.
 *
 * Dependencies: DOM
 *
 * Author: Emilio De La Peña Chacón
 */

/**
 * Theme Strategy Interface
 * Defines the contract for applying theme variations using the Strategy Pattern.
 */
const ThemeStrategies = {
    dark: {
        /**
         * Applies dark mode styles and updates icons/labels.
         * @param {Object} elements - References to DOM elements (body, icon, toggle).
         */
        apply(elements) {
            elements.body.classList.add('dark-mode');
            elements.icon.innerHTML = '&#9728;'; // Sun Icon
            elements.toggle.setAttribute('aria-label', 'Switch to light mode');
        }
    },
    light: {
        /**
         * Applies light mode styles and updates icons/labels.
         * @param {Object} elements - References to DOM elements (body, icon, toggle).
         */
        apply(elements) {
            elements.body.classList.remove('dark-mode');
            elements.icon.innerHTML = '&#9790;'; // Moon Icon
            elements.toggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
};

/**
 * ThemeManager
 * Context class that orchestrates theme state and strategies.
 */
class ThemeManager {
    /**
     * Initializes the ThemeManager.
     * Sets up DOM references and default state.
     */
    constructor() {
        this.elements = {
            body: document.body,
            toggle: document.getElementById('theme-toggle'),
            icon: document.getElementById('theme-icon'),
            header: document.querySelector('header')
        };
        this.storageKey = 'theme';
        this.currentTheme = 'light';
    }

    /**
     * Bootstraps the theme logic.
     * Loads preference, applies initial theme, and binds events.
     */
    init() {
        this.loadPreference();
        this.apply();
        this.bindEvents();
    }

    /**
     * Loads the theme preference from localStorage or detects system preference.
     */
    loadPreference() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            this.currentTheme = stored;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
        }
    }

    /**
     * Toggles between 'light' and 'dark' themes.
     * Updates state, applies changes, and saves preference.
     */
    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.apply();
        this.save();
    }

    /**
     * Delegates the theme application to the specific strategy.
     */
    apply() {
        const strategy = ThemeStrategies[this.currentTheme];
        if (strategy) {
            strategy.apply(this.elements);
        }
    }

    /**
     * Persists the current theme to localStorage.
     */
    save() {
        localStorage.setItem(this.storageKey, this.currentTheme);
    }

    /**
     * Sets up event listeners for the theme toggle and window scroll.
     */
    bindEvents() {
        if (this.elements.toggle) {
            this.elements.toggle.addEventListener('click', () => this.toggle());
        }

        // Scroll Logic: Throttling via requestAnimationFrame could be added if heavy logic existed,
        // but for a single class toggle, direct handling with passive listener is efficient enough.
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    /**
     * Handles scroll events to toggle the sticky header style.
     * Adds 'scrolled' class when page is scrolled past threshold.
     */
    handleScroll() {
        const threshold = 10;
        const isScrolled = window.scrollY > threshold;

        // Efficient class toggle: only writes if changed to minimize reflows
        if (this.elements.header) {
             if (isScrolled && !this.elements.header.classList.contains('scrolled')) {
                 this.elements.header.classList.add('scrolled');
             } else if (!isScrolled && this.elements.header.classList.contains('scrolled')) {
                 this.elements.header.classList.remove('scrolled');
             }
        }
    }
}

/**
 * MenuManager
 * Handles mobile menu interactions (open/close).
 */
class MenuManager {
    /**
     * Initializes the MenuManager.
     * Captures DOM elements for the navigation menu.
     */
    constructor() {
        this.elements = {
            toggle: document.getElementById('menu-toggle'),
            close: document.getElementById('close-menu'),
            nav: document.getElementById('main-nav'),
            links: document.querySelectorAll('#main-nav a')
        };
    }

    /**
     * Initializes menu logic if elements exist (e.g., might be missing on thank-you page).
     */
    init() {
        // Guard clause: If critical elements are missing, abort.
        if (!this.elements.toggle || !this.elements.nav) return;
        this.bindEvents();
    }

    /**
     * Binds click events for opening and closing the menu.
     */
    bindEvents() {
        this.elements.toggle.addEventListener('click', () => this.open());
        
        if (this.elements.close) {
            this.elements.close.addEventListener('click', () => this.close());
        }
        
        this.elements.links.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }

    /**
     * Opens the mobile navigation menu.
     * Disables background scrolling.
     */
    open() {
        this.elements.nav.classList.add('nav-open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    /**
     * Closes the mobile navigation menu.
     * Restores background scrolling.
     */
    close() {
        this.elements.nav.classList.remove('nav-open');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Initialize logic when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager().init();
    new MenuManager().init();
});
