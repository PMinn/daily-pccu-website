import { set } from 'firebase/database';
import Head from 'next/head';
import { type } from 'os';
import React, { useState } from 'react';

function Br({ number = 1 }) {
    const brs = [];
    for (let i = 0; i < number; i++) {
        brs.push(<br />);
    }
    return <>{brs}</>;
}

export default function Textarea({ placeholder = " ", rows = 1, value = useState("") }) {
    const [textareaValue, setTextareaValue] = value;
    const [numOfBr, setNumOfBr] = useState(rows);

    function textareaOnInput(e) {
        setTextareaValue(e.target.value);
        setNumOfBr(rows - e.target.value.split('\n').length + 1);
    }

    return (
        <div className='textareaComponent'>
            <Head>
                <link rel="stylesheet" href="/css/TextareaComponent.css" />
            </Head>
            <pre>
                <span>{textareaValue}</span>
                <Br number={numOfBr}></Br>
                <br />
            </pre>
            <textarea placeholder={placeholder} rows={rows} onInput={textareaOnInput} />
        </div>
    )
}