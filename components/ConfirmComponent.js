import styles from '../styles/ConfirmComponent.module.css';

import coverStyles from '../styles/cover.module.css';

export default function Confirm({ title, content, btn, onClick, show, theme, size }) {
    return (
        <div className={coverStyles.cover + ' ' + styles['confirm-outer'] + ' ' + (show ? styles.show : '') + ' ' + (theme == 'dark' ? styles[theme] : '')}>
            <div className={styles.confirm + ' ' + styles[size]}>
                <div className={styles.title}>{title}</div>
                <div className={styles.content}>{content}</div>
                <div className={styles['btn-bar']}>
                    {
                        btn.map((item, index) => {
                            return (<div className={'my-btn ' + styles.btn} onClick={onClick[index]} key={'confirm_btn_' + index}>{item}</div>)
                        })
                    }
                </div>
            </div>
        </div >
    )
}