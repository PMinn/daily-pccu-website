import Link from 'next/link';
import styles from '@/styles/FooterComponent.module.css';
import { motion } from 'framer-motion';

export default function Footer({ options = {} }) {
    if (options.hidden == true) return null;
    return (
        <footer className='w-full py-[10svh] relative bg-content2'>
            <div className={styles.topBorder}></div>
            <div className='container mx-auto px-6 md:px-12'>
                <motion.div
                    className='flex flex-col md:flex-row md:justify-between w-full gap-10 md:gap-16'
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className='w-full md:w-[320px] shrink-0'>
                        <motion.img
                            whileHover={{ scale: 1.06, rotate: 2 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className='w-50 h-50 object-cover rounded-full border border-[#00000020] shadow-xl'
                            src='/images/logo/logo-bg_w350.webp'
                            alt="每日文大 logo"
                        />
                        <p className='leading-8 mt-[5vh]'>每日文大創立於2020年，致力於設計和開發更方便及人性化的移動應用程式，提供更便捷的服務給文大學生，讓每日文大成為文大學生的日常。</p>
                    </div>
                    <div className={styles.links + ' flex flex-wrap gap-x-16 gap-y-10 md:pt-2'}>
                        <div className='flex flex-col pt-[10px] w-full md:w-[220px] my-4 md:my-0'>
                            <Link className='no-underline relative pt-5 text-3xl' href='/'>首頁</Link>
                            <Link className='no-underline relative pt-5' href='/#add_friend'>如何加入</Link>
                            <Link className='no-underline relative pt-5' href='/#history'>重大事件</Link>
                        </div>
                        <div className='flex flex-col pt-[10px] w-full md:w-[220px] my-4 md:my-0'>
                            <Link className='no-underline relative pt-5 text-3xl' href='/course'>課程評價</Link>
                            <Link className='no-underline relative pt-5' href='/addCourse' target='_blank'>新增課程評價</Link>
                        </div>
                    </div>
                </motion.div>
                <small className='block mt-[10svh] opacity-60'>© 2022 All Rights Reserved - <a href="https://github.com/PMinn">P'MIN</a>.</small>
            </div>
        </footer>
    )
}