import Head from 'next/head';
import Confirm from '@/components/Confirm';
import CourseCardComponent from '@/components/CourseCardComponent';
import Layout from '@/components/Layout';
import category from '@/data/category.json';
import examString from '@/data/exam.json';
import generalTypeString from '@/data/generalType.json';
import { useState } from 'react';
import useSWR from 'swr';
import { Input, Card, CardHeader, CardBody, CardFooter, Link, Button, Slider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio, Tabs, Tab, Select, SelectItem, Tooltip, CheckboxGroup, Textarea } from "@nextui-org/react";
import { WayCheckbox } from '@/components/WayCheckbox';

import { app } from '@/js/firebaseConfig.js';
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const database = getDatabase(app);
const firestore = getFirestore(app);

function encodedStr(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, i => ('&#' + i.charCodeAt(0) + ';'));
}

function fetchConfig() {
    return get(ref(database, 'courseConfig/')).then(snapshot => snapshot.val());
}

export default function Course() {
    const { data: courseConfig, error: courseConfigError } = useSWR("/courseConfig", fetchConfig);

    // 欄位
    const [className, setClassName] = useState(""); // 課程名稱
    const [categoryType, setCategoryType] = useState("一般"); // [一般, 通識, 跨域]
    const [generalType, setGeneralType] = useState(generalTypeString[0]); // 1: 人文, 2: 社會, 3: 自然
    const [teacher, setTeacher] = useState([]); // 授課教師
    const [year, setYear] = useState(new Date().getFullYear() - 1911); // 開課學年
    const [department, setDepartment] = useState(""); // 開課系別
    const [college, setCollege] = useState(new Set(["商學院"])); // 開課系所屬之院別
    const [point, setPoint] = useState(60); // 課程評分
    const [tempPoint, setTempPoint] = useState(60); // 課程評分(暫存)
    const [way, setWay] = useState(""); // 授課方式
    const [exam, setExam] = useState([]); // 考試模式
    const [evaluation, setEvaluation] = useState(""); // 課程評語

    const [isInvalid, setIsInvalid] = useState({}); // 顯示驗證
    const disclosure = useDisclosure();
    const [loading, setLoading] = useState(false); // 表單送出中
    const [success, setSuccess] = useState(null); // 送出成功
    const [data, setData] = useState(null); // 要上傳的資料

    const formClassNames = { label: "text-md text-default-900 opacity-100", inputWrapper: "border-medium border-transparent hover:border-primary focus:border-primary transition-colors" };
    const formFields = [
        {
            '通識': (
                <RadioGroup
                    label="選擇分類"
                    orientation="horizontal"
                    value={generalType}
                    onValueChange={setGeneralType}
                    classNames={formClassNames}
                >
                    {
                        generalTypeString.map((generalType, index) => (
                            <Radio value={generalType} key={'generalType_' + index}>{generalType}</Radio>
                        ))
                    }
                </RadioGroup>
            )
        },
        {
            'all': (
                <Input
                    type="text"
                    label="課程名稱"
                    value={className}
                    isRequired
                    isInvalid={isInvalid.className}
                    color={isInvalid.className ? "danger" : ""}
                    errorMessage={isInvalid.className && "請輸入課程名稱"}
                    onChange={e => setClassName(e.target.value.trim())}
                    labelPlacement="outside"
                    placeholder=" "
                    classNames={formClassNames}
                />
            ),
            verification: tempIsInvalid => {
                if (className.length == 0) tempIsInvalid.className = true;
                else tempIsInvalid.className = false;
                return tempIsInvalid;
            }
        },
        {
            'all': (
                <div className='w-full flex gap-4'>
                    <Input
                        type="text"
                        label="授課教師"
                        value={teacher.join(',')}
                        isRequired
                        isInvalid={isInvalid.teacher}
                        color={isInvalid.teacher ? "danger" : ""}
                        errorMessage={isInvalid.teacher && "請輸入授課教師"}
                        onChange={e => setTeacher(e.target.value.split(','))}
                        labelPlacement="outside"
                        placeholder=" "
                        description='多位教師請使用半形逗號(,)分隔'
                        classNames={formClassNames}
                    />
                    <Input
                        type="number"
                        label="開課學年"
                        className="w-[10rem]"
                        value={year}
                        isRequired
                        pattern="\d*"
                        required="required"
                        color={isInvalid.year ? "danger" : ""}
                        errorMessage={isInvalid.year && "開課學年無效"}
                        onChange={e => setYear(e.target.value)}
                        labelPlacement="outside"
                        placeholder=" "
                        min={new Date().getFullYear() - 1911 - 5}
                        max={new Date().getFullYear() - 1911}
                        step={1}
                        classNames={formClassNames}
                    />
                </div>
            ),
            verification: tempIsInvalid => {
                if (teacher.length == 0) tempIsInvalid.teacher = true;
                else tempIsInvalid.teacher = false;

                if (!year || year.length == 0 || year > new Date().getFullYear() - 1911 || year < new Date().getFullYear() - 1911 - 5) tempIsInvalid.year = true;
                else tempIsInvalid.year = false;

                return tempIsInvalid;
            }
        },
        {
            '一般': (
                <div className='w-full flex flex-col md:flex-row gap-4'>
                    {
                        courseConfig?.colleges &&
                        <Select
                            label="開課系所屬之院別"
                            isRequired
                            selectedKeys={college}
                            onSelectionChange={setCollege}
                            classNames={formClassNames}
                        >
                            {
                                courseConfig.colleges.filter(c => !c.includes('通識')).map((college, index) => (
                                    <SelectItem key={college} value={college}>{college}</SelectItem>
                                ))
                            }
                        </Select>
                    }
                    <Input
                        type="text"
                        label="開課系別"
                        value={department}
                        isRequired
                        isInvalid={isInvalid.department}
                        color={isInvalid.department ? "danger" : ""}
                        errorMessage={isInvalid.department && "請輸入開課系別"}
                        onChange={e => setDepartment(e.target.value)}
                        placeholder=" "
                        description='可使用簡稱'
                        classNames={formClassNames}
                    />
                </div>
            ),
            '跨域': (
                <div className='w-full flex flex-col md:flex-row gap-4'>
                    {
                        courseConfig?.colleges &&
                        <Select
                            label="開課系所屬之院別"
                            isRequired
                            selectedKeys={college}
                            onSelectionChange={setCollege}
                            classNames={formClassNames}
                        >
                            {
                                courseConfig.colleges.filter(c => !c.includes('通識')).map((college, index) => (
                                    <SelectItem key={college} value={college}>{college}</SelectItem>
                                ))
                            }
                        </Select>
                    }
                    <Input
                        type="text"
                        label="開課系別"
                        value={department}
                        isRequired
                        isInvalid={isInvalid.department}
                        color={isInvalid.department ? "danger" : ""}
                        errorMessage={isInvalid.department && "請輸入開課系別"}
                        onChange={e => setDepartment(e.target.value)}
                        placeholder=" "
                        description='可使用簡稱'
                        classNames={formClassNames}
                    />
                </div>
            ),
            verification: tempIsInvalid => {
                if (department.length == 0) tempIsInvalid.department = true;
                else tempIsInvalid.department = false;
                return tempIsInvalid;
            }
        },
        {
            'all': (
                <Slider
                    label="評分"
                    size="sm"
                    step={1}
                    maxValue={100}
                    minValue={0}
                    color="primary"
                    value={point}
                    onChange={value => {
                        if (isNaN(Number(value))) return;
                        setPoint(value);
                        setTempPoint(value);
                    }}
                    renderValue={({ children, ...props }) => (
                        <output {...props}>
                            <Tooltip
                                className="text-tiny text-default-500 rounded-md"
                                content="按下 Enter 確認"
                                placement="left"
                            >
                                <Input
                                    className="w-14 text-right"
                                    classNames={formClassNames}
                                    type="text"
                                    id='pointTextInput'
                                    value={tempPoint}
                                    onChange={e => setTempPoint(e.target.value)}
                                    labelPlacement="outside"
                                    onKeyDown={e => {
                                        if (e.key === "Enter" && !isNaN(Number(e.target.value))) {
                                            let point = Number(e.target.value);
                                            if (point > 100) point = 100;
                                            else if (point < 0) point = 0;
                                            setPoint(point);
                                            setTempPoint(point);
                                        }
                                    }}
                                />
                            </Tooltip>
                        </output>
                    )}
                    classNames={formClassNames}
                />
            )
        },
        {
            'all': (
                <Input
                    type="text"
                    label="授課方式"
                    value={way}
                    onChange={e => setWay(e.target.value)}
                    labelPlacement="outside"
                    placeholder=" "
                    classNames={formClassNames}
                />
            )
        },
        {
            'all': (
                <CheckboxGroup
                    className="gap-1"
                    label="考試模式(可複選)"
                    orientation="horizontal"
                    classNames={formClassNames}
                    value={exam}
                    onChange={setExam}
                >
                    {
                        examString.map((e, index) => <WayCheckbox key={"way_" + index} value={e}>{e}</WayCheckbox>)
                    }
                </CheckboxGroup>
            )
        },
        {
            'all': (
                <Textarea
                    label="課程評語"
                    value={evaluation}
                    onChange={e => setEvaluation(e.target.value)}
                    labelPlacement="outside"
                    description="請以客觀且不具辱罵及攻擊性的字眼填寫"
                    classNames={formClassNames}
                />
            )
        }
    ];

    function submit() {
        let tempIsInvalid = { ...isInvalid };
        for (let i = 0; i < formFields.length; i++) {
            const field = formFields[i];
            if (field.verification) {
                if (field.all || field[categoryType]) {
                    tempIsInvalid = field.verification(tempIsInvalid);
                }
            }
        }
        setIsInvalid(tempIsInvalid);
        const isValid = !Object.keys(tempIsInvalid).map(key => tempIsInvalid[key]).reduce((count, value) => count || value, false);
        if (!isValid) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        var collegeValue = college.values().next().value;
        var result = {
            className,
            teacher: teacher.map(value => value.trim()).filter(value => value != ''),
            year: parseInt(year),
            department,
            college: collegeValue,
            point: parseInt(point),
            way,
            evaluation: encodedStr(evaluation).replace(/\n/gi, '<br>'),
            date: new Date().toISOString(),
            category: collegeValue,
            exam: exam.join(',')
        };
        if (categoryType == '通識') {
            result.className = `${generalType}通識︰${result.className}`;
            result.category = `${generalType}通識`;
            result.department = '';
            result.college = '';
        } else if (categoryType == '跨域') {
            result.className = `跨域︰${result.className}`;
        }
        setData(result);
        disclosure.onOpen();
    }

    async function upload() {
        setLoading(true);
        try {
            const docRef = await addDoc(collection(firestore, "evaluations"), data);
            console.log("Document written with ID: ", docRef.id);
            setSuccess(true);
        } catch (error) {
            console.error("Error adding document: ", error);
            setSuccess(false);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <Layout>
            <Head>
                {/* HTML Meta Tags  */}
                <title>新增課程評價 | 每日文大</title>
                <meta name='keywords' content='每日文大,文大bot,課程評價' />
                <meta name='description' content='文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。' />

                {/* Facebook Meta Tags */}
                {/* <meta property="og:url" content="https://daily-pccu.web.app/" /> */}
                <meta property="og:type" content="website" /> {/* article */}
                <meta property='og:title' content='新增課程評價 | 每日文大' />
                <meta property='og:description' content='文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。' />
                <meta property="og:image" content="https://daily-pccu.web.app/favicon_package/mstile-310x310.png" />
                {/*
                    檔案大小：< 8MB
                    檔案尺寸：建議尺寸 1200x630
                    對於圖片的內容 FB 有提供 圖像文字檢查工具 的網站，協助檢測。
                    網址的 url 一定要使用絕對路徑
                */}

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="app" /> {/* summary, summary_large_image, app, player */}
                <meta property="twitter:domain" content="daily-pccu.web.app" />
                {/* <meta property="twitter:url" content="https://daily-pccu.web.app/" /> */}
                <meta name="twitter:title" content="新增課程評價 | 每日文大" />
                <meta name="twitter:description" content="文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。" />
                <meta name="twitter:image" content="https://daily-pccu.web.app/favicon_package/mstile-310x310.png" />
            </Head>
            <Confirm
                title='確認新增'
                content={<CourseCardComponent e={data} isDemo={true} />}
                disclosure={disclosure}
                size='5xl'
                confirm={upload}
                placement='center'
            />
            <div className='container mx-auto pt-[8.5rem] flex flex-col md:flex-row justify-between item-start mb-[5rem]'>
                <div className='px-4'>
                    <h1 className='text-3xl'>新增課程評價</h1>
                    <div className='opacity-70 leading-7 mt-4'>
                        您可以提供課程具體的資訊、分享您的觀點，以幫助所有同學未來選課有資訊可以參考。感謝您抽出寶貴的時間新增課程評價，您的參與將幫助大家獲得更多選課參考資訊。
                    </div>
                </div>
                <div className="w-full px-4 flex flex-col">
                    <Card>
                        <CardBody className='gap-4'>
                            {
                                success == null ?
                                    <>
                                        <Tabs
                                            fullWidth
                                            size="md"
                                            selectedKey={categoryType}
                                            onSelectionChange={setCategoryType}
                                        >
                                            {
                                                category.map(c => {
                                                    return (
                                                        <Tab key={c} title={c}>
                                                            <div className='flex flex-col gap-4'>
                                                                {
                                                                    formFields
                                                                        .map((field, index) => {
                                                                            if (field.all) {
                                                                                return (
                                                                                    <div key={'field_' + index}>{field.all}</div>
                                                                                );
                                                                            }
                                                                            if (field[c]) {
                                                                                return (
                                                                                    <div key={'field_' + index}>{field[c]}</div>
                                                                                );
                                                                            }
                                                                            return (
                                                                                <div key={'field_' + index}></div>
                                                                            );
                                                                        })
                                                                }
                                                            </div>
                                                        </Tab>
                                                    )
                                                })
                                            }
                                        </Tabs>
                                        {
                                            loading ?
                                                <Button color='primary' isLoading>送出</Button>
                                                :
                                                <Button color='primary' onClick={submit}>送出</Button>
                                        }
                                    </>
                                    :
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
                            }
                        </CardBody>
                    </Card>
                </div>

            </div>
        </Layout>
    )
}