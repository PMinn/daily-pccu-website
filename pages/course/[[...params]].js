import Head from 'next/head'
import Confirm from '@/components/Confirm';
import Alert from '@/components/Alert';
import CourseCardComponent from '@/components/CourseCardComponent';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from '@/styles/course.module.css';

import { app } from '@/js/firebaseConfig.js';
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Input, Card, CardHeader, CardBody, CardFooter, Link, Button, Accordion, AccordionItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";

const database = getDatabase(app);
const firestore = getFirestore(app);

async function fetchFirestoreWithYear(type, keyword) {
    var q;
    if (type == 'college') {
        q = query(collection(firestore, "evaluations"), where('category', '==', keyword));
    } else if (type == 'teacher') {
        q = query(collection(firestore, "evaluations"), where('teacher', 'array-contains', keyword));
    } else {
        return [];
    }
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        var d = [];
        querySnapshot.forEach(doc => {
            var docData = doc.data();
            docData.id = doc.id;
            d.push(docData);
        });
        d.sort((a, b) => b.year - a.year);
        return d;
    } else {
        return [];
    }
}

async function fetchFirestoreById(id) {
    const docSnap = await getDoc(doc(firestore, "evaluations", id));
    if (docSnap.exists()) {
        var data = docSnap.data();
        data.id = id;
        return [data];
    }
    return [];
}

async function fetchDatabase(pathname) {
    pathname = decodeURI(pathname);
    // if (pathname == '/course/[[...params]]') return { title: '', data: [] };
    var pathArray = decodeURI(pathname).split('/');
    if (pathArray.length == 4) {
        if (pathArray[2] == 'college' || pathArray[2] == 'teacher') { // '/course/college/文學院' or '/course/teacher/王小明' 
            return {
                title: `${pathArray[3]}-課程評價 | 每日文大`,
                data: await fetchFirestoreWithYear(pathArray[2], pathArray[3])
            }
        } else if (pathArray[2] == 'id') {// '/course/id/-MTyASIvwwbHs9Vz-fu9'
            return {
                title: '課程評價 | 每日文大',
                data: await fetchFirestoreById(pathArray[3])
            }
        }
    }
    return { title: '課程評價 | 每日文大', data: [] };
}

function fetchConfig() {
    return get(ref(database, 'courseConfig/')).then(snapshot => snapshot.val())
}

function Menu({ courseConfig }) {
    return (courseConfig ?
        courseConfig.colleges.map((college, index) => {
            return (
                <Button color="default" variant="light" href={`/course/college/${college}`} className='w-full text-left mb-1' as={Link} key={'college_link_' + index}>{college}</Button>
            )
        })
        :
        <></>
    )

}

export default function Course() {
    const [revelationID, setRevelationID] = useState("");
    const router = useRouter();
    const { isOpen: isRevelationOpen, onOpen: onRevelationOpen, onOpenChange: onRevelationOpenChange } = useDisclosure();
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onOpenChange: onSuccessOpenChange } = useDisclosure();
    const { isOpen: isShareErrorOpen, onOpen: onShareErrorOpen, onOpenChange: onShareErrorOpenChange } = useDisclosure();
    const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onOpenChange: onMobileMenuOpenChange } = useDisclosure();

    var pathname = router.asPath.replace(/([^#]+)#[^#]+/g, "$1");
    const { data, error: dataError } = useSWR(pathname, fetchDatabase);
    const { data: courseConfig, error: courseConfigError } = useSWR("/courseConfig", fetchConfig);

    function search(e) {
        if (data && data.data.length != 0) {
            var keyWord = e.target.value;
            document.querySelectorAll('#blocks>*').forEach(block => {
                if (block.innerText.includes(keyWord)) block.removeAttribute('hidden');
                else block.setAttribute('hidden', 'true');
            })
        } else {
            e.target.value = '';
        }
    }

    async function submitRevelation() {
        var checkedInput = document.getElementById('revelation').querySelector('*:checked');
        if (checkedInput) {
            await fetch('https://script.google.com/macros/s/AKfycbz5-jKCREsM5trGoPGoZojMQiHPr_EMEw2fUmhiOGf0RTr_pfTvXcCzPc_Irl6T1M0/exec', {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain; charset=utf-8"
                },
                body: JSON.stringify({
                    id: revelationID,
                    reason: checkedInput.value
                })
            })
            onSuccessOpen();
        }
    }

    useEffect(() => {
        if (location.host == 'daily-pccu.web.app') {
            const analytics = getAnalytics(app);
            function handleRouteChange(pathname) {
                var title = "課程評價 | 每日文大";
                var pathArray = decodeURI(pathname).split('/');
                if (pathArray.length == 4) title = `${pathArray[3]}-課程評價 | 每日文大`;
                logEvent(analytics, 'page_view', {
                    page_location: `https://daily-pccu.web.app/${pathname}`,
                    page_title: title
                });
            }
            router.events.on('routeChangeStart', handleRouteChange);
        }
    }, []);

    return (
        <Layout>
            <Head>
                {/* HTML Meta Tags  */}
                <title>{data ? data.title : "課程評價 | 每日文大"}</title>
                <meta name='keywords' content='每日文大,文大bot,課程評價' />
                <meta name='description' content='文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。' />

                {/* Facebook Meta Tags */}
                {/* <meta property="og:url" content="https://daily-pccu.web.app/" /> */}
                <meta property="og:type" content="website" /> {/* article */}
                {(data ? <meta property="og:title" content={data.title} /> : <meta property="og:title" content="課程評價 | 每日文大" />)}
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
                {(data ? <meta property="twitter:title" content={data.title} /> : <meta property="twitter:title" content="課程評價 | 每日文大" />)}
                <meta name="twitter:description" content="文化大學學生必看的課程評價網站，探索每日文大的課程評價，作為選課參考，分享對課程的評價，發現受歡迎的課程和大家最真實的意見。" />
                <meta name="twitter:image" content="https://daily-pccu.web.app/favicon_package/mstile-310x310.png" />
            </Head>
            <Confirm
                title='審查'
                content={
                    <RadioGroup defaultValue="內容有誤" id='revelation'>
                        <Radio value="內容有誤">內容有誤</Radio>
                        <Radio value="中傷、歧視或謾罵他人">中傷、歧視或謾罵他人</Radio>
                        <Radio value="傳播個資(電話、電郵、任何軟體ID等)">傳播個資(電話、電郵、任何軟體ID等)</Radio>
                        <Radio value="重複張貼">重複張貼</Radio>
                        <Radio value="含色情、血腥、騷擾等令人不適之內容">含色情、血腥、騷擾等令人不適之內容</Radio>
                        <Radio value="包含廣告、商業宣傳之內容">包含廣告、商業宣傳之內容</Radio>
                        <Radio value="內容明顯無意義">內容明顯無意義</Radio>
                        <Radio value="其他原因">其他原因</Radio>
                    </RadioGroup>
                }
                confirm={submitRevelation}
                disclosure={{ isOpen: isRevelationOpen, onOpen: onRevelationOpen, onOpenChange: onRevelationOpenChange }}
            />
            <Alert
                title=''
                content={
                    <div className='w-full h-[50vh] flex flex-col justify-center items-center gap-2 text-success'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="currentColor" viewBox="0 0 256 256"><path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path></svg>
                        <div>成功</div>
                    </div>
                }
                disclosure={{ isOpen: isSuccessOpen, onOpen: onSuccessOpen, onOpenChange: onSuccessOpenChange }}
            />
            <Alert
                title='分享錯誤'
                content='您的瀏覽器不支援分享功能，請使用其他瀏覽器。'
                disclosure={{ isOpen: isShareErrorOpen, onOpen: onShareErrorOpen, onOpenChange: onShareErrorOpenChange }}
            />
            <div className='container mx-auto flex pt-[7.5rem] min-h-full mb-[5rem]'>
                <Card className='mx-4 hidden md:flex w-[400px] min-w-[400px] max-w-[400px] sticky top-[7.5rem] h-[80vh]'>
                    <CardBody className='overflow-y-scroll grow'>
                        <Menu courseConfig={courseConfig} />
                    </CardBody>
                    <CardFooter>
                        <Button as={Link} color='primary' href="/addCourse" className='w-full' target='_blank'>新增評價</Button>
                    </CardFooter>
                </Card>

                <Modal
                    isOpen={isMobileMenuOpen}
                    onOpenChange={onMobileMenuOpenChange}
                    placement="top-center"
                    scrollBehavior="inside"
                    className='h-full'
                >
                    <ModalContent>
                        <ModalBody className='pb-5'>
                            <Menu courseConfig={courseConfig} />
                        </ModalBody>
                        <ModalFooter>
                            <Button as={Link} color='primary' href="/addCourse" className='w-full' target='_blank'>新增評價</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Button onClick={onMobileMenuOpen} color="primary" className='p-0 md:hidden w-[50px] min-w-[50px] h-[50px] justify-center items-center rounded-full shadow-2xl fixed bottom-[25px] right-[25px] z-40'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 256 256" fill='currentColor'><path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path></svg>
                </Button>
                <div className={'px-4 ' + styles.result}>
                    {
                        (data &&
                            (data.data.length != 0 ?
                                <Input
                                    type="search"
                                    placeholder="搜尋"
                                    startContent={<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill='currentColor' viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>}
                                    onInput={search}
                                />
                                :
                                <Input
                                    type="search"
                                    placeholder="搜尋"
                                    startContent={<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill='currentColor' viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>}
                                    isDisabled
                                />
                            )
                        )
                    }
                    <div id="blocks" className='flex flex-col gap-5 mt-5'>
                        {
                            (data &&
                                (data.data.length != 0 ?
                                    data.data.map(e => {
                                        return (
                                            <CourseCardComponent
                                                e={e}
                                                setRevelationConfirmShow={onRevelationOpen}
                                                setRevelationID={setRevelationID}
                                                setShareErrorConfirmShow={onShareErrorOpen}
                                            />
                                        )
                                    })
                                    :
                                    <div className='w-full h-[50svh] text-center flex flex-col justify-center items-center'>
                                        <div className='text-xl'>沒有結果</div>
                                        <div className='text-sm opacity-50 mt-2'>在選單中，依照年份及院別可查詢其他評價。</div>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}