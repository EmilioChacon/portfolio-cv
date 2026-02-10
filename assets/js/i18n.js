class I18nManager {
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

    init() {
        this.loadPreference();
        this.applyTranslations();
        this.updateToggleState();
        this.bindEvents();
        
        // Update html lang attribute
        document.documentElement.lang = this.currentLocale === 'en-GB' ? 'en' : 'es';
    }

    loadPreference() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored && this.supportedLocales.includes(stored)) {
            this.currentLocale = stored;
        } else {
            this.currentLocale = this.defaultLocale;
        }
    }

    toggle() {
        this.currentLocale = this.currentLocale === 'en-GB' ? 'es-ES' : 'en-GB';
        this.savePreference();
        this.applyTranslations();
        this.updateToggleState();
        
        // Update html lang attribute
        document.documentElement.lang = this.currentLocale === 'en-GB' ? 'en' : 'es';
    }

    savePreference() {
        localStorage.setItem(this.storageKey, this.currentLocale);
    }

    applyTranslations() {
        const localeData = translations[this.currentLocale];
        if (!localeData) return;

        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (localeData[key]) {
                element.innerHTML = localeData[key];
            }
        });

        // Update elements with data-i18n-aria
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            if (localeData[key]) {
                element.setAttribute('aria-label', localeData[key]);
            }
        });

        // Update elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (localeData[key]) {
                element.setAttribute('placeholder', localeData[key]);
            }
        });
    }

    updateToggleState() {
        if (this.elements.indicator) {
            this.elements.indicator.textContent = this.currentLocale === 'en-GB' ? 'EN' : 'ES';
        }
        if (this.elements.toggle) {
             const ariaKey = this.currentLocale === 'en-GB' ? 'aria_lang_toggle' : 'aria_lang_toggle'; 
             // Logic: If current is EN, button switches to ES, so label should be "Switch to Spanish"
             // My translation keys are: "aria_lang_toggle": "Switch to Spanish" (in EN)
             // In ES: "aria_lang_toggle": "Cambiar a inglés"
             // So I can just use the translation key directly.
             const localeData = translations[this.currentLocale];
             if (localeData && localeData['aria_lang_toggle']) {
                 this.elements.toggle.setAttribute('aria-label', localeData['aria_lang_toggle']);
             }
        }
    }

    bindEvents() {
        if (this.elements.toggle) {
            this.elements.toggle.addEventListener('click', () => this.toggle());
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new I18nManager().init();
});
