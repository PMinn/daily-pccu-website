import { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import { Input, Card, CardBody, Button, Chip, useDisclosure, Tabs, Tab, Switch, CheckboxGroup } from "@nextui-org/react";
import { app } from '@/js/firebaseConfig.js';
import { getDatabase, ref, get, set } from "firebase/database";
import Alert from '@/components/Alert';
import Layout from '@/components/Layout';
import { WeatherIcon, EatIcon } from '@/components/Icons';
import { WeatherCheckbox } from '@/components/WeatherCheckbox';

export default function Settings() {
    const [isLoading, setIsLoading] = useState(true);
    const [weatherLocations, setWeatherLocations] = useState([]);
    const [weatherLocationsChecked, setWeatherLocationsChecked] = useState([]);
    const { isOpen: errorIsOpen, onOpen: errorOnOpen, onOpenChange: errorOnOpenChange } = useDisclosure();
    const { isOpen: weatherOverflowIsOpen, onOpen: weatherOverflowOnOpen, onOpenChange: weatherOverflowOnOpenChange } = useDisclosure();
    const [searchValue, setSearchValue] = useState("");
    const [isEatCustom, setIsEatCustom] = useState(false);
    const [customValue, setCustomValue] = useState("");
    const [customList, setCustomList] = useState([]);
    const [liffObject, setLiffObject] = useState(null);
    const [liffContext, setLiffContext] = useState(null);
    const [errorText, setErrorText] = useState(null);
    const database = getDatabase(app);

    // 資料庫儲存
    async function save(path, data) {
        await set(ref(database, path), data);
    }

    // 天氣搜尋地點
    const filteredWeatherLocations = useMemo(() => {
        let filtered = [...weatherLocations];
        filtered = filtered.filter(weatherLocation => weatherLocation.location.includes(searchValue) || weatherLocation.city.includes(searchValue));
        return filtered;
    }, [weatherLocations, searchValue]);

    // 天氣點選地點
    async function weatherLocationsOnChange(value) {
        if (value.length > 11) {
            weatherOverflowOnOpen();
            return;
        }
        setWeatherLocationsChecked(value);
        await save(`users/${liffContext.userId}/weather`, value);
    }

    // 吃什麼開關改變
    async function isEatCustomOnChange(value) {
        setIsEatCustom(value);
        await save(`users/${liffContext.userId}/isEatAvailable`, value);
    }

    // 吃什麼新增自定義選項
    async function addNewCustom() {
        var customListSet = new Set(customList);
        customListSet.add(customValue);
        var newCustomList = Array.from(customListSet);
        setCustomList(newCustomList);
        setCustomValue("");
        await save(`users/${liffContext.userId}/eat`, newCustomList.join(','));
    }

    // 吃什麼移除自定義選項
    async function customListOnClose(customToRemove) {
        var newCustomList = customList.filter(custom => custom !== customToRemove);
        setCustomList(newCustomList);
        await save(`users/${liffContext.userId}/eat`, newCustomList.join(','));
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

    // 讀取資料
    async function data_init(userId) {
        return await Promise.all([
            get(ref(database, 'weatherLocations/')).then(snapshot => snapshot.val()),
            get(ref(database, `users/${userId}`)).then(snapshot => snapshot.val())
        ])
            .then(([wl, user]) => {
                setWeatherLocations(wl);
                setWeatherLocationsChecked(user.weather);
                setIsEatCustom(user.isEatAvailable);
                setCustomList(user.eat.split(',').filter(e => e));
            })
            .catch((e) => {
                if (typeof e === 'object') e = JSON.stringify(e);
                setErrorText(`取得資料失敗，請稍後重試，或是將此頁面截圖並回報錯誤。[id:${userId},err:${e}]`);
                errorOnOpen();
            })
    }

    // 發生錯誤時
    function handleError() {
        liffObject.closeWindow();
        window.close();
    }

    useEffect(() => {
        (async () => {
            var liffId = "1655168208-29vA01a6";
            try {
                if (process?.env?.SETTINGS_LIFF_ID) liffId = process.env.SETTINGS_LIFF_ID;
                else if (context.type == "none" || context.type == "external") {
                    alert("請使用正常路徑開啟");
                    return;
                }
            } catch { }

            const context = await liff_init(liffId);

            var isDev = false;
            var userId = "";
            try {
                if (process?.env?.UUID) {
                    userId = process.env.UUID;
                    isDev = true;
                }
            } catch { }

            if (isDev) {
                await data_init(process.env.UUID);
                setLiffContext({ userId: process.env.UUID });
            } else {
                await data_init(context.userId);
                setLiffContext(context);
            }
            // .catch(err => {
            //     setErrorText(`錯誤代碼:\n${err.code}\n\n錯誤訊息:\n${err.message}\n請重新開啟頁面`);
            //     errorOnOpen();
            // })
            setIsLoading(false);
        })();
    }, []);

    return (
        <Layout options={{ footer: { hidden: true }, nav: { head: { as: "div" } } }}>
            <Head>
                <title>設定 | 每日文大</title>
            </Head>
            <Alert
                title="發生錯誤"
                content={errorText}
                disclosure={{ isOpen: errorIsOpen, onOpen: errorOnOpen, onOpenChange: errorOnOpenChange }}
                className="min-h-50"
                callback={handleError}
                isDismissable={false}
            />
            <Alert
                content="因為 Line 的限制，最多只能選擇12個地點。"
                disclosure={{ isOpen: weatherOverflowIsOpen, onOpen: weatherOverflowOnOpen, onOpenChange: weatherOverflowOnOpenChange }}
                className="min-h-50"
            />
            <div className='container mx-auto pt-[7.5rem] flex flex-col items-center min-h-screen'>
                {liffContext &&
                    <div className='px-4 w-full'>
                        {
                            !isLoading &&
                            <Tabs
                                color="primary"
                                variant="underlined"
                            >
                                <Tab
                                    key="weather"
                                    title={
                                        <div className="flex items-center space-x-2">
                                            <WeatherIcon width="1rem" />
                                            <span>天氣</span>
                                        </div>
                                    }
                                >
                                    <Input
                                        isClearable
                                        type="search"
                                        variant="bordered"
                                        placeholder="搜尋"
                                        onClear={() => setSearchValue("")}
                                        value={searchValue}
                                        onChange={e => setSearchValue(e.target.value)}
                                    />
                                    <CheckboxGroup
                                        value={["大義館7F"]}
                                        className="w-full mt-4"
                                        isDisabled
                                    >
                                        {("大義館7F".includes(searchValue) || "文化大學".includes(searchValue)) &&
                                            <WeatherCheckbox
                                                value="大義館7F"
                                                city="文化大學"
                                            />}
                                    </CheckboxGroup>
                                    <CheckboxGroup
                                        value={weatherLocationsChecked}
                                        onChange={weatherLocationsOnChange}
                                        className="w-full mt-2"
                                    >
                                        {filteredWeatherLocations.map((weatherLocation, index) => (
                                            <WeatherCheckbox
                                                value={weatherLocation.location}
                                                city={weatherLocation.city}
                                                key={"weather_" + index}
                                            />
                                        ))}
                                    </CheckboxGroup>
                                </Tab>
                                <Tab
                                    key="eat"
                                    title={
                                        <div className="flex items-center space-x-2">
                                            <EatIcon width="1rem" />
                                            <span>吃什麼</span>
                                        </div>
                                    }
                                >
                                    <div className="flex flex-col gap-2">
                                        <Switch isSelected={isEatCustom} onValueChange={isEatCustomOnChange}>自定義</Switch>
                                        <Card className='mt-2'>
                                            <CardBody>
                                                <div className='flex items-center gap-2'>
                                                    <Input
                                                        placeholder="輸入自定義選項"
                                                        disabled={!isEatCustom}
                                                        value={customValue}
                                                        onChange={e => setCustomValue(e.target.value)}
                                                        variant="underlined"
                                                    />
                                                    {!isEatCustom ?
                                                        <Button isDisabled>新增</Button>
                                                        :
                                                        <Button disabled={!isEatCustom} onClick={addNewCustom}>新增</Button>
                                                    }
                                                </div>
                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                    {customList.map((custom, index) => (
                                                        <Chip key={'custom_' + index} onClose={() => customListOnClose(custom)} isDisabled={!isEatCustom} variant="flat">
                                                            {custom}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </Tab>
                            </Tabs>
                        }
                    </div>
                }
            </div>
        </Layout>
    )
}