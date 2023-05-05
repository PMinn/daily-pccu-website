import Head from 'next/head'
// import NavComponent from '../../../components/NavComponent';
import colleges from './colleges.json';
import Link from 'next/link';

export default function Course() {

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
                <div className="collapse-label" data-for="y_109" onClick={openCollapse}>109學年
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
                </div>
            </section>
        </div>
    )
}