import styles from '../styles/NavComponent.module.css';
import { setStoredTheme } from '../js/theme.js';

export default function Nav({ theme, setTheme }) {

    function changeTheme() {
        if (theme == 'light') {
            setTheme('dark');
            setStoredTheme('dark');
        } else {
            setTheme('light');
            setStoredTheme('light');
        }
    }

    return (
        <header>
            <nav className={styles.nav}>
                <a href="/" className={styles.logo}>
                    <h1>每日文大</h1>
                </a>
                <div className={styles['theme-btn'] + ' ' + (theme ? styles[theme + '-theme-btn'] : '')} onClick={changeTheme}>
                    <svg className={styles['dark-btn']} xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M120,40V32a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm8,24a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-8-8A8,8,0,0,0,50.34,61.66Zm0,116.68-8,8a8,8,0,0,0,11.32,11.32l8-8a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l8,8a8,8,0,0,0,11.32-11.32ZM40,120H32a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Zm88,88a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,208Zm96-88h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z"></path></svg>
                    <svg className={styles['light-btn']} xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 256 256"><path d="M235.54,150.21a104.84,104.84,0,0,1-37,52.91A104,104,0,0,1,32,120,103.09,103.09,0,0,1,52.88,57.48a104.84,104.84,0,0,1,52.91-37,8,8,0,0,1,10,10,88.08,88.08,0,0,0,109.8,109.8,8,8,0,0,1,10,10Z"></path></svg>
                </div>
            </nav>
        </header>
    )
}