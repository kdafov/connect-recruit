/**
 * JSX component that will provide the UI and
 * functionality for the popup containing a 
 * textfield for the user to send a message
 */

import styles from '@/styles/User/message.module.css';
import { Button } from '@mui/material';
import axios from 'axios';

const Page = (props) => {
    const hideMenu = () => {
        props.control(-1);
    }

    const say = (text, type) => {
        props.say(text, type, 1500);
    }

    const sendMessage = () => {
        if (document.getElementById('msg-user-empl').value === '') {
            say('Please enter valid message', 'error');
            return;
        }

        axios.post('/api/sendMessage', {
            mode: 'user-to-company',
            user: localStorage.getItem('id'),
            job: localStorage.getItem('jobid'),
            msg: document.getElementById('msg-user-empl').value
        }).then(( {data} ) => {
            if (data.status === 200) {
                say('Message sent successfully', 'success');
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
                <span className={styles.title}>Enter your message:</span>
                <textarea id='msg-user-empl' className={styles.msg}></textarea>
                <Button variant='contained' onClick={() => {sendMessage()}} sx={{'color': '#ffffff', 'background': '#66B2FF', 'fontWeight': 'bold', '&:hover': {'background': '#66B2FF', 'fontWeight': 'bold'}}}>Send</Button>
            </div>
        </div>
    );   
}

export default Page;