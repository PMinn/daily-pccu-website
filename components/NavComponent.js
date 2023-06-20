import Head from 'next/head';

export default function Nav() {
    return (
        <header className="header">
            <Head>
                <link rel="stylesheet" href="/css/NavComponent.css" />
            </Head>
            <a href="/" className="logo">
                <h1>每日文大</h1>
            </a>
        </header>
    )
}