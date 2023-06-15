import Head from 'next/head'
import NavComponent from '../components/NavComponent';
import React, { useEffect, useState } from 'react';

// import { database, firestore } from '../../js/firebaseConfig.js';
// import { ref, get } from "firebase/database";
// import { collection, query, where, getDocs } from "firebase/firestore";

export default function Course() {
    const [className, setClassName] = useState("");
    const [teacher, setTeacher] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear() - 1911);
    const [categoryType, setCategoryType] = useState(1);
    const [department, setDepartment] = useState("");
    const [point, setPoint] = useState(60);
    const [tempPoint, setTempPoint] = useState(60);
    const [evaluation, setEvaluation] = useState("");

    useEffect(() => {

    }, []);

    function categoryOnClick(index) {
        document.querySelectorAll('.category input').forEach(input => input.classList.remove('checked'));
        document.getElementById('category' + index).classList.add('checked');
        setCategoryType(index.toString());
    }

    function teacherOnChange(e) {
        setTeacher(e.target.value.split(','));
    }

    function departmentOnInput(e) {
        setDepartment(e.target.value);
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

    return (
        <div>
            <NavComponent></NavComponent>
            <Head>
                <title>新增課程評價 | 每日文大</title>
                <meta property="og:title" content="新增課程評價 | 每日文大" />
                <link rel="stylesheet" href="/css/addCourse.css" />
            </Head>
            <div className="outter">
                <div className="container">
                    <div className="border category">
                        <input type="radio" name="category" id="category1" className='checked' onClick={() => categoryOnClick(1)} />
                        <label htmlFor="category1">一般</label>
                        <input type="radio" name="category" id="category2" onClick={() => categoryOnClick(2)} />
                        <label htmlFor="category2">通識</label>
                        <input type="radio" name="category" id="category3" onClick={() => categoryOnClick(3)} />
                        <label htmlFor="category3">跨域</label>
                    </div>
                    <div className="border">
                        <label className="input-group" htmlFor="className">
                            <input type="text" placeholder=" " id="className" onInput={e => setClassName(e.target.value)} />
                            <div className='label'>課程名稱</div>
                            <div className="note" style={{ display: (categoryType == 2 ? 'block' : 'none') }}>不須包含"自然通識︰"、"社會通識︰"或"人文通識︰"</div>
                            <div className="note" style={{ display: (categoryType == 3 ? 'block' : 'none') }}>不須包含"跨域︰"</div>
                        </label>
                    </div>
                    <div className="border">
                        <label className="input-group" htmlFor="teacher">
                            <input type="text" placeholder=" " id="teacher" onChange={teacherOnChange} />
                            <div className='label'>授課教師</div>
                            <div className="note">多位教師請使用半形逗號(,)分隔</div>
                        </label>
                    </div>
                    <div className="border">
                        <label className="input-group" htmlFor="year">
                            <input type="number" step={1} value={year} id="year" onChange={e => setYear(e.target.value)} />
                            <div className='label'>開課學年</div>
                        </label>
                    </div>
                    <div className="border" style={{ display: (categoryType == 1 || categoryType == 3 ? 'block' : 'none') }}>
                        <label className="input-group" htmlFor="department">
                            <input type="text" placeholder=" " id="department" onInput={departmentOnInput} value={department} />
                            <div className='label'>開課系別</div>
                        </label>
                    </div>
                    <div className="border" style={{ display: (categoryType == 1 || categoryType == 3 ? 'block' : 'none') }}>
                        <label className="input-group" htmlFor="college">
                            <input type="text" placeholder=" " id="college" />
                            <div className='label'>開課系所屬之院別</div>
                        </label>
                    </div>
                    <div className="border">
                        <label className="input-group" htmlFor="point">
                            <input type="number" min={0} max={100} step={1} value={tempPoint} id="point" onChange={e => setTempPoint(e.target.value)} onBlur={pointOnBlur} />
                            <div className='label'>課程評分</div>
                        </label>
                    </div>
                    <div className="border">
                        <label className="input-group" htmlFor="way">
                            <input type="text" placeholder=" " id="way" />
                            <div className='label'>授課方式</div>
                        </label>
                    </div>
                    <div className="border">
                        <div>考試模式(可複選)</div>
                        <div className="checkbox-group">
                            <input type="checkbox" name="exam" id="exam1" />
                            <label htmlFor="exam1">期中報告</label>
                            <input type="checkbox" name="exam" id="exam2" />
                            <label htmlFor="exam2">期中作業</label>
                            <input type="checkbox" name="exam" id="exam3" />
                            <label htmlFor="exam3">期中考試</label>
                            <input type="checkbox" name="exam" id="exam4" />
                            <label htmlFor="exam4">期末報告</label>
                            <input type="checkbox" name="exam" id="exam5" />
                            <label htmlFor="exam5">期末作業</label>
                            <input type="checkbox" name="exam" id="exam6" />
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
                    <div className="btn btn-second">送出</div>
                </div>
            </div>
        </div >
    )
}