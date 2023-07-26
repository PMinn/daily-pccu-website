import Head from 'next/head'
import NavComponent from '../../components/NavComponent';
import FooterComponent from '../../components/FooterComponent';
import LoadingComponent from '../../components/LoadingComponent';
import ConfirmComponent from '../../components/ConfirmComponent';
import CourseCardComponent from '../../components/CourseCardComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import styles from '../../styles/course.module.css';
import coverStyles from '../../styles/cover.module.css';

import { app } from '../../js/firebaseConfig.js';
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";

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
    // if (pathname == '/course/[[...params]]') return { title: '', data: [] };
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
    return { title: '課程評價 | 每日文大', data: [] };
}

function fetchConfig() {
    return get(ref(database, 'courseConfig/')).then(snapshot => snapshot.val())
}

export default function Course({ theme, setTheme }) {
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
        if (data && data.data.length != 0) {
            var keyWord = e.target.value;
            document.querySelectorAll('#blocks>*').forEach(block => {
                if (block.innerText.includes(keyWord)) block.removeAttribute('hidden');
                else block.setAttribute('hidden', 'true');
            })
        } else {
            e.target.value = '';
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

    useEffect(() => {
        if (location.host == 'daily-pccu.web.app') getAnalytics(app);
    }, [])

    return (
        <div className={styles.main + ' ' + (theme == 'dark' ? styles[theme] : '')}>
            <Head>
                {/* HTML Meta Tags  */}
                <title>{data ? data.title : "課程評價 | 每日文大"}</title>
                <meta name='keywords' content='每日文大,文大bot,課程評價' />
                <meta name='description' content='文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。' />

                {/* Facebook Meta Tags */}
                {/* <meta property="og:url" content="https://daily-pccu.web.app/" /> */}
                <meta property="og:type" content="website" /> {/* article */}
                {(data ? <meta property="og:title" content={data.title} /> : <meta property="og:title" content="課程評價 | 每日文大" />)}
                <meta property='og:description' content='文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。' />
                <meta property="og:image" content="https://daily-pccu.web.app/favicon_package/mstile-310x310.png" />
                {/*
                    檔案大小：< 8MB
                    檔案尺寸：建議尺寸 1200x630
                    對於圖片的內容 FB 有提供 圖像文字檢查工具 的網站，協助檢測。
                    網址的 url 一定要使用絕對路徑
                */}

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="app" /> {/* summary, summary_large_image, app, player */}
                <meta property="twitter:domain" content="daily-pccu.web.app" />
                {/* <meta property="twitter:url" content="https://daily-pccu.web.app/" /> */}
                {(data ? <meta property="twitter:title" content={data.title} /> : <meta property="twitter:title" content="課程評價 | 每日文大" />)}
                <meta name="twitter:description" content="文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。" />
                <meta name="twitter:image" content="https://daily-pccu.web.app/favicon_package/mstile-310x310.png" />
            </Head>
            <NavComponent theme={theme} setTheme={setTheme}></NavComponent>
            <LoadingComponent show={loading}></LoadingComponent>
            <ConfirmComponent theme={theme} title='審查' content={
                <div className={styles.revelation}>
                    <label><input type="radio" name="revelation" value="內容有誤" />內容有誤</label>
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
                <div className={styles.success}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M243.33,90.91,114.92,219.31a16,16,0,0,1-22.63,0l-71.62-72a16,16,0,0,1,0-22.61l24-24a16,16,0,0,1,22.57-.06l36.64,35.27.11.11h0l92.73-91.37a16,16,0,0,1,22.58,0l24,23.56A16,16,0,0,1,243.33,90.91Z"></path></svg>
                    <div>成功</div>
                </div>
            } btn={['確認']} onClick={[() => setSuccessConfirmShow(false)]} show={successConfirmShow}></ConfirmComponent>
            <ConfirmComponent title='分享錯誤' content={<div>{shareErrorText}</div>} btn={['確認']} onClick={[() => setShareErrorConfirmShow(false)]} show={shareErrorConfirmShow}></ConfirmComponent>
            <div className={styles.page}>
                <aside className={styles.aside + ' ' + (openMenu ? styles.open : '')} >
                    <div id={styles.menu}>
                        <div className={styles.close} onClick={() => setOpenMenu(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                        </div>
                        <div className={styles['collapse-scroll']}>
                            {
                                (courseConfig ?
                                    courseConfig.years.map(year => {
                                        return (
                                            <div id={'y_' + year} key={'y_' + year}>
                                                <button className={"collapsed " + styles["year-label"]} type="button" id={'label_' + year} data-bs-toggle="collapse" role="button" aria-expanded="false" data-bs-target={"#collapse_" + year} aria-controls={"collapse_" + year}>
                                                    <div>{year}學年</div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M236.78,211.81A24.34,24.34,0,0,1,215.45,224H40.55a24.34,24.34,0,0,1-21.33-12.19,23.51,23.51,0,0,1,0-23.72L106.65,36.22a24.76,24.76,0,0,1,42.7,0L236.8,188.09A23.51,23.51,0,0,1,236.78,211.81Z"></path></svg>
                                                </button>
                                                <div className={"collapse " + styles['colleges-list']} id={"collapse_" + year}>
                                                    {courseConfig.colleges.map((college, index) => {
                                                        return (
                                                            <Link href={`/course/${year}/college/${college}`} className={styles['college-link']} key={'college_link_' + index} onClick={() => setOpenMenu(false)}>{college}</Link>
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
                        <Link href="/addCourse" className={'my-btn my-btn-first ' + styles['add-btn']} target='_blank'>新增評價</Link>
                    </div>
                    <div className={coverStyles.cover + ' ' + styles.cover}></div>

                </aside>
                <div className={styles['menu-mobile-btn']} onClick={() => setOpenMenu(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path></svg>
                </div>
                <main className={styles.result + ' ' + (!data || data.data.length == 0 ? styles['no-result'] : '')}>
                    <label className={styles['search-bar']} htmlFor="search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
                        <input type="text" id="search" onInput={search} placeholder="搜尋" />
                    </label>
                    <div id="blocks">
                        {
                            (data ?
                                (data.data.length != 0 ?
                                    data.data.map(e => {
                                        return (
                                            <div className={styles.courseCard}>
                                                <CourseCardComponent e={e} theme={theme} setRevelationConfirmShow={setRevelationConfirmShow} setRevelationID={setRevelationID}></CourseCardComponent>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className={styles['no-result-text']}>
                                        <div>沒有結果</div>
                                        <div>在選單中，依照年份及院別可查詢其他評價。</div>
                                    </div>
                                )
                                :
                                <LoadingComponent show={true}></LoadingComponent>
                            )
                        }
                    </div>
                </main>
            </div>
            <FooterComponent></FooterComponent>
        </div >
    )
}