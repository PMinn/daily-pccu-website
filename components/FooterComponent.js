import Link from 'next/link';
import styles from '../styles/FooterComponent.module.css';

export default function Footer() {
    return (
        <footer className={styles.foot}>
            <div>
                <div className={styles['team-info']}>
                    <img
                        src='https://firebasestorage.googleapis.com/v0/b/daily-pccu.appspot.com/o/web%2Flogo-bg_w350.webp?alt=media&token=dd0eae47-4373-42d7-8602-afbffd1cfd3a'
                        alt="每日文大 logo"
                        srcSet='https://firebasestorage.googleapis.com/v0/b/daily-pccu.appspot.com/o/web%2Flogo-bg.webp?alt=media&token=80013b5d-0cb7-4a2d-9619-67fede77edb7 350w'
                    />
                    <p>每日文大創立於2020年，致力於設計和開發更方便及人性化的移動應用程式，提供更便捷的服務給文大學生，讓每日文大成為文大學生的日常。</p>
                </div>
                <div className={styles['page-info']}>
                    <div>
                        <Link href='/' className={styles['parent-anchor']}>首頁</Link>
                        <Link href='/#add_friend'>如何加入</Link>
                        <Link href='/#history'>重大事件</Link>
                    </div>
                    <div>
                        <Link href='/course' className={styles['parent-anchor']}>課程評價</Link>
                        <Link href='/addCourse' target='_blank'>新增課程評價</Link>
                    </div>
                </div>
            </div>
            <small>© 2022 All Rights Reserved - <a href="https://github.com/PMinn">P'MIN</a>.</small>
        </footer>
    )
}