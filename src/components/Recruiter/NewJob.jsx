/**
 * JSX component that will provide the UI and
 * functionality for the panel that will open
 * when a new job advert is created. It should
 * capture both quick apply type jobs and ones
 * that require further screening.
 */

import styles from '@/styles/Recruiter/newjob.module.css';
import { useState, forwardRef, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CheckCircleOutlineIcon from '@/public/assets/tick_success_icon.svg';
import Image from 'next/image';
import axios from 'axios';

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

    const [screen, setScreen] = useState(0);
    const [popupTitle, setPopupTitle] = useState('Job Advert General Information');
    const [jobRole, setJobRole] = useState('');
    const [jobLevel, setJobLevel] = useState('Entry-level');
    const [jobMode, setJobMode] = useState('In-Person');
    const [jobType, setJobType] = useState('Internship');
    const [jobLocation, setJobLocation] = useState('');
    const [jobSalary, setJobSalary] = useState('£0 - £5k');
    const [expiring, setExpiring] = useState(false);
    const [expDate, setExpDate] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobRequirements, setJobRequirements] = useState('');
    const [jobBenefits, setJobBenefits] = useState('');
    const [jobInfo, setJobInfo] = useState('');
    const [fastApply, setFastApply] = useState(true);
    const [additionalScreening, setAdditionalScreening] = useState([]);

    const [additionalScreen, setAdditionalScreen] = useState(-1);
    const [adtQuestion, setAdtQuestion] = useState('');
    const [wordCount, setWordCount] = useState('');
    const [adtVideo, setAdtVideo] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [adtReq, setAdtReq] = useState('');
    const [rejectOnFail, setRejectOnFail] = useState(false);
    const [adtKeyword, setAdtKeyword] = useState('');
    const [rejectOnFailKeyword, setRejectOnFailKeyword] = useState(false);


    const raiseAlert = (message, type) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
    }

    const handleClose = () => {
        props.controlDisplay(false);
    }

    const nextScreen = () => {
        if(screen === 0) {
            // Validate inputs
            if (jobRole === '' || jobRole.length === 0) {
                raiseAlert('Enter valid job role', 'error'); return;
            }
            if (jobLocation === '' || jobLocation === 0) {
                raiseAlert('Enter valid job location', 'error'); return;
            }
            if (expiring) {
                if (expDate === undefined || expDate === '') {
                    raiseAlert('Enter an expiration date', 'error'); return;
                }
            }
            setScreen(1);
            setPopupTitle('Job Advert Details (1)');
        } else if (screen === 1) {
            // Validate inputs
            if (jobDescription === '' || jobDescription.length === 0) {
                raiseAlert('Enter valid job description', 'error'); return;
            }
            setScreen(2);
            setPopupTitle('Job Advert Details (2)');
        } else if (screen === 2) {
            // Validate inputs
            if (jobRequirements === '' || jobRequirements.length === 0) {
                raiseAlert('Enter valid job requirements', 'error'); return;
            }
            setScreen(3);
            setPopupTitle('Job Advert Details (3)');
        } else if (screen === 3) {
            // Validate inputs
            if (jobBenefits === '' || jobBenefits.length === 0) {
                raiseAlert('Enter valid job benefits', 'error'); return;
            }
            setScreen(4);
            setPopupTitle('Job Advert Details (4)');
        } else if (screen === 4) {
            setScreen(5);
            setPopupTitle('Job Advert Additional Information');
        } else if (screen === 5) {
            if (fastApply) {
                setScreen(7);
            } else {
                setScreen(6);
                setPopupTitle('Job Advert Additional Information');
            }
        } else if (screen === 6) {
            if (additionalScreening.length === 0) {
                raiseAlert('You must add at least one screening to continue', 'error'); return;
            }
            setScreen(8);
        }
    }

    const prevScreen = () => {
        setScreen(screen - 1);
        setPopupTitle(['Job Advert General Information','Job Advert Details (1)', 'Job Advert Details (2)', 'Job Advert Details (3)', 'Job Advert Details (4)', 'Job Advert Additional Information'][screen - 1])
    }

    const handleCheckboxChange = (event) => {
        setFastApply(event.target.name === 'fastApply');
    };

    const aq_block = (key, title, description, secondParam) => {
        return(
            <div key={key} className={styles.aqBlock}>
                <div className={styles.aqBlockSub}>
                    <span className={styles.aqTitle}>{title}</span>
                    <span className={styles.aqSubTitle}>{description}</span>
                    <span className={styles.aqInfoTitle}>
                        {title === 'Text Response' && secondParam !== 'na' ? `Max words: ${secondParam}` : ``}
                        {title === 'Video Response' && secondParam !== 'na' ? `Max duration: ${secondParam}s` : ''}
                        {title === 'Requirement' && secondParam === true ? 'Rejecting if not met' : ''}
                        {title === 'Keyword' && secondParam === true ? 'Rejecting if not found' : ''}
                    </span>
                </div>
                <IconButton size='small' sx={{'color': 'darkred', 'background': '#F0F0F0', '&:hover': {'background': '#F0F0F0', 'color': 'darkred', 'fontWeight': 'bold'}}} onClick={() => removeAdditionalScreening(key)}><DeleteIcon /></IconButton>
            </div>
        )
    }

    const closeAdtPopup = () => {
        setAdditionalScreen(-1);
        setAdtQuestion('');
        setWordCount('');
        setAdtVideo('');
        setTimeLimit('');
        setAdtReq('');
        setRejectOnFail(false);
        setAdtKeyword('');
        setRejectOnFailKeyword(false);
    }

    const addAdditionalFilter = (mode) => {
        if (mode === 'text') {
            if (adtQuestion === '' || adtQuestion.length === 0) {
                raiseAlert('Please enter a valid question', 'error');
                return;
            }
            if (wordCount !== '') {
                if(!(/^-?\d*\.?\d+$/.test(wordCount))) {
                    raiseAlert('Word limit must be a number', 'error');
                    return;
                }
            }
            setAdditionalScreening([...additionalScreening, [
                'Text Response', adtQuestion, wordCount === '' ? 'na' : wordCount
            ]]);
            raiseAlert('Text Response added', 'info');
        } else if (mode === 'video') {
            if (adtVideo === '' || adtVideo.length === 0) {
                raiseAlert('Please enter a valid question', 'error');
                return;
            }
            if (timeLimit !== '') {
                if(!(/^-?\d*\.?\d+$/.test(timeLimit))) {
                    raiseAlert('Time limit must be a number', 'error');
                    return;
                }
            }
            setAdditionalScreening([...additionalScreening, [
                'Video Response', adtVideo, timeLimit === '' ? 'na' : timeLimit
            ]]);
            raiseAlert('Video Response added', 'info');
        } else if (mode === 'req') {
            if (adtReq === '' || adtReq.length === 0) {
                raiseAlert('Please enter a valid requirement', 'error');
                return;
            }
            setAdditionalScreening([...additionalScreening, [
                'Requirement', adtReq, rejectOnFail
            ]]);
            raiseAlert('Requirement added', 'info');
        } else if (mode === 'keyword') {
            if (adtKeyword === '' || adtKeyword.length === 0) {
                raiseAlert('Please enter a valid keyword', 'error');
                return;
            }
            setAdditionalScreening([...additionalScreening, [
                'Keyword', adtKeyword, rejectOnFailKeyword
            ]]);
            raiseAlert('Keyword scan added', 'info');
        }
        closeAdtPopup();
    }


    const removeAdditionalScreening = (index) => {
        setAdditionalScreening(prevAdditionalScreening => {
            const updatedAdditionalScreening = [...prevAdditionalScreening];
            updatedAdditionalScreening.splice(index, 1);
            return updatedAdditionalScreening;
        });
    }


    const postJob = () => {
        axios.put('/api/addJob', {
            id: localStorage.getItem('id'),
            title: jobRole,
            type: jobType,
            level: jobLevel,
            mode: jobMode,
            location: jobLocation,
            salary: jobSalary,
            description: jobDescription,
            requirements: jobRequirements,
            benefits: jobBenefits,
            addInfo: jobInfo,
            fastApply: fastApply ? 'yes' : 'no',
            screening: additionalScreening.join(','),
            exp: expiring,
            expDate,
            editing: props.editor === true ? 'yes' : 'no',
            exJob: localStorage.getItem('jobid')
        }).then(( {data} ) => {
            if (data.status === 200) {
                // Job id: data.advertId
                setScreen(9);
                setPopupTitle(props.editor === true ? 'Job advert updated' : 'Job posted successfully');
            }
        });
    }

    useEffect(() => {
        if (props.editor === true) {
            axios.post('/api/loadRecruiterData', {
                mode: 'load-edit-job-info',
                id: localStorage.getItem('jobid')
            }).then(( {data} ) => {
                const res = data.data[0];
                console.log(res);
                setJobRole(res.title || '');
                setJobType(res.job_type || '');
                setJobLevel(res.job_level || '');
                setJobLocation(res.location || '');
                setJobMode(res.mode || '');
                setJobSalary(res.salary || '');
                if (res.expiring === 1) {
                    setExpiring(true);
                    setExpDate(res.exp_date.slice(0, -1) || '');
                }
                setJobDescription(res.description || '');
                setJobRequirements(res.requirements || '');
                setJobBenefits(res.benefits || '');
                setJobInfo(res.add_info || '');
                setFastApply(res.fast_apply === 1 ? true : false);
                if (res.screening !== '') {
                    setAdditionalScreening(res.screening.split(',').reduce((acc, curr, i) => (i % 3 == 0 ? acc.push([curr]) : acc[acc.length-1].push(curr), acc), []));
                }
            });
        }
    }, [])


    return(
        <div className={styles.main}>
            <div className={screen > 6 && screen < 9 ? styles.contentHidden : styles.sub}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <IconButton color="primary" aria-label="exit" component="label" size='small' sx={{'color': 'darkred', 'background': 'white', 'border': '1px solid black', '&:hover': {'background': 'darkred', 'color': 'white', 'fontWeight': 'bold'}}} onClick={handleClose} className={screen === 9 ? styles.contentHidden : ''}>
                            <ClearIcon />
                        </IconButton>
                        <span className={screen === 9 ? styles.spacedTitle : ''}>{popupTitle}</span>
                    </div>
                    <div className={screen === 9 ? styles.contentHidden : ''}>
                        <IconButton color="primary" aria-label="go back" component="label" size='small' sx={{'background': '#66b2ff', 'color': 'black', 'border': '1px solid black', mr: '15px'}} className={screen === 0 ? styles.contentHidden : ''} onClick={() => prevScreen()}>
                            <ArrowBackIcon />
                        </IconButton>
                        <IconButton color="primary" aria-label="go next" component="label" size='small' sx={{'background': '#66b2ff', 'color': 'black', 'border': '1px solid black', mr: '15px'}} onClick={() => nextScreen()}>
                            <ArrowForwardIcon />
                        </IconButton>
                    </div>
                </div>

                <div  className={screen === 0 ? styles.contentP1 : styles.contentHidden}>
                    <div className={styles.contentLeftP1}>
                        <TextField label='Job Role' variant='outlined' placeholder='Software Engineer' value={jobRole} onChange={(e) => setJobRole(e.target.value)} sx={{mt: '30px', mb: '30px'}} size='small'/>

                        <TextField select label='Job Level' variant='outlined' value={jobLevel} onChange={(e) => setJobLevel(e.target.value)} sx={{mb: '30px'}} size='small'>
                            {['Entry-level', 'Individual Contributor', 'Director', 'Vice President', 'C-Suite'].map((v, i) => (
                                <MenuItem key={i} value={v}>{v}</MenuItem> 
                            ))}
                        </TextField>

                        <TextField select label='Mode of Work' variant='outlined' value={jobMode} onChange={(e) => setJobMode(e.target.value)} size='small'>
                            {['In-Person', 'Remote', 'Hybrid'].map((v, i) => (
                                <MenuItem key={i} value={v}>{v}</MenuItem> 
                            ))}
                        </TextField>
                        
                        <FormControlLabel control={<Checkbox checked={expiring} onChange={(e) => setExpiring(e.target.checked)} icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label="Temporary job advert" sx={{mt: '20px'}}/>
                    </div>
                    <div className={styles.contentRightP1}>
                        <TextField select label='Job Type' variant='outlined' value={jobType} onChange={(e) => setJobType(e.target.value)} sx={{mt: '30px', mb: '30px'}} size='small'>
                            {['Internship', 'Full-time', 'Part-time', 'Temporary', 'Volunteer', 'Training'].map((v, i) => (
                                <MenuItem key={i} value={v}>{v}</MenuItem> 
                            ))}
                        </TextField>

                        <TextField label='Job Location' variant='outlined' placeholder='London' value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} size='small' />

                        <TextField select label='Job Salary' variant='outlined' value={jobSalary} onChange={(e) => setJobSalary(e.target.value)} sx={{mt: '30px', mb: '25px'}} size='small'>
                            {['£0 - £5k', '£5k - £15k', '£15k - £30k', '£30k - £45k', '£45k - £60k', '£60k - £80k', '£80k - £100k', '£100k +'].map((v, i) => (
                                <MenuItem key={i} value={v}>{v}</MenuItem> 
                            ))}
                        </TextField>

                        <input type="datetime-local" name="datetime" value={expDate} onChange={(e) => setExpDate(e.target.value)} className={expiring ? styles.expInput : styles.contentHidden}/>
                    </div>
                </div>

                <div className={[1,2,3,4].includes(screen) ? styles.contentP2 : styles.contentHidden}>
                    <div className={styles.indication}>
                        <span className={screen === 1 ? styles.indicationOn : ''} onClick={() => setScreen(1)}><span className={styles.smallNav}>{'> '}</span>Job Description</span>
                        <span className={styles.hideNav}>{'>'}</span>
                        <span className={screen === 2 ? styles.indicationOn : ''} onClick={() => setScreen(2)}><span className={styles.smallNav}>{'> '}</span>Requirements</span>
                        <span className={styles.hideNav}>{'>'}</span>
                        <span className={screen === 3 ? styles.indicationOn : ''} onClick={() => setScreen(3)}><span className={styles.smallNav}>{'> '}</span>Benefits</span>
                        <span className={styles.hideNav}>{'>'}</span>
                        <span className={screen === 4 ? styles.indicationOn : ''} onClick={() => setScreen(4)}><span className={styles.smallNav}>{'> '}</span>More</span>
                    </div>

                    <div className={screen === 1 ? styles.p2Content : styles.contentHidden}>
                        <div className={styles.writingBox}>
                            <span className={styles.writingBoxTitle}>Job Description:</span>
                        </div>
                        <div className={styles.writingBox}>
                            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></textarea>
                            <span className={styles.writingBoxGreyText}>Accurately and concisely describe what the role entails, including tasks and responsibilities and any other pertinent details. It is good to include expectations about workload, and potential career growth.</span>
                        </div>
                    </div>

                    <div className={screen === 2 ? styles.p2Content : styles.contentHidden}>
                        <div className={styles.writingBox}>
                            <span className={styles.writingBoxTitle}>Job Requirements:</span>
                        </div>
                        <div className={styles.writingBox}>
                            <textarea value={jobRequirements} onChange={(e) => setJobRequirements(e.target.value)}></textarea>
                            <span className={styles.writingBoxGreyText}>Outline the specific qualifications and experience needed to be considered for the role (level of education, specific technical or professional skills, years of experience, intangible qualities).</span>
                        </div>
                    </div>

                    <div className={screen === 3 ? styles.p2Content : styles.contentHidden}>
                        <div className={styles.writingBox}>
                            <span className={styles.writingBoxTitle}>Job Benefits:</span>
                        </div>
                        <div className={styles.writingBox}>
                            <textarea value={jobBenefits} onChange={(e) => setJobBenefits(e.target.value)}></textarea>
                            <span className={styles.writingBoxGreyText}>Showcase the company's commitment to its employees' well-being and quality of life (health insurance, dental and vision plans, retirement plans, vacation time, sick leave, development opportunities, and employee discounts).</span>
                        </div>
                    </div>

                    <div className={screen === 4 ? styles.p2Content : styles.contentHidden}>
                        <div className={styles.writingBox}>
                            <span className={styles.writingBoxTitle}>Additional Information:</span>
                        </div>
                        <div className={styles.writingBox}>
                            <textarea value={jobInfo} onChange={(e) => setJobInfo(e.target.value)}></textarea>
                            <span className={styles.writingBoxGreyText}>You could include information about the interview process, such as the number of interview rounds and what to expect during each stage, more information about the salary, and any other relevant information.</span>
                        </div>
                    </div>
                </div>

                <div className={screen === 5 ? styles.contentP3 : styles.contentHidden}>
                    <span className={styles.writingBoxTitle}>Please select an option:</span>
                    <div className={styles.tickBoxParent}>
                        <FormControlLabel control={<Checkbox name="fastApply" checked={fastApply} onChange={handleCheckboxChange} icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label="Fast Apply Job Advert" />
                        <span>This option will enable candidates to apply to your job faster. Information you receive will include CV, email, phone number, and work experience of the candidate. System will automatically scan candidates for right to work in the UK.</span>
                    </div>
                    <div className={styles.tickBoxParent}>
                        <FormControlLabel control={<Checkbox checked={!fastApply} onChange={handleCheckboxChange} icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label="Additional questions and screening" />
                        <span>This option will allow you to add text and video responses and additional screening options to the job application process.</span>
                    </div>
                </div>

                <div className={screen === 6 ? styles.contentP4 : styles.contentHidden}>
                    <span className={styles.writingBoxTitle}>Additional questions and screening:</span>
                    <div className={styles.P4Sub}>
                        <div className={styles.P4reqList}>{additionalScreening.length === 0 ? 'No filters added yet' : additionalScreening.map((v, i) => aq_block(i, v[0], v[1], v[2]))}</div>
                        <div className={styles.P4Options}>
                            <Button className={styles.hideNav} variant='outlined' endIcon={<DriveFileRenameOutlineIcon />} onClick={() => setAdditionalScreen(0)}>Text Response</Button>
                            <IconButton size='small' color="primary" className={styles.smallIcon} onClick={() => setAdditionalScreen(0)}><DriveFileRenameOutlineIcon /></IconButton>

                            <Button className={styles.hideNav} variant='outlined' endIcon={<VideoCameraFrontIcon />} onClick={() => setAdditionalScreen(1)}>Video Response</Button>
                            <IconButton size='small' color="primary" className={styles.smallIcon} onClick={() => setAdditionalScreen(1)}><VideoCameraFrontIcon /></IconButton>

                            <Button className={styles.hideNav} variant='outlined' endIcon={<ChecklistIcon />} onClick={() => setAdditionalScreen(2)}>Requirement</Button>
                            <IconButton size='small' color="primary" className={styles.smallIcon} onClick={() => setAdditionalScreen(2)}><ChecklistIcon /></IconButton>
                            
                            <Button className={styles.hideNav} variant='outlined' endIcon={<ManageSearchIcon />} onClick={() => setAdditionalScreen(3)}>Keyword Scan</Button>
                            <IconButton size='small' color="primary" className={styles.smallIcon} onClick={() => setAdditionalScreen(3)}><ManageSearchIcon /></IconButton>
                        </div>
                    </div>
                </div>

                <div className={screen === 9 ? styles.successTickParent : styles.contentHidden}>
                    <Image src={CheckCircleOutlineIcon} alt='success icon' />
                    <Button variant='outlined' onClick={() => handleClose()} sx={{mt: '20px'}}>Close</Button>
                </div>
            </div>


            <div className={additionalScreen === 0 ? styles.innerPopup : styles.innerPopupHidden}>
                <div className={styles.innerPopupTop}>
                    <span className={styles.innerPopupTitle}>Question:</span>
                    <IconButton color="primary" aria-label="exit" component="label" size='small' sx={{'color': 'darkred'}} onClick={() => closeAdtPopup()}>
                        <ClearIcon />
                    </IconButton>
                </div>
                <textarea value={adtQuestion} onChange={(e) => setAdtQuestion(e.target.value)} placeholder='What question should the candidate write an answer to?'></textarea>
                <div className={styles.innerPopupBottom}>
                    <TextField label="Word limit" variant="outlined" placeholder='350' size='small' sx={{'width': '120px', 'background': 'white'}} value={wordCount} onChange={(e) => setWordCount(e.target.value)}/>
                    <Button variant='outlined' sx={{mr: '8px','height': '38px', 'background': '#66b2ff', 'color': 'black', 'fontWeight': '500', '&:hover': {'background': '#66b2ff', 'color': 'black', 'fontWeight': '600'}}} onClick={() => addAdditionalFilter('text')}>OK</Button>
                </div>
            </div>

            <div className={additionalScreen === 1 ? styles.innerPopup : styles.innerPopupHidden}>
                <div className={styles.innerPopupTop}>
                    <span className={styles.innerPopupTitle}>Video:</span>
                    <IconButton color="primary" aria-label="exit" component="label" size='small' sx={{'color': 'darkred'}} onClick={() => closeAdtPopup()}>
                        <ClearIcon />
                    </IconButton>
                </div>
                <textarea value={adtVideo} onChange={(e) => setAdtVideo(e.target.value)} placeholder='What question should the candidate record a video for?'></textarea>
                <div className={styles.innerPopupBottom}>
                    <TextField label="Time limit (secs)" variant="outlined" placeholder='60' size='small' sx={{'width': '150px', 'background': 'white'}} value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}/>
                    <Button variant='outlined' sx={{mr: '8px','height': '38px', 'background': '#66b2ff', 'color': 'black', 'fontWeight': '500', '&:hover': {'background': '#66b2ff', 'color': 'black', 'fontWeight': '600'}}} onClick={() => addAdditionalFilter('video')}>OK</Button>
                </div>
            </div>

            <div className={additionalScreen === 2 ? styles.innerPopup : styles.innerPopupHidden}>
                <div className={styles.innerPopupTop}>
                    <span className={styles.innerPopupTitle}>Requirement:</span>
                    <IconButton color="primary" aria-label="exit" component="label" size='small' sx={{'color': 'darkred'}} onClick={() => closeAdtPopup()}>
                        <ClearIcon />
                    </IconButton>
                </div>
                <textarea value={adtReq} onChange={(e) => setAdtReq(e.target.value)} placeholder='What should the candidate confirm that they have?'></textarea>
                <div className={styles.innerPopupBottom}>
                    <FormControlLabel control={<Checkbox checked={rejectOnFail} onChange={(e) => setRejectOnFail(e.target.checked)} icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label="Reject if not eligible" />
                    <Button variant='outlined' sx={{mr: '8px','height': '38px', 'background': '#66b2ff', 'color': 'black', 'fontWeight': '500', '&:hover': {'background': '#66b2ff', 'color': 'black', 'fontWeight': '600'}}} onClick={() => addAdditionalFilter('req')}>OK</Button>
                </div>
            </div>    

            <div className={additionalScreen === 3 ? styles.innerPopup : styles.innerPopupHidden}>
                <div className={styles.innerPopupTop}>
                    <span className={styles.innerPopupTitle}>Keyword Scan:</span>
                    <IconButton color="primary" aria-label="exit" component="label" size='small' sx={{'color': 'darkred'}} onClick={() => closeAdtPopup()}>
                        <ClearIcon />
                    </IconButton>
                </div>
                <textarea value={adtKeyword} onChange={(e) => setAdtKeyword(e.target.value)} placeholder='Filter candidates on specific keywords e.g., JavaScript'></textarea>
                <div className={styles.innerPopupBottom}>
                    <FormControlLabel control={<Checkbox checked={rejectOnFailKeyword} onChange={(e) => setRejectOnFailKeyword(e.target.checked)} icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label="Reject if not eligible" />
                    <Button variant='outlined' sx={{mr: '8px','height': '38px', 'background': '#66b2ff', 'color': 'black', 'fontWeight': '500', '&:hover': {'background': '#66b2ff', 'color': 'black', 'fontWeight': '600'}}} onClick={() => addAdditionalFilter('keyword')}>OK</Button>
                </div>
            </div>       

            <div className={screen === 7 || screen === 8 ? styles.cnfPopup : styles.innerPopupHidden}>
                <div>
                    <div className={styles.cnfPopupTitle}><span>{props.editor === true ? 'Do you want to continue?' : 'Post job to listings?'}</span></div>
                    <div className={styles.cnfPopupSubText}><span>{props.editor === true ? 'Have you finished editing the job advert?' : "Have you added all the details about the job you are posting?"}</span></div>
                    <div className={styles.cnfPopupActions}>
                        <Button variant='outlined' size='small' onClick={() => {screen === 7 ? setScreen(5) : setScreen(6)}}>Back</Button>
                        <Button variant='outlined' size='small' onClick={() => postJob()}>{props.editor === true ? 'Save changes' : 'Post job'}</Button>
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
        </div>
    )
}

export default Page;