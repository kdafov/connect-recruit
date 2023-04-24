import Image from "next/image"
import ProfileIcon from '@/public/assets/profile_icon.svg';
import ProfileIconActive from '@/public/assets/profile_icon_active.svg';
import LockIcon from '@/public/assets/lock_icon.svg';
import LockIconActive from '@/public/assets/lock_icon_active.svg';
import PreferencesIcon from '@/public/assets/preferences_icon.svg';
import PreferencesIconActive from '@/public/assets/preferences_icon_active.svg';
import TeamIcon from '@/public/assets/team_icon.svg';
import TeamIconActive from '@/public/assets/team_icon_active.svg';
import styles from '@/styles/Admin/Profile.module.css';
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
import CancelIcon from '@mui/icons-material/Cancel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

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
            <div className={menu===menuIndex ? styles.selectedOption : styles.menuOptionParent} onClick={() => setMenu(menuIndex)}>
                <Image src={menu===menuIndex ? iconActive : icon} alt={iconAlt} />
                <span>{label}</span>
            </div>
        )
    }
    
    const Panel = (label, description, content, menuIndex) => {
        return(
            <div className={menu===menuIndex ? styles.menuSection : styles.hiddenMenu}>
                <span className={styles.menuLabel}>{label}</span>
                <span className={styles.menuDescription}>{description}</span>
                {content}
            </div>
        )
    }

    const EmployerView = (id, key, name, role) => {
        return(
            <div className={styles.recruitersListItem} key={key}>
                <div className={styles.recruitersNameBox}>
                    <span className={styles.recruitersListTitle}>{name}</span>
                    <span className={styles.recruitersListDash}> - </span>
                    <span className={styles.recruitersListRole}>{role === 0 ? 'limited access' : 'full access'}</span>
                </div>

                <div className={styles.recruitersActionBox}>
                    <IconButton aria-label='Change access' size='small' onClick={() => {
                        changeAccess(id, !role);
                    }}>
                        {role === 0 ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}
                    </IconButton>
                    <IconButton aria-label='Delete' size='small' onClick={() => {
                        removeRecruiter(id);
                    }}> <DeleteSweepIcon /> </IconButton>
                </div>
            </div>
        )
    }

    const router = Router.useRouter();

    const raiseAlert = (message, type) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
    }

    const [menu, setMenu] = useState(0);
    const [logoURL, setLogoURL] = useState('');
    const [newAccount, setNewAccount] = useState(false);
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');

    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const [notifications, setNotifications] = useState(true);
    const [directMessages, setDirectMessages] = useState(true);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e) => { e.preventDefault(); };

    const [anchorEl, setAnchorEl] = useState(null);
    const recruiterMenuOpen = Boolean(anchorEl);
    const handleRecruiterMenuOpen = (event) => { setAnchorEl(event.currentTarget); };
    const handleRecruiterMenuClose = () => { setAnchorEl(null); };

    const [recruiterAddMenu, setRecruiterAddMenu] = useState(false);
    const [recruiterType, setRecruiterType] = useState('limited');
    const [showRecruiterInfo, setShowRecruiterInfo] = useState(false);
    const [recruitersList, setRecruitersList] = useState([]);

    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        // Load profile information from the database
        setTimeout(() => {
            let id = localStorage.getItem('id');
            axios.post('/api/loadAdminData', {id}).then(( {data} ) => {
                setNewAccount(data.requires_setup === 1 ? true : false)
                document.getElementById('companyName').value = data.name;
                document.getElementById('companyEmail').value = data.email;
                setName(data.name);
                setLogoURL(data.logo_url === null ? '' : data.logo_url);
                setDescription(data.company_description === null ? '' : data.company_description);
                setDirectMessages(data.direct_messages === 1 ? true : false);
                setNotifications(data.notifications === 1 ? true : false);
                setRecruitersList(data.recruiters);
            })
        }, 300)
    }, [])


    const updateCompanyDetails = () => {
        // Check if company logo and description is uploaded
        if (logoURL === null || logoURL === '') {
            raiseAlert('Please upload a company logo', 'error');
            return;
        }

        if (description === '' || description.length === 0) {
            raiseAlert('Please add a company description', 'error');
            return;
        }

        // Check if email and name are valid
        let name = document.getElementById('companyName').value;
        let email = document.getElementById('companyEmail').value;

        if (name === '' || name.length === 0) {
            raiseAlert('Please enter a valid company name', 'error');
            return;
        }

        if (email === '' || email.length === 0) {
            raiseAlert('Please enter a valid email address', 'error');
            return;
        }

        // Check if company is in registration phase
        let mode;
        if (newAccount) {
            mode = 'fill-company-details';
        } else {
            mode = 'u-company-details';
        }

        // Update database
        axios.post('/api/updateCompanyDetails', {
            id: localStorage.getItem('id'),
            mode,
            name,
            email,
            logoURL,
            description
        }).then(( {data} ) => {
            if (data.status === 200) {
                if (newAccount) {
                    raiseAlert('Registration setup completed', 'success');
                    setNewAccount(false);
                    setTimeout(() => { router.push('/admin') }, 2000);
                } else {
                    raiseAlert('Company details updated', 'success');
                }
            }
        });
    }
    

    const handleUploadLogo = async () => {
        // Check if logo is uploaded
        setUploading(true);
        try {
            if(!selectedFile) {
                // Logo is not uploaded
                setUploading(false);
                raiseAlert('Select a file to upload first', 'error');
                return;
            }
            const formData = new FormData();
            formData.append('myImage', selectedFile);
            const { data } = await axios.post('/api/uploadImage', formData);
            setLogoURL(data.data);
        } catch (e) {
            console.log(e);
        }
        setUploading(false);
    }


    const updatePassword = () => {
        const currentPassword = document.getElementById('companyPassword').value;
        const newPassword = document.getElementById('companyNewPass').value;
        const newPasswordCnf = document.getElementById('companyNewPassCnf').value;

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

        // Update password
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
            mode: 'admin',
            notifications: notifications === true ? 1 : 0,
            dm: directMessages === true ? 1 : 0
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Your preferences have been updated', 'success');
            }
        })
    }

    
    const addNewRecruiter = () => {
        const recruiterName = document.getElementById('newRecruiterName').value;
        const recruiterEmail = document.getElementById('newRecruiterEmail').value;

        //Validate fields
        if (recruiterName === '' || recruiterName.length === 0) {
            raiseAlert('Recruiter name not valid', 'error');
            return;
        }
        if (recruiterEmail === '' || recruiterEmail.length === 0) {
            raiseAlert('Recruiter email not valid', 'error');
            return;
        }

        //Send name and email to server to generate a recruiter account
        axios.post('/api/addRecruiter', {
            companyId: localStorage.getItem('id'),
            name: recruiterName,
            email: recruiterEmail,
            access: recruiterType
        }).then(( {data} ) => {
            if (data.status === 200) {
                setShowRecruiterInfo(true);
                document.getElementById('newRecruiterName').value = '';
                document.getElementById('newRecruiterEmail').value = '';
                document.getElementById('newRecruiterId').value = recruiterEmail;
                document.getElementById('newRecruiterPass').value = data.password;

                // Update useState
                setRecruitersList([...recruitersList, {
                    user_id: data.newUserId,
                    name: recruiterName,
                    full_access: recruiterType === 'limited' ? 0 : 1
                }]);
            }
        })
    }


    const changeAccess = (id, changeTo) => {
        axios.put('/api/modifyRecruiter', { 
            id, 
            action: Number(changeTo) === 1 ? 'promote' : 'demote'
        }).then(( {data} ) => {
            if (data.status === 200) {
                // Update useState to avoid calling db
                const updatedList = recruitersList.map(user => {
                    if (user.user_id === id) {
                      return { ...user, full_access: Number(changeTo) };
                    }
                    return user;
                });
                setRecruitersList(updatedList);

                // Alert user
                raiseAlert('Access changed', 'info');
            }
        });
    }


    const removeRecruiter = (id) => {
        axios.put('/api/deleteUsers', { 
            id, 
            mode: 'recruiter'
        }).then(( {data} ) => {
            if (data.status === 200) {
                // Update useState to avoid calling db
                setRecruitersList(recruitersList.filter(user => user.user_id !== id));
                
                // Alert user
                raiseAlert('Recruiter removed', 'info');
            }
        });
    }

    const deleteAccount = () => {
        axios.post('/api/deleteUsers', {
            mode: 'company',
            id: localStorage.getItem('id')
        }).then(( {data} ) => {
            if (data.status === 200) {
                raiseAlert('Company deleted', 'success');
                setTimeout(() => {
                    localStorage.clear();
                    router.push('/');
                }, 2000);
            }
        })
    }

    useEffect(() => {
        let timeoutId;
        if (clickCount === 2) { deleteAccount(); setClickCount(0); }
        timeoutId = setTimeout(() => { setClickCount(0); }, 2000);
        return () => { clearTimeout(timeoutId); };
    }, [clickCount]);

    return(
        <section className={styles.main}>
            <span className={styles.title}>Profile settings</span>
            <span className={styles.subtitle}>Change company details, preferences and recruiters access</span>

            <div className={newAccount ? styles.newAccountPopup : styles.hiddenMenu}>
                <InfoIcon />
                <span>Please add a company logo and description to complete the setup of your account</span>
            </div>

            <section className={styles.panelMain}>
                <div className={styles.leftPanel}>
                    {Setting(ProfileIcon, ProfileIconActive, 'Profile Icon', 'Company details', 0)}
                    {Setting(LockIcon, LockIconActive, 'Lock Icon', 'Password', 1)}
                    {Setting(PreferencesIcon, PreferencesIconActive, 'Preferences Icon', 'Preferences', 2)}
                    {Setting(TeamIcon, TeamIconActive, 'People Icon', 'Recruiters', 3)}
                </div>
                <div className={styles.rightPanel}>
                    {/*** COMPANY DETAILS SECTION ***/}
                    {Panel('Company Details', 'Change company name, logo and email', 
                    <section className={styles.sectionCompanyDetails}>
                        <div className={styles.sectionCompanyDetailsTop}>
                            <TextField id="companyName" label="Company Name" variant="outlined" size='small' sx={{'margin': '25px 0px 7px'}} defaultValue={' '} className={styles.textField} />
                            <TextField id="companyEmail" label="Company Email" variant="outlined" size='small' sx={{'margin': '15px 0px 30px'}} defaultValue={' '} className={styles.textField} />
                            <div className={styles.logoUploadContainer}>
                                <span className={styles.logoImageHodler}><b>Logo</b>: {logoURL === null || logoURL === '' ? 'No logo found' : <img src={logoURL} alt='Company Logo' className={styles.logoImage}/>}
                                </span>

                                <div>
                                <Button variant="outlined" component='label' size='small' sx={{mr: 1, 'textTransform': 'capitalize'}}>
                                    {selectedFile === null ? 'Select file' : 'File selected!'}
                                    <input hidden accept="image/*" type='file'
                                    onChange={({ target }) => {
                                        if(target.files) {
                                            const file = target.files[0];
                                            setSelectedImage(URL.createObjectURL(file));
                                            setSelectedFile(file);
                                        }
                                    }} />
                                </Button>
                                <Button variant="outlined" component='label' size='small' disabled={uploading} onClick={handleUploadLogo} sx={{ml: 1, 'textTransform': 'capitalize', }}>{uploading ? 'Uploading...' : 'Upload logo'}</Button>
                                </div>

                                <TextField
                                    id="companyDescription" label="Company Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} sx={{'margin': '30px 0px 10px', 'width': '400px', 'fontSize': '14px'}} className={styles.companyDescriptionField}/>
                                
                                <div className={styles.stylesDelete}>
                                    <Button size='small' variant="contained" onClick={() => {setClickCount(clickCount + 1)}} sx={{'background': '#FF6666', 'fontWeight': '600', '&:hover': {'background': '#FF6666'}}}>{clickCount === 1 ? 'Click to confirm' : 'Delete Company'}</Button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.sectionCompanyDetailsSubmit}>
                            <Button variant="contained" onClick={updateCompanyDetails}>Update Details</Button>
                        </div>
                    </section>, 
                    0)}

                    {/*** COMPANY PASSWORD SECTION ***/}
                    {Panel('Password', 'Change the password of your account',
                    <section className={styles.sectionPassword}>
                        <div className={styles.sectionPasswordTop}>
                            <FormControl sx={{'margin': '25px 0px 7px', 'width': '250px'}} variant="outlined" className={styles.passwordField}>
                                <InputLabel htmlFor="companyPassword" size="small">Current password *</InputLabel>
                                <OutlinedInput
                                    required
                                    id="companyPassword"
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
                            <TextField id="companyNewPass" label="New password *" variant="outlined" size='small' sx={{'margin': '25px 0px 7px', 'width': '250px'}} type={showPassword ? 'text' : 'password'} className={styles.passwordField} />
                            <TextField id="companyNewPassCnf" label="Confirm new password *" variant="outlined" size='small' sx={{'margin': '25px 0px 7px', 'width': '250px'}} type={showPassword ? 'text' : 'password'} className={styles.passwordField}/>
                        </div>
                        <div className={styles.sectionPasswordSubmit}>
                            <Button variant="contained" onClick={updatePassword}>Update Password</Button>
                        </div>
                    </section>, 1)}

                    {/*** COMPANY PREFERENCES SECTION ***/}
                    {Panel('Preferences', 'Change notification settings and company settings',
                    <section className={styles.sectionPreferences}>
                        <div className={styles.sectionPreferencesTop}>
                            <FormControlLabel control={<Checkbox checked={notifications} onChange={(e) => setNotifications(e.target.checked)} color="success" />} label='Receive notifications about company performance and recruiters activity' sx={{mb: '15px', 'display': 'flex', 'alignItems': 'flex-start'}}/>
                            <FormControlLabel control={<Checkbox checked={directMessages} onChange={(e) => setDirectMessages(e.target.checked)} color="success" />} label='Allow employees to send direct messages to your company' sx={{mb: '15px', 'display': 'flex', 'alignItems': 'flex-start'}}/>
                        </div>
                        <div className={styles.sectionPreferencesSubmit}>
                            <Button variant="contained" onClick={updatePreferences}>Update Preferences</Button>
                        </div>
                    </section>, 2)}

                    {/*** COMPANY RECRUITERS SECTION ***/}
                    {Panel('Recruiters', 'Add or remove recruiters, and change their access and other settings',
                    <section className={styles.sectionRecruiters}>
                        <div className={styles.topSectionRecruiters}>
                            <span>List of all recruiters working for {name}</span>
                            <Button variant="contained" size="small" onClick={() => {setRecruiterAddMenu(true)}}>Add New</Button>
                        </div>
                        <div className={styles.recruitersListParent}>
                            {recruitersList.length > 0 ?
                                recruitersList.map((v, i) => EmployerView(v.user_id, i, v.name, v.full_access)) : <>No recruiters found.</> 
                            }
                        </div>
                    </section>, 3)}
                </div>

                <div className={recruiterAddMenu ? styles.recruiterAddPopupShow : styles.recruiterAddPopupParentDefault}>
                    <div className={styles.recruiterAddPopup}>
                            <div className={styles.recruiterAddMenuCloseBtn}>
                                <IconButton aria-label='Close' size='small' onClick={() => {
                                    setRecruiterAddMenu(false)
                                    setShowRecruiterInfo(false);
                                    document.getElementById('newRecruiterName').value = '';
                                    document.getElementById('newRecruiterEmail').value = '';
                                }}><CancelIcon/></IconButton>
                            </div>
                            <div className={showRecruiterInfo ? styles.recruiterAddMenuFormHidden : styles.recruiterAddMenuForm}>
                                <span>Fill in the details below:</span>
                                <TextField id="newRecruiterName" label="Name of recruiter *" variant="outlined" size='small' sx={{'margin': '25px 0px 7px', 'width': '250px'}} />
                                <TextField id="newRecruiterEmail" label="Email of recruiter *" variant="outlined" size='small' sx={{'margin': '25px 0px 27px', 'width': '250px'}} />
                                <Tooltip title='Limited = read access to job applications and full access to messages'><ToggleButtonGroup
                                    color="primary"
                                    value={recruiterType}
                                    exclusive
                                    onChange={(e, v) => {setRecruiterType(v)}}
                                    aria-label='Recruiter type'
                                    size='small'
                                    sx={{'width': '250px'}}
                                >
                                    <ToggleButton value='limited' sx={{'width': '135px'}}>Limited Access</ToggleButton>
                                    <ToggleButton value='full' sx={{'width': '115px'}}>Full Access</ToggleButton>
                                </ToggleButtonGroup></Tooltip>
                                <Button variant="contained" sx={{my: '30px'}} onClick={addNewRecruiter}>Add Recruiter</Button>
                            </div>
                            <div className={showRecruiterInfo ? styles.recruiterAddMenuForm : styles.recruiterAddMenuFormHidden}>
                                <span>Login details for the created recruiter:</span>
                                <TextField id="newRecruiterId" label="Login id"  variant="outlined" size='small' sx={{'margin': '45px 0px 7px', 'cursor': 'copy'}} InputProps={{readOnly: true}} onClick={(e) => {
                                    navigator.clipboard.writeText(e.target.value);
                                    raiseAlert('Copied to clipboard', 'info');
                                }} />
                                <TextField id="newRecruiterPass" label="Password"  variant="outlined" size='small' sx={{'margin': '25px 0px 27px', 'cursor': 'copy'}} InputProps={{readOnly: true}} onClick={(e) => {
                                    navigator.clipboard.writeText(e.target.value);
                                    raiseAlert('Copied to clipboard', 'info');
                                }} />
                                <Button variant="contained" sx={{my: '30px'}} onClick={() => {setShowRecruiterInfo(false)}}>Add Another</Button>
                            </div>
                    </div>
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