import styles from '../styles/ConfirmComponent.module.css';

import coverStyles from '../styles/cover.module.css';

export default function Confirm({ title, content, btn, onClick, show, theme }) {
    return (
        <div className={coverStyles.cover + ' ' + styles['confirm-outer'] + ' ' + (show ? styles.show : '') + ' ' + (theme ? styles[theme] : '')}>
            <div className={styles.confirm}>
                <div className={styles.title}>{title}</div>
                <div className={styles.content}>{content}</div>
                <div className={styles['btn-bar']}>
                    {
                        btn.map((item, index) => {
                            return (<div className={'btn ' + styles.btn} onClick={onClick[index]} key={'confirm_btn_' + index}>{item}</div>)
                        })
                    }
                </div>
            </div>
        </div >
    )
}