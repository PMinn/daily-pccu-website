import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import logo from '../public/images/logo/logo-bg.webp';

export default function Footer() {
    return (
        <footer className="footer">
            <Head>
                <link rel="stylesheet" href="/css/FooterComponent.css" />
            </Head>
            <div>
                <div id="team_info">
                    <Image src={logo} alt="每日文大 logo" width="202" height="202"></Image>
                    <p>每日文大創立於2020年，致力於設計和開發更方便及人性化的移動應用程式，提供更便捷的服務給文大學生，讓每日文大成為文大學生的日常。</p>
                </div>
                <div id="page_info">
                    <div>
                        <h3><Link href='/'>首頁</Link></h3>
                        <Link href='/#add_friend'>如何加入</Link>
                        <Link href='/#history'>重大事件</Link>
                    </div>
                    <div>
                        <h3><Link href='/course'>課程評價</Link></h3>
                        <Link href='/addCourse'>新增課程評價</Link>
                    </div>
                </div>
            </div>
            <small>© 2022 All Rights Reserved - <a href="https://github.com/PMinn">P'MIN</a>.</small>
        </footer>
    )
}