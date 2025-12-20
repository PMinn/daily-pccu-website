import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
    Select,
    SelectItem,
    Textarea,
    Card,
    CardBody,
    Button,
    Progress
} from "@heroui/react";

import { app } from '@/js/firebaseConfig.js';
import { getDatabase, ref as databaseRef, set } from "firebase/database";

import Layout from '@/components/Layout';

export default function Form({ devMode, uuid }) {
    const formClassNames = { label: "text-md text-default-900 opacity-100", inputWrapper: "border-medium border-transparent hover:border-primary focus:border-primary transition-colors" };
    const database = getDatabase(app);

    const [liffContext, setLiffContext] = useState(null);

    const formId = new Date().getTime();
    const [files, setFiles] = useState([]);
    const [confirmShow, setConfirmShow] = useState(false);
    const [textareaValue, setTextareaValue] = useState("");
    const [radioGroup, setRadioGroup] = useState("error");
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [liffObject, setLiffObject] = useState(null);

    // 點擊上傳
    function uploadOnPress() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = false;
        input.click();
        input.addEventListener('change', e => {
            let id = (new Date()).getTime();
            var file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target.result;
                const rawBase64 = base64String.split(',')[1];
                setFiles(tempFiles => {
                    let tf = [...tempFiles];
                    tf.push({
                        totalBytes: file.size,
                        id,
                        base64: rawBase64,
                        originFileName: file.name
                    });
                    return tf;
                });
                window.scrollTo(0, document.body.scrollHeight);
            };
            reader.readAsDataURL(file);
        });
    }

    // liff 初始化
    async function liff_init(liffId) {
        return await import("@line/liff")
            .then(module => module.liff)
            .then(liff => {
                setLiffObject(liff);
                return liff;
            })
            .then(liff => liff.init({ liffId }))
            .then(() => {
                const context = liff.getContext();
                setLiffContext(context);
                return context;
            });
    }

    // 送出
    async function submit() {
        var content = textareaValue;
        if (content.replace(/[ \n\t\r]/gi, '') == '') {
            alert("內容不可為空");
            return;
        }
        console.log(liffContext.userId)
        setLoading(true);
        var data = {
            type: radioGroup,
            content,
            uuid: liffContext.userId,
            files: files
        };
        await set(databaseRef(database, 'form/' + formId), data);
        data.id = formId;
        await fetch('https://script.google.com/macros/s/AKfycbwkM-jXJRugWp0IjCiUAeo2QfOHvFQy793jTojc76XweR54Gg9DiE1bu5a8X7CGj3D8qQ/exec', {
            method: "POST",
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            },
            body: JSON.stringify(data)
        })
        setLoading(false);
        setSuccess(true);
    }

    useEffect(() => {
        (async () => {
            console.log('DEV_MODE:', devMode);
            if (devMode) {
                setLiffContext({ userId: uuid });
            } else {
                const liffId = "1655168208-9NvVk86X";
                const context = await liff_init(liffId);
                try {
                    if (!process?.env?.SETTINGS_LIFF_ID && (context.type == "none" || context.type == "external")) {
                        alert("請使用正常路徑開啟");
                        return;
                    }
                } catch { }
                setLiffContext(context);
            }
        })();
        // .catch(err => {
        //     console.error(err);
        //     setErrorText(`錯誤代碼:\n${err.code}\n\n錯誤訊息:\n${err.message}\n請重新開啟頁面`);
        // });
    }, []);

    return (
        <Layout options={{ footer: { hidden: true }, nav: { head: { as: "div" } } }}>
            <Head>
                <title>回饋 | 每日文大</title>
            </Head>
            {/* <Confirm title="請輸入內容" content={"內容不可為空"} show={confirmShow} btn={["確認"]} onClick={[() => setConfirmShow(false)]}></Confirm> */}
            <div className='container mx-auto pt-30 flex flex-col items-center min-h-screen'>
                {liffContext &&
                    (success == null ? (
                        <div className='w-full flex flex-col py-5 px-7'>
                            <input type="text" id="uuid" hidden />
                            <Select
                                label="我要回饋的是..."
                                labelPlacement="outside"
                                selectedKeys={[radioGroup]}
                                onChange={e => setRadioGroup(e.target.value)}
                                className="mb-4 w-full"
                                classNames={formClassNames}
                                isRequired
                            >
                                <SelectItem key="error" value="error">錯誤回報</SelectItem>
                                <SelectItem key="suggestion" value="suggestion">建議</SelectItem>
                                <SelectItem key="cooperation" value="cooperation">合作</SelectItem>
                                <SelectItem key="else" value="else">其他</SelectItem>
                            </Select>
                            <Textarea
                                label="內容是..."
                                labelPlacement="outside"
                                className="mb-4 w-full"
                                classNames={formClassNames}
                                value={textareaValue}
                                onValueChange={setTextareaValue}
                                isRequired
                            />
                            <label className={"mb-4 " + formClassNames.label}>有沒有相關圖片...</label>
                            {
                                files.map((file, index) => {
                                    return (
                                        <Card
                                            isBlurred
                                            className="border-none bg-background/60 dark:bg-default-100/50 max-w-152.5 mb-2"
                                            shadow="sm"
                                            key={'file_' + index}
                                        >
                                            <CardBody>
                                                <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                                                    <div className="relative col-span-6 md:col-span-4">
                                                        <img
                                                            className="object-cover mx-auto"
                                                            height={100}
                                                            shadow="md"
                                                            src={"data:image/png;base64," + file.base64}
                                                            width={100}
                                                        />
                                                    </div>

                                                    <div className="flex flex-col col-span-6 md:col-span-8">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="font-semibold text-foreground/90">{file.originFileName}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    );
                                })
                            }
                            {
                                loading ?
                                    <>
                                        <Button color="default" variant="faded" className='mb-2' disabled>上傳</Button>
                                        <Button color='primary' className='w-full' isLoading>送出</Button>
                                    </>
                                    :
                                    <>
                                        <Button color="default" variant="faded" className='mb-2' onPress={uploadOnPress}>上傳</Button>
                                        <Button color='primary' className='w-full' onPress={submit}>送出</Button>
                                    </>
                            }

                        </div>
                    ) :
                        success ?
                            <div className='w-full h-[50vh] flex flex-col justify-center items-center gap-2 text-success'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="currentColor" viewBox="0 0 256 256"><path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path></svg>
                                <div>成功</div>
                            </div>
                            :
                            <div className='w-full h-[50vh] flex flex-col justify-center items-center gap-2 text-danger'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="currentColor" viewBox="0 0 256 256"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path></svg>
                                <div>失敗</div>
                            </div>
                    )
                }
            </div>
        </Layout>
    )
}

export const getStaticProps = (async (context) => {
    const devMode = process.env.DEV_MODE == '1' || process.env.DEV_MODE == 1;
    const props = { devMode };
    if (devMode) props.uuid = process.env.UUID;
    return { props };
})