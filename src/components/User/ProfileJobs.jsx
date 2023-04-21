/**
 * JSX component that will provide the UI and
 * functionality for the jobs user page where
 * the user will be able to track their application
 * saved jobs and messages
 */

import styles from '@/styles/User/profilejobs.module.css';
import mainStyles from '@/styles/Admin/Profile.module.css';
import { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Page = () => {
    const [applications, setApplications] = useState([]);
    const [saved, setSaved] = useState([]);
    const [messages, setMessages] = useState([]);
    const [showMessage, setShowMessage] = useState(-1);
    const [messageContent, setMessageContent] = useState('');

    useEffect(() => {
        axios.post('/api/loadUserData', {
            mode: 'load-jobs-panel-data',
            userid: localStorage.getItem('id')
        }).then(( {data} ) => {
            if (data.status === 200) {
                setApplications(data.data.jobs);
                setMessages(data.data.messages);
                setSaved(data.data.saved);
            }
        });
    }, [showMessage]);

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('error');
    const closeAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false);
    }
    const raiseAlert = (message, type) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
    }

    const convert_to_dd_mm_yyyy = (input) => {
        let d = new Date(input);
        let pDD = d.getDate().toString().padStart(2, "0");
        let pMM = (d.getMonth() + 1).toString().padStart(2, "0");
        let pYYYY = d.getFullYear().toString();
        return(`${pDD}/${pMM}/${pYYYY}`);
    }

    const jobLabel = (db_key, company, job_title, date_applied, status, seen) => {
        return(
            <div className={seen === 'no' && status !== 'pending' ? styles.jobUnseen : styles.job} key={db_key}>
                <div className={styles.jobLeft}>
                    <span className={styles.jobHeader}>{company} - {job_title}</span>
                    <span className={styles.jobSub}>{convert_to_dd_mm_yyyy(date_applied)}</span>
                </div>
                <div>
                    <span className={{'pending': styles.jobPending, 'rejected': styles.jobRejected, 'accepted': styles.jobAccepted}[status]}>{{'pending': 'Application Submitted', 'rejected': 'Application Rejected', 'accepted': 'Application Successfull'}[status]}</span>
                </div>
            </div>
        )
    }

    const savedJobs = (jobid, company, role) => {
        return(
            <div className={styles.savedBlock} key={jobid} onClick={() => window.location.href = '/user?job=' + jobid}>
                <span className={styles.jobHeader}>{company} - {role}</span>
            </div>
        )
    }

    const msgLabel = (msgid, name, role, preview, lastseen, reply) => {
        return(
            <div className={lastseen !== Number(localStorage.getItem('id')) && reply === 1 ? styles.msgBlockNotify : styles.msgBlock} key={msgid} onClick={() => openMessage(msgid, preview)}>
                <span className={styles.jobHeader}>{name} - {role}</span>
                <span className={styles.preview}>{preview.split('***').pop()}</span>
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
        if (document.getElementById('reply-msg-container').value === '') {
            raiseAlert('Enter valid reply', 'error');
            return;
        }
        
        axios.post('/api/sendMessage', {
            mode: 'reply-from-user',
            id: showMessage,
            content: document.getElementById('reply-msg-container').value
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Reply sent', 'success');
                setTimeout(() => {
                    setShowMessage(-1);
                }, 1500);
            }
        })
    }

    return(
        <section className={mainStyles.main}>
            <span className={mainStyles.title}>Jobs</span>
            <span className={mainStyles.subtitle}>View and check your job applications, saved jobs and messages to/from employers</span>
        
            <section className={styles.panelMain}>
                <div className={styles.top}>
                    <span className={styles.subTitle}>Job Applications</span>
                    <div className={styles.applications}>
                        {applications.map((v, i) => jobLabel(v.id, v.company_name, v.title, v.date, v.status, v.seen))}
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.savedParent}>
                        <span className={styles.subTitle}>Saved Jobs</span>
                        <div className={styles.saved}>
                            {saved.map((v, i) => savedJobs(v.id, v.company_name, v.title))}
                        </div>
                    </div>

                    <div className={styles.msgParent}>
                        <span className={styles.subTitle}>Messages</span>
                        <div className={styles.msg}>
                            {messages.map((v, i) => msgLabel(v.id, v.other_user_name, v.job_title, v.content, v.last_seen, v.reply))}
                        </div>
                    </div>
                </div>
            </section>

            <div className={showMessage !== -1 ? styles.messageReply : styles.hide}>
                <div className={styles.messageReplySub}>
                    <span className={styles.mrsText}>Conversation:</span>
                    <div className={styles.mrsConv}>
                        {
                        messageContent.split('***').map((v, i) => <span key={i}>{v}</span>)
                        }
                    </div>
                    <span className={styles.mrsText}>Reply:</span>
                    <textarea id='reply-msg-container' className={styles.mrsReplybox}></textarea>
                    <div className={styles.mrsActions}><Button size='small' variant='contained' onClick={() => setShowMessage(-1)}>Go Back</Button><Button size='small' variant='contained' onClick={() => replyMessage()}>Send</Button></div>
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
        </section>
    )
}

export default Page;