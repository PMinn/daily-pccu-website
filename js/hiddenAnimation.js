function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
};

function checkHidden() {
    document.querySelectorAll('.hidden').forEach((hiddenDOM, index) => {
        if (isElementInViewport(hiddenDOM))
            setTimeout(() => hiddenDOM.classList.remove('hidden'), index * 500);
    })
};

const hiddenAnimation = {
    start: function () {
        checkHidden();
        window.addEventListener("scroll", checkHidden);
    }
}