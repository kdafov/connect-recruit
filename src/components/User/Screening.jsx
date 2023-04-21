/**
 * JSX component that will provide the UI and
 * functionality for the screening setup for
 * application that is NOT quick apply. It 
 * should allow full flexibility in terms of 
 * what the user chooses.
 */

import styles from '@/styles/User/screening.module.css';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import VideoRecorder from './VideoRecorder';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Page = (props) => {
    const hideMenu = () => {
        props.control(-1);
    }

    const say = (text, type, time) => {
        props.say(text, type, time);
    }

    const [keywords, setKeywords] = useState([]);
    const [req, setReq] = useState([]);
    const [screening, setScreening] = useState([]);
    const [screeningStage, setScreeningStage] = useState(0);
    const [ref, setRef] = useState([]);
    const [keywordBase, setKeywordBase] = useState([]);
    const [reqPass, setReqPass] = useState(true);

    const textResponse = (i, question, limit, uid) => {
        return (
            <div className={styles.textScreening} key={i}>
                <span>{question} {limit !== 'na' ? `(${limit} words)` : ''}</span>
                <textarea id={`${i}-${limit}`}></textarea>
                <div className={styles.textBtn}><Button variant='contained' onClick={() => {
                    let response = document.getElementById(`${i}-${limit}`).value;
                    if (limit !== 'na') {
                        const croppedResponse = response.split(' ').slice(0, Number(limit)).join(' ');
                        updateReference(uid, croppedResponse);
                    } else {
                        updateReference(uid, response);
                    }
                }}>Save Response</Button></div>
            </div>
        )
    }

    const reqBox = (i, label, uid) => {
        return(
            <div className={styles.reqMain} key={i}>
            <FormControlLabel control={<Checkbox onChange={(e) => updateReference(uid, String(e.target.checked))} icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label={label} />
            </div>
        )
    }

    const updateReference = (UID, v, system = false) => {
        if (v === '') {
            say('The response is not valid', 'error', 1500);
        } else {
            setRef(prevState => {
                const oldState = [...ref];
                oldState[UID] = v;
                return oldState;
            });
            if (!system) {say(`Your response to "${screening[UID*3]}" was saved`, 'success', 1500);}
        }
    }

    useEffect(() => {
        axios.post('/api/loadUserData', {
            mode: 'check-screening',
            jobid: localStorage.getItem('jobid'),
            id: localStorage.getItem('id')
        }).then(( {data} ) => {
            if(data.status === 200) {
                const reqArr = data.data.screening.split(',');
                
                const triples = reqArr.reduce((acc, val, idx, arr) => {
                    if (idx % 3 === 0) {
                        acc.push([arr[idx], arr[idx+1], arr[idx+2]]);
                    }
                    return acc;
                }, []);
                  
                const k_arr = triples.filter(triple => triple[0] === "Keyword" && triple[2] === "true");
                const r_arr = triples.filter(triple => triple[0] === "Requirement" && triple[2] === "true");
                const s_arr = triples.filter(triple => triple[0] !== "Keyword" && triple[0] !== "Requirement" || (triple[0] === "Keyword" && triple[2] !== "true") || (triple[0] === "Requirement" && triple[2] !== "true"));

                setKeywords(k_arr);
                setReq(r_arr);
                setScreening(s_arr.flat());

                const reqValues = s_arr.map((v) => {
                    if(v[0] === 'Requirement' && v[2] === 'false') {
                        return 'false'
                    } else if (v[0] === 'Keyword' && v[2] === 'false') {
                        return keywordBase.includes(v[1].toLowerCase()) ? 'true' : 'false'
                    } else {
                        return ''
                    }
                });
                setRef(reqValues)
                setKeywordBase(data.data.keywords.toLowerCase().replace(/\n/g, ' ').split(' ').map(word => word.replace(/[^\w\s]/gi, '')).filter(word => word.length > 0));

                if (k_arr.length === 0) { setScreeningStage(1) }
            }
        });
    }, []);

    useEffect(() => {
        if (screeningStage === 1 && req.length === 0) {
            setScreeningStage(2);
        }
    }, [screeningStage])

    const apply = () => {
        const hasNoEmptyValues = ref.every(value => value !== '');

        if(hasNoEmptyValues) {
            axios.post('/api/applyJob', {
                user: localStorage.getItem('id'),
                job: localStorage.getItem('jobid'),
                fr_data: keywords,
                sr_data: req,
                lr_data: screening,
                ur_data: ref
            }).then(( {data} ) => {
                if (data.status === 200) {
                    say('Application #' + data.data + ' submitted', 'success', 3000);
                    setTimeout(() => {
                        hideMenu();
                    }, 3001);
                }
            })
        } else {
            say('Please complete all sections', 'error', 1500);
        }
    }

    return(
        <div className={styles.main}>
            <div className={styles.exitParent}>
                <div className={styles.exitButton} onClick={() => {hideMenu()}}>X</div>
            </div>
            <div className={styles.sub}>
                <div className={screeningStage !== 0 ? styles.hide : ''}>
                    {
                        (() => {
                            const missingKeywords = [];
                            keywords.forEach((v, i) => {
                                if (!keywordBase.includes(v[1].toLowerCase())) {
                                    missingKeywords.push(v[1]);
                                }
                            });

                            if (missingKeywords.length === 0) {
                                return <div className={styles.msgStyleA}><span>Automatic scan of your profile has shown that you are a good fit for this role.</span><Button variant='contained' onClick={() => {setScreeningStage(1)}}>Continue</Button></div>;
                            } else {
                                return <span>Your application was automatically <b>declined</b> as it failed to meet the minimum experience required by the company. Our system has detected that you are missing experience in the following field(s): <b>{missingKeywords.join(', ')}</b>. If you believe that this is an error, please message the recruiter and let them know. Apologies for any inconvenience caused.</span>;
                            }
                        })()
                    }
                </div>
                
                <div className={screeningStage !== 1 ? styles.hide : ''}>
                    <div className={!reqPass ? styles.hide : ''}>
                        <span className={styles.reqTitle}>Do you meet the below criteria:</span>
                        <div className={styles.reqParent}>
                            <ul>
                            {
                                req.map((v, i) => {
                                    return <li key={i}>{v[1]}</li>
                                })
                            }
                            </ul>
                        </div>
                        <div>
                            <Button variant='contained' onClick={() => {setReqPass(false)}} sx={{'color': '#ffffff', 'background': '#f00000', 'fontWeight': 'bold', mr: '60px', '&:hover': {'background': '#ff0000', 'fontWeight': 'bold'}}}>I do not</Button>
                            <Button variant='contained' onClick={() => {setScreeningStage(2)}} sx={{'color': '#ffffff', 'background': '#66B2FF', 'fontWeight': 'bold', '&:hover': {'background': '#66B2FF', 'fontWeight': 'bold'}}}>I do</Button>
                        </div>
                    </div>
                    <div className={reqPass ? styles.hide : ''}>
                        <span>Your application was automatically <b>declined</b> as you have failed to meet the minimum requirements set by the recruiter. Meeting all the conditions was essential for this job role.</span>
                    </div>
                </div>

                <div className={screeningStage !== 2 ? styles.hide : ''}>
                    <div className={styles.screeningTitle}><span>Complete all fields to finish your application</span></div>
                    <div>
                    {
                    screening.map((v, i) => {
                        if (i % 3 === 0) {
                            if (v === 'Text Response') {
                                return textResponse(i, screening[i+1], screening[i+2], i/3);
                            } else if (v === 'Video Response') {
                                return <VideoRecorder
                                    key={i}
                                    question={screening[i+1]}
                                    limit={screening[i+2] === 'na' ? 600 : Number(screening[i+2])}
                                    uid={i/3}
                                    handle={updateReference}
                                />
                            } else if (v === 'Requirement') {
                                return reqBox(i, screening[i+1], i/3)
                            }
                        }
                    })
                    }
                    </div>
                    <div className={styles.submitApplication}><Button variant='contained' onClick={() => {apply()}} sx={{'color': '#ffffff', 'background': '#66B2FF', 'fontWeight': 'bold', '&:hover': {'background': '#66B2FF', 'fontWeight': 'bold'}}}>Apply</Button></div>
                </div>
            </div>
        </div>
    );   
}

export default Page;