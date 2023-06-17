import Head from 'next/head'
import NavComponent from '../components/NavComponent';
import FooterComponent from '../components/FooterComponent';
import ConfirmComponent from '../components/ConfirmComponent';
import LoadingComponent from '../components/LoadingComponent';
import React, { useEffect, useState } from 'react';

import { database, firestore } from '../js/firebaseConfig.js';
import { ref, get } from "firebase/database";
import { collection, addDoc } from "firebase/firestore";

export default function Course({ fontClass }) {
    const [collegeData, setCollegeData] = useState([]);
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
    const [confirmContent, setConfirmContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [data, setData] = useState({});


    function categoryOnClick(index) {
        document.querySelectorAll('input[id^="category"]').forEach(input => input.classList.remove('checked'));
        document.getElementById('category' + index).classList.add('checked');
        setCategoryType(index);
    }

    function generalTypeOnClick(index) {
        document.querySelectorAll('input[id^="generalType"]').forEach(input => input.classList.remove('checked'));
        document.getElementById('generalType' + index).classList.add('checked');
        setGeneralType(index);
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

    function dataToString(data) {
        return '名稱: "' + data.className + '"\n教師: ' + data.teacher.length + '位("' + data.teacher.join('","') + '")\n學年: "' + data.year + '"\n系所: "' + data.department + '"\n學院: "' + data.college + '"\n評分: "' + data.point + '"\n上課方式: "' + data.way + '"\n考試方式: "' + data.exam + '"\n評價: "' + data.evaluation + '"';
    }

    function submit() {
        var check = true;
        if (className == '') {
            document.getElementById('container').classList.add('noClassName');
            check = false;
        } else document.getElementById('container').classList.remove('noClassName');

        var tTeacher = teacher.filter(value => value != '');
        if (tTeacher.length == 0) {
            document.getElementById('container').classList.add('noTeacher');
            check = false;
        } else document.getElementById('container').classList.remove('noTeacher');
        if (categoryType == 1 || categoryType == 3) {
            if (department == '') {
                document.getElementById('container').classList.add('noDepartment');
                check = false;
            } else document.getElementById('container').classList.remove('noDepartment');
        } else document.getElementById('container').classList.remove('noDepartment');
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
            setConfirmContent(dataToString(data));
            console.log(data);
            setData(data);
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

    useEffect(() => {
        get(ref(database, 'courseConfig/colleges/'))
            .then(snapshot => {
                setCollegeData(snapshot.val().filter(value => (!value.includes('通識'))));
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <NavComponent></NavComponent>
            <Head>
                <title>新增課程評價 | 每日文大</title>
                <meta property="og:title" content="新增課程評價 | 每日文大" />
                <link rel="stylesheet" href="/css/addCourse.css" />
                <link rel="stylesheet" href="/css/confirm.css" />
            </Head>
            <ConfirmComponent title='確認新增' content={
                confirmContent.split('\n').map(line => {
                    return (
                        <div>
                            {
                                line.split('\\n').map(word => {
                                    return (<>{word}<br /></>)
                                })
                            }
                        </div>
                    )
                })
            } btn={['取消', '確認']} onClick={[() => setConfirmShow(false), upload]} show={confirmShow} ></ConfirmComponent >
            <LoadingComponent show={loading}></LoadingComponent>
            <div className="outter">
                <div className='intro'>
                    <h1>新增課程評價</h1>
                    <div>
                        您可以提供課程具體的資訊、分享您的觀點，以幫助所有同學未來選課有資訊可以參考。感謝您抽出寶貴的時間新增課程評價，您的參與將幫助大家獲得更多選課參考資訊。
                    </div>
                </div>

                <div className="container" id='container'>
                    <div style={{ display: (success ? 'none' : '') }}>
                        <div className="border radio">
                            <input type="radio" name="category" id="category1" className='checked' onClick={() => categoryOnClick(1)} />
                            <label htmlFor="category1">一般</label>
                            <input type="radio" name="category" id="category2" onClick={() => categoryOnClick(2)} />
                            <label htmlFor="category2">通識</label>
                            <input type="radio" name="category" id="category3" onClick={() => categoryOnClick(3)} />
                            <label htmlFor="category3">跨域</label>
                        </div>
                        <div className="border radio" style={{ display: (categoryType == 2 ? 'flex' : 'none') }}>
                            <input type="radio" name="generalType" id="generalType1" className='checked' onClick={() => generalTypeOnClick(1)} />
                            <label htmlFor="generalType1">人文</label>
                            <input type="radio" name="generalType" id="generalType2" onClick={() => generalTypeOnClick(2)} />
                            <label htmlFor="generalType2">社會</label>
                            <input type="radio" name="generalType" id="generalType3" onClick={() => generalTypeOnClick(3)} />
                            <label htmlFor="generalType3">自然</label>
                        </div>
                        <div className="border className" >
                            <label className="input-group" htmlFor="className">
                                <input type="text" className={fontClass} placeholder=" " id="className" onInput={e => setClassName(e.target.value)} value={className} />
                                <div className='label'>課程名稱</div>
                                <div className="note" style={{ display: (categoryType == 2 ? 'block' : 'none') }}>不須包含"自然通識︰"、"社會通識︰"或"人文通識︰"</div>
                                <div className="note" style={{ display: (categoryType == 3 ? 'block' : 'none') }}>不須包含"跨域︰"</div>
                            </label>
                        </div>
                        <div className="border teacher" >
                            <label className="input-group" htmlFor="teacher">
                                <input type="text" className={fontClass} placeholder=" " id="teacher" onChange={e => setTeacher(e.target.value.replace(/ /gi, '').split(','))} value={teacher.join(',')} />
                                <div className='label'>授課教師</div>
                                <div className="note">多位教師請使用半形逗號(,)分隔</div>
                            </label>
                        </div>
                        <div className="border" >
                            <label className="input-group" htmlFor="year">
                                <input type="number" min={new Date().getFullYear() - 1911 - 5} max={new Date().getFullYear() - 1911} step={1} value={year} id="year" onChange={e => setYear(e.target.value)} onBlur={yearOnBlur} />
                                <div className='label'>開課學年</div>
                            </label>
                        </div>
                        <div className="border department" style={{ display: ((categoryType == 1 || categoryType == 3) ? 'block' : 'none') }}>
                            <label className="input-group" htmlFor="department">
                                <input type="text" className={fontClass} placeholder=" " id="department" onInput={e => setDepartment(e.target.value)} value={department} />
                                <div className='label'>開課系別</div>
                            </label>
                        </div>
                        <div className="border" style={{ display: ((categoryType == 1 || categoryType == 3) ? 'block' : 'none') }}>
                            <label className="input-group" htmlFor="college">
                                <select onChange={e => setCollege(e.target.value)}>
                                    {
                                        collegeData.map(c => {
                                            return (<option value={c}>{c}</option>);
                                        })
                                    }
                                </select>
                                <div className='label'>開課系所屬之院別</div>
                            </label>
                        </div>
                        <div className="border" >
                            <label className="input-group" htmlFor="point">
                                <input type="number" min={0} max={100} step={1} value={tempPoint} id="point" onChange={e => setTempPoint(e.target.value)} onBlur={pointOnBlur} />
                                <div className='label'>課程評分</div>
                            </label>
                        </div>
                        <div className="border" >
                            <label className="input-group" htmlFor="way">
                                <input type="text" className={fontClass} placeholder=" " id="way" onChange={e => setWay(e.target.value)} />
                                <div className='label'>授課方式</div>
                            </label>
                        </div>
                        <div className="border">
                            <div>考試模式(可複選)</div>
                            <div className="checkbox-group">
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
                        <div className="border">
                            <label className="input-group" htmlFor="evaluation">
                                <pre>
                                    <span id='textarea_preview'>{evaluation}</span>
                                    <br />
                                </pre>
                                <textarea placeholder=" " id="evaluation" rows="2" onInput={e => setEvaluation(e.target.value)} />
                                <div className='label'>課程評語</div>
                            </label>
                        </div>
                        <div>請以客觀且不具辱罵及攻擊性的字眼填寫</div>
                        <div className="btn btn-second" onClick={submit}>完成</div>
                    </div>
                    <div className='success' style={{ display: (!success ? 'none' : '') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M243.33,90.91,114.92,219.31a16,16,0,0,1-22.63,0l-71.62-72a16,16,0,0,1,0-22.61l24-24a16,16,0,0,1,22.57-.06l36.64,35.27.11.11h0l92.73-91.37a16,16,0,0,1,22.58,0l24,23.56A16,16,0,0,1,243.33,90.91Z"></path></svg>
                        <div>成功</div>
                    </div>
                </div>
            </div>
            <FooterComponent></FooterComponent>
        </div >
    )
}