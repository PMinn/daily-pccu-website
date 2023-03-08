var isOpened = false;
const nav = document.querySelector('nav');
if (window.innerWidth <= 600) {
    document.getElementById('nav_btn').addEventListener('click', function () {
        if (isOpened) {
            nav.classList.remove('opened');
            isOpened = false;
        } else {
            nav.classList.add('opened');
            isOpened = true;
        }
    })
}