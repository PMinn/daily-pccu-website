export default function loading() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.getElementById('loading').classList.add('start');
        }, 10);
        window.addEventListener('load', function () {
            var cssVariables = getComputedStyle(document.getElementById('loading'));
            var animation_duration_sun = cssVariables.getPropertyValue('--animation-duration-sun');
            var animation_duration_build = cssVariables.getPropertyValue('--animation-duration-build');
            var animation_duration_text = cssVariables.getPropertyValue('--animation-duration-text');
            var during = parseInt(animation_duration_sun.replace('s', '')) + parseInt(animation_duration_build.replace('s', '')) + parseInt(animation_duration_text.replace('s', ''));
            setTimeout(() => {
                document.getElementById('loading').classList.add('end');
                document.body.classList.remove('noscroll');
                this.window.scrollTo(0, 0);
                resolve();
            }, during * 1000 + 1500);
        })
    })
}