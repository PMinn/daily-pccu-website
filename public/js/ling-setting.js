async function start() {
    var userId = await window.liff.getContext().userId;
    console.log(userId)
}

function init() {
    if (window.liff) {
        console.log(window.liff)

        window.liff.init({ liffId: '1655168208-DL1V4lM5' }).then(start);
        clearInterval(init);
    }
}

// setInterval(init, 1000);
init();