/**
 * JSX component that will provide the UI and
 * functionality for the jobs panel that will
 * contain information about the jobs adverts,
 * and provide relevant filters to filter them.
 */

import styles from '@/styles/Recruiter/jobs.module.css';
import { useState, useEffect, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import JobApplicationsIcon from '@/public/assets/job_applications_icon.svg';
import JobViewsIcon from '@/public/assets/job_views_icon.svg';
import Image from 'next/image';
import NewAdvertPage from '@/components/Recruiter/NewJob';
import JobView from '@/components/Recruiter/JobView';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Page = () => {
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('error');
    const closeAlert = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setAlert(false);
    }

    const raiseAlert = (message, type) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const filterMenuOpen = Boolean(anchorEl);
    const [filter, setFilter] = useState('Newest first');
    const [activeJobs, setActiveJobs] = useState([]);
    const [activeJobsCount, setActiveJobsCount] = useState(0);
    const [newAdvert, setNewAdvert] = useState(false);
    const [openJob, setOpenJob] = useState(false);

    useEffect(() => {
        // Update active jobs when filter is changed or when new job is added
        updateActiveJobs();
    }, [filter, newAdvert, openJob]);

    const openNewAdvertScreen = () => {
        axios.post('/api/loadRecruiterData', {
            mode: 'check-recruiter-access',
            id: localStorage.getItem('id')
        }).then(( {data} ) => {
            if (data.data[0].full_access === 1) {
                setNewAdvert(true);
            } else {
                raiseAlert('You do not have permission to do this', 'error');
            }
        });
    }

    const updateActiveJobs = () => {
        axios.post('/api/loadRecruiterData', {
            id: localStorage.getItem('id'),
            mode: {'Newest first': 'list-active-jobs-newest', 'Oldest first': 'list-active-jobs-oldest', 'Applications': 'list-active-jobs-applications', 'Views': 'list-active-jobs-views'}[filter]
        }).then(( {data} ) => {
            if(data.data.length > 0) {
                let listOfJobs = [];
                data.data.map((v) => {
                    let posted = new Date(v.date_posted);
                    let pDD = posted.getDate().toString().padStart(2, "0");
                    let pMM = (posted.getMonth() + 1).toString().padStart(2, "0");
                    let pYYYY = posted.getFullYear().toString();
                    let exp = v.expiring;
                    let expD = new Date(v.exp_date);
                    let eDD = expD.getDate().toString().padStart(2, "0");
                    let eMM = (expD.getMonth() + 1).toString().padStart(2, "0");
                    let eYYYY = expD.getFullYear().toString();
                    let eHH = expD.getHours().toString().padStart(2, "0");
                    let emm = expD.getMinutes().toString().padStart(2, "0");
                    listOfJobs.push([v.title, `${pDD}/${pMM}/${pYYYY}`, exp === 1 ? `${eDD}/${eMM}/${eYYYY} ${eHH}:${emm}` : '', v.applications, v.views, v.id, v.notify])
                });
                setActiveJobs([...listOfJobs]);
                setActiveJobsCount(data.data.length);
            }
        });
    }

    const JobAdvert = (key, title, postedOn, dueBy, applications, views, jobId, notify) => {
        return(
            <div className={notify === 1 ? styles.jobListingMainNotify : styles.jobListingMain} key={key} onClick={() => {setOpenJob(true); localStorage.setItem('jobid', jobId)}}>
                <div className={styles.jobListingLeft}>
                    <div className={styles.jobListingLeftTop}>
                        <span className={styles.jobListingTitle}>{title}</span>
                        <span className={styles.jobListingPosted}>Posted: {postedOn}</span>
                    </div>
                    <span className={styles.jobListingDue}>{dueBy === '' ? '' : 'Deadline: ' + dueBy}</span>
                </div>
                <div className={styles.jobListingRight}>
                    <div className={styles.jobListingStats}>
                        <Image src={JobApplicationsIcon} alt='Job Applications Icon' height={25}/>
                        <span className={styles.jobListingStatDigit}>{applications}</span>
                    </div>
                    <div className={styles.jobListingStats}>
                        <Image src={JobViewsIcon} alt='Job Views Icon' height={25}/>
                        <span className={styles.jobListingStatDigit}>
                            {views > 999 ? (views/1000).toFixed(1) + 'K' : views}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <section className={styles.main}>
            <div className={styles.topSection}>
                <span className={styles.title}>You have <b>{activeJobsCount}</b> active job adverts</span>
                <div className={styles.actionButtonsParent}>
                    <Button
                        variant='contained'
                        size='small'
                        id='r-filterBtn'
                        aria-controls={filterMenuOpen ? 'r-filterMenu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={filterMenuOpen ? 'true' : undefined}
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{'background': '#F0F0F0', 'textTransform': 'capitalize', 'color': '#000000', 'border': '1px solid #000000', 'fontWeight': '600', 'fontFamily': '"Montserrat", sans-serif', 'fontSize': '14.5px', '&:hover': {'background': '#F0F0F0'}, 'width': '145px'}}
                        endIcon={ <ArrowDropDownIcon />}
                    >
                        {filter}
                    </Button>
                    <Menu
                        id='r-filterMenu'
                        anchorEl={anchorEl}
                        open={filterMenuOpen}
                        onClose={() => setAnchorEl(null)}
                        MenuListProps={{
                        'aria-labelledby': 'r-filterBtn',
                        }}
                        className={styles.filterMenu}
                    >
                        <MenuItem divider={true} sx={{'background': '#F0F0F0'}} onClick={(e) => {setFilter(e.target.innerText); setAnchorEl(null)}}>Newest first</MenuItem>
                        <MenuItem value='oldest' divider={true} sx={{'background': '#F0F0F0'}} onClick={(e) => {setFilter(e.target.innerText); setAnchorEl(null)}}>Oldest first</MenuItem>
                        <MenuItem value='applications' divider={true} sx={{'background': '#F0F0F0'}} onClick={(e) => {setFilter(e.target.innerText); setAnchorEl(null)}}>Applications</MenuItem>
                        <MenuItem value='views' sx={{'background': '#F0F0F0'}} onClick={(e) => {setFilter(e.target.innerText); setAnchorEl(null)}}>Views</MenuItem>
                    </Menu>

                    <Button
                        onClick={() => openNewAdvertScreen()}
                        variant='contained'
                        size='small'
                        sx={{'background': '#66b2ff', 'textTransform': 'capitalize', 'color': '#000000', 'border': '1px solid #000000', 'fontWeight': '600', 'fontFamily': '"Montserrat", sans-serif', 'fontSize': '14.5px', '&:hover': {'background': '#66b2ff'}, 'width': '115px', ml: '20px'}}
                        className={styles.actionButtonNewDefault}
                    >New Advert</Button>
                    <Button
                        onClick={() => openNewAdvertScreen()}
                        variant='contained'
                        size='small'
                        sx={{'background': '#66b2ff', 'textTransform': 'capitalize', 'color': '#000000', 'border': '1px solid #000000', 'fontWeight': '600', 'fontFamily': '"Montserrat", sans-serif', 'fontSize': '14.5px', '&:hover': {'background': '#66b2ff'}, 'width': '55px', ml: '20px'}}
                        className={styles.actionButtonNewMobile}
                    >Add</Button>
                </div>
            </div>

            <div>
                {activeJobs.map((v, i) => 
                    JobAdvert(i, v[0], v[1], v[2], v[3], v[4], v[5], v[6])
                )}
            </div>

            {newAdvert ? <NewAdvertPage controlDisplay={setNewAdvert} /> : <></>}
            {openJob ? <JobView controlDisplay={setOpenJob} /> : <></>}

            <Snackbar 
                open={alert} 
                autoHideDuration={5000} 
                onClose={closeAlert} 
                anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
            >
                <Alert onClose={closeAlert} severity={alertType}>{alertText}</Alert>
            </Snackbar>
        </section>
    )
}

export default Page;