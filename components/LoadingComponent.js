import Head from 'next/head';

export default function Loading({ show }) {
    return (
        <div className={'cover loading-outter ' + (show ? 'show' : '')}>
            <Head>
                <link rel="stylesheet" href="/css/cover.css" />
                <link rel="stylesheet" href="/css/LoadingComponent.css" />
            </Head>
            <div class="custom-loader"></div>
        </div>
    )
}