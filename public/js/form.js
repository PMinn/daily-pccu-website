import 'https://static.line-scdn.net/liff/edge/2/sdk.js'

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'
import { getStorage, ref as storageRef, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

const app = initializeApp({
    apiKey: "AIzaSyCPq-VtQask8BdUmwojqfp4tq_WbkTlbEw",
    authDomain: "daily-pccu.firebaseapp.com",
    databaseURL: "https://daily-pccu-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "daily-pccu",
    storageBucket: "daily-pccu.appspot.com",
    messagingSenderId: "805313945825",
    appId: "1:805313945825:web:a966b8c9d9902dbca417a0",
    measurementId: "G-FV6BTQPGNN"
});
const storage = getStorage(app);

const submit = document.getElementById('submit');
var uploadJobsCount = 0;

function init() {
    return liff.init({
        liffId: '1655168208-9NvVk86X'
    });
}

async function getUserId() {
    var userId = await liff.getContext().userId;
    return userId;
}

init()
    .then(getUserId)
    .then(userId => document.getElementById('uuid').value = userId)
    .catch(() => {
        alert('獲取line權限失敗');
        liff.closeWindow();
    })

function getBase64(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    })
}

function saveImage(file, DOMs) {
    return new Promise((resolve, reject) => {
        const gsPath = `form/${new Date().getTime()}-${file.name}`;
        const formRef = storageRef(storage, gsPath);
        uploadBytesResumable(formRef, file).on('state_changed', snapshot => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes;
            DOMs.progress.style.transform = `scaleX(${progress})`;
        }, reject, () => {
            resolve(gsPath);
        });
    })
}

document.getElementById('image').addEventListener('change', e => {
    if (e.target.files.length == 1) {
        var file = e.target.files[0];
        uploadJobsCount++;
        submit.setAttribute('disabled', 'disabled');
        getBase64(file)
            .then(base64 => {
                var imgItem = document.createElement('div');
                imgItem.classList.add('img-item');

                var progress = document.createElement('div');
                progress.classList.add('progress');

                var imgData = document.createElement('div');
                imgData.classList.add('img-data');

                var imgBlock = document.createElement('div');
                imgBlock.classList.add('img-block');

                var img = document.createElement('img');
                img.src = base64;

                var name = document.createElement('div');
                name.innerText = file.name;

                imgBlock.appendChild(img);
                imgData.appendChild(imgBlock);
                imgData.appendChild(name);
                imgItem.appendChild(progress);
                imgItem.appendChild(imgData);
                document.getElementById('file_block').appendChild(imgItem);
                saveImage(file, { imgItem, progress, imgData, imgBlock, img, name })
                    .then(gsPath => {
                        imgItem.dataset.path = gsPath;
                        uploadJobsCount--;
                        setTimeout(() => {
                            progress.style.backgroundColor = 'var(--fourth-color)';
                            if (uploadJobsCount == 0) submit.removeAttribute('disabled');
                        }, 500)
                    })
                    .catch(error => {
                        uploadJobsCount--;
                        alert('上傳失敗');
                        imgItem.remove();
                    })
                    .finally(() => window.scrollTo(0, document.body.scrollHeight));
            })
    }
})


submit.addEventListener('click', () => {
    submit.setAttribute('disabled', 'disabled');
    const typeValue = document.querySelector('input[name="radio_group"]:checked').value;
    const contentValue = document.getElementById('content').value;
    const imagesValue = Array.from(document.querySelectorAll('.img-item')).map(imgItem => imgItem.dataset.path);
    const uuidValue = document.getElementById('uuid').value;
    Promise.all([fetch('https://script.google.com/macros/s/AKfycbwP6matTZHqEB27idX-9M_9jnrah32rM41rjXSgcVdauqKQmIwg90bR_e3jXu2IELSFcA/exec', {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ typeValue, contentValue, imagesValue, uuidValue })
    }), packEnvelopeAnimation()])
        .then(sendEnvelopeAnimation)
        .catch(() => alert('送出失敗'))
        .finally(() => liff.closeWindow())
})

function packEnvelopeAnimation() {
    return new Promise((resolve, reject) => {
        document.querySelector('.envelope').style.display = 'block';
        setTimeout(() => {
            document.querySelector('.envelope-body').style.left = '0';
            setTimeout(() => {
                setTimeout(() => document.querySelector('.container').style.opacity = '0', 500);
                document.querySelector('.envelope-cover').style.transform = 'rotateY(0)';
                setTimeout(() => {
                    document.querySelector('.envelope').style.transform = 'scale(0.5)';
                    setTimeout(resolve, 2000)
                }, 1000)
            }, 500)
        }, 10)
    })
}

function sendEnvelopeAnimation() {
    return new Promise((resolve, reject) => {
        document.querySelector('.envelope').style.transform = 'scale(0.5) rotateX(85deg)';
        setTimeout(() => {
            document.querySelector('.envelope').style.transform = 'scale(0) rotateX(85deg)';
            document.querySelector('.envelope').style.top = '-40vh';
            setTimeout(resolve, 2000)
        }, 1000)
    })
}