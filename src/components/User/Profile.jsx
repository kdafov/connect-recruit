/**
 * JSX component that will provide the UI and
 * functionality for the user's profile page
 */

import Image from "next/image"
import ProfileIcon from '@/public/assets/profile_icon.svg';
import ProfileIconActive from '@/public/assets/profile_icon_active.svg';
import LockIcon from '@/public/assets/lock_icon.svg';
import LockIconActive from '@/public/assets/lock_icon_active.svg';
import PreferencesIcon from '@/public/assets/preferences_icon.svg';
import PreferencesIconActive from '@/public/assets/preferences_icon_active.svg';
import TeamIcon from '@/public/assets/team_icon.svg';
import TeamIconActive from '@/public/assets/team_icon_active.svg';
import mainStyles from '@/styles/Admin/Profile.module.css';
import styles from '@/styles/User/profile.module.css';
import { useState, useEffect, forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from "axios";
import Router from "next/router";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CVIcon from '@/public/assets/cv_icon.svg';
import CVIconActive from '@/public/assets/cv_icon_active.svg';
import MoreSettingsIcon from '@/public/assets/more_settings_icon.svg';
import MoreSettingsIconActive from '@/public/assets/more_settings_active_icon.svg';

const AdminProfile = () => {
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


    const Setting = (icon, iconActive, iconAlt, label, menuIndex) => {
        return(
            <div className={menu===menuIndex ? mainStyles.selectedOption : mainStyles.menuOptionParent} onClick={() => setMenu(menuIndex)}>
                <Image src={menu===menuIndex ? iconActive : icon} alt={iconAlt} />
                <span>{label}</span>
            </div>
        )
    }
    
    const Panel = (label, description, content, menuIndex) => {
        return(
            <div className={menu===menuIndex ? mainStyles.menuSection : mainStyles.hiddenMenu}>
                <span className={mainStyles.menuLabel}>{label}</span>
                <span className={mainStyles.menuDescription}>{description}</span>
                {content}
            </div>
        )
    }

    const raiseAlert = (message, type) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
    }

    const router = Router.useRouter();

    const [menu, setMenu] = useState(0);
    const [newAccount, setNewAccount] = useState(false);
    const [cvURL, setCvURL] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [globalDb, setGlobalDb] = useState(true);
    const [clickCount, setClickCount] = useState(0);
    const [apikey, setApikey] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e) => { e.preventDefault(); };

    useEffect(() => {
        setTimeout(() => {
            let id = localStorage.getItem('id');
            axios.post('/api/loadUserData', {
                id,
                mode: 'profile-simple'
            }).then(( {data} ) => {
                if (data.data) {
                    setNewAccount(data.data.requires_setup === 1 ? true : false);
                    setCvURL(data.data.cv_ref);
                    setName(data.data.name || '');
                    setEmail(data.data.email || '');
                    setNotifications(data.data.notifications === 1 ? true : false);
                    setGlobalDb(data.data.global_cv === 1 ? true : false);

                    axios.post('/api/loadUserData', {
                        mode: 'api-key-check',
                        id: localStorage.getItem('id')
                    }).then(( {data} ) => {
                        if (data.status === 200) {
                            setApikey(data.key);
                        }
                    });
                }
            });
        }, 300)
    }, []);

    const handleCvUpload = async (file) => {
        setUploading(true);
        try {
            if(!file) {
                raiseAlert('Select a file to upload first', 'error');
                return;
            }
            const formData = new FormData();
            formData.append('cv', file);
            const { data } = await axios.post('/api/uploadFile?mode=cv&uid=' + localStorage.getItem('id'), formData);
            if (data.status === 200) {
                setCvURL(data.data);
                raiseAlert('CV updated', 'info');
                setNewAccount(false);
                setUploading(false);
            } else {
                raiseAlert('Uploading CV failed', 'error');
                setUploading(false);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const updateUserDetails = () => {
        if (name === undefined || name === null || name === '') {
            raiseAlert('Please enter valid name', 'error');
            return;
        }
        if (email === undefined || email === null || email === '') {
            raiseAlert('Please enter valid email', 'error');
            return;
        }

        axios.post('/api/loadUserData', {
            id: localStorage.getItem('id'),
            mode: 'update-user-details',
            email,
            name
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Personal details updated', 'success');
            }
        })
    }

    const updatePassword = () => {
        const currentPassword = document.getElementById('userPassword').value;
        const newPassword = document.getElementById('userNewPass').value;
        const newPasswordCnf = document.getElementById('userNewPassCnf').value;

        // Validate fields
        if (currentPassword === '' || currentPassword.length === 0) {
            raiseAlert('Please enter current password', 'error');
            return;
        }

        if (newPassword === '' || newPassword.length === 0) {
            raiseAlert('Please enter new password', 'error');
            return;
        }

        if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(newPassword))) {
            raiseAlert('New password must contain at least one uppercase letter, lowercase letter, a number, a special character (!@#$*&-=) and be of length 7 or more', 'error');
            return;
        }

        if (newPasswordCnf !== newPassword) {
            raiseAlert('The confirmed password does not match', 'error');
            return;
        }

        axios.post('/api/updateUserPassword', {
            id: localStorage.getItem('id'),
            password: currentPassword,
            newPassword: newPassword
        }).then(( {data} ) => {
            if (data.status === 401) {
                raiseAlert('The password your entered is invalid', 'error');
                return;
            } else if (data.status === 400) {
                raiseAlert('The new password cannot be the same as the old password', 'warning');
                return;
            } else if (data.status === 200) {
                raiseAlert('Your password has been updated', 'success');
            }
        })
    }


    const updatePreferences = () => {
        axios.post('/api/updateUserPreferences', {
            id: localStorage.getItem('id'),
            mode: 'user',
            notifications: notifications === true ? 1 : 0,
            globalcv: globalDb === true ? 1 : 0
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Your preferences have been updated', 'success');
            }
        })
    }

    const deleteAccount = () => {
        axios.post('/api/deleteUsers', {
            id: localStorage.getItem('id'),
            mode: 'user'
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Account deleted! Redirecting...', 'success');
                setTimeout(() => {
                    localStorage.clear();
                    router.push('/');
                }, 2000);
            }
        });
    }

    useEffect(() => {
        let timeoutId;
        if (clickCount === 2) { deleteAccount(); setClickCount(0); }
        timeoutId = setTimeout(() => { setClickCount(0); }, 2000);
        return () => { clearTimeout(timeoutId); };
    }, [clickCount]);

    const createAPIkey = () => {
        axios.post('/api/loadUserData', {
            id: localStorage.getItem('id'),
            mode: 'create-api-key'
        }).then(( {data} ) => { 
            if (data.status === 200) {
                setApikey(data.key);
                raiseAlert('API key created', 'success');
            }
        });
    }

    return(
        <section className={mainStyles.main}>
            <span className={mainStyles.title}>Profile settings</span>
            <span className={mainStyles.subtitle}>Change details about your account including name, email, cv, and preferences</span>

            <div className={newAccount ? mainStyles.newAccountPopup : mainStyles.hiddenMenu}>
                <InfoIcon />
                <span>Please add CV to your profile to complete the registration of your account</span>
            </div>

            <section className={mainStyles.panelMain}>
                <div className={mainStyles.leftPanel}>
                    {Setting(CVIcon, CVIconActive, 'CV Icon', 'CV', 0)}
                    {Setting(ProfileIcon, ProfileIconActive, 'Profile Icon', 'Personal details', 1)}
                    {Setting(LockIcon, LockIconActive, 'Lock Icon', 'Password', 2)}
                    {Setting(PreferencesIcon, PreferencesIconActive, 'Preferences Icon', 'Preferences', 3)}
                    {Setting(MoreSettingsIcon, MoreSettingsIconActive, '3 Dots Icon', 'Other', 4)}
                </div>
                <div className={mainStyles.rightPanel}>
                    {/*** CV SECTION ***/}
                    {Panel('CV', 'Upload or change your CV',
                    <section className={styles.cvSection}>
                        <span>Current CV: {cvURL === '' ? 'No CV found' : cvURL}</span>
                        <Button variant="outlined" component='label' size='small'>
                            {uploading ? 'Uploading...' : 'Upload CV'}
                            <input hidden accept=".doc,.docx,.pdf" type='file'
                                onChange={({ target }) => {
                                    if(target.files) {
                                        const file = target.files[0];
                                        handleCvUpload(file);
                                    }
                                }}
                            />
                        </Button>
                    </section>, 0)}

                    {/*** USER DETAILS SECTION ***/}
                    {Panel('Personal Details', 'Change your name and email address. Information such as job experience, education, phone number, skills and certification is automatically obtained from your CV using intelligent parsing.', 
                    <section className={mainStyles.sectionCompanyDetails}>
                        <div className={mainStyles.sectionCompanyDetailsTop}>
                            <TextField label="Name" variant="outlined" size='small' sx={{'margin': '25px 0px 7px'}} value={name} className={mainStyles.textField} onChange={(e) => setName(e.target.value)} />
                            <TextField label="Email" variant="outlined" size='small' sx={{'margin': '25px 0px 30px'}} value={email} className={mainStyles.textField} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={mainStyles.sectionCompanyDetailsSubmit}>
                            <Button variant="contained" onClick={() => updateUserDetails()}>Update Details</Button>
                        </div>
                    </section>, 
                    1)}

                    {/*** USER PASSWORD SECTION ***/}
                    {Panel('Password', 'Change the password of your account',
                    <section className={mainStyles.sectionPassword}>
                        <div className={mainStyles.sectionPasswordTop}>
                            <FormControl sx={{'margin': '25px 0px 7px', 'width': '250px'}} variant="outlined" className={mainStyles.passwordField}>
                                <InputLabel htmlFor="userPassword" size="small">Current password *</InputLabel>
                                <OutlinedInput
                                    required
                                    id="userPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                    label="Current password"
                                    size="small"
                                />
                            </FormControl>
                            <TextField id="userNewPass" label="New password *" variant="outlined" size='small' sx={{'margin': '25px 0px 7px', 'width': '250px'}} type={showPassword ? 'text' : 'password'} className={mainStyles.passwordField} />
                            <TextField id="userNewPassCnf" label="Confirm new password *" variant="outlined" size='small' sx={{'margin': '25px 0px 7px', 'width': '250px'}} type={showPassword ? 'text' : 'password'} className={mainStyles.passwordField}/>
                        </div>
                        <div className={mainStyles.sectionPasswordSubmit}>
                            <Button variant="contained" onClick={updatePassword}>Update Password</Button>
                        </div>
                    </section>, 2)}

                    {/*** USER PREFERENCES SECTION ***/}
                    {Panel('Preferences', 'Change your notification settings',
                    <section className={mainStyles.sectionPreferences}>
                        <div className={mainStyles.sectionPreferencesTop}>
                            <FormControlLabel control={<Checkbox checked={notifications} onChange={(e) => setNotifications(e.target.checked)} color="success" />} label='Receive notifications about applied jobs and messages from companies' sx={{mb: '15px', 'display': 'flex', 'alignItems': 'flex-start'}}/>
                            <FormControlLabel control={<Checkbox checked={globalDb} onChange={(e) => setGlobalDb(e.target.checked)} color="success" />} label='Upload your CV to global database where employers can find you and offer you jobs' sx={{mb: '15px', 'display': 'flex', 'alignItems': 'flex-start'}}/>
                        </div>
                        <div className={mainStyles.sectionPreferencesSubmit}>
                            <Button variant="contained" onClick={updatePreferences}>Update Preferences</Button>
                        </div>
                    </section>, 3)}

                    {/*** USER OTHER SETTINGS ***/}
                    {Panel('Other settings', 'Request account termination and other settings',
                    <section className={styles.deleteSection}>
                        <div className={styles.otherTop}>
                            <span>Terminate account</span>
                            <Button variant="contained" onClick={() => {setClickCount(clickCount + 1)}} sx={{'background': '#FF6666', 'fontWeight': '600', '&:hover': {'background': '#FF6666'}}}>{clickCount === 1 ? 'Click to confirm' : 'Delete Account'}</Button>
                        </div>
                        <div className={styles.otherBottom}>
                            {apikey === '' ? <>
                                <span>Request DEV API key</span>
                                <Button variant="contained" onClick={() => {createAPIkey()}} sx={{'background': '#66B2FF', 'fontWeight': '600', '&:hover': {'background': '#66B2FF'}}}>Request</Button>
                            </> : <>
                                <span>Your API key: <b>{apikey}</b></span>
                                <div className={styles.otherDEV0}>
                                    <div className={styles.otherDEV1}>
                                        <div>POST</div>
                                        <span>/api/joblist</span>
                                    </div>
                                    <div className={styles.otherSection}>
                                        <span className={styles.otherDescText}>Return the list of active jobs in the platform with information about each such as company name, job information and statistics (views and applications count).</span>
                                    </div>
                                    <div className={styles.otherHighlight}>
                                        <span>Parameters</span>
                                    </div>
                                    <div className={styles.otherSection}>
                                        <span className={styles.otherDescText}>X-API-KEY: Your API key</span>
                                    </div>
                                    <div className={styles.otherHighlight}>
                                        <span>Request body</span>
                                        <span>application/json</span>
                                    </div>
                                    <div className={styles.otherSection}>
                                        <span className={styles.otherDescText}>company: NULL | $string</span>
                                        <span className={styles.otherDescText}>role: NULL | $string</span>
                                        <span className={styles.otherDescText}>location: NULL | $string</span>
                                    </div>
                                    <div className={styles.otherHighlight}>
                                        <span>Response</span>
                                    </div>
                                    <div className={styles.otherSection}>
                                        <pre><code className={styles.code}>
                                            <div><span>{'{'}</span></div>
                                            <div>
                                                <span>  status : 200 | 400 | 401 | 405 | 500</span>
                                            </div>
                                            <div>
                                                <span>  data : {'['}</span>
                                            </div>
                                            <div>
                                                <span>    {'{'}</span>
                                            </div>
                                            <div>
                                                <span>      "company" : "Facebook"</span>
                                            </div>
                                            <div>
                                                <span>      "job": "Software Engineer"</span>
                                            </div>
                                            <div>
                                                <span>      "type": "Internship"</span>
                                            </div>
                                            <div>
                                                <span>      "level": "Entry-level"</span>
                                            </div>
                                            <div>
                                                <span>      "mode": "In-Person"</span>
                                            </div>
                                            <div>
                                                <span>      "location": "London"</span>
                                            </div>
                                            <div>
                                                <span>      "salary": "£0 - £25k"</span>
                                            </div>
                                            <div>
                                                <span>      "description": "Company description..."</span>
                                            </div>
                                            <div>
                                                <span>      "requirements": "Job requirements..."</span>
                                            </div>
                                            <div>
                                                <span>      "benefits": "Job benefits..."</span>
                                            </div>
                                            <div>
                                                <span>      "more_info": "Additional info..."</span>
                                            </div>
                                            <div>
                                                <span>      "date_posted": "2023-04-15T23:00:00.000Z"</span>
                                            </div>
                                            <div>
                                                <span>      "expiring": 1 | 0</span>
                                            </div>
                                            <div>
                                                <span>      "exp_date": "2023-04-22 15:47:28" | ""</span>
                                            </div>
                                            <div>
                                                <span>      "views": 1</span>
                                            </div>
                                            <div>
                                                <span>      "applications": 0</span>
                                            </div>
                                            <div>
                                                <span>    {'},'}</span>
                                            </div>
                                            <div>
                                                <span>    {'{'}</span>
                                            </div>
                                            <div>
                                                <span>      ...</span>
                                            </div>
                                            <div>
                                                <span>    {'},'}</span>
                                            </div>
                                            <div>
                                                <span>    ...</span>
                                            </div>
                                            <div>
                                                <span>  {'],'}</span>
                                            </div>
                                            <div>
                                                <span>  timestamp : "2023-04-17T15:13:39.569Z"</span>
                                            </div>
                                            <div>
                                                <span>{'}'}</span>
                                            </div>
                                        </code></pre>
                                    </div>
                                </div>
                            </>}
                        </div>
                    </section>, 4)}
                </div>

                
            </section>

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

export default AdminProfile;