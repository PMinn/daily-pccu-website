import styles from '../styles/NavComponent.module.css';

import Link from 'next/link';

export default function Home() {
    return (
        <header class={styles.header}>
            <nav class={styles.nav}>
                <div>
                    <a href="/" class={styles.logo}>
                        <img src="/images/logo/transparent-noText.png" alt="每日文大 logo" class="headerLogo"></img>
                        <h1>每日文大</h1>
                    </a>
                </div>
                <ul class={styles['nav-list']}>
                    {/* <li class="nav-item">
                        <a href="#" class="nav-item__link">
                            連結
                        </a>
                    </li> */}
                    <li class={styles['nav-item']}>
                        <Link href="/#add_friend" class="btn-primary">加入好友</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}