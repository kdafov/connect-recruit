import s from '@/styles/Admin/Default.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Curve from '@/components/Graphs/Curve';
import CurveGraph from '@/components/Graphs/CurveGraph';
import Bar from '@/components/Graphs/Bar';
import StackedBar from '@/components/Graphs/StackedBar';
import PieCircle from '@/components/Graphs/PieCircle';
import Radar from '@/components/Graphs/Radar';

const AdminHomePage = () => {
    const [totalRecruiter, setTotalRecruiter] = useState(0);
    const [indRecruiter, setIndRecruiter] = useState([0]);
    const [totalApplications, setTotalApplications] = useState(0);
    const [indApplications, setIndApplications] = useState([0]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [indJobs, setIndJobs] = useState([0]);

    const [messagesPerDay, setMessagesPerDay] = useState([]);
    const [jobsPerDay, setJobsPerDay] = useState([]);

    const [applicationPerJob, setApplicationPerJob] = useState([]);
    const [viewsPerJob, setViewsPerJob] = useState([]);

    const [pie, setPie] = useState([]);
    const [bestPerformanceJob, setBestPerformanceJob] = useState([]);
    const [enoughData, setEnoughData] = useState(true);

    useEffect(() => {
        // Load data metrics from database
        axios.post('/api/metrics', {
            mode: 'admin-metrics',
            id: localStorage.getItem('id')
        }).then(( {data} ) => {
            if (data.status === 200) {
                try {
                    setTotalRecruiter(data.metric1.A);
                    setIndRecruiter(data.metric1.B);
                    setTotalApplications(data.metric1.C);
                    setIndApplications(data.metric1.D);
                    setTotalJobs(data.metric1.E);
                    setIndJobs(data.metric1.F);
                    setMessagesPerDay(data.metric2.A);
                    setJobsPerDay(data.metric2.B);
                    setApplicationPerJob(data.metric3.A);
                    setViewsPerJob(data.metric3.B);
                    setPie([data.metric4.A, data.metric4.B]);
                    setBestPerformanceJob([data.metric5.applications, data.metric5.views, data.metric5.days_ago, data.metric5.messages, data.metric5.title]);
                    if (data.metric5.title === null) {
                        setEnoughData(false)
                    }
                } catch (e) {
                    setEnoughData(false);
                }
            }
        })
    }, [])

    // Constructor function for small data display generation
    const SmallDataDisplay = (total, individual, title, w, h, version) => {
        return(
            <div className={{1: s.smMetricParentV1, 2: s.smMetricParentV2, 3:s.smMetricParentV3}[version]}>
                <div className={s.smMetricParentLeft}>
                    <span className={s.smBIGtitle}>{total}</span>
                    <span>{title}</span>
                </div>
                <Curve data={individual} h={h} w={w} />
            </div>
        )
    }
    
    return (
        <section className={s.main}>
            {enoughData ? <>
            <div className={s.quickStat}>
                {SmallDataDisplay(totalRecruiter, indRecruiter, 'Recruiters', 100, 100, 1)}
                {SmallDataDisplay(totalApplications, indApplications, 'Applications', 80, 100, 2)}
                {SmallDataDisplay(totalJobs, indJobs, 'Jobs', 140, 100, 3)}
            </div>
            
            <div className={s.adaptiveFlexBox}>
                <CurveGraph data={messagesPerDay} w={500} h={300} title={'#Messages in the last 7 day'} palette={2}/>
                <CurveGraph data={jobsPerDay} w={500} h={300} title={'#Jobs posted in the last 7 day'} palette={1}/>
            </div>
            <div className={s.adaptiveFlexBox}>
                <Bar data={applicationPerJob} w={500} h={300} title={'Applications per job'} palette={1} />
                <Bar data={viewsPerJob} w={500} h={300} title={'Views per job'} palette={2} />
            </div>
            <div className={s.adaptiveFlexBox}>
                <StackedBar data_x={applicationPerJob} data_y={viewsPerJob} h={300} w={800} label_x={'Applications'} label_y={'Views'} />
            </div>
            <div className={s.adaptiveFlexBox}>
                <PieCircle labels={pie[0]} series={pie[1]} h={280} w={500} />
                <Radar title={`Best performing job (${bestPerformanceJob[4]})`} data={bestPerformanceJob} h={280} w={500} />
            </div>


            <div className={s.adaptiveFlexBoxMobile}>
                <CurveGraph data={messagesPerDay} w={350} h={300} title={'#Messages in the last 7 day'} palette={2}/>
                <CurveGraph data={jobsPerDay} w={350} h={300} title={'#Jobs posted in the last 7 day'} palette={1}/>
            </div>
            <div className={s.adaptiveFlexBoxMobile}>
                <Bar data={applicationPerJob} w={350} h={300} title={'Applications per job'} palette={1} />
                <Bar data={viewsPerJob} w={350} h={300} title={'Views per job'} palette={2} />
            </div>
            <div className={s.adaptiveFlexBoxMobile}>
                <StackedBar data_x={applicationPerJob} data_y={viewsPerJob} h={400} w={350} label_x={'Applications'} label_y={'Views'} />
            </div>
            <div className={s.adaptiveFlexBoxMobile}>
                <PieCircle labels={pie[0]} series={pie[1]} h={280} w={350} />
                <Radar title={`Best performing job (${bestPerformanceJob[4]})`} data={bestPerformanceJob} h={280} w={350} />
            </div>
            </> : <h2>There is not enough data for statistics.</h2>}
        </section>
    );
};

export default AdminHomePage;