import Link from 'next/link';
import styles from '../styles/FooterComponent.module.css';

export default function Footer() {
    return (
        <footer className={styles.foot}>
            <div>
                <div className={styles['team-info']}>
                    <img src="/images/logo/logo-bg.webp" alt="每日文大 logo" srcSet="/images/logo/logo-bg_w350.webp 350w" />
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