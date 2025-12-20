import Link from 'next/link';
import styles from '@/styles/FooterComponent.module.css';

export default function Footer({ options = {} }) {
    if (options.hidden == true) return null;
    return (
        <footer className='w-full md:h-[80svh] py-[10svh] relative bg-content2'>
            <div className='container mx-auto'>
                <div className='px-4 flex flex-col md:flex-row w-full'>
                    <div className='w-full md:w-[20vw]'>
                        <img
                            className='w-50 h-50 object-cover rounded-full border border-[#00000020] shadow-xl'
                            src='/images/logo/logo-bg_w350.webp'
                            alt="每日文大 logo"
                        />
                        <p className='leading-8 mt-[5vh]'>每日文大創立於2020年，致力於設計和開發更方便及人性化的移動應用程式，提供更便捷的服務給文大學生，讓每日文大成為文大學生的日常。</p>
                    </div>
                    <div className={styles.links + ' w-full mx-auto my-4 md:my-[8vh] md:my-0 flex grow justify-center flex-wrap md:px-10'}>
                        <div className='flex flex-col pt-[10px] w-full md:w-[300px] my-4 md:my-0'>
                            <Link className='no-underline relative pt-5 text-3xl' href='/'>首頁</Link>
                            <Link className='no-underline relative pt-5' href='/#add_friend'>如何加入</Link>
                            <Link className='no-underline relative pt-5' href='/#history'>重大事件</Link>
                        </div>
                        <div className='flex flex-col pt-[10px] w-full md:w-[300px] my-4 md:my-0'>
                            <Link className='no-underline relative pt-5 text-3xl' href='/course'>課程評價</Link>
                            <Link className='no-underline relative pt-5' href='/addCourse' target='_blank'>新增課程評價</Link>
                        </div>
                    </div>
                </div>
                <small className='px-4 absolute bottom-[5vh] left-0 opacity-60'>© 2022 All Rights Reserved - <a href="https://github.com/PMinn">P'MIN</a>.</small>
            </div>
        </footer>
    )
}