import styles from '../styles/NavComponent.module.css';

export default function Nav() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div>
                    <a href="/" className={styles.logo}>
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
                        <a data-target="#add_friend" className="btn btn-first" id='nav_addFriend_btn'>加入好友</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}