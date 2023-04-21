/**
 * JSX component providing functionality for
 * password reset screen
 */

import styles from '@/styles/Login/main.module.css';
import { useState, forwardRef } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Router from 'next/router'
import axios from 'axios';
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
    const { id } = router.query;

    const [inputErr, setInputErr] = useState([false, false]);
    const [err, setErr] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formSubmit, setFormSubmit] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e) => { e.preventDefault(); };

    // reusable component to display errors
    const raiseError = (pos, text) => {
        let tempInputErr = [false, false];
        if(pos !== -1) { tempInputErr[pos] = true; }
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

        //Define variables
        let password = document.getElementById('login-reset-pass').value;
        let passwordConfirm = document.getElementById('login-reset-pass-cnf').value;

        // Validate password
        if(password === undefined || password === null || password.length === 0) {
            raiseError(2, 'Please enter a password');
            return;
        }
        if(passwordConfirm === undefined || passwordConfirm === null || passwordConfirm.length === 0) {
            raiseError(3, 'Please confirm your password');
            return;
        }
        if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(password))) {
            raiseError(2, 'Password must contain at least one uppercase letter, lowercase letter, a number, a special character (!@#$*&-=) and be of length 7 or more');
            return;
        }
        if (password !== passwordConfirm) {
            raiseError(3, 'Passwords do not match');
            return;
        }

        // Update password in database
        axios.post('/api/updatePassword', {
            password,
            id
        }).then((response) => {
            if (response.data.status === 200) {
                setAlert(true);
                setTimeout(() => {
                    router.push('/login');
                    return;
                }, 5000);
            } else if (response.data.status === 400) {
                raiseError(-1, 'You must use a different password from your current one');
                return;
            } else if (response.data.status === 498) {
                raiseError(-1, 'The reset link has expired');
                return;
            } else {
                raiseError(-1, 'There was an error with your request');
                return;
            }
        });
    }

    return(
        <section className={styles.parent}>
            <div className={styles.form}>
                <span className={styles.formLabel}>Reset password</span>

                <span className={styles.instructionsLabel}>Enter your new password</span>

                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className={styles.formBaseInput}>
                    <InputLabel htmlFor="login-reset-pass" size="small">New password *</InputLabel>
                    <OutlinedInput
                        error={inputErr[0]}
                        required
                        id="login-reset-pass"
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

                <TextField
                    className={styles.formBaseInput}
                    error={inputErr[1]}
                    required
                    id='login-reset-pass-cnf'
                    label='Confirm new password'
                    size="small"
                    margin="normal"
                    type={showPassword ? 'text' : 'password'}
                />

                <LoadingButton
                    className={styles.formButton}
                    size="normal"
                    onClick={(e) => {handleFormSubmit(e)}}
                    endIcon={<SendIcon />}
                    loading={formSubmit}
                    loadingPosition="end"
                    variant="contained"
                    >
                    <span>Reset password</span>
                </LoadingButton>

                <span className={styles.err}>{err}</span>
            </div>

            <Snackbar 
                open={alert} 
                autoHideDuration={5000} 
                onClose={closeAlert} 
                anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
            >
                <Alert onClose={closeAlert} severity='success'>Password updated successfully. Redirecting to Login page...</Alert>
            </Snackbar>
        </section>
    )
}

export default Page;