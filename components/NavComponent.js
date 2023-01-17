import styles from '../styles/NavComponent.module.css';
import Image from 'next/image';
import logo from '../images/logo/transparent-noText.png';

import Link from 'next/link';

export default function Home() {
    return (
        <header class={styles.header}>
            <nav class={styles.nav}>
                <div>
                    <a href="/" class={styles.logo}>
                        <Image src={logo} alt="每日文大 logo" class="headerLogo"></Image>
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
                    <Link href="/#add_friend"  class="btn-primary">加入好友</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}