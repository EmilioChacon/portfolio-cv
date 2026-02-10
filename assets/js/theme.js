/**
 * Theme Strategy Interface
 * Defines the contract for applying theme variations.
 */
const ThemeStrategies = {
    dark: {
        apply(elements) {
            elements.body.classList.add('dark-mode');
            elements.icon.innerHTML = '&#9728;'; // Sun Icon
            elements.toggle.setAttribute('aria-label', 'Switch to light mode');
        }
    },
    light: {
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

    init() {
        this.loadPreference();
        this.apply();
        this.bindEvents();
    }

    loadPreference() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            this.currentTheme = stored;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
        }
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.apply();
        this.save();
    }

    apply() {
        const strategy = ThemeStrategies[this.currentTheme];
        if (strategy) {
            strategy.apply(this.elements);
        }
    }

    save() {
        localStorage.setItem(this.storageKey, this.currentTheme);
    }

    bindEvents() {
        if (this.elements.toggle) {
            this.elements.toggle.addEventListener('click', () => this.toggle());
        }

        // Scroll Logic: Throttling via requestAnimationFrame could be added if heavy logic existed,
        // but for a single class toggle, direct handling with passive listener is efficient enough.
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    handleScroll() {
        const threshold = 10;
        const isScrolled = window.scrollY > threshold;
        
        // Efficient class toggle: only writes if changed
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
 * Handles mobile menu interactions.
 */
class MenuManager {
    constructor() {
        this.elements = {
            toggle: document.getElementById('menu-toggle'),
            close: document.getElementById('close-menu'),
            nav: document.getElementById('main-nav'),
            links: document.querySelectorAll('#main-nav a')
        };
    }

    init() {
        // If elements don't exist (e.g. on thank you page), skip
        if (!this.elements.toggle || !this.elements.nav) return;
        this.bindEvents();
    }

    bindEvents() {
        this.elements.toggle.addEventListener('click', () => this.open());
        
        if (this.elements.close) {
            this.elements.close.addEventListener('click', () => this.close());
        }
        
        this.elements.links.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }

    open() {
        this.elements.nav.classList.add('nav-open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    close() {
        this.elements.nav.classList.remove('nav-open');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager().init();
    new MenuManager().init();
});
