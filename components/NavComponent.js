import styles from '../styles/NavComponent.module.css';

export default function Nav() {
    return (
        <header>
            <nav className={styles.header}>
                <a href="/" className={styles.logo}>
                    <h1>每日文大</h1>
                </a>
            </nav>
        </header>
    )
}