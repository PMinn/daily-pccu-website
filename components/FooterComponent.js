import styles from '../styles/FooterComponent.module.css';

import Image from 'next/image';

import logo from '../public/images/logo/logo-bg.webp';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div>
                <div id={styles.team_info}>
                    <Image src={logo} alt="每日文大 logo" width="202" height="202"></Image>
                    <p>每日文大創立於2020年，致力於設計和開發更方便及人性化的移動應用程序，提供更便捷的服務給文大學生，讓每日文大成為文大學生的日常。</p>
                </div>
                <div id={styles.page_info}>
                    <div>
                        <h3><a href="/">首頁</a></h3>
                        <a href="#add_friend">如何加入</a>
                        <a href="#history">重大事件</a>
                    </div>
                </div>
            </div>
            <small>© 2022 All Rights Reserved - <a href="https://github.com/PMinn">P'MIN</a>.</small>
        </footer>
    )
}