/**
 * JSX component that will provide the UI and
 * functionality for the panel that will open
 * when a recruiter open a job. It should display
 * status about the job, applications, messages
 * and provide actions such as delete, edit and 
 * interact with the job advert.
 */

import styles from '@/styles/Recruiter/jobview.module.css';
import { useState, forwardRef, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import JobApplicationsIcon from '@/public/assets/job_applications_icon.svg';
import JobViewsIcon from '@/public/assets/job_views_icon.svg';
import Image from 'next/image';
import Button from '@mui/material/Button';
import axios from 'axios';
import NewAdvertPage from '@/components/Recruiter/NewJob';
import Link from 'next/link';

const Page = (props) => {
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

    const formatApplicationDate = (date) => {
        const inputDate = new Date(date);
        const now = new Date();
        const inputDateStartOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
        const nowStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diff = nowStartOfDay - inputDateStartOfDay;

        const day = 24 * 60 * 60 * 1000;

        if (diff < day) {
            return "today";
        } else {
            const days = Math.floor(diff / day);
            return `${days}d ago`;
        }
    }

    const [title, setTitle] = useState('Software Engineer');
    const [posted, setPosted] = useState('24/05/2023');
    const [due, setDue] = useState('25/05/2023 09:00');
    const [applications, setApplications] = useState('10');
    const [views, setViews] = useState('1345');
    const [editJob, setEditJob] = useState(false);
    const [candidatesList, setCandidatesList] = useState([]);
    const [msgList, setMsgList] = useState([]);
    const [showMessage, setShowMessage] = useState(-1);
    const [messageContent, setMessageContent] = useState('');

    const [showApplication, setShowApplication] = useState(-1);
    const [cName, cSetName] = useState('');
    const [cEmail, cSetEmail] = useState('');
    const [cPhoneNumber, cSetPhoneNumber] = useState('');
    const [cSummary, cSetSummary] = useState('');
    const [cSkills, cSetSkills] = useState('');
    const [cTotalXP, cSetTotalXP] = useState('');
    const [cEducation, cSetEducation] = useState('');
    const [cWorkXP, cSetWorkXP] = useState('');
    const [cCertificate, cSetCertificate] = useState('');
    const [cCVref, setCVref] = useState('');
    const [cScreening, setCScreening] = useState([]);

    const refreshDataStream = () => {
        axios.post('/api/loadRecruiterData', {
            id: localStorage.getItem('jobid'),
            mode: 'simple-job-advert-data'
        }).then(( {data} ) => {
            if(data.data.length > 0) {
                setTitle(data.data[0].title);
                let posted = new Date(data.data[0].date_posted);
                let pDD = posted.getDate().toString().padStart(2, "0");
                let pMM = (posted.getMonth() + 1).toString().padStart(2, "0");
                let pYYYY = posted.getFullYear().toString();
                setPosted(`${pDD}/${pMM}/${pYYYY}`);
                let exp = data.data[0].expiring;
                if (exp === 1) {
                    let expD = new Date(data.data[0].exp_date);
                    let eDD = expD.getDate().toString().padStart(2, "0");
                    let eMM = (expD.getMonth() + 1).toString().padStart(2, "0");
                    let eYYYY = expD.getFullYear().toString();
                    let eHH = expD.getHours().toString().padStart(2, "0");
                    let emm = expD.getMinutes().toString().padStart(2, "0");
                    setDue(`${eDD}/${eMM}/${eYYYY} ${eHH}:${emm}`)
                } else {
                    setDue('');
                }
                setApplications(data.data[0].applications);
                setViews(data.data[0].views);

                // Load job candidates
                axios.post('/api/loadRecruiterData', {
                    id: localStorage.getItem('jobid'),
                    mode: 'load-job-candidates'
                }).then(( {data} ) => {
                    let tempCandidates = [];
                    data.data.map((v, i) => {
                        tempCandidates.push([
                            v.id, v.name, 
                            formatApplicationDate(v.date), 
                            v.seen === 'yes' ? false : true
                        ]);
                    });
                    setCandidatesList(tempCandidates);

                    // Load messages
                    axios.post('/api/loadRecruiterData', {
                        id: localStorage.getItem('jobid'),
                        mode: 'load-job-msg'
                    }).then(( {data} ) => {
                        let tempMessages = [];
                        data.data.map((v, i) => {
                            tempMessages.push([
                                v.id,
                                v.content,
                                v.last_seen === Number(localStorage.getItem('id')) ? false : true
                            ]);
                        });
                        setMsgList(tempMessages);
                    });
                });
            }
        });
    }

    useEffect(() => {
        refreshDataStream();
    }, [showApplication, showMessage])

    const raiseAlert = (message, type) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
    }

    const openEditor = () => {
        axios.post('/api/loadRecruiterData', {
            mode: 'check-recruiter-access',
            id: localStorage.getItem('id')
        }).then(( {data} ) => {
            if (data.data[0].full_access === 1) {
                setEditJob(true);
            } else {
                raiseAlert('You do not have permission to do this', 'error');
            }
        });
    }

    const handleClose = () => {
        props.controlDisplay(false);
    }

    const applicationBlock = (id, name, timeAgo, notSeen) => {
        return(
            <div key={id} className={notSeen ? styles.candidateBlockNotification : styles.candidateBlock} onClick={() => openApplication(id)}>
                <span>{name}</span>
                <span>{timeAgo}</span>
            </div>
        )
    }

    const messageBlock = (id, message, notSeen) => {
        return(
            <div key={id} className={notSeen ? styles.messageBlockNotification : styles.messageBlock} onClick={() => openMessage(id, message)}>
                <span className={styles.messageContent}>{message.split('***').pop()}</span>
            </div>
        )
    }

    const openMessage = (msgid, preview) => {
        setShowMessage(msgid);
        setMessageContent(preview);
        axios.put('/api/sendMessage', {
            mode: 'user-opening-message',
            userid: localStorage.getItem('id'),
            msgid
        });
    }

    const replyMessage = () => {
        if (document.getElementById('reply-msg-container-recruiter').value === '') {
            raiseAlert('Enter valid reply', 'error');
            return;
        }
        
        axios.post('/api/sendMessage', {
            mode: 'reply-from-user',
            id: showMessage,
            content: document.getElementById('reply-msg-container-recruiter').value
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Reply sent', 'success');
                setTimeout(() => {
                    setShowMessage(-1);
                }, 1500);
            }
        })
    }

    const openApplication = (id) => {
        setShowApplication(id);
        axios.put('/api/loadRecruiterData', {
            mode: 'acknowledge-application',
            id
        });
    }

    const deleteAdvert = () => {
        axios.post('/api/loadRecruiterData', {
            mode: 'check-recruiter-access',
            id: localStorage.getItem('id')
        }).then(( {data} ) => {
            if (data.data[0].full_access === 1) {
                axios.post('/api/deleteJob', {
                    id: localStorage.getItem('jobid')
                }).then(( {data} ) => {
                    if (data.status === 200) {
                        raiseAlert('Job advert deleted', 'success');
                        setTimeout(() => {
                            handleClose();
                        }, 2000);
                    }
                })
            } else {
                raiseAlert('You do not have permission to do this', 'error');
            }
        });
    }

    useEffect(() => {
        if (showApplication !== -1) {
            axios.post('/api/loadRecruiterData', {
                mode: 'load-application-data',
                id: showApplication
            }).then(( {data} ) => {
                const res = data.data[0];
                cSetName(res.name);
                cSetEmail(res.email);
                cSetPhoneNumber(res.phone);
                cSetSkills(res.skills);
                cSetSummary(res.summary);
                cSetTotalXP(res.total_experience);
                cSetWorkXP(res.work_experience);
                cSetEducation(res.education);
                cSetCertificate(res.certifications);
                setCVref(res.cv_ref);

                axios.post('/api/loadRecruiterData', {
                    mode: 'load-screening-data',
                    id: showApplication,
                    addParam: res.user
                }).then(( {data} ) => {
                    const res = data.data;
                    let tempScreeningArr = [];
                    if (res) {
                        res.map((v, i) => {
                            tempScreeningArr.push([
                                v.id, v.type, v.title, v.ref
                            ]);
                        });
                        setCScreening(tempScreeningArr);
                    }
                });
            });
        }
    }, [showApplication])

    const respondApplication = (id, answer) => {
        axios.put('/api/loadRecruiterData', {
            mode: 'respond-to-application',
            id,
            addParam: answer
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Application ' + answer, 'info');
                setShowApplication(-1);
            }
        })
    }

    const handleFileDownload = (fileUrl) => {
        fetch("/docs/" + fileUrl)
        .then(response => response.blob())
        .then(blob => {
            const fileExtension = fileUrl.split('.').pop();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
        
            if (fileExtension === 'pdf') {
                link.download = 'CV.pdf';
            } else if (fileExtension === 'docx' || fileExtension === 'doc') {
                link.download = 'CV.docx';
            } else {
                console.log('Unsupported file type');
                return;
            }
        
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error(error);
        });
    }

    const rejectAll = () => {
        axios.post('/api/loadRecruiterData', {
            mode: 'modify-status-applications',
            id: localStorage.getItem('jobid'),
            addParam: 'rejected'
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Applications rejected', 'info');
                refreshDataStream();
            }
        });
    }

    const acceptAll = () => {
        axios.post('/api/loadRecruiterData', {
            mode: 'modify-status-applications',
            id: localStorage.getItem('jobid'),
            addParam: 'accepted'
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Applications accepted', 'info');
                refreshDataStream();
            }
        });
    }

    return(
        <div className={styles.main}>
            {editJob ? <></> : <div className={styles.sub}>
                <div className={styles.title}>
                    Job Advert #{localStorage.getItem('jobid')}
                </div>
                <div className={styles.content}>
                    <div className={styles.top}>
                        <div className={styles.topInfo}>
                            <span className={styles.jobTitle}>{title}</span>
                            <span className={styles.subTitle}>Posted on: {posted}</span>
                            <span className={styles.subTitle}>Expiring: {due === '' ? 'not set' : due}</span>
                        </div>
                        <div className={styles.topStats}>
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

                    <div className={styles.listBox}>
                        <div className={styles.applications}>
                            <section className={styles.applicationsTopNav}>
                                <span>Candidates:</span>
                                <div>
                                    <Button onClick={() => {rejectAll();}} variant='outlined' size='small' sx={{'fontSize': '11.5px'}}>reject all</Button>
                                    <Button onClick={() => {acceptAll();}} variant='outlined' size='small' sx={{'fontSize': '11.5px'}}>accept all</Button>
                                </div>
                            </section>
                            <div>
                                {candidatesList.map((v) => applicationBlock(v[0], v[1], v[2], v[3]))}
                                {candidatesList.length === 0 ? 'No candidates' : ''}
                            </div>
                        </div>

                        <div className={styles.msg}>
                            <span>Messages:</span>
                            <div>
                                {msgList.map((v) => messageBlock(v[0], v[1], v[2]))}
                                {msgList.length === 0 ? 'No messages' : ''}
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonsParent}>
                        <Button onClick={() => {handleClose();}} variant='contained' size='small' sx={{'border': '1px solid black', 'background': '#F0F0F0', 'color': 'black', 'textTransform': 'capitalize', 'fontWeight': '600', '&:hover': {'background': '#F0F0F0', 'color': 'black', 'fontSize': '13.5px'}, mx: '20px'}}>Go Back</Button>
                        <Button onClick={() => {deleteAdvert()}} variant='contained' size='small' sx={{'border': '1px solid black', 'background': '#FF0000', 'color': 'white', 'textTransform': 'capitalize', 'fontWeight': '600', '&:hover': {'background': '#FF0000', 'color': 'white', 'fontSize': '13.5px'}, mx: '20px'}}>Delete</Button>
                        <Button onClick={() => {openEditor()}} variant='contained' size='small' sx={{'border': '1px solid black', 'background': '#66B2FF', 'color': 'black', 'textTransform': 'capitalize', 'fontWeight': '600', '&:hover': {'background': '#66B2FF', 'color': 'black', 'fontSize': '13.5px'}, mx: '20px'}}>Edit</Button>
                    </div>
                </div>
            </div>}

            <div className={showMessage !== -1 ? styles.messageReply : styles.hide}>
                <div className={styles.messageReplySub}>
                    <span className={styles.mrsText}>Conversation:</span>
                    <div className={styles.mrsConv}>
                        {
                        messageContent.split('***').map((v, i) => <span key={i}>{v}</span>)
                        }
                    </div>
                    <span className={styles.mrsText}>Reply:</span>
                    <textarea id='reply-msg-container-recruiter' className={styles.mrsReplybox}></textarea>
                    <div className={styles.mrsActions}><Button size='small' variant='contained' onClick={() => setShowMessage(-1)}>Go Back</Button><Button size='small' variant='contained' onClick={() => replyMessage()}>Send</Button></div>
                </div>
            </div>

            <div className={showApplication !== -1 ? styles.applicationView : styles.hide}>
                <div className={styles.applicationViewSub}>
                    <div className={styles.applicationHeader}>
                        <span>Job Application #{showApplication}</span>
                        <Button variant='contained' size='small'><Link href={cCVref} target='_blank'>CV</Link></Button>
                    </div>
                    <div className={styles.generalInfo}>
                        <div className={styles.applicationRow}>
                            <span className={styles.applicationBold}>Candidate name:</span>
                            <span className={styles.applicationSmallTxt}>{cName}</span>
                        </div>
                        <div className={styles.applicationRow}>
                            <span className={styles.applicationBold}>Candidate email:</span>
                            <span className={styles.applicationSmallTxt}>{cEmail}</span>
                        </div>
                        <div className={styles.applicationRow}>
                            <span className={styles.applicationBold}>Candidate phone:</span>
                            <span className={styles.applicationSmallTxt}>{cPhoneNumber}</span>
                        </div>
                        <div className={styles.applicationCol}>
                            <span className={styles.applicationBold}>Candidate summary:</span>
                            <span className={styles.applicationSmallTxt}>{cSummary}</span>
                        </div>
                        <div className={styles.applicationCol}>
                            <span className={styles.applicationBold}>Candidate skills:</span>
                            <span className={styles.applicationSmallTxt}>{cSkills}</span>
                        </div>
                        <div className={styles.applicationRow}>
                            <span className={styles.applicationBold}>Total experience:</span>
                            <span className={styles.applicationSmallTxt}>{cTotalXP}</span>
                        </div>
                        <div className={styles.applicationCol}>
                            <span className={styles.applicationBold}>Experience:</span>
                            <span className={styles.applicationSmallTxt}>{
                                cWorkXP.split(',').map((v, i) => {
                                    if (i % 5 === 0) {
                                        return <div key={i} className={styles.applicationCol}>
                                            <div className={styles.applicationBoldSub}>
                                                <span className={styles.indented}>{cWorkXP.split(',')[i+1]}</span>
                                                <span>-</span>
                                                <span>{cWorkXP.split(',')[i+2]}</span>
                                            </div>
                                            <div className={styles.applicationBoldSub}>
                                                <span className={styles.indented}>{cWorkXP.split(',')[i+3]}</span>
                                                <span>@ {cWorkXP.split(',')[i]}</span>
                                            </div>
                                            <div className={styles.applicationWorkExpInfo}>
                                                {cWorkXP.split(',')[i+4]}
                                            </div>
                                        </div>
                                    }
                                })
                            }</span>
                        </div>
                        <div className={styles.applicationCol}>
                            <span className={styles.applicationBold}>Education:</span>
                            <span className={styles.applicationSmallTxt}>{
                                cEducation.split(',').map((v, i) => {
                                    if (i % 3 === 0) {
                                        return <div key={i} className={styles.applicationCol}>
                                            <div className={styles.applicationBoldSub}>
                                                <span className={styles.indented}>{cEducation.split(',')[i]}</span>
                                                <span>, </span>
                                                <span>{cEducation.split(',')[i+1]}</span>
                                            </div>
                                            <div className={styles.applicationWorkExpInfo}>
                                                <span>Awarded in </span>
                                                {cEducation.split(',')[i+2]}
                                            </div>
                                        </div>
                                    }
                                })
                            }</span>
                        </div>
                        <div className={styles.applicationCol}>
                            <span className={styles.applicationBold}>Certifications:</span>
                            <span className={styles.applicationSmallTxt}>{cCertificate}</span>
                        </div>

                        <div className={cScreening.length > 0 ? styles.screeningParent : styles.hide}>
                            {cScreening.map((v, i) => {
                                if (v[1] === 'Text') {
                                    return <div key={i} className={styles.applicationCol}>
                                        <span className={styles.applicationBold}>{v[2]}</span>
                                        <span className={styles.applicationSmallTxt}>{v[3]}</span>
                                    </div>
                                } else if (v[1] === 'Video') {
                                    return <div key={i} className={styles.applicationCol}>
                                        <span className={styles.applicationBold}>{v[2]}</span>
                                        <video className={styles.videoContainer} src={v[3]} controls></video>
                                    </div>
                                } else if (v[1] === 'Req') {
                                    return <div key={i} className={styles.applicationCol}>
                                        <span className={styles.applicationBold}>Requirement: {v[2]}</span>
                                        <span className={styles.applicationSmallTxt}>{v[3] === 'true' ? 'Yes' : 'No'}</span>
                                    </div>
                                } else if (v[1] === 'zReq') {
                                    return <div key={i} className={styles.applicationCol}>
                                        <span className={styles.applicationBold}>Requirement*:  {v[2]}</span>
                                        <span className={styles.applicationSmallTxt}>{v[3] === 'true' ? 'Automatic scan from the system has found that the user meet this requirement' : 'SYS:FAIL'}</span>
                                    </div>
                                } else if (v[1] === 'Keyword') {
                                    return <div key={i} className={styles.applicationCol}>
                                        <span className={styles.applicationBold}>Keyword: {v[2]}</span>
                                        <span className={styles.applicationSmallTxt}>{v[3] === 'true' ? "Automatic scan from the system has found that the user's CV contains the keyword" : "Automatic scan from the system has found that the user's CV does NOT contain the keyword"}</span>
                                    </div>
                                } else if (v[1] === 'zKeyword') {
                                    return <div key={i} className={styles.applicationCol}>
                                        <span className={styles.applicationBold}>Keyword*: {v[2]}</span>
                                        <span className={styles.applicationSmallTxt}>{v[3] === 'true' ? "Automatic scan from the system has found that the user's CV contains the keyword" : 'SYS:FAIL'}</span>
                                    </div>
                                }
                            })}
                        </div>

                        <div className={styles.actionBtnsApplicationView}>
                            <Button onClick={() => {setShowApplication(-1)}} variant='contained' size='small' sx={{'background': '#66B2FF', 'color': '#ffffff', 'fontWeight': 600 ,'&:hover': {'background': '#66B2FF', 'color': '#ffffff'}, mx: '20px'}}>Go back</Button>
                            <Button onClick={() => {respondApplication(showApplication, 'rejected')}} variant='contained' size='small' sx={{'background': '#ff0000', 'color': '#ffffff', 'fontWeight': 600 ,'&:hover': {'background': '#ff0000', 'color': '#ffffff'}, mx: '20px'}}>Decline</Button>
                            <Button onClick={() => {respondApplication(showApplication, 'accepted')}} variant='contained' size='small' sx={{'background': '#017f01', 'color': '#ffffff', 'fontWeight': 600 ,'&:hover': {'background': '#017f01', 'color': '#ffffff'}, mx: '20px'}}>Accept</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar 
                open={alert} 
                autoHideDuration={5000} 
                onClose={closeAlert} 
                anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
            >
                <Alert onClose={closeAlert} severity={alertType}>{alertText}</Alert>
            </Snackbar>

            {editJob ? <NewAdvertPage controlDisplay={setEditJob} editor={true} /> : <></>}
        </div>
    )
}

export default Page;