import styles from '../styles/LoadingComponent.module.css';
import Head from 'next/head';

export default function Loading({ show }) {
    return (
        <div className={'cover ' + styles['loading-outer'] + ' ' + (show ? styles.show : '')}>
            <Head>
                <link rel="stylesheet" href="/css/cover.css" />
            </Head>
            <div className={styles["custom-loader"]}></div>
        </div>
    )
}