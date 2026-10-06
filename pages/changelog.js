import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ChangelogData from '@/data/changelog.json';
import styles from '@/styles/changelog.module.css';

const TYPE_LABELS = {
    new: '新增',
    improve: '調整',
    fix: '修正',
};

const SCOPE_LABELS = {
    web: '網站',
    bot: 'Bot',
};

export default function Changelog() {
    const title = '更新紀錄 | 每日文大';
    const description = '每日文大網站與 LINE Bot 的版本更新紀錄，包含新功能、調整與修正。';
    return (
        <Layout>
            <Head>
                <title>{title}</title>
                <meta name='keywords' content='每日文大,更新紀錄,版本紀錄,文大bot' />
                <meta name='description' content={description} />
                <meta property='og:title' content={title} />
                <meta property='og:description' content={description} />
                <link rel='canonical' href='https://daily-pccu.web.app/changelog' />
            </Head>
            <section className={styles.page}>
                <div className={styles.container}>
                    <motion.div
                        className={styles.head}
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h1 className={styles.en}>Changelog</h1>
                        <span className={styles.zh}>更新紀錄</span>
                    </motion.div>
                    <div>
                        {ChangelogData.map((entry, i) => (
                            <motion.article
                                key={entry.version}
                                className={styles.entry}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.06 }}
                            >
                                <div>
                                    <span className={styles.version}>{`v${entry.version}`}</span>
                                    <time className={styles.date}>{entry.date.replaceAll('/', '.')}</time>
                                </div>
                                <div>
                                    <h2 className={styles.title}>{entry.title}</h2>
                                    <ul className={styles.list}>
                                        {entry.items.map((item) => (
                                            <li key={item.text} className={styles.item}>
                                                <span className={`${styles.tag} ${styles['tag-' + item.type]}`}>{TYPE_LABELS[item.type]}</span>
                                                <span>{item.text}<span className={styles.scope}>{SCOPE_LABELS[item.scope]}</span></span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
