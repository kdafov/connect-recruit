/**
 * JSX component that will provide the UI and
 * functionality for the user's home page that
 * will display the active job listings and provide
 * appropriate filters to improve the search results
 */

import { useState, useEffect, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import styles from '@/styles/User/main.module.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { InputAdornment } from '@mui/material';
import Menu from '@mui/material/Menu';
import ButtonGroup from '@mui/material/ButtonGroup';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocationIcon from '@/public/assets/location_icon.svg';
import TimeIcon from '@/public/assets/time_icon.svg';
import OfficeIcon from '@/public/assets/office_icon.svg';
import DollarSignIcon from '@/public/assets/job_salary_icon.svg';
import Image from 'next/image';
import ScrollStyles from '@/styles/Scroll.module.css';
import axios from 'axios';
import JobView from '@/components/User/JobDisplay';

const Home = () => {
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('error');
    const [alertTime, setAlertTime] = useState(5000);
    const closeAlert = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setAlert(false);
    }

    const raiseAlert = (message, type, time = 5000) => {
        setAlert(true);
        setAlertText(message);
        setAlertType(type);
        setAlertTime(time)
    }

    const convert_to_dd_mm_yyyy_hhmm = (input) => {
        let d = new Date(input);
        let eDD = d.getDate().toString().padStart(2, "0");
        let eMM = (d.getMonth() + 1).toString().padStart(2, "0");
        let eYYYY = d.getFullYear().toString();
        let eHH = d.getHours().toString().padStart(2, "0");
        let emm = d.getMinutes().toString().padStart(2, "0");
        return(`${eDD}/${eMM}/${eYYYY} ${eHH}:${emm}`)
    }

    const convert_to_dd_mm_yyyy = (input) => {
        let d = new Date(input);
        let pDD = d.getDate().toString().padStart(2, "0");
        let pMM = (d.getMonth() + 1).toString().padStart(2, "0");
        let pYYYY = d.getFullYear().toString();
        return(`${pDD}/${pMM}/${pYYYY}`);
    }

    const jobAdvert = (elemId, id, company, title, date, location, type, mode, due = '', logo, salary) => {
        return(
            <div className={styles.jobAdvert} key={elemId}>
                    <div className={styles.jobAdvertInfo}>
                        <div className={styles.jobAdvertLeft}>
                            <div>
                                <img src={logo} alt={'Company logo'} className={styles.companyLogo}/>
                            </div>
                            <div>
                                <span className={styles.jobTitle}>{company}</span>
                                <span className={styles.jobRole}>{title}</span>
                                <span className={styles.jobDate}>{convert_to_dd_mm_yyyy(date)} {due !== '' ? `(Apply By: ${convert_to_dd_mm_yyyy_hhmm(due)})` : ''}</span>
                            </div>
                        </div>
                        <div className={styles.jobAdvertRight}>
                            <div>
                                <div>
                                    <Image src={LocationIcon} alt='Location Icon' height={20}/>
                                    <span>{location}</span>
                                </div>
                                <div className={styles.reversible}>
                                    <Image src={TimeIcon} alt='Time Icon' height={20}/>
                                    <span>{type}</span>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <Image src={OfficeIcon} alt='Office Icon' height={20}/>
                                    <span>{mode}</span>
                                </div>
                                <div className={styles.reversible}>
                                    <Image src={DollarSignIcon} alt='Dollar Sign Icon' height={20}/>
                                    <span>{salary}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.jobAdvertActions}>
                        <Button 
                            variant='contained'
                            sx={{'color': '#000000', 'background': '#66B2FF', 'textTransform': 'capitalize', '&:hover': {'background': '#66B2FF', 'fontWeight': 'bold'}}}
                            onClick={() => openJobAdvert(id)}
                        >View Job</Button>
                        <IconButton 
                            sx={{'background': '#182737', 'color': '#ffffff', 'height': '30px', 'width': '32px', '&:hover': {'background': '#182737', 'color': '#66b2ff'}}} 
                            className={styles.jobSaveButton}
                            onClick={() => saveJobAdvert(id)}
                        >
                            <BookmarkBorderIcon/>
                        </IconButton>
                    </div>
            </div>
        );
    }

    const filter = (label, location, key) => {
        return(
            <Button 
                onClick={(e) => removeFilter(key, label, location)}
                key={key}
                variant='outlined' 
                size='small' 
                startIcon={<HighlightOffIcon/>}
                className={styles.searchFilter}>
                    <span>{label}</span>
            </Button>
        )
    }

    
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilterMenu = Boolean(anchorEl);

    const [searchFilters, setFilters] = useState([]);
    const [searchOptions, setOptions] = useState([]);

    const jobTypes = ['Internship', 'Full-time', 'Part-time', 'Temporary', 'Volunteer', 'Training'];
    const jobExperiences = ['Entry-level', 'Individual Contributor', 'Manager', 'Director', 'Vice President', 'C-Suite'];
    const [jobTitle, setJobTitle] = useState('');
    const [jobCompany, setJobCompany] = useState('');
    const [jobType, setJobType] = useState([]);
    const [jobLevel, setJobLevel] = useState([]);
    const [jobLocations, setJobLocations] = useState([]);
    const [jobLocation, setJobLocation] = useState([]);
    const [jobMode, setJobMode] = useState(3);
    const [jobPeriod, setJobPeriod] = useState(2);

    const [originalJobsArray, setOriginalJobsArray] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [openJob, setOpenJob] = useState(-1);

    useEffect(() => {
        axios.post('/api/loadUserData', {
            'mode': 'load-jobs-simple'
        }).then(( {data} ) => {
            const temp_jobs = [];
            const companyNames = [];
            const locations = [];

            data.data.map((v) => {
                temp_jobs.push([v.id, v.name, v.title, v.date_posted, v.location, v.type, v.mode, v.exp_date, v.level, v.logo, v.salary]);
                companyNames.push(v.name);
                locations.push(v.location);
            })
            setJobs(temp_jobs);
            setOriginalJobsArray(temp_jobs);
            setOptions(companyNames.filter((name, index) => companyNames.indexOf(name) === index));
            setJobLocations(locations.filter((name, index) => locations.indexOf(name) === index));

            // Check if user is redirected to view a specific job
            const urlref = window.location.href.substr(window.location.href.indexOf('?') + 5);
            if (!isNaN(urlref)) {
                setSearchQuery('#' + urlref);
            }
        });
    }, [])

    const removeFilter = (key, label, location) => {
        let filters = searchFilters;
        filters.splice(key, 1);
        setFilters([...filters]);
        
        if(location === 0) { setJobTitle(''); }
        if (location === 1) { setJobCompany(''); }
        if (location === 2) { 
            setJobType(prevJobType => prevJobType.filter(jobType => jobType !== label));
        }
        if (location === 3) {
            setJobLevel(prevJobLevel => prevJobLevel.filter(jobLevel => jobLevel !== label));
        }
        if (location === 4) { setJobMode(3) }
        if (location === 5) { setJobPeriod(2) }
        if (location === 6) { 
            setJobLocation(prevJobLocations => prevJobLocations.filter(jobLocation => jobLocation !== label));
        }
    }

    const clearSearchFilters = () => {
        setAnchorEl(null);
        setJobTitle('');
        setJobCompany('');
        setJobType([]);
        setJobLevel([]);
        setJobMode(3);
        setJobPeriod(2);
        setJobLocation([]);
        setFilters([]);
    }

    const setSearchFilters = () => {
        setAnchorEl(null);
        const tempFilters = [];

        if (jobTitle) { tempFilters.push({label: jobTitle, location: 0}); }
        if (jobCompany) { tempFilters.push({label: jobCompany, location:1 }); }
        if (jobType) { jobType.map((val) => tempFilters.push({label: val, location:2})); }
        if (jobLevel) { jobLevel.map((val) => tempFilters.push({label: val, location:3})); }
        if (jobMode !== 3) { tempFilters.push({label: ['In-Person','Remote','Hybrid'][jobMode], location: 4}); }
        if (jobPeriod !== 2) { tempFilters.push({label: ['Today','This Week'][jobPeriod], location: 5}); }
        if (jobLocation) { jobLocation.map((val) => tempFilters.push({label: val, location:6})); }

        setFilters(tempFilters)
    }

    const refreshResults = () => {
        const filteredResults = originalJobsArray.filter(job => {
            const t_jobid = job[0];
            const t_companyName = job[1];
            const t_jobTitle = job[2];
            const t_posted = job[3];
            const t_location = job[4];
            const t_type = job[5];
            const t_mode = job[6];
            const t_level = job[8];
            
            const filterByJobTitle = () => {
                if (jobTitle !== '') {
                    return t_jobTitle.toLowerCase().includes(jobTitle.toLowerCase());
                }
                return true;
            }

            const filterByCompany = () => {
                if (jobCompany !== '') {
                    return t_companyName.toLowerCase().includes(jobCompany.toLowerCase());
                }
                return true;
            }

            const filterByJobType = () => {
                if (jobType.length > 0) {
                    let matchFound = false;
                    for (let i = 0; i < jobType.length; i++) {
                        if (t_type.toLowerCase().includes(jobType[i].toLowerCase())) {
                            matchFound = true;
                        }
                    }
                    return matchFound;
                }
                return true;
            }

            const filterByJobLevel = () => {
                if (jobLevel.length > 0) {
                    let matchFound = false;
                    for (let i = 0; i < jobLevel.length; i++) {
                        if (t_level.toLowerCase().includes(jobLevel[i].toLowerCase())) {
                            matchFound = true;
                        }
                    }
                    return matchFound;
                }
                return true;
            }

            const filterByJobLocation = () => {
                if (jobLocation.length > 0) {
                    let matchFound = false;
                    for (let i = 0; i < jobLocation.length; i++) {
                        if (t_location.toLowerCase().includes(jobLocation[i].toLowerCase())) {
                            matchFound = true;
                        }
                    }
                    return matchFound;
                }
                return true;
            }

            const filterByJobMode = () => {
                if (jobMode !== 3) {
                    return t_mode.toLowerCase().includes(['In-Person', 'Remote', 'Hybrid'][jobMode].toLowerCase());
                }
                return true;
            }

            const filterByDate = () => {
                const today = new Date();
                const postedDate = new Date(t_posted);
    
                if (jobPeriod === 0) {
                    return postedDate.toDateString() === today.toDateString();
                } else if (jobPeriod === 1) {
                    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
                    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
                    return postedDate >= firstDayOfWeek && postedDate <= lastDayOfWeek;
                } else {
                    return true;
                }
            }

            const filterSearchString = () => {
                if (searchQuery !== '') {
                    if (searchQuery.startsWith("#")) {
                        return(
                            t_jobid === Number(searchQuery.substring(1))
                        );
                    } else {
                        return(
                            t_companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t_jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                    }
                } else {
                    return true;
                }
            }


            return filterByJobTitle() && filterByCompany() && filterByJobType() && filterByJobLevel() && filterByJobLocation() && filterByJobMode() && filterByDate() && filterSearchString();
        });

        setJobs(filteredResults);
    }

    useEffect(() => {
        refreshResults();
    }, [jobTitle, jobCompany, jobType, jobLevel, jobLocation, jobMode, jobPeriod, searchQuery])
    
    const search = () => {
        refreshResults();
    }

    const openJobAdvert = (id) => {
        setOpenJob(id);
    }

    const saveJobAdvert = (id) => {
        axios.post('/api/saveJob', {
            user: localStorage.getItem('id'),
            job: id
        }).then(( {data} ) => {
            if(data.status === 200) {
                raiseAlert('Job saved', 'success', 1500);
            }
        });
    }

    return(
        <section className={styles.parent + ' ' + ScrollStyles.disableScrollY}>
            <span className={styles.mainLabel}>{`Browse ${originalJobsArray.length} job vacancies available today`}</span>

            <div>
                <div className={styles.searchFilters}>
                    {searchFilters.map((val, i) => filter(val.label, val.location, i))}
                </div>

                <div id='searchBoxUser' className={styles.searchBarParent}>
                    <Autocomplete
                        id="user-searchbar"
                        className={styles.searchBar}
                        freeSolo
                        options={searchOptions.map((option) => option)}
                        renderInput={(params) => <TextField {...params} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                            label="Search for jobs, companies, or keywords" 
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton 
                                            id='filterSearchBtn'
                                            color="primary" 
                                            aria-label="filter picture" 
                                            component="label" 
                                            sx={{'p': 0}}
                                            aria-controls={openFilterMenu ? 'filterMenu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={openFilterMenu ? 'true' : undefined}
                                            onClick={(e) => setAnchorEl(document.getElementById('searchBoxUser'))}
                                        >
                                                <FilterAltIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            />}
                        size='small'
                    />
                    <Menu
                        sx={{mt: 1}}
                        id='filterMenu'
                        anchorEl={anchorEl}
                        open={openFilterMenu}
                        onClose={(e) => setAnchorEl(null)}
                        MenuListProps={{
                            'aria-labelledby': 'filterSearchBtn',
                        }}
                        transitionDuration={500}
                    >
                        <section className={styles.filterParentBox}>
                            <div className={styles.filterOptions}>
                                <div className={styles.filterOptionsLeft}>
                                    <TextField id="filter-job-title" label="Job Title" variant="standard" placeholder='Software Engineer' sx={{mb: 1}} defaultValue={jobTitle} onChange={(e) => setJobTitle(e.target.value)} onKeyDown={(e) => e.stopPropagation()} className={styles.filterField} />

                                    <TextField id="filter-company" label="Company" variant="standard" placeholder='Facebook' sx={{mb: 1}} defaultValue={jobCompany} onChange={(e) => setJobCompany(e.target.value)} onKeyDown={(e) => e.stopPropagation()} className={styles.filterField}/>

                                    <Autocomplete
                                        className={styles.filterField}
                                        multiple={true}
                                        limitTags={1}
                                        sx={{mb: 1}}
                                        id='filter-job-type'
                                        options={jobTypes}
                                        getOptionLabel={(o) => o}
                                        value={jobType || []}
                                        onChange={(e, v) => setJobType(v)}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        renderInput={(params) => <TextField {...params} label='Job Type' variant="standard"
                                        />}
                                    />
                                    
                                    <Autocomplete
                                        className={styles.filterField}
                                        multiple={true}
                                        limitTags={1}
                                        sx={{mb: 1}}
                                        id='filter-experience'
                                        options={jobExperiences}
                                        getOptionLabel={(o) => o}
                                        value={jobLevel || []}
                                        onChange={(e, v) => setJobLevel(v)}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        renderInput={(params) => <TextField {...params} label='Job Level' variant="standard"/>}
                                    />
                                </div>

                                <div className={styles.filterOptionsRight}>
                                    <ButtonGroup variant="text" aria-label="outlined primary button group" className={styles.filterGroupButtons} size='small' sx={{mb: 2}}>
                                        <Button className={jobMode === 0 ? styles.selectedButton : ''} onClick={() => setJobMode(0)}>In-Person</Button>
                                        <Button className={jobMode === 1 ? styles.selectedButton : ''} onClick={() => setJobMode(1)}>Remote</Button>
                                        <Button className={jobMode === 2 ? styles.selectedButton : ''} onClick={() => setJobMode(2)}>Hybrid</Button>
                                        <Button className={jobMode === 3 ? styles.selectedButton : ''} onClick={() => setJobMode(3)}>All</Button>
                                    </ButtonGroup>

                                    <ButtonGroup variant="text" aria-label="outlined primary button group" className={styles.filterGroupButtons} size='small' sx={{mb: 1}}>
                                        <Button className={jobPeriod === 0 ? styles.selectedButton : ''} onClick={() => setJobPeriod(0)}>Today</Button>
                                        <Button className={jobPeriod === 1 ? styles.selectedButton : ''} onClick={() => setJobPeriod(1)}>This Week</Button>
                                        <Button className={jobPeriod === 2 ? styles.selectedButton : ''} onClick={() => setJobPeriod(2)}>All Time</Button>
                                    </ButtonGroup>

                                    <Autocomplete
                                        className={styles.filterField}
                                        multiple={true}
                                        limitTags={1}
                                        id='filter-location'
                                        options={jobLocations}
                                        getOptionLabel={(o) => o}
                                        value={jobLocation || []}
                                        onChange={(e, v) => setJobLocation(v)}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        renderInput={(params) => <TextField {...params} label='Job Location' variant="standard"/>}
                                    />
                                </div>
                            </div>

                            <div className={styles.filterActions}>
                                <Button variant='contained' sx={{'background': '#ff6666', '&:hover': {'background': 'red'}}} onClick={clearSearchFilters}>Clear Filters</Button>
                                <Button variant='contained' sx={{'background': '#66B2FF', '&:hover': {'background': '#1976D0'}}} onClick={setSearchFilters}>Apply Filters</Button>
                            </div>
                        </section>
                    </Menu>

                    <Button variant='contained' onClick={search}>
                        Search
                    </Button>
                </div>
            </div>

            <div>
                {jobs.map((v, i) => {
                    return jobAdvert(i, v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[9], v[10])
                })}
            </div>

            {openJob !== -1 ? <JobView control={setOpenJob} val={openJob} c1={convert_to_dd_mm_yyyy} c2={convert_to_dd_mm_yyyy_hhmm} /> : <></>}

            <Snackbar 
                open={alert} 
                autoHideDuration={alertTime} 
                onClose={closeAlert} 
                anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
            >
                <Alert onClose={closeAlert} severity={alertType}>{alertText}</Alert>
            </Snackbar>
        </section>
    )
}

export default Home;