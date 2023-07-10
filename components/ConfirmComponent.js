import Head from 'next/head';
import styles from '../styles/ConfirmComponent.module.css';

export default function Confirm({ title, content, btn, onClick, show }) {
    return (
        <div className={'cover ' + styles['confirm-outer'] + ' ' + (show ? styles.show : '')}>
            <Head>
                <link rel="stylesheet" href="/css/cover.css" />
            </Head>
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
        </div>
    )
}