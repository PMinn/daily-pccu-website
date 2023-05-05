import Head from 'next/head'
// import NavComponent from '../../../components/NavComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import colleges from '../../colleges.json';
import evaluation from './evaluation.json';
const evaluationArray = Object.keys(evaluation).map(e => evaluation[e]);
export default function Course() {
    const router = useRouter();
    const [data, setData] = useState([]);

    useEffect(() => {
        var uri = decodeURI(location.pathname).split('/');
        var college = uri[uri.length - 1];
        var evaluationArrayFilter = evaluationArray.filter(e => e.college == college);
        setData(evaluationArrayFilter);
        router.events.on('routeChangeStart', (url, { }) => {
            uri = decodeURI(url).split('/');
            college = uri[uri.length - 1];
            evaluationArrayFilter = evaluationArray.filter(e => e.college == college);
            setData(evaluationArrayFilter);
        });
    }, []);
    return (
        <div>
            <Head>
                <title>每日文大</title>
                <link rel="stylesheet" href="/css/course.css" />
            </Head>
            <section className="menu">
                <div className="collapse-label" data-for="y_109">109學年
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.34,24.34,0,0,0,40.55,224h174.9a24.34,24.34,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8Z"></path></svg>
                </div>
                <div className="collapse-area" id='y_109'>
                    {colleges.map(college => {
                        return (
                            <Link href={'/course/109/' + college} className='college-link'>{college}</Link>
                        )
                    })}
                </div>
            </section>
            <section id='main'>
                <label className="search-bar" for="search">
                    <input type="text" id="search" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
                </label>
                <div id="blocks">
                    {
                        data.map(e => {
                            return (
                                <div className='block'>
                                    <div className="className">{e.className}</div>
                                    <div className="department">{e.department}</div>
                                    <div className="teacher">{e.teacher}</div>
                                    <div className="way">上課方式: {e.way}</div>
                                    <div className="exam">考試方式: {e.exam}</div>
                                    <div className="point">推薦程度: {e.point}</div>
                                    <div className="evaluation">評論: {e.evaluation}</div>
                                    <div className="date">{new Date(e.date).toLocaleDateString()}</div>
                                    <hr />
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            <script type="module" src="/js/course.js"></script>
        </div>
    )
}