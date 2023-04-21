/**
 * JSX component that will provide the UI and
 * functionality for the statistics page
 * for the user's page
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
    const [jobsCount, setJobsCount] = useState(0);
    const [companiesCount, setcompaniesCount] = useState(0);
    const [applicationCount, setApplicationCount] = useState(0);
    const [m2Names, setM2Names] = useState([]);
    const [m2Rate, setM2Rate] = useState([]);
    const [bar, setBar] = useState([]);
    const [pie, setPie] = useState([]);
    const [bestPerformanceJob, setBestPerformanceJob] = useState([]);

    useEffect(() => {
        axios.post('/api/metrics', {
            mode: 'user-metrics',
            id: localStorage.getItem('id')
        }).then(( {data} ) => {
            if (data.status === 200) {
                setJobsCount(data.metric1.A);
                setcompaniesCount(data.metric1.B);
                setApplicationCount(data.metric1.C);
                const refinedNames = data.metric2.A.map(item => item.company_name);
                const refinedRates = data.metric2.A.map(item => Math.round(item.non_pending_applications / item.pending_applications * 100));
                setM2Names(refinedNames);
                setM2Rate(refinedRates);
                const words = data.metric3.A.map(item => item.v.split(', ')).flat();
                const result = Object.values(data.metric3).flatMap(v => v.map(o => o.v)).join(',').toLowerCase().split(/[^a-zA-Z]+/).filter(Boolean).reduce((acc, word) => {
                    if (acc.hasOwnProperty(word)) {
                        acc[word]++;
                    } else {
                        acc[word] = 1;
                    }
                    return acc;
                }, {});
                const top5 = Object.entries(result).sort((a, b) => b[1] - a[1]).slice(0, 5);
                setBar(top5.map(([x, y]) => ({ x: x.charAt(0).toUpperCase() + x.slice(1), y })))
                const statuses = Object.values(data.metric5.A).map(item => item.status);
                const metrics = Object.values(data.metric5.A).map(item => item.metric);
                setPie([statuses, metrics]);
                setBestPerformanceJob([data.metric4.applications, data.metric4.views, data.metric4.accepted, data.metric4.messages, data.metric4.company + ' - ' + data.metric4.title]);
            }
        })
    }, [])

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
            <h2 className={s.megaTitle}>In the platform today:</h2>
            <div className={s.quickStat}>
                {SmallDataDisplay(jobsCount, Array.from({length: 5}, () => Math.floor(Math.random() * 7) + 1), 'Jobs', 140, 100, 1)}
                {SmallDataDisplay(companiesCount, Array.from({length: 5}, () => Math.floor(Math.random() * 7) + 1), 'Companies', 110, 100, 2)}
                {SmallDataDisplay(applicationCount, Array.from({length: 5}, () => Math.floor(Math.random() * 7) + 1), 'Applications', 80, 100, 3)}
            </div>

            <h2 className={s.megaTitle}>Discover:</h2>
            <div className={s.adaptiveFlexBox}>
                <div>
                    <span className={s.h}>Response rate of: {m2Names.join(',')}</span>
                    <Dart names={m2Names} rates={m2Rate} w={500} h={300} />
                </div>
                <Radar title={`Best performing job (${bestPerformanceJob[4]})`} data={bestPerformanceJob} h={280} w={500} mode={'u'} />
            </div>

            <div className={s.adaptiveFlexBoxMobile}>
                <div>
                    <span className={s.h}>Response rate of: {m2Names.join(',')}</span>
                    <Dart names={m2Names} rates={m2Rate} w={350} h={300} />
                </div>
                <Radar title={`Best performing job (${bestPerformanceJob[4]})`} data={bestPerformanceJob} h={350} w={350} mode={'u'} />
            </div>

            <h2 className={s.megaTitle}>About you:</h2>
            <div className={s.adaptiveFlexBox}>
                <PieCircle labels={pie[0]} series={pie[1]} h={280} w={500} />
                <Bar data={bar} w={500} h={300} title={'Most looked keywords'} palette={1} />
            </div>

            <div className={s.adaptiveFlexBoxMobile}>
                <PieCircle labels={pie[0]} series={pie[1]} h={280} w={350} />
                <Bar data={bar} w={350} h={300} title={'Most looked keywords'} palette={1} />
            </div>
        </section>
    );
};

export default Overview;