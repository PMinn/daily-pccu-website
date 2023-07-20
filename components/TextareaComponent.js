import { useState } from 'react';
import styles from '../styles/TextareaComponent.module.css';

function Br({ number = 1 }) {
    const brs = [];
    for (let i = 0; i < number; i++) {
        brs.push(<br />);
    }
    return <>{brs}</>;
}

export default function Textarea({ theme, placeholder = " ", rows = 1, value = useState("") }) {
    const [textareaValue, setTextareaValue] = value;
    const [focus, setFocus] = useState(false);
    const [numOfBr, setNumOfBr] = useState(rows);

    function textareaOnInput(e) {
        setTextareaValue(e.target.value);
        setNumOfBr(rows - e.target.value.split('\n').length + 1);
    }

    return (
        <div className={" " + styles.textareaComponent + ' ' + (focus ? 'focus' : '')}>
            <pre className='form-control'>
                <span>{textareaValue}</span>
                <Br number={numOfBr}></Br>
                <br />
            </pre>
            <textarea className='form-control my-form-control' placeholder={placeholder} rows={rows} onInput={textareaOnInput} onFocus={() => setFocus(true)} onBlur={() => { if (textareaValue == '') setFocus(false) }} />
        </div>
    )
}