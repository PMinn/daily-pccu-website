function detectingDarkMode(fn) {
    if (!window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    fn(query.matches);
    query.addEventListener('change', (event) => fn(event.matches));
}
export { detectingDarkMode };