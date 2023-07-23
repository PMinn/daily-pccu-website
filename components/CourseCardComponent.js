import Link from 'next/link';

import styles from '../styles/CourseCardComponent.module.css';

export default function CourseCard({ e, isDemo, theme, setRevelationConfirmShow, setRevelationID }) {

    function shareOnClick(shareData) {
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            setShareErrorConfirmShow(true);
            setShareErrorText('您的瀏覽器不支援分享功能，請使用其他瀏覽器。');
        }
    }

    return (
        <div className={styles.outer + ' ' + (theme == 'dark' ? styles[theme] : '')} key={'course_' + e.id}>
            <div className={styles["title-bar"]}>
                <div className={styles.className}>{e.className}</div>
                <div className={styles['mini-btn-group']}>
                    <div title="分享" onClick={isDemo ? () => { } :
                        () => shareOnClick({
                            title: `${e.teacher.join('和')}的${e.className} 的課程評價`,
                            text: `在每日文大課程評價中，查看${e.teacher.join('和')}的${e.className}。`,
                            url: 'https://daily-pccu.web.app/course/' + e.id,
                        })
                    }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z"></path></svg>
                    </div>
                    <div title="審查" onClick={isDemo ? () => { } :
                        () => {
                            setRevelationConfirmShow(true);
                            setRevelationID(e.id);
                        }
                    }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
                    </div>
                </div>
            </div>
            <div className={styles.department}>{e.department}</div>
            <div className={styles.teacher}>
                {
                    e.teacher.map(teacher => {
                        return (
                            <Link href={isDemo ? '#' : `/course/${e.year}/teacher/${teacher}`} key={`course_${e.year}_${teacher}`}>{teacher}</Link>
                        )
                    })
                }
            </div>
            <div className={styles['point-progress']}>
                <div className={styles['point-progress-bar']}>
                    <div className={styles['point-progress-bar-value']} style={{ transform: `scaleX(${e.point / 100})`, backgroundColor: (e.point >= 80 ? 'var(--green)' : (e.point >= 60 ? 'var(--yellow)' : 'var(--red)')) }}></div>
                </div>
                <div className={styles['point-progress-text']} style={{ color: (e.point >= 80 ? 'var(--green)' : (e.point >= 60 ? 'var(--yellow)' : 'var(--red)')) }}>{e.point}</div>
            </div>
            <div className={styles.exam}>
                {
                    (e.exam != '' ? e.exam.split(',').map((exam, index) => <div key={'exam_' + index}>{exam}</div>) : '')
                }
            </div>
            <div className={styles.way}>授課方式:<br />
                {e.way}
            </div>
            <div className={styles.evaluation}>課程評語:<br />
                {e.evaluation.replaceAll('\\n', '\n')}
            </div>
            <div className={styles.date}>
                <div>{e.year}學年</div>
                <div>{new Date(e.date).toLocaleDateString()}</div>
            </div>
        </div>
    )
}