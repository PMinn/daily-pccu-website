import styles from '../styles/NavComponent.module.css';

import Link from 'next/link';

export default function Home() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div>
                    <a href="/" className={styles.logo}>
                        <img src="/images/logo/transparent-noText.png" alt="每日文大 logo"></img>
                        <h1>每日文大</h1>
                    </a>
                </div>
                <ul className={styles['nav-list']}>
                    {/* <li className="nav-item">
                        <a href="#" className="nav-item__link">
                            連結
                        </a>
                    </li> */}
                    <li className={styles['nav-item']}>
                        <Link href="/#add_friend" className="btn-primary">加入好友</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}