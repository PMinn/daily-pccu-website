import Head from 'next/head';

export default function Confirm({ title, content, btn, onClick, show }) {
    return (
        <div className={'cover confirm-outter ' + (show ? 'show' : '')}>
            <Head>
                <link rel="stylesheet" href="/css/cover.css" />
                <link rel="stylesheet" href="/css/ConfirmComponent.css" />
            </Head>
            <div class="confirm">
                <div className="title">{title}</div>
                <div className="content">
                    {
                        content.split('\n').map(line => {
                            return (
                                <div>
                                    {
                                        line.split('\\n').map(word => {
                                            return (<div>{word}</div>)
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div className="btn-bar">
                    {
                        btn.map((item, index) => {
                            return (<div className="btn" onClick={onClick[index]}>{item}</div>)
                        })
                    }
                </div>
            </div>
        </div>
    )
}