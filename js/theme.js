function detectingDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
    return localStorage.getItem('theme');
}

function setStoredTheme(theme) {
    return localStorage.setItem('theme', theme);
}

export { detectingDarkMode, getStoredTheme, setStoredTheme };