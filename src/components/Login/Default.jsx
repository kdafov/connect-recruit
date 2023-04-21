/***
 * JSX component for login page and its functionality
 * providing authentication, data validation, and 
 * JWT credentials creation.
 */

import { useState, forwardRef } from 'react';
import axios from 'axios';
import styles from '@/styles/Login/main.module.css';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import Router from 'next/router';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Page = () => {
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const [alert, setAlert] = useState(false);
    const closeAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false);
    }

    const router = Router.useRouter();

    const [inputErr, setInputErr] = useState([false, false]);
    const [err, setErr] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formSubmit, setFormSubmit] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e) => { e.preventDefault(); };

    // Reusable function to display errors
    const raiseError = (pos, text) => {
        let tempInputErr = [false, false];
        if(pos !== -1 && pos !== 2) { tempInputErr[pos] = true; }
        if(pos === 2) { tempInputErr = [true, true]; }
        setInputErr(tempInputErr);
        setFormSubmit(false);
        setErr(text);
    }

    const handleFormSubmit = (e) => {
        // Prevent default action, clear previous errors and start loading animation
        e.preventDefault();
        setInputErr([false, false]);
        setErr('');
        setFormSubmit(true);

        // Define variables
        let email = document.getElementById('login-id').value;
        let password = document.getElementById('login-pass').value;

        // Validate email
        if(email === undefined || email === null || email.length === 0) {
            raiseError(0, 'Please enter an email address');
            return;
        } 
        if(!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email))) {
            raiseError(0, 'Email address entered is not a valid email address');
            return;
        }

        // Check if user is reseting password and if so interupt validation here
        if(forgotPassword) {
            axios.post('/api/resetPassword', {
                email
            }).then((response) => {
                console.log('%cWARNING: The log below should not be displayed in development', "color: red; font-family:monospace; font-size: 28px")
                console.log(`%cPassword reset link: ${response.data.resetLink}`,"color: #66B2FF; font-family:monospace; font-size: 20px");
                setFormSubmit(false);

                setAlert(true);
            });
            return;
        }

        // Validate password
        if(password === undefined || password === null || password.length === 0) {
            raiseError(1, 'Please enter a password');
            return;
        }

        // Check if credentials exist (Validate user)
        axios.post('/api/auth', {
            email,
            password
        }).then((response) => {
            if(response.data.requestStatus === true) {
                // Save tokens into local storage and redirect to homepage
                localStorage.setItem('accessToken', response.data.requestData.accessToken);
                localStorage.setItem('refreshToken', response.data.requestData.refreshToken);
                localStorage.setItem('route', response.data.requestData.route);
                router.push(localStorage.getItem('route'));

                // Stop the loading animation
                setFormSubmit(false);
            } else {
                raiseError(2, 'Email or password is incorrect');
                return;
            }
        }).catch((error) => {
            console.error(error);
        });
    }


    return(
        <section className={styles.parent}>
            <div className={forgotPassword ? styles.formFlipped : styles.form}>
                <span className={styles.formLabel}>{forgotPassword ? 'Reset password' : 'Log In'}</span>

                <span className={forgotPassword ? styles.instructionsLabel : styles.formFlippedHiddenInput}>Enter your email and if it is valid you will receive a reset link to your inbox</span>

                <TextField
                    className={styles.formBaseInput}
                    error={inputErr[0]}
                    required
                    id='login-id'
                    label='Email address'
                    placeholder='john.doe@domain.com'
                    size="small"
                    margin="normal"
                />

                <FormControl sx={{ m: 3, width: '230px' }} variant="outlined" className={forgotPassword ? styles.formFlippedHiddenInput : styles.formBaseInput}>
                    <InputLabel htmlFor="login-pass" size="small">Password *</InputLabel>
                    <OutlinedInput
                        error={inputErr[1]}
                        required
                        id="login-pass"
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
                        label="Password"
                        size="small"
                    />
                </FormControl>

                <LoadingButton
                    className={styles.formButton}
                    size="normal"
                    onClick={(e) => {handleFormSubmit(e)}}
                    endIcon={<SendIcon />}
                    loading={formSubmit}
                    loadingPosition="end"
                    variant="contained"
                    sx={{'width': '230px', 'background': '#66B2FF', 'color': '#ffffff', 'margin': '35px 0px 0px'}}
                    >
                    <span>{forgotPassword ? 'Reset' : 'Login'}</span>
                </LoadingButton>

                <span className={styles.resetLabel} onClick={(e) => {
                    setForgotPassword(curr => !curr);
                    setInputErr([false, false]);
                    setErr('');
                }}>{forgotPassword ? 'Go back' : 'Reset password'}</span>

                <span className={styles.err}>{err}</span>
            </div>

            <Snackbar 
                open={alert} 
                autoHideDuration={5000} 
                onClose={closeAlert} 
                anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
            >
                <Alert onClose={closeAlert} severity='info'>A reset link has been sent to your email</Alert>
            </Snackbar>
        </section>
    )
}

export default Page;