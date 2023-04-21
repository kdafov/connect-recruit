/**
 * JSX component that will provide the UI and
 * functionality for the statistics page that will
 * display when the user clicks the overview tab
 */

import s from '@/styles/Admin/Default.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Curve from '@/components/Graphs/Curve';
import CurveGraph from '@/components/Graphs/CurveGraph';
import Bar from '@/components/Graphs/Bar';
import StackedBar from '@/components/Graphs/StackedBar';
import PieCircle from '@/components/Graphs/PieCircle';
import Radar from '@/components/Graphs/Radar';
import Dart from '@/components/Graphs/Dart';

const Overview = () => {
    const [unasnweredApplications, setUnansweredApplications] = useState(0);
    const [unansweredMessages, setUnansweredMessages] = useState(0);
    const [todayApplications, setTodayApplications] = useState(0);
    const [jobPosted, setJobsPosted] = useState(0);
    const [quickApply, setQuickApply] = useState(0);
    const [activity, setActivity] = useState(0);
    const [applicationPerJob, setApplicationPerJob] = useState([]);
    const [viewsPerJob, setViewsPerJob] = useState([]);

    useEffect(() => {
        axios.post('/api/metrics', {
            mode: 'recruiter-metrics',
            id: localStorage.getItem('id')
        }).then(( {data} ) => {
            if (data.status === 200) {
                setUnansweredApplications(data.metric1.A);
                setUnansweredMessages(data.metric1.B);
                setTodayApplications(data.metric1.C);
                setJobsPosted(data.metric1.D);
                setQuickApply(data.metric1.E);
                setActivity(data.metric1.F);
                setApplicationPerJob(data.metric2.A);
                setViewsPerJob(data.metric3.A);
            }
        })
    }, [])

    const SmallDataDisplay = (total, title, w, h, version, individual) => {
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
            <div className={s.quickStat}>
                {SmallDataDisplay(unasnweredApplications, 'To review', 160, 100, 1, [2,4,1,3,4])}
                {SmallDataDisplay(unansweredMessages, 'To answer', 110, 100, 2, [7,0,5,2,2])}
                {SmallDataDisplay(todayApplications, 'Applied today', 80, 100, 3, [4,2,8,4,5])}
            </div>

            

            <div className={s.quickStat}>
                {SmallDataDisplay(jobPosted, 'Jobs posted', 140, 100, 3, [7,7,0,1,4])}
                {SmallDataDisplay(quickApply, 'Quick apply', 110, 100, 2, [5,1,2,3,1])}
                {SmallDataDisplay(activity, 'Activity', 120, 100, 1, [5,6,4,2,6])}
            </div>

            <div className={s.adaptiveFlexBox}>
                <Bar data={applicationPerJob} w={500} h={300} title={'Applications per job'} palette={1} />
                <Bar data={viewsPerJob} w={500} h={300} title={'Views per job'} palette={2} />
            </div>
            <div className={s.adaptiveFlexBoxMobile}>
                <Bar data={applicationPerJob} w={350} h={300} title={'Applications per job'} palette={1} />
                <Bar data={viewsPerJob} w={350} h={300} title={'Views per job'} palette={2} />
            </div>
        </section>
    );
};

export default Overview;