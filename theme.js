document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Función para aplicar el tema
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            toggle.textContent = 'Modo Claro';
        } else {
            body.classList.remove('dark-mode');
            toggle.textContent = 'Modo Oscuro';
        }
    };

    // 1. Aplicar tema almacenado o detectar preferencia del sistema
    if (currentTheme) {
        applyTheme(currentTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Si no hay preferencia guardada, usar la preferencia del sistema
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        // Por defecto, modo claro
        applyTheme('light');
        localStorage.setItem('theme', 'light');
    }

    // 2. Manejar el clic del toggle
    toggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
});
