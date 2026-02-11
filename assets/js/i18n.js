/**
 * Internationalization (i18n) Manager
 *
 * Purpose: Handles language switching, persistence of user preference,
 *          and dynamic text updates based on the selected locale.
 *
 * Dependencies:
 * - assets/js/lang.js (provides the 'translations' object)
 *
 * Author: Emilio De La Peña Chacón
 */
class I18nManager {
    /**
     * Initializes the I18nManager instance.
     * Sets up default configuration and DOM element references.
     */
    constructor() {
        this.storageKey = 'locale';
        this.defaultLocale = 'en-GB';
        this.supportedLocales = ['en-GB', 'es-ES'];
        this.currentLocale = this.defaultLocale;
        this.elements = {
            toggle: document.getElementById('lang-toggle'),
            indicator: document.getElementById('lang-current')
        };
    }

    /**
     * Bootstraps the localization logic.
     * Loads preference, applies translations, and sets up event listeners.
     */
    init() {
        this.loadPreference();
        this.applyTranslations();
        this.updateToggleState();
        this.bindEvents();

        // Sync the HTML lang attribute with current locale for accessibility/SEO
        document.documentElement.lang = this.currentLocale === 'en-GB' ? 'en' : 'es';
    }

    /**
     * Loads the user's language preference from localStorage.
     * Falls back to default if no valid preference is found.
     */
    loadPreference() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored && this.supportedLocales.includes(stored)) {
            this.currentLocale = stored;
        } else {
            this.currentLocale = this.defaultLocale;
        }
    }

    /**
     * Toggles the current language between supported locales.
     * Persists the change and updates the UI immediately.
     */
    toggle() {
        this.currentLocale = this.currentLocale === 'en-GB' ? 'es-ES' : 'en-GB';
        this.savePreference();
        this.applyTranslations();
        this.updateToggleState();

        // Sync the HTML lang attribute
        document.documentElement.lang = this.currentLocale === 'en-GB' ? 'en' : 'es';
    }

    /**
     * Persists the current locale to localStorage.
     */
    savePreference() {
        localStorage.setItem(this.storageKey, this.currentLocale);
    }

    /**
     * Updates all DOM elements marked for translation.
     * Handles text content, aria-labels, and placeholders.
     */
    applyTranslations() {
        const localeData = translations[this.currentLocale];
        if (!localeData) return;

        // Update elements with text content (data-i18n)
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (localeData[key]) {
                element.innerHTML = localeData[key];
            }
        });

        // Update elements with aria-label (data-i18n-aria)
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            if (localeData[key]) {
                element.setAttribute('aria-label', localeData[key]);
            }
        });

        // Update elements with placeholder (data-i18n-placeholder)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (localeData[key]) {
                element.setAttribute('placeholder', localeData[key]);
            }
        });
    }

    /**
     * Updates the visual state of the language toggle button.
     * Sets the visible text and accessible label based on the active locale.
     */
    updateToggleState() {
        if (this.elements.indicator) {
            this.elements.indicator.textContent = this.currentLocale === 'en-GB' ? 'EN' : 'ES';
        }
        if (this.elements.toggle) {
            // Retrieve the localized aria-label for the toggle button
            const localeData = translations[this.currentLocale];
            if (localeData && localeData['aria_lang_toggle']) {
                this.elements.toggle.setAttribute('aria-label', localeData['aria_lang_toggle']);
            }
        }
    }

    /**
     * Binds click events to the language toggle button.
     */
    bindEvents() {
        if (this.elements.toggle) {
            this.elements.toggle.addEventListener('click', () => this.toggle());
        }
    }
}

// Initialize the I18nManager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new I18nManager().init();
});
