/**
 * JSX component that will provide the UI and
 * functionality for the profile page for the 
 * recruiter. It should include an option to
 * change email address, password and preferences.
 */

import { useState, useEffect, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import styles from '@/styles/Recruiter/profile.module.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const ProfilePage = () => {
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

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e) => { e.preventDefault(); };
    const changeNotification = (event) => { setNotifications(event.target.checked) };

    const raiseAlert = (message, type) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
    }

    useEffect(() => {
        setTimeout(() => {
            let id = localStorage.getItem('id');
            axios.post('/api/loadRecruiterData', {
                id,
                mode: 'load-notifications-settings'
            }).then(( {data} ) => {
                if (data.data.length > 0) {
                    setNotifications(data.data[0].notifications === 1 ? true : false);
                }
            })
        }, 300);
    }, []);

    const [showPassword, setShowPassword] = useState(false);
    const [notifications, setNotifications] = useState(false);

    const updatePassword = () => {
        const currentPassword = document.getElementById('recruiterPassword').value;
        const newPassword = document.getElementById('recruiterNewPass').value;
        const newPasswordCnf = document.getElementById('recruiterNewPassCnf').value;

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
            mode: 'recruiter',
            notifications: notifications ? '1' : '0'
        }).then(( {data} ) => {
            if(data.status === 200) {
                raiseAlert('Preference settings updated', 'success');
            }
        })
    }

    return(
        <section className={styles.main}>
            <span className={styles.title}>Your Profile</span>
            <span className={styles.subtitle}>Change your password and notification settings</span>
            <div className={styles.sub}>
                <div className={styles.passwordSection}>
                    <span className={styles.passwordTitle}>Password</span>
                    <FormControl sx={{'margin': '25px 0px 7px', 'width': '250px'}} variant="outlined" className={styles.passwordField}>
                        <InputLabel htmlFor="recruiterPassword" size="small">Current password *</InputLabel>
                        <OutlinedInput
                            required
                            id="recruiterPassword"
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

                    <div className={styles.passwordSub}>
                        <TextField id="recruiterNewPass" label="New password *" variant="outlined" size='small' sx={{'margin': '25px 0px 7px', 'width': '250px'}} type={showPassword ? 'text' : 'password'} className={styles.passwordField} />
                        <TextField id="recruiterNewPassCnf" label="Confirm new password *" variant="outlined" size='small' sx={{'margin': '25px 0px 7px', 'width': '250px'}} type={showPassword ? 'text' : 'password'} className={styles.passwordField}/>
                    </div>

                    <Button variant="contained" onClick={updatePassword} sx={{mt: '30px'}}>Update Password</Button>
                </div>

                <div className={styles.prefSection}>
                    <span className={styles.prefTitle}>Preferences</span>

                    <div className={styles.cbParent}>
                        <FormControlLabel control={<Checkbox name="notifications" checked={notifications} onChange={changeNotification} icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label={<span className={styles.cbTitle}>Receive email notifications</span>} />
                        <span className={styles.cbSub}>Receive notifications to your email so you can continue to be updated about the progress of job adverts even when you are not logged in to the platform.</span>
                    </div>

                    <Button variant="contained" onClick={updatePreferences} sx={{mt: '15px'}}>Update Preferences</Button>
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

export default ProfilePage;