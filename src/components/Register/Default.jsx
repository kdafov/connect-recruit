/**
 * JSX component that will provide the UI and
 * functionality for the Register page together
 * with validating the inputs and creating JWT tokens
 * and inserting relevant data into the database when
 * new user is registering. It should have options for
 * both users and company owners.
 */

import styles from '@/styles/Register/main.module.css';
import Image from 'next/image';
import FeatureIMG from '@/public/assets/feature_tick.svg';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/router";

const Page = () => {
    const router = useRouter();
    
    const [registerMode, setRegisterMode] = useState(0); // 0 = User; 1 = Company
    const [inputErr, setInputErr] = useState([false, false, false, false]);
    const [formSubmit, setFormSubmit] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (e) => { e.preventDefault(); };

    const raiseError = (pos, text) => {
        let tempInputErr = [false, false, false, false];
        if(pos !== -1) { tempInputErr[pos] = true; }
        setInputErr(tempInputErr);
        setFormSubmit(false);
        setError(text);
    }

    const feature = (text) => {
        return(
            <div className={styles.featureParent}>
                <Image src={FeatureIMG} alt='Tick icon'/>
                <span>{text}</span>
            </div>
        )
    }

    const handleFormSubmit = (e) => {
        // Prevent default behavior & set loading animation
        e.preventDefault();
        setFormSubmit(curr => !curr);

        // Clear previous errors
        setError('');
        setInputErr([false, false, false, false])

        // Define variables
        let name = document.getElementById('reg-name').value;
        let email = document.getElementById('reg-email').value;
        let password = document.getElementById('reg-pass').value;
        let passwordConfirm = document.getElementById('reg-pass-cnf').value;
        
        // Validate name
        if(name === undefined || name === null || name.length === 0) {
            raiseError(0, 'Please enter a name');
            return;
        } 
        if(!(/^[A-Za-z\s]+$/.test(name))) {
            raiseError(0, 'Name field can only contain alphabetic characters');
            return;
        }
        
        // Validate email address
        if(email === undefined || email === null || email.length === 0) {
            raiseError(1, 'Please enter an email address');
            return;
        } 
        if(!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email))) {
            raiseError(1, 'Email address entered is not a valid email address');
            return;
        }

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

        // Check if email exists in database
        axios.post('/api/checkEmail', {
            email
        })
        .then((response) => {
            if (response?.data === true) {
                // Email already exists in database
                raiseError(1, 'Email already exists');
                return;
            }

            // Write user details to database
            axios.put('/api/completeRegister', {
                name,
                email,
                password,
                access: registerMode === 0 ? 'USER_ACCESS' : 'ADMIN_ACCESS'
            })
            .then((response) => {
                if(response.status === 200) {
                    // Get generated access & refresh tokens
                    const accessToken = response.data.accessToken;
                    const refreshToken = response.data.refreshToken;

                    // Relocate to corresponding homepage
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('route', registerMode === 0 ? '/user' : '/admin');
                    router.push(localStorage.getItem('route'));

                    // Stop the loading animation
                    setFormSubmit(false);
                } else {
                    raiseError(-1, 'Something went wrong')
                    return;
                }
            });
        });
    }

    return(
        <section className={styles.parent}>
            <div className={styles.leftPanel}>
                <div className={styles.form}>
                    <span className={styles.formLabel}>Sign Up</span>
                    <div className={styles.inputHolder}>
                        <ButtonGroup size="small" aria-label="small button group" className={styles.formButton}>
                            <Button key='one' className={registerMode === 0 ? styles.modeSliderOn : styles.formButtonChild} onClick={(e) => setRegisterMode(0)}>Individual</Button>
                            <Button key='two' className={registerMode === 1 ? styles.modeSliderOn : styles.formButtonChild} onClick={(e) => setRegisterMode(1)}>Company</Button>
                        </ButtonGroup>

                        <TextField
                            className={styles.formBaseInput}
                            error={inputErr[0] === false ? false : true}
                            required
                            id='reg-name'
                            label={registerMode === 0 ? 'Name' : 'Company Name'}
                            placeholder={registerMode === 0 ? 'John Doe' : 'Facebook'}
                            size="small"
                            margin="normal"
                        />

                        <TextField
                            className={styles.formBaseInput}
                            error={inputErr[1] === false ? false : true}
                            required
                            id='reg-email'
                            label='Email'
                            placeholder='johndoe@example.com'
                            size="small"
                            margin="normal"
                        />

                        <FormControl sx={{ m: 1 }} variant="outlined" className={styles.formBaseInput}>
                            <InputLabel htmlFor="reg-pass" size="small">Password *</InputLabel>
                            <OutlinedInput
                                error={inputErr[2] === false ? false : true}
                                required
                                id="reg-pass"
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
                            error={inputErr[3] === false ? false : true}
                            required
                            id='reg-pass-cnf'
                            label='Confirm Password'
                            placeholder=''
                            size="small"
                            margin="normal"
                            type={showPassword ? 'text' : 'password'}
                        />
                    </div>

                    <LoadingButton
                        className={styles.submitButton}
                        size="normal"
                        onClick={(e) => {handleFormSubmit(e)}}
                        endIcon={<SendIcon />}
                        loading={formSubmit}
                        loadingPosition="end"
                        variant="contained"
                        sx={{'width': '230px', 'background': '#66B2FF', 'color': '#ffffff'}}
                        >
                        <span>Continue</span>
                    </LoadingButton>

                    <span className={error === '' ? styles.errHide : styles.err}>{error === '' ? '' : error}</span>
                </div>
            </div>
            <div className={styles.rightPanel}>
                <h2>Welcome to the All-in-One Jobs Tool</h2>
                {registerMode === 0 ?
                <div>
                    {feature('Advanced job search')}
                    {feature('Instant notifications')}
                    {feature('Adapts to your preferences')}
                    {feature('Simplified application process')}
                    {feature('Companies find you using your CV')}
                    {feature('Mobile devices friendly')}
                </div> :
                <div>
                    {feature('Control over your recruiters')}
                    {feature('Design every bit of your job application')}
                    {feature("Visualization of your company's data")}
                    {feature('CV Base to find and filter candidates')}
                    {feature('AI used to make recruiting easier')}
                </div>
                }
            </div>
        </section>
    )
}

export default Page;