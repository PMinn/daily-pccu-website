import Head from 'next/head'
// import NavComponent from '../../../components/NavComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import evaluation from './evaluation.json';
import { database, firestore } from '../../../../../firebaseConfig.js';
import { ref, get } from "firebase/database";
import { collection, query, where, getDocs } from "firebase/firestore";

const evaluationArray = Object.keys(evaluation).map(e => evaluation[e]);
export default function Course() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [collapseData, setCollapseData] = useState({ years: [], colleges: [] });

    async function fetchFirestore(year, type, keyword) {
        const q = query(collection(firestore, "evaluations"), where("year", "==", parseInt(year)), where(type, '==', keyword));//
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            var d = [];
            querySnapshot.forEach(doc => {
                d.push(doc.data());// doc.id
            });
            setData(d);
        } else {
            console.log("No such document!");
            setData([]);
        }
    }

    useEffect(() => {
        var [t, t, year, type, ketword] = decodeURI(location.pathname).split('/');
        fetchFirestore(year, type, ketword);
        // var college = uri[uri.length - 1];
        // var evaluationArrayFilter = evaluationArray.filter(e => e.college == college);
        // setData(evaluationArrayFilter);
        get(ref(database, 'courseConfig/')).then(snapshot => setCollapseData(snapshot.val()))
            .catch((error) => {
                console.error(error);
            });
        router.events.on('routeChangeStart', (url, { }) => {
            var [t, t, year, type, ketword] = decodeURI(url).split('/');
            fetchFirestore(year, type, ketword);

            // college = uri[uri.length - 1];
            // evaluationArrayFilter = evaluationArray.filter(e => e.college == college);
            // setData(evaluationArrayFilter);
        });
    }, []);

    function search(e) {
        var keyWord = e.target.value;
        document.querySelectorAll('.block').forEach(block => {
            if (block.innerText.includes(keyWord)) block.style.display = 'block';
            else block.style.display = 'none';
        })
    }

    function openCollapse(e) {
        var collapseLabel = e.target;
        if (collapseLabel.classList.contains('open')) {
            collapseLabel.classList.remove('open');
            document.getElementById(collapseLabel.dataset.for).classList.remove('open');
        } else {
            collapseLabel.classList.add('open');
            document.getElementById(collapseLabel.dataset.for).classList.add('open');
        }
    }

    return (
        <div>
            <Head>
                <title>每日文大</title>
                <link rel="stylesheet" href="/css/course.css" />
            </Head>
            <section className="menu">
                {collapseData.years.map(year => {
                    return (
                        <div id={'y_' + year}>
                            <div className="collapse-label" data-for={"y_" + year} onClick={openCollapse}>{year}學年
                                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.34,24.34,0,0,0,40.55,224h174.9a24.34,24.34,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8Z"></path></svg>
                            </div>
                            <div className="collapse-area">
                                {collapseData.colleges.map(college => {
                                    return (
                                        <Link href={`/course/${year}/college/${college}`} className='college-link'>{college}</Link>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </section>
            <section id='main'>
                <label className="search-bar" for="search">
                    <input type="text" id="search" onInput={search} placeholder="搜尋" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
                </label>
                <div id="blocks">
                    {
                        data.map(e => {
                            return (
                                <div className='block'>
                                    <div className="className">{e.className}</div>
                                    <div className="department">{e.department}</div>
                                    <Link href={`/course/${e.year}/teacher/${e.teacher}`} className='teacher'>{e.teacher}</Link>
                                    <div className="way">上課方式: {e.way}</div>
                                    <div className="exam">考試方式: {e.exam}</div>
                                    <div className="point">推薦程度: {e.point}</div>
                                    <div className="evaluation">評論: {e.evaluation.replaceAll('\\n', '\n')}</div>
                                    <div className="date">{new Date(e.date).toLocaleDateString()}</div>
                                    <hr />
                                </div>
                            )
                        })
                    }
                </div>
            </section >
            {/* <script type="module" src="/js/course.js"></script> */}
        </div >
    )
}