import Link from 'next/link';
import { Card, CardHeader, CardBody, CardFooter, Progress, CheckboxGroup } from "@heroui/react";
import examString from '@/data/exam.json';
import { WayChip } from '@/components/WayChip';

export default function CourseCard({ e, isDemo, setRevelationConfirmShow, setRevelationID, setShareErrorConfirmShow }) {
    function shareOnClick(shareData) {
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            setShareErrorConfirmShow();
        }
    }

    return (
        <Card key={'course_' + e.id}>
            <CardHeader className='flex justify-between'>
                <div className='font-bold text-lg'>{e.className}</div>
                <div className='flex gap-2 cursor-pointer opacity-50'>
                    <div
                        title="分享"
                        onClick={isDemo ? null :
                            () => shareOnClick({
                                title: `${e.teacher.join('和')}的${e.className} 的課程評價`,
                                text: `在每日文大課程評價中，查看${e.teacher.join('和')}的${e.className}。`,
                                url: 'https://daily-pccu.web.app/course/id/' + e.id,
                            })
                        }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" fill='currentColor' viewBox="0 0 256 256"><path d="M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z"></path></svg>
                    </div>
                    <div
                        title="審查"
                        onClick={isDemo ? null :
                            () => {
                                setRevelationConfirmShow();
                                setRevelationID(e.id);
                            }
                        }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" fill='currentColor' viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                <div>{e.department}</div>
                <div className='mt-3 flex gap-2'>
                    {
                        e.teacher.map(teacher => <Link className='underline underline-offset-4' href={isDemo ? '' : `/course/teacher/${teacher}`} key={`course_${teacher}`}>{teacher}</Link>)
                    }
                </div>
                {
                    e.point >= 80 ?
                        <Progress
                            label="評分"
                            value={e.point}
                            color="success"
                            showValueLabel={true}
                            size="sm"
                            className='mt-3'
                            classNames={{ value: "text-success" }}
                        />
                        :
                        e.point >= 60 ?
                            <Progress
                                label="評分"
                                value={e.point}
                                color="warning"
                                showValueLabel={true}
                                size="sm"
                                className='mt-3'
                                classNames={{ value: "text-warning" }}
                            />
                            :
                            <Progress
                                label="評分"
                                value={e.point}
                                color="danger"
                                showValueLabel={true}
                                size="sm"
                                className='mt-3'
                                classNames={{ value: "text-danger" }}
                            />
                }
                <div className='flex flex-wrap justify-around md:justify-start gap-2 mt-3'>
                    {
                        examString.map((exam, index) => (
                            e.exam.includes(exam) ?
                                <WayChip key={'exam_' + index} value={exam} isDemo={true} isSelected>{exam}</WayChip>
                                :
                                <WayChip key={'exam_' + index} value={exam} isDemo={true}>{exam}</WayChip>
                        ))
                    }
                </div>
                <div className=' mt-3'>授課方式:<br />
                    {e.way}
                </div>
                <div className='w-full whitespace-pre-line mt-3' dangerouslySetInnerHTML={{ __html: "課程評語:<br />" + e.evaluation }}></div>
            </CardBody>
            <CardFooter className='text-sm flex justify-between'>
                <div>{e.year}學年</div>
                <div>{new Date(e.date).toLocaleDateString()}</div>
            </CardFooter>
        </Card >
    )
}