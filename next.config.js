const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
    var nextConfig = {
        output: 'export',

        // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
        // trailingSlash: true,

        // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
        // skipTrailingSlashRedirect: true,

        // Optional: Change the output directory `out` -> `dist`
        // distDir: 'dist',

        env: {},
    };
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        nextConfig.env.UUID = process.env.UUID;
        nextConfig.env.SETTINGS_LIFF_ID = process.env.SETTINGS_LIFF_ID;
        nextConfig.env.FORM_LIFF_ID = process.env.FORM_LIFF_ID;
    }
    return nextConfig;
}