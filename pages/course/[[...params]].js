import Head from 'next/head'
import NavComponent from '../../components/NavComponent';
import FooterComponent from '../../components/FooterComponent';
import LoadingComponent from '../../components/LoadingComponent';
import ConfirmComponent from '../../components/ConfirmComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import useSWR from 'swr';

import { app } from '../../js/firebaseConfig.js';
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

const database = getDatabase(app);
const firestore = getFirestore(app);

async function fetchFirestoreWithYear(year, type, keyword) {
    var q;
    if (type == 'college') {
        q = query(collection(firestore, "evaluations"), where("year", "==", parseInt(year)), where('category', '==', keyword));
    } else if (type == 'teacher') {
        q = query(collection(firestore, "evaluations"), where("year", "==", parseInt(year)), where('teacher', 'array-contains', keyword));
    } else return [];
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        var d = [];
        querySnapshot.forEach(doc => {
            var docData = doc.data();
            docData.id = doc.id;
            d.push(docData);
        });
        return d;
    } else return [];
}

async function fetchFirestoreById(id) {
    const docSnap = await getDoc(doc(firestore, "evaluations", id));
    if (docSnap.exists()) {
        var data = docSnap.data();
        data.id = id;
        return [data];
    }
    return [];
}

async function fetchDatabase(pathname) {
    pathname = decodeURI(pathname);
    if (pathname == '/course/[[...params]]') return { title: '', data: [] };
    var pathArray = decodeURI(pathname).split('/');
    if (pathArray.length == 5) { // '/course/109/college/%E5%95%86%E5%AD%B8%E9%99%A2'
        return {
            title: `${pathArray[4]}-${pathArray[2]}學年-課程評價 | 每日文大`,
            data: await fetchFirestoreWithYear(pathArray[2], pathArray[3], pathArray[4])
        }
    } else if (pathArray.length == 3) { // '/course/-MTyASIvwwbHs9Vz-fu9'
        return {
            title: '課程評價 | 每日文大',
            data: await fetchFirestoreById(pathArray[2])
        }
    }
    return { title: '', data: [] };
}

function fetchConfig() {
    return get(ref(database, 'courseConfig/')).then(snapshot => snapshot.val())
}

export default function Course() {
    const [loading, setLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [revelationConfirmShow, setRevelationConfirmShow] = useState(false);
    const [successConfirmShow, setSuccessConfirmShow] = useState(false);
    const [revelationID, setRevelationID] = useState("");
    const [shareErrorConfirmShow, setShareErrorConfirmShow] = useState(false);
    const [shareErrorText, setShareErrorText] = useState("");

    const router = useRouter();
    var pathname = router.asPath.replace(/([^#]+)#[^#]+/g, "$1");
    const { data, error: dataError } = useSWR(pathname, fetchDatabase);
    const { data: courseConfig, error: courseConfigError } = useSWR("/courseConfig", fetchConfig);

    function search(e) {
        var keyWord = e.target.value;
        document.querySelectorAll('.block').forEach(block => {
            if (block.innerText.includes(keyWord)) block.style.display = 'block';
            else block.style.display = 'none';
        })
    }

    function openCollapse(year) {
        var collapseLabel = document.getElementById('label_' + year);
        if (collapseLabel.classList.contains('open')) {
            collapseLabel.classList.remove('open');
            document.getElementById("y_" + year).classList.remove('open');
        } else {
            collapseLabel.classList.add('open');
            document.getElementById("y_" + year).classList.add('open');
        }
    }

    async function submitRevelation() {
        var checkedInput = document.querySelector('input[name="revelation"]:checked');
        if (checkedInput) {
            setRevelationConfirmShow(false);
            setLoading(true);
            await fetch('https://script.google.com/macros/s/AKfycbwuhzDzw6RN6-pMb11lomwj0QEKwLYXIZaCfDiKO_QvI_FyIss6ogJ6CKoDnF2Mr_Q/exec', {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain; charset=utf-8"
                },
                body: JSON.stringify({
                    id: revelationID,
                    reason: checkedInput.value
                })
            })
            setLoading(false);
            setSuccessConfirmShow(true);
        }
    }

    function shareOnClick(shareData) {
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    console.log('Thanks for sharing!');
                })
                .catch(() => {
                    setShareErrorConfirmShow(true);
                    setShareErrorText('分享失敗，請再試一次。');
                });
        } else {
            setShareErrorConfirmShow(true);
            setShareErrorText('您的瀏覽器不支援分享功能，請使用其他瀏覽器。');
        }
    }
    return (
        <div>
            <Head>
                <link rel="stylesheet" href="/css/course.css" />

                {(data ? <title>{data.title}</title> : <title>課程評價 | 每日文大</title>)}
                <meta name="keywords" content="每日文大,文大bot,課程評價" />
                {(data ? <meta property="og:title" content={data.title} /> : <meta property="og:title" content="課程評價 | 每日文大" />)}

                <meta name="description" content="文大學生必看的每日課程評價網站，探索每日文大的課程評價，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。" />
                <meta property="og:description" content="文大學生必看的每日課程評價網站，探索每日文大的課程評價，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。" />
            </Head>
            <NavComponent></NavComponent>
            <LoadingComponent show={loading}></LoadingComponent>
            <ConfirmComponent title='審查' content={
                <div className='revelation'>
                    <label><input type="radio" name="revelation" value="中傷、歧視或謾罵他人" />中傷、歧視或謾罵他人</label>
                    <label><input type="radio" name="revelation" value="傳播個資(電話、電郵、任何軟體ID等)" />傳播個資(電話、電郵、任何軟體ID等)</label>
                    <label><input type="radio" name="revelation" value="重複張貼" />重複張貼</label>
                    <label><input type="radio" name="revelation" value="包含色情、血腥、騷擾等令人不適之內容" />包含色情、血腥、騷擾等令人不適之內容</label>
                    <label><input type="radio" name="revelation" value="包含廣告、商業宣傳之內容" />包含廣告、商業宣傳之內容</label>
                    <label><input type="radio" name="revelation" value="內容明顯無意義" />內容明顯無意義</label>
                    <label><input type="radio" name="revelation" value="其他原因" />其他原因</label>
                </div>
            } btn={['取消', '確認']} onClick={[() => setRevelationConfirmShow(false), submitRevelation]} show={revelationConfirmShow}></ConfirmComponent>
            <ConfirmComponent title='' content={
                <div className='success'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M243.33,90.91,114.92,219.31a16,16,0,0,1-22.63,0l-71.62-72a16,16,0,0,1,0-22.61l24-24a16,16,0,0,1,22.57-.06l36.64,35.27.11.11h0l92.73-91.37a16,16,0,0,1,22.58,0l24,23.56A16,16,0,0,1,243.33,90.91Z"></path></svg>
                    <div>成功</div>
                </div>
            } btn={['確認']} onClick={[() => setSuccessConfirmShow(false)]} show={successConfirmShow}></ConfirmComponent>
            <ConfirmComponent title='分享錯誤' content={<div>{shareErrorText}</div>} btn={['確認']} onClick={[() => setShareErrorConfirmShow(false)]} show={shareErrorConfirmShow}></ConfirmComponent>
            <div className="page">
                <div className='panel'>
                    <section id="menu" className={(openMenu ? 'open' : '')}>
                        <div className="close" onClick={() => setOpenMenu(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                        </div>
                        <div className="collapse">
                            <div className="collapse-scroll">
                                {
                                    (courseConfig ?
                                        courseConfig.years.map(year => {
                                            return (
                                                <div id={'y_' + year} className="collapse-one-block" key={'y_' + year}>
                                                    <div className="collapse-label" onClick={() => openCollapse(year)} id={'label_' + year}>{year}學年
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M236.78,211.81A24.34,24.34,0,0,1,215.45,224H40.55a24.34,24.34,0,0,1-21.33-12.19,23.51,23.51,0,0,1,0-23.72L106.65,36.22a24.76,24.76,0,0,1,42.7,0L236.8,188.09A23.51,23.51,0,0,1,236.78,211.81Z"></path></svg>
                                                    </div>
                                                    <div className="collapse-area">
                                                        {courseConfig.colleges.map((college, index) => {
                                                            return (
                                                                <Link href={`/course/${year}/college/${college}`} className='college-link' key={'college_link_' + index} onClick={() => setOpenMenu(false)}>{college}</Link>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <></>
                                    )
                                }
                            </div>
                            <div className="gradient"></div>
                        </div>
                        <Link href="/addCourse" className='btn btn-first' target='_blank'>新增評價</Link>
                    </section>
                    <div className="cover"></div>
                    <div id='menu_btn' onClick={() => setOpenMenu(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path></svg>
                    </div>
                    <section id='main'>
                        <label className="search-bar" htmlFor="search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
                            <input type="text" id="search" onInput={search} placeholder="搜尋" />
                        </label>
                        <div id="blocks">
                            {
                                (data ?
                                    data.data.map(e => {
                                        return (
                                            <div className='block' key={'course_' + e.id}>
                                                <div className="title-bar">
                                                    <div className="className">{e.className}</div>
                                                    <div className='mini-btn-group'>
                                                        <div title="分享" onClick={() => shareOnClick({
                                                            title: `${e.teacher.join('和')}的${e.className} 的課程評價`,
                                                            text: `在每日文大課程評價查看${e.teacher.join('和')}的${e.className}。`,
                                                            url: 'https://daily-pccu.web.app/course/' + e.id,
                                                        })}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z"></path></svg>
                                                        </div>
                                                        <div title="審查" onClick={() => {
                                                            setRevelationConfirmShow(true);
                                                            setRevelationID(e.id);
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="department">{e.department}</div>
                                                <div className='teacher'>
                                                    {
                                                        e.teacher.map(teacher => {
                                                            return (
                                                                <Link href={`/course/${e.year}/teacher/${teacher}`} className='teacher' key={`course_${e.year}_${teacher}`}>{teacher}</Link>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="point-progress">
                                                    <div className="point-progress-bar">
                                                        <div className="point-progress-bar-value" style={{ transform: `scaleX(${e.point / 100})`, backgroundColor: (e.point >= 80 ? 'var(--green)' : (e.point >= 60 ? 'var(--yellow)' : 'var(--red)')) }}></div>
                                                    </div>
                                                    <div className="point-progress-text" style={{ color: (e.point >= 80 ? 'var(--green)' : (e.point >= 60 ? 'var(--yellow)' : 'var(--red)')) }}>{e.point}</div>
                                                </div>
                                                <div className="exam">
                                                    {
                                                        (e.exam != '' ? e.exam.split(',').map((exam, index) => <div key={'exam_' + index}>{exam}</div>) : '')
                                                    }
                                                </div>
                                                <div className="way">授課方式:<br />
                                                    {e.way}
                                                </div>
                                                <div className="evaluation">課程評語:<br />
                                                    {e.evaluation.replaceAll('\\n', '\n')}
                                                </div>
                                                <div className="date">
                                                    <div>{e.year}學年</div>
                                                    <div>{new Date(e.date).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <LoadingComponent show={true}></LoadingComponent>
                                )
                            }
                        </div>
                    </section>
                </div>
            </div>
            <FooterComponent></FooterComponent>
        </div >
    )
}