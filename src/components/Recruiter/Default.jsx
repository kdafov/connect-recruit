/**
 * JSX component that will provide the UI and
 * functionality for the Recruiter home page
 */

import { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import styles from '@/styles/Recruiter/main.module.css';
import axios from 'axios';
import OverviewPage from '@/components/Recruiter/Overview';
import JobsPage from '@/components/Recruiter/JobsPanel';
import BrowseCVPage from '@/components/Recruiter/BrowseCV';

const Page = () => {
    const [tab, setTab] = useState('overview');
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        setTimeout(() => {
            axios.post('/api/loadRecruiterData', {
                id: localStorage.getItem('id'),
                mode: 'resolve-company-name'
            }).then(( {data} ) => {
                if (data.data.length > 0) {
                    setCompanyName(data.data[0].name);
                }
            });
        }, 200);
    }, []);

    return(
        <section className={styles.main}>
            <div className={styles.title}><span>
                {{'overview': `Evaluate the performance of ${companyName}`,
                'jobs': `Job adverts for ${companyName}`,
                'cvbase': `Find the next perfect candidate for ${companyName}`}[tab]}
            </span></div>
            <div>
                <ToggleButtonGroup
                    color="primary"
                    value={tab}
                    exclusive
                    onChange={(e, v) => {setTab(v)}}
                    aria-label="Type of screen displayed"
                    sx={{'background': '#FFFFFF'}}
                    size='large'
                    className={styles.sectionsToggleParent}
                >
                    <ToggleButton value="overview" sx={{'color': '#000000', 'background': '#F0F0F0', 'fontWeight': '600', 'border': '2px solid black', 'borderRadius': '20px', '&.Mui-selected': {backgroundColor: '#C2E0FF'}, '&:hover': {'background': '#C2E0FF'}, fontFamily: '"Montserrat", sans-serif'}} className={styles.sectionsToggleButton}>Overview</ToggleButton>
                    <ToggleButton value="jobs" sx={{'color': '#000000', 'background': '#F0F0F0', 'fontWeight': '600', 'border': '2px solid black', '&.Mui-selected': {backgroundColor: '#C2E0FF'}, '&:hover': {'background': '#C2E0FF'}, fontFamily: '"Montserrat", sans-serif'}} className={styles.sectionsToggleButton}>Job Adverts</ToggleButton>
                    <ToggleButton value="cvbase" sx={{'color': '#000000', 'background': '#F0F0F0', 'fontWeight': '600', 'border': '2px solid black', 'borderRadius': '20px', '&.Mui-selected': {backgroundColor: '#C2E0FF'}, '&:hover': {'background': '#C2E0FF'}, fontFamily: '"Montserrat", sans-serif'}} className={styles.sectionsToggleButton}>Browse CV's</ToggleButton>
                </ToggleButtonGroup>
            </div>

            {
                {'overview': <OverviewPage />,
                'jobs': <JobsPage />,
                'cvbase': <BrowseCVPage />}[tab]
            }
        </section>
    )
}

export default Page;