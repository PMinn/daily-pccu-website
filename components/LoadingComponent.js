import styles from '../styles/LoadingComponent.module.css';

import coverStyles from '../styles/cover.module.css';

export default function Loading({ show }) {
    return (
        <div className={coverStyles.cover + ' ' + styles['loading-outer'] + ' ' + (show ? styles.show : '')}>
            <div className={styles["custom-loader"]}></div>
        </div>
    )
}