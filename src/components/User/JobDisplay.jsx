/**
 * JSX component that will provide the UI and
 * functionality for the screen that will open
 * when the user clicks on job advert.
 */

import styles from '@/styles/User/jobdisplay.module.css';
import { useState, forwardRef, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import axios from 'axios';
import Image from 'next/image';
import LocationIcon from '@/public/assets/location_icon.svg';
import TimeIcon from '@/public/assets/time_icon.svg';
import OfficeIcon from '@/public/assets/office_icon.svg';
import DollarSignIcon from '@/public/assets/job_salary_icon.svg';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LazyLoadImg from '@/public/images/lazy_load_img.png';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SpaIcon from '@mui/icons-material/Spa';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import QuickApplyPrompt from '@/components/User/QuickApply';
import Apply from '@/components/User/Screening';
import MessageBox from '@/components/User/Message';

const Page = (props) => {
    const hideMenu = () => {
        props.control(-1);
    }

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('error');
    const [alertTime, setAlertTime] = useState(5000);
    const closeAlert = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setAlert(false);
    }

    const raiseAlert = (message, type, time = 5000) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
        setAlertTime(time)
    }

    const NavBlock = (name, index, icon) => {
        return(
            <div className={index === panel ? styles.activeOption : styles.option} onClick={() => setPanel(index)}>
                <span className={styles.desktop}>{name}</span>
                <span className={styles.mobile}>{icon}</span>
            </div>
        )
    }

    const [panel, setPanel] = useState(0);
    const [company, setCompany] = useState('Company Name');
    const [jobTitle, setJobTitle] = useState('Job Role');
    const [jobLocation, setJobLocation] = useState('Job Location');
    const [jobType, setJobType] = useState('Job Type');
    const [jobMode, setJobMode] = useState('Job Mode');
    const [jobSalary, setJobSalary] = useState('0 - 1000');
    const [jobPosted, setJobPosted] = useState('24/05/2023');
    const [jobExpiring, setJobExpiring] = useState('20/05/2023 09:00');
    const [jobViews, setJobViews] = useState('1562');
    const [jobApplications, setJobApplications] = useState('23');
    const [fastApply, setFastApply] = useState(false);
    const [companyLogo, setCompanyLogo] = useState('');
    const [companyInfo, setCompanyInfo] = useState('text1');
    const [companyDescription, setCompanyDescription] = useState('text2');
    const [companyReq, setCompanyReq] = useState('text3');
    const [comapnyBenefit, setCompanyBenefit] = useState('text4');
    const [companyMore, setCompanyMore] = useState('text5');
    const [dmAllowed, setDmAllowed] = useState(true);

    const [actionScreen, setActionScreen] = useState(-1);

    useEffect(() => {
        localStorage.setItem('jobid', props.val);
        axios.post('/api/loadUserData', {
            mode: 'job-advert-info',
            jobid: props.val
        }).then(( {data} ) => {
            if (data.status === 200) {
                const v = data.data;
                setCompany(v.company_name);
                setJobTitle(v.job_title);
                setJobLocation(v.location);
                setJobType(v.job_type + ' / ' + v.job_level);
                setJobMode(v.mode);
                setJobSalary(v.salary);
                setJobPosted(props.c1(v.date_posted));
                setJobExpiring(v.expiring === 1 ? props.c2(v.exp_date) : '');
                setJobViews(v.views);
                setJobApplications(v.applications);
                setFastApply(v.fast_apply === 1 ? true : false);
                setCompanyLogo(v.logo);
                setCompanyInfo(v.company_description);
                setCompanyDescription(v.description);
                setCompanyReq(v.requirements);
                setCompanyBenefit(v.benefits);
                setCompanyMore(v.add_info);
                setDmAllowed(v.dmAccess === 1 ? true : false);
            }
        });
    }, []);

    const saveJob = () => {
        axios.post('/api/saveJob', {
            user: localStorage.getItem('id'),
            job: localStorage.getItem('jobid')
        }).then(( {data} ) => {
            if(data.status === 200) {
                raiseAlert('Job saved', 'success', 1500);
            }
        })
    }

    const startApplication = () => {
        axios.post('/api/loadUserData', {
            mode: 'check-job-application-rights',
            user: localStorage.getItem('id'),
            job: localStorage.getItem('jobid')
        }).then(( {data} ) => {
            if (data.data === 0) {
                fastApply ? setActionScreen(0) : setActionScreen(1)
            } else {
                raiseAlert('You have ongoing application already', 'error');
            }
        });
    }

    return(
        actionScreen === -1 ? (
        <div className={styles.main} onClick={(e) => {
            if (typeof e.target.className === 'string' && e.target.className.includes("main")) {
                // User clicked outside of popup :. assuming to close
                hideMenu();
            }
        }}>
            <div className={styles.exitParent}>
                <div className={styles.exitButton} onClick={() => {hideMenu()}}>X</div>
            </div>
            <div className={styles.sub}>
                <div className={styles.topPanel}>
                    <div className={styles.left}>
                        <div className={styles.leftTop}>
                            <img src={companyLogo === '' ? LazyLoadImg : companyLogo} alt={'Company logo'} className={styles.companyLogo} />
                            <div className={styles.leftTopInfo}>
                                <span className={styles.company}>{company}</span>
                                <span className={styles.title}>{jobTitle}</span>
                            </div>
                        </div>
                        <div className={styles.leftBottom}>
                            <div className={styles.stat}>
                                <Image src={LocationIcon} alt='Location icon' height={24} width={24} />
                                <span>{jobLocation}</span>
                            </div>
                            <div className={styles.stat}>
                                <Image src={TimeIcon} alt='Time icon' height={24} width={24} />
                                <span>{jobType}</span>
                            </div>
                            <div className={styles.stat}>
                                <Image src={OfficeIcon} alt='Office icon' height={24} width={24} />
                                <span>{jobMode}</span>
                            </div>
                            <div className={styles.stat}>
                                <Image src={DollarSignIcon} alt='Money icon' height={24} width={24} />
                                <span>{jobSalary}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div>
                            <div className={styles.topRight}>
                                <span className={styles.posted}>{'Posted: ' + jobPosted}</span>
                                <span className={styles.due}>{jobExpiring}</span>
                            </div>
                            <div className={styles.middleRight}>
                                <span>Applications: {jobApplications}</span>
                                <span>Views: {jobViews}</span>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Button size='small' variant='contained' sx={{'width': '130px', 'color': '#000000', 'background': '#66B2FF', 'textTransform': 'capitalize', '&:hover': {'background': '#66B2FF', 'fontWeight': 'bold'}}} onClick={() => {startApplication()}}>{fastApply ? 'Fast Apply' : 'Apply'}</Button>
                            <div className={styles.actionsSub}>
                                {dmAllowed ? 
                                    <Button size='small' variant='contained' sx={{'width': '90px', 'color': '#000000', 'background': '#66B2FF', 'textTransform': 'capitalize', '&:hover': {'background': '#66B2FF', 'fontWeight': 'bold'}}} onClick={() => setActionScreen(2)}>Message</Button>
                                : <></>}
                                {dmAllowed ?
                                <Button variant='contained' sx={{'minWidth': '10px', 'width': '10px', 'color': '#ffffff', 'background': '#182737', 'textTransform': 'capitalize', '&:hover': {'background': '#182737', 'fontWeight': 'bold', 'color': '#66b2ff'}}} onClick={() => saveJob()}><BookmarkBorderIcon/></Button>
                                : <Button variant='contained' sx={{'minWidth': '10px', 'width': '130px', 'color': '#ffffff', 'background': '#182737', 'textTransform': 'capitalize', '&:hover': {'background': '#182737', 'fontWeight': 'bold', 'color': '#66b2ff'}}} onClick={() => saveJob()}>Save job</Button>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomPanel}>
                    <div className={styles.navigation}>
                        {NavBlock('About Us', 0, <InfoIcon />)}
                        <div className={styles.vs}></div>
                        {NavBlock('Description', 1, <DescriptionIcon />)}
                        <div className={styles.vs}></div>
                        {NavBlock('Requirements', 2, <FormatListNumberedIcon />)}
                        <div className={styles.vs}></div>
                        {NavBlock('Benefits', 3, <SpaIcon />)}
                        <div className={styles.vs}></div>
                        {NavBlock('More', 4, <MoreHorizIcon />)}
                    </div>
                    <div className={styles.bottomPanelContent}>
                        <span className={styles.panelStyles}>
                            {
                                {0: companyInfo,
                                1: companyDescription,
                                2: companyReq,
                                3: comapnyBenefit,
                                4: companyMore}[panel]
                            }
                        </span>
                    </div>
                </div>
            </div>

            <Snackbar 
                open={alert} 
                autoHideDuration={alertTime} 
                onClose={closeAlert} 
                anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
            >
                <Alert onClose={closeAlert} severity={alertType}>{alertText}</Alert>
            </Snackbar>
        </div>
        ) : (
            <>
                {actionScreen === 0 ? <QuickApplyPrompt control={setActionScreen} say={raiseAlert} /> : <></>}
                {actionScreen === 1 ? <Apply control={setActionScreen} say={raiseAlert} /> : <></>}
                {actionScreen === 2 ? <MessageBox control={setActionScreen} say={raiseAlert} /> : <></>}
            
                <Snackbar 
                    open={alert} 
                    autoHideDuration={alertTime} 
                    onClose={closeAlert} 
                    anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
                >
                    <Alert onClose={closeAlert} severity={alertType}>{alertText}</Alert>
                </Snackbar>
            </>
        )
    )
}

export default Page;