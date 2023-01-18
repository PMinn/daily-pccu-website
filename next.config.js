/*
export const PHASE_EXPORT = 'phase-export'
export const PHASE_PRODUCTION_BUILD = 'phase-production-build'
export const PHASE_PRODUCTION_SERVER = 'phase-production-server'
export const PHASE_DEVELOPMENT_SERVER = 'phase-development-server'
export const PHASE_TEST = 'phase-test'
*/

// const { PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
    const nextConfig = {
        images: {
            domains: ['scdn.line-apps.com', 'qr-official.line.me']
        }
    };
    // if (phase === PHASE_PRODUCTION_BUILD) { // run build
    //     nextConfig.images.loader = 'imgix';
    //     nextConfig.images.path = '/';
    //     nextConfig.images.unoptimized = true;
    // }
    return nextConfig;
}