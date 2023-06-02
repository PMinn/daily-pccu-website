import Head from 'next/head';

export default function Nav() {
    return (
        <header className="header">
            <Head>
                <link rel="stylesheet" href="/css/NavComponent.css" />
            </Head>
            <nav className="nav">
                <div>
                    <a href="/" className="logo">
                        <h1>每日文大</h1>
                    </a>
                </div>
                <ul className="nav-list">
                    {/* <li className="nav-item">
                        <a href="#" className="nav-item__link">
                            連結
                        </a>
                    </li> */}
                    {/* <li className={styles['nav-item']}>
                        <a data-target="#add_friend" className="btn btn-first" id='nav_addFriend_btn'>加入好友</a>
                    </li> */}
                </ul>
            </nav>
        </header>
    )
}