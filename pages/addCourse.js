import Head from 'next/head';
import NavComponent from '../components/NavComponent';
import FooterComponent from '../components/FooterComponent';
import ConfirmComponent from '../components/ConfirmComponent';
import LoadingComponent from '../components/LoadingComponent';
import TextareaComponent from '../components/TextareaComponent';
import CourseCardComponent from '../components/CourseCardComponent';
import { useState } from 'react';
import useSWR from 'swr';

import styles from '../styles/addCourse.module.css';

import { app } from '../js/firebaseConfig.js';
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const database = getDatabase(app);
const firestore = getFirestore(app);

function fetchConfig() {
    return get(ref(database, 'courseConfig/')).then(snapshot => snapshot.val())
}

export default function Course({ theme, setTheme }) {
    const { data: courseConfig, error: courseConfigError } = useSWR("/courseConfig", fetchConfig);
    const [className, setClassName] = useState("");
    const [categoryType, setCategoryType] = useState(1);
    const [generalType, setGeneralType] = useState(1);
    const [teacher, setTeacher] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear() - 1911);
    const [department, setDepartment] = useState("");
    const [college, setCollege] = useState("商學院");
    const [point, setPoint] = useState(60);
    const [tempPoint, setTempPoint] = useState(60);
    const [way, setWay] = useState("");
    const [exam, setExam] = useState({ exam1: false, exam2: false, exam3: false, exam4: false, exam5: false, exam6: false });
    const [evaluation, setEvaluation] = useState("");
    const generalTypeString = ['人文', '社會', '自然'];
    const examString = ['期中報告', '期中作業', '期中考試', '期末報告', '期末作業', '期末考試'];

    const [confirmShow, setConfirmShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [data, setData] = useState({
        className: '',
        teacher: [],
        year: 0,
        department: '',
        college: '',
        point: 0,
        way: '',
        evaluation: '',
        date: '',
        category: '',
        exam: ''
    });


    function classNameOnInput(e) {
        setClassName(e.target.value);
        document.getElementById('className').classList.remove('is-invalid');
    }

    function teacherOnChange(e) {
        setTeacher(e.target.value.replace(/ /gi, '').split(','));
        document.getElementById('teacher').classList.remove('is-invalid');
    }

    function departmentOnInput(e) {
        setDepartment(e.target.value);
        document.getElementById('department').classList.remove('is-invalid');
    }

    function yearOnBlur(e) {
        try {
            var tYear = parseInt(e.target.value);
            if (tYear < new Date().getFullYear() - 1911 - 5 || tYear > new Date().getFullYear() - 1911) {
                setYear(new Date().getFullYear() - 1911);
            }
        } catch {
            setYear(new Date().getFullYear() - 1911);
        }
    }

    function pointOnBlur(e) {
        try {
            var tPoint = parseInt(e.target.value);
            if (tPoint <= 100 && tPoint >= 0) {
                setPoint(tPoint);
                setTempPoint(tPoint);
            } else {
                setTempPoint(point);
            }
        } catch {
            setTempPoint(point);
        }
    }

    function examOnClick(e) {
        var tExam = exam;
        tExam[e.target.id] = !tExam[e.target.id];
        setExam(tExam);
        document.querySelectorAll('input[id^="exam"]').forEach(input => {
            if (tExam[input.id]) input.setAttribute('checked', 'true');
            else input.removeAttribute('checked');
        });
    }

    function submit() {
        var check = true;
        if (className == '') {
            document.getElementById('className').classList.add('is-invalid');
            check = false;
        }

        var tTeacher = teacher.filter(value => value != '');
        if (tTeacher.length == 0) {
            document.getElementById('teacher').classList.add('is-invalid');
            check = false;
        }

        if (department == '') {
            if (categoryType == 1 || categoryType == 3) {
                document.getElementById('department').classList.add('is-invalid');
                check = false;
            }
        }

        if (check) {
            var data = { className, teacher: tTeacher, year: parseInt(year), department, college, point: parseInt(point), way, evaluation, date: new Date().toISOString(), category: college };
            if (categoryType == 2) {
                data.className = `${generalTypeString[generalType - 1]}通識︰${data.className}`;
                data.category = `${generalTypeString[generalType - 1]}通識`;
                data.department = '';
                data.college = '';
            } else if (categoryType == 3) {
                data.className = `跨域︰${data.className}`;
            }
            var examArray = ['exam1', 'exam2', 'exam3', 'exam4', 'exam5', 'exam6'];
            examArray = examArray.map((id, index) => ({ v: exam[id], i: index })).filter(value => value.v).map(value => examString[value.i]);
            data.exam = examArray.join(',');
            data.evaluation = data.evaluation.replace(/\n/gi, '\\n');
            setConfirmShow(true);
            setData(data);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    async function upload() {
        setConfirmShow(false);
        setLoading(true);
        const docRef = await addDoc(collection(firestore, "evaluations"), data);
        console.log(docRef.id);
        setLoading(false);
        setSuccess(true);
    }

    return (
        <div className={styles.main + ' ' + (theme == 'dark' ? styles[theme] : '')}>
            <Head>
                {/* HTML Meta Tags  */}
                <title>新增課程評價 | 每日文大</title>
                <meta name='keywords' content='每日文大,文大bot,課程評價' />
                <meta name='description' content='文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。' />

                {/* Facebook Meta Tags */}
                {/* <meta property="og:url" content="https://daily-pccu.web.app/" /> */}
                <meta property="og:type" content="website" /> {/* article */}
                <meta property='og:title' content='新增課程評價 | 每日文大' />
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
                <meta name="twitter:title" content="新增課程評價 | 每日文大" />
                <meta name="twitter:description" content="文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。" />
                <meta name="twitter:image" content="https://daily-pccu.web.app/favicon_package/mstile-310x310.png" />
            </Head>
            <NavComponent theme={theme} setTheme={setTheme}></NavComponent>
            <ConfirmComponent title='確認新增' content={
                <CourseCardComponent e={data} isDemo={true}></CourseCardComponent>
            } size={"max"} btn={['取消', '確認']} onClick={[() => setConfirmShow(false), upload]} show={confirmShow} theme={theme}></ConfirmComponent>
            <LoadingComponent show={loading}></LoadingComponent>
            <div className={styles.outer}>
                <div className={styles.intro}>
                    <h1>新增課程評價</h1>
                    <div>
                        您可以提供課程具體的資訊、分享您的觀點，以幫助所有同學未來選課有資訊可以參考。感謝您抽出寶貴的時間新增課程評價，您的參與將幫助大家獲得更多選課參考資訊。
                    </div>
                </div>

                <div className={styles.container} id='container'>
                    <div hidden={success}>
                        <div className={"mb-3 " + styles.col}>
                            <div className={"btn-group"} role="group">
                                <input type="radio" className="btn-check" name="category" id="category1" autocomplete="off" onClick={() => setCategoryType(1)} checked={categoryType == 1} />
                                <label className="btn my-btn-outline" htmlFor="category1">一般</label>
                                <input type="radio" className="btn-check" name="category" id="category2" autocomplete="off" onClick={() => setCategoryType(2)} checked={categoryType == 2} />
                                <label className="btn my-btn-outline" htmlFor="category2">通識</label>
                                <input type="radio" className="btn-check" name="category" id="category3" autocomplete="off" onClick={() => setCategoryType(3)} checked={categoryType == 3} />
                                <label className="btn my-btn-outline" htmlFor="category3">跨域</label>
                            </div>
                        </div>
                        <div className={"mb-3 " + styles.col} hidden={categoryType != 2}>
                            <div className={"btn-group"} role="group">
                                <input type="radio" className="btn-check" name="generalType" id="generalType1" autocomplete="off" onClick={() => setGeneralType(1)} checked={generalType == 1} />
                                <label className="btn my-btn-outline" htmlFor="generalType1">人文</label>
                                <input type="radio" className="btn-check" name="generalType" id="generalType2" autocomplete="off" onClick={() => setGeneralType(2)} checked={generalType == 2} />
                                <label className="btn my-btn-outline" htmlFor="generalType2">社會</label>
                                <input type="radio" className="btn-check" name="generalType" id="generalType3" autocomplete="off" onClick={() => setGeneralType(3)} checked={generalType == 3} />
                                <label className="btn my-btn-outline" htmlFor="generalType3">自然</label>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="className" className="form-label">課程名稱</label>
                            <input type="text" className={'form-control my-form-control'} id="className" onInput={classNameOnInput} value={className} />
                            <div class="invalid-feedback">課程名稱為必填</div>
                            <div class="form-text" data-bs-theme={theme}>{(categoryType == 1 ? '' : (categoryType == 2 ? '不須包含 "自然通識︰"、"社會通識︰" 或 "人文通識︰"' : '不須包含 "跨域︰"'))}</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="teacher" className="form-label">授課教師</label>
                            <input type="text" className={'form-control my-form-control'} id="teacher" onChange={teacherOnChange} value={teacher.join(',')} />
                            <div class="invalid-feedback">授課教師為必填</div>
                            <div class="form-text" data-bs-theme={theme}>多位教師請使用半形逗號(,)分隔</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="year" className="form-label">開課學年</label>
                            <input type="number" className={'form-control my-form-control'} id="year" min={new Date().getFullYear() - 1911 - 5} max={new Date().getFullYear() - 1911} step={1} value={year} onChange={e => setYear(e.target.value)} onBlur={yearOnBlur} />
                        </div>
                        <div className="mb-3" hidden={categoryType == 2}>
                            <label htmlFor="department" className="form-label">開課系別</label>
                            <input type="text" className={'form-control my-form-control'} id="department" placeholder={"可使用簡稱"} onInput={departmentOnInput} value={department} />
                            <div class="invalid-feedback">開課系別為必填</div>
                        </div>
                        <div className="mb-3" hidden={categoryType == 2}>
                            <label className="form-label">開課系所屬之院別</label>
                            {
                                (
                                    courseConfig ?
                                        courseConfig.colleges.filter(c => !c.includes('通識')).map((c, i) => {
                                            return (
                                                <div className={'form-check ' + styles['college-check']}>
                                                    <input className={"form-check-input my-form-check-input"} type="radio" name="college" id={'college_' + i} onClick={() => setCollege(c)} checked={college == c} />
                                                    <label className="form-check-label" htmlFor={'college_' + i}>{c}</label>
                                                </div>
                                            )
                                        })
                                        :
                                        <></>
                                )
                            }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="point" className="form-label">課程評分</label>
                            <input type="number" className={'form-control my-form-control'} id="point" min={0} max={100} step={1} value={tempPoint} onChange={e => setTempPoint(e.target.value)} onBlur={pointOnBlur} />
                        </div>
                        <div className="mb-3" >
                            <label htmlFor="way" className="form-label">授課方式</label>
                            <input type="text" className={'form-control my-form-control'} id="way" onChange={e => setWay(e.target.value)} />
                        </div>
                        <div className="mb-3" >
                            <label className="form-label">考試模式(可複選)</label>
                            <div className={styles['checkbox-group']}>
                                <input type="checkbox" name="exam" id="exam1" onClick={examOnClick} />
                                <label htmlFor="exam1">期中報告</label>
                                <input type="checkbox" name="exam" id="exam2" onClick={examOnClick} />
                                <label htmlFor="exam2">期中作業</label>
                                <input type="checkbox" name="exam" id="exam3" onClick={examOnClick} />
                                <label htmlFor="exam3">期中考試</label>
                                <input type="checkbox" name="exam" id="exam4" onClick={examOnClick} />
                                <label htmlFor="exam4">期末報告</label>
                                <input type="checkbox" name="exam" id="exam5" onClick={examOnClick} />
                                <label htmlFor="exam5">期末作業</label>
                                <input type="checkbox" name="exam" id="exam6" onClick={examOnClick} />
                                <label htmlFor="exam6">期末考試</label>
                            </div>
                        </div>
                        <div className={"mb-3 " + styles['textarea-block']}>
                            <label htmlFor="evaluation" className="form-label">課程評語</label>
                            <TextareaComponent rows={4} value={[evaluation, setEvaluation]} theme={theme}></TextareaComponent>
                        </div>
                        <div className="mb-3 mt-3">
                            <div class="form-text" data-bs-theme={theme}>請以客觀且不具辱罵及攻擊性的字眼填寫</div>
                        </div>
                        <div className="mb-3">
                            <div className={"my-btn my-btn-second " + styles.submit} onClick={submit}>完成</div>
                        </div>
                    </div>
                    <div className={styles.success} style={{ display: (!success ? 'none' : '') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M243.33,90.91,114.92,219.31a16,16,0,0,1-22.63,0l-71.62-72a16,16,0,0,1,0-22.61l24-24a16,16,0,0,1,22.57-.06l36.64,35.27.11.11h0l92.73-91.37a16,16,0,0,1,22.58,0l24,23.56A16,16,0,0,1,243.33,90.91Z"></path></svg>
                        <div>成功</div>
                    </div>
                </div>
            </div>
            <FooterComponent></FooterComponent>
        </div >
    )
}