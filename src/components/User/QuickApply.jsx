/**
 * JSX component that will provide the UI and
 * functionality for the popup that will display 
 * when the user applies for jobs that has quick
 * apply mode: on
 */

import styles from '@/styles/User/qapply.module.css';
import { Button } from '@mui/material';
import axios from 'axios';

const Page = (props) => {
    const hideMenu = () => {
        props.control(-1);
    }

    const say = (text, type) => {
        props.say(text, type, 1500);
    }

    const apply = () => {
        axios.post('/api/applyJob?mode=fast', {
            user: localStorage.getItem('id'),
            job: localStorage.getItem('jobid')
        }).then(( {data} ) => {
            if (data.status === 200) {
                say('Application #' + data.data + ' submitted', 'success');
                setTimeout(() => {
                    hideMenu();
                }, 200);
            }
        })
    }

    return(
        <div className={styles.main}>
            <div className={styles.exitParent}>
                <div className={styles.exitButton} onClick={() => {hideMenu()}}>X</div>
            </div>
            <div className={styles.sub}>
                <span className={styles.title}>By applying to this job you confirm that you have all the required documents, qualifications, and right to work in the country. You also confirm that you have read all the information for this job and have understood it.</span>
                <div className={styles.actions}>
                    <Button variant='contained' onClick={() => {hideMenu()}} sx={{'color': '#ffffff', 'background': '#f00000', 'fontWeight': 'bold', mr: '60px', '&:hover': {'background': '#ff0000', 'fontWeight': 'bold'}}}>Go back</Button>
                    <Button variant='contained' onClick={() => {apply()}} sx={{'color': '#ffffff', 'background': '#66B2FF', 'fontWeight': 'bold', '&:hover': {'background': '#66B2FF', 'fontWeight': 'bold'}}}>I confirm</Button>
                </div>
            </div>
        </div>
    );   
}

export default Page;