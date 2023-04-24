/**
 * JSX component to return a custom navigation 
 * which contains the company logo, profile icon
 * associated with the name of the user, the name
 * of the user, and notifications states that will
 * display notification-like icon indicating there is
 * something requiring the attention of the user
 */

import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import LogoSVG from '@/public/assets/logo_default.svg'
import LogoMobileSVG from '@/public/assets/logo_mobile.svg'
import defaultStyles from '@/styles/Nav/main.module.css'
import styles from '@/styles/Nav/custom.module.css';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import LazyLoadImg from '@/public/images/lazy_load_img.png';

const dropdownOption = (href, label, expand, notification) => {
    return(
        <Link href={href} className={styles.dropdownOption}>
            <span className={styles.dropdownOptionLabel}>
                <div className={notification ? styles.notificationBlock : ''}></div>
                {label}
            </span>
            <span className={styles.dropdownIndicator}>{expand ? '>' : ''}</span>
        </Link>
    )
}

const CustomNav = ({ type, notifications }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const openDropdown = Boolean(anchorEl);
    const [name, setName] = useState('');
    const [logoRef, setLogoRef] = useState('');
    const [custNotification, setCustNotification] = useState([]);

    // Check if the user has any notifications and indicate them
    useEffect(() => {
        setTimeout(() => {
            let id = localStorage.getItem('id');

            if (type === 'admin') {
                axios.post('/api/loadAdminData', {id}).then(( {data} ) => {
                    setName(data.name);
                    setLogoRef(data.logo_url === null ? `https://ui-avatars.com/api/?background=182737&color=fff&name=${data.name.replace(' ','+')}&rounded=true` : data.logo_url);
                });
            } else if (type === 'company' || type === 'user') {
                axios.post('/api/loadRecruiterData', {
                    id,
                    mode: 'basic'
                }).then(( {data} ) => {
                    if (data.data.length > 0) {
                        setName(data.data[0].name);
                        setLogoRef(`https://ui-avatars.com/api/?background=182737&color=fff&name=${data.data[0].name.replace(' ','+')}&rounded=true`);
                    }
                });

                if (type === 'user') {
                    axios.post('/api/loadUserData', {
                        mode: 'return-user-notifications',
                        id
                    }).then(( {data} ) => {
                        setCustNotification(data.data);
                    })
                }
            }
        }, 299)
    }, [])

    return(
        <>
            <nav className={defaultStyles.nav} id='customNav'>
                <div className={defaultStyles.sectionLeft}>
                    <Link href={'/' + type}>
                        <Image src={LogoSVG} 
                            alt='Logo' 
                            height={75} 
                            className={defaultStyles.logoDefault}/>
                    </Link>
                    <Link href={'/' + type}>
                        <Image src={LogoMobileSVG}
                            priority={true} 
                            alt='Logo'
                            height={65} 
                            className={defaultStyles.logoMobile} />
                    </Link>
                </div>
                <div className={defaultStyles.sectionRight}>
                    <section className={styles.customNavParent}>
                        <div className={styles.avatarParent}>
                            <img src={logoRef === null ? LazyLoadImg : logoRef} alt='Avatar' />
                            <div className={notifications.concat(custNotification).every(v => v === false) ? '' : styles.notificationIcon}></div>
                        </div>
                        <span className={styles.name}>{name}</span>

                        <IconButton 
                            aria-label='test'
                            size='small'
                            id='dropdownTrigger'
                            sx={{'margin': '3px 10px 0px 0px', 'color': 'black', 'fontSize': '18px'}}
                            aria-controls={openDropdown ? 'dropdownMenu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openDropdown ? 'true' : undefined}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        >▼</IconButton>
                        <Menu
                            id='dropdownMenu'
                            className={styles.dropdownParent}
                            anchorEl={anchorEl}
                            open={openDropdown}
                            onClose={(e) => setAnchorEl(null)}
                            MenuListProps={{
                                'aria-labelledby': 'dropdownTrigger',
                            }}
                            transitionDuration={500}
                        >
                            {type === 'user' ? (
                                [<MenuItem key={0} divider={true} onClick={(e) => setAnchorEl(null)}>
                                    {dropdownOption('/user/overview', 'Overview', true, custNotification[0])}
                                </MenuItem>,
                                <MenuItem key={1} divider={true} onClick={(e) => setAnchorEl(null)}>
                                    {dropdownOption('/user/profile', 'Profile', true, custNotification[1])}
                                </MenuItem>,
                                <MenuItem key={2} divider={true} onClick={(e) => setAnchorEl(null)}>
                                    {dropdownOption('/user/jobs', 'Jobs', true, custNotification[2])}
                                </MenuItem>]
                            ) : (type === 'company' ? (
                                [<MenuItem key={0} divider={true} onClick={(e) => setAnchorEl(null)}>
                                    {dropdownOption('/company/profile', 'Profile', true, notifications[0])}
                                </MenuItem>]
                            ) : (
                                [<MenuItem key={0} divider={true} onClick={(e) => setAnchorEl(null)}>
                                    {dropdownOption('/admin/profile', 'Profile', true, notifications[0])}
                                </MenuItem>]
                            ))}
                            <MenuItem divider={false} onClick={(e) => setAnchorEl(null)}>
                                <Link className={styles.logout} href='/logout'>Logout</Link>
                            </MenuItem>
                        </Menu>
                    </section>
                </div>
            </nav>
        </>
    )
}

export default CustomNav;