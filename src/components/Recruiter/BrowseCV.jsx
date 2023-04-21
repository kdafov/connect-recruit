/**
 * JSX component that will provide the UI and
 * functionality for the BrowseCV screen which will
 * allow the recruiter to find a candidate through 
 * filters and search bar. Once search is performed
 * results will be returned and an option to contact
 * the user will be given.
 */

import { useState, useEffect, forwardRef, use } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { InputAdornment } from '@mui/material';
import Menu from '@mui/material/Menu';
import styles from '@/styles/Recruiter/browsecv.module.css';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const Page = () => {
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('error');
    const closeAlert = (event, reason) => { if (reason === 'clickaway') {return;} setAlert(false);}

    // reusable function that will display errors, information or success
    const raiseAlert = (message, type) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const openFilterMenu = Boolean(anchorEl);
    const [minFilter, setMinFilter] = useState('');
    const [maxFilter, setMaxFilter] = useState('');
    const [bachelorFilter, setBachelorFilter] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [cvBlockOpen, setCvBlockOpen] = useState('');
    const [openMessageDialog, setOpenMessageDialog] = useState(false);
    const [cvBASE, setCvBASE] = useState([]);
    const [displayBlock, setDisplayBlock] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');

    useEffect(() => {
        let tempBase = [];
        axios.post('/api/loadRecruiterData', {
            mode: 'load-cv-base'
        }).then(( {data} ) => {
            data.data.map((v) => {tempBase.push(v)})
        });
        setCvBASE(tempBase);
    }, [])

    const search = () => {
        // Validation
        if (isNaN(minFilter)) {
            raiseAlert('Filter "Min" must be a number', 'error');
            return;
        }
        if (isNaN(maxFilter)) {
            raiseAlert('Filter "Max" must be a number', 'error');
            return;
        }

        const tempResults = [];
        cvBASE.map((v) => {
            const years = v.total_experience.includes('years') ? v.total_experience.split(" years and ")[0] : 0;
            const hasUniversityEducation = v.education.toLowerCase().includes('university');
            const isMatch = v.skills.toLowerCase().includes(searchString.toLowerCase()) 
                || v.summary.toLowerCase().includes(searchString.toLowerCase())
                || v.work_experience.toLowerCase().includes(searchString.toLowerCase())
                || v.education.toLowerCase().includes(searchString.toLowerCase())
                || hasUniversityEducation && searchString.toLowerCase().includes('university');

            if ((minFilter === '' || years >= minFilter) && (maxFilter === '' || years <= maxFilter) && (!bachelorFilter || hasUniversityEducation) && (!searchString || isMatch)) {
                tempResults.push([v.id, v.name, searchString.length === 0 ? '' :  searchString, v.summary, v.skills, v.phone, v.email]);
            }
        });
        setDisplayBlock(tempResults);

        raiseAlert('Search results (' + tempResults.length + ')', 'info');
    }

    const clearFilters = () => {
        setMinFilter('');
        setMaxFilter('');
        setBachelorFilter(false);
        raiseAlert('Filters reset', 'info');
    }

    const cvBlock = (id, name, match, summary, skills, tel, email) => {
        return(
            <div key={id} onClick={() => {setCvBlockOpen(id)}} className={styles.cvBlock}>
                <span className={styles.cvBlockTitle}>{name}</span>
                <span className={styles.cvBlockSubText}>Filters matched: {match === '' ? 'N/A' : match}</span>
                <div className={cvBlockOpen === id ? styles.cvSeparator : styles.cvHide}></div>
                <div className={cvBlockOpen === id ? styles.cvInfo : styles.cvHide}>
                    <span>Summary: {summary}</span>
                    <span>Skills: {skills}</span>
                    <div className={styles.cvBut}><Button variant='contained' size='small' onClick={() => {openContactInfo(name, tel, email)}}>Contact</Button></div>
                </div>
            </div>
        )
    }

    const openContactInfo = (name, tel, email) => {
        setOpenMessageDialog(true);
        setName(name);
        setEmail(email);
        setTel(tel);
    }

    return(
        <section className={styles.main}>
            <div>
                <div id='cvbase-search' className={styles.searchbox}>
                    <TextField
                        defaultValue={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        className={styles.searchfield}
                        size='small'
                        label={`Search CV's by keyword or use filters`}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton 
                                id='cvbaseFilterSearchBtn'
                                aria-label="filter picture" 
                                component="label" 
                                sx={{'p': 0}}
                                aria-controls={openFilterMenu ? 'cvbaseFilterMenu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openFilterMenu ? 'true' : undefined}
                                onClick={(e) => setAnchorEl(document.getElementById('cvbase-search'))}
                                >
                                <FilterAltIcon/>
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                    />
                    <Button variant='contained' size='small' sx={{'color': '#000000', 'background': '#66B2FF', 'textTransform': 'capitalize', 'border': '1px solid black', 'width': '60px', '&:hover': {'background': '#66B2FF', 'fontWeight': 'bold'}}} onClick={() => search()}>Search</Button>
                </div>
                <Menu
                        sx={{mt: '4px'}}
                        id='cvbaseFilterMenu'
                        anchorEl={anchorEl}
                        open={openFilterMenu}
                        onClose={(e) => setAnchorEl(null)}
                        MenuListProps={{
                            'aria-labelledby': 'cvbaseFilterSearchBtn',
                        }}
                        transitionDuration={500}
                        className={styles.menu}
                >
                    <section className={styles.filterParent}>
                        <div className={styles.filterTitle}><span>Years of experience</span></div>
                        <div className={styles.minmaxParent}>
                            <div className={styles.minmaxSub}>
                                <span>Min</span>
                                <TextField size='small' sx={{'background': 'white', 'width': '80px', ml: '15px'}} defaultValue={minFilter} onChange={(e) => setMinFilter(e.target.value)} />
                            </div>
                            <div className={styles.minmaxSub}>
                                <span>Max</span>
                                <TextField size='small' sx={{'background': 'white', 'width': '80px', ml: '15px'}} defaultValue={maxFilter} onChange={(e) => setMaxFilter(e.target.value)} />
                            </div>
                        </div>
                        <div className={styles.filterTitle}><span>Degree of education</span></div>
                        <div className={styles.education}>
                            <FormControlLabel control={<Checkbox checked={bachelorFilter} onChange={(e) => setBachelorFilter(e.target.checked)} icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label={<span className={styles.cbTitle}>Bachelors</span>} />
                        </div>
                        <div className={styles.actions}>
                            <Button variant='contained' size='small' sx={{'color': '#000000', 'background': '#f0f0f0', 'textTransform': 'capitalize', 'border': '1px solid black', '&:hover': {'background': '#f0f0f0', 'fontWeight': 'bold'}}} onClick={() => clearFilters()}>Clear filters</Button>
                        </div>
                    </section>
                </Menu>

                <div>
                    {displayBlock.map((v) => cvBlock(v[0], v[1], v[2], v[3], v[4], v[5], v[6]))}
                </div>
            </div>

            <div className={openMessageDialog ? styles.msgPopup : styles.cvHide}>
                <div className={styles.messageDialog}>
                    <span className={styles.msgTitle}>Contact information</span>
                    <div className={styles.infocvbase}>
                        <span>Name: {name}</span>
                        <span>Email: {email}</span>
                        <span>Phone: {tel}</span>
                    </div>
                    <div className={styles.msgButtons}>
                        <Button variant='contained' size='small' sx={{'color': '#000000', 'background': '#f0f0f0', 'textTransform': 'capitalize', 'border': '1px solid black', '&:hover': {'background': '#f0f0f0', 'fontWeight': 'bold'}}} onClick={() => {setOpenMessageDialog(false)}}>Go back</Button>
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
        </section>
    )
}

export default Page;