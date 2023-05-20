import Head from 'next/head'
import NavComponent from '../../../../../components/NavComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { database, firestore } from '../../../../../firebaseConfig.js';
import { ref, get } from "firebase/database";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Course() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [collapseData, setCollapseData] = useState({ years: [], colleges: [] });

    async function fetchFirestore(year, type, keyword) {
        document.getElementById('loading').classList.add('show');
        var q;
        if (type == 'college') {
            q = query(collection(firestore, "evaluations"), where("year", "==", parseInt(year)), where('category', '==', keyword));
        }
        else if (type == 'teacher') {
            q = query(collection(firestore, "evaluations"), where("year", "==", parseInt(year)), where('teacher', 'array-contains', keyword));
        } else {
            console.log("paramaters are wrong");
            setData([]);
            return;
        }
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
        document.getElementById('loading').classList.remove('show');
    }

    function pageOnLoad(url) {
        var uriSplit = decodeURI(url).split('/');
        if (uriSplit.length == 5) {
            fetchFirestore(uriSplit[2], uriSplit[3], uriSplit[4]);
            document.getElementById('search').value = '';
            closeMenu();
        }
    }

    useEffect(() => {
        pageOnLoad(location.pathname);
        router.events.on('routeChangeStart', (url, { }) => pageOnLoad(url));
        get(ref(database, 'courseConfig/'))
            .then(snapshot => setCollapseData(snapshot.val()))
            .catch((error) => {
                console.error(error);
            });
    }, []);

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

    function openMenu() {
        document.getElementById('menu').classList.add('open');
    }

    function closeMenu() {
        document.getElementById('menu').classList.remove('open');
    }

    return (
        <div>
            <Head>
                <title>每日文大</title>
                <link rel="stylesheet" href="/css/course.css" />
            </Head>
            <NavComponent></NavComponent>
            <div className="cover" id="loading">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"></path>
                    <path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"></path>
                </svg>
            </div>
            <section id="menu">
                <div className="close" onClick={closeMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                </div>
                <div className="collapse-scroll">
                    {
                        collapseData.years.map(year => {
                            return (
                                <div id={'y_' + year}>
                                    <div className="collapse-label" onClick={() => openCollapse(year)} id={'label_' + year}>{year}學年
                                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M236.78,211.81A24.34,24.34,0,0,1,215.45,224H40.55a24.34,24.34,0,0,1-21.33-12.19,23.51,23.51,0,0,1,0-23.72L106.65,36.22a24.76,24.76,0,0,1,42.7,0L236.8,188.09A23.51,23.51,0,0,1,236.78,211.81Z"></path></svg>
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
                        })
                    }
                </div>
                <div className="btn btn-first">新增評價</div>
            </section>
            <div className="cover"></div>
            <div id='menu_btn' onClick={openMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path></svg>
            </div>
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
                                    <div className="title-bar">
                                        <div className="className">{e.className}</div>
                                        <div>
                                            <div title="檢舉">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="department">{e.department}</div>
                                    <div className='teacher'>
                                        {
                                            e.teacher.map(teacher => {
                                                return (
                                                    <Link href={`/course/${e.year}/teacher/${teacher}`} className='teacher'>{teacher}</Link>
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
                                            (e.exam != '' ?
                                                e.exam.split(',').map(exam => {
                                                    return (
                                                        <div >{exam}</div>
                                                    )
                                                })
                                                :
                                                ''
                                            )
                                        }
                                    </div>
                                    <div className="way">授課方式:<br />
                                        {e.way}
                                    </div>
                                    <div className="evaluation">課程評語:<br />
                                        {e.evaluation.replaceAll('\\n', '\n')}
                                    </div>
                                    <div className="date">{new Date(e.date).toLocaleDateString()}</div>
                                    <hr />
                                </div>
                            )
                        })
                    }
                </div>
            </section >
        </div >
    )
}