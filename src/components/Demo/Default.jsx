import s from '@/styles/Demo/main.module.css';
import Image from 'next/image';


export default function() {
    return(
        <section className={s.main}>
            <div className={s.company}>
                <h1>All the tools you need for company administrator</h1>
                <span>Monitor the progress of your company:</span>
                <Image src={'/images/demo_company_1.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <Image src={'/images/demo_company_2.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <span>Manage your recruiters:</span>
                <Image src={'/images/demo_company_3.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
            </div>

            <div className={s.recruiter}>
                <h1>Being a recruiter was never so easy</h1>
                <span>Evaluate the performance of your company</span>
                <Image src={'/images/demo_recruiter_1.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <span>View and manage job adverts</span>
                <Image src={'/images/demo_recruiter_2.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <Image src={'/images/demo_recruiter_3.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <span>Review applications with ease</span>
                <Image src={'/images/demo_recruiter_4.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <Image src={'/images/demo_recruiter_5.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <span>Find your next perfect candidate</span>
                <Image src={'/images/demo_recruiter_6.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
            </div>

            <div className={s.user}>
                <h1>Browse and apply for jobs with a few clicks</h1>
                <span>Browse and filter jobs</span>
                <Image src={'/images/demo_user_1.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <Image src={'/images/demo_user_2.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <span>Receive all the information in one place</span>
                <Image src={'/images/demo_user_3.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <span>Access job applications, saved jobs and messages</span>
                <Image src={'/images/demo_user_4.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <span>Track your progress</span>
                <Image src={'/images/demo_user_5.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
                <Image src={'/images/demo_user_6.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
            </div>

            <div className={s.dev}>
                <h1>Use our API to receive a list of all jobs</h1>
                <span>POST: /api/joblist</span>
                <Image src={'/images/demo_dev.png'} alt={'Metrics'} height={450} width={800} className={s.img} /> 
            </div>

        </section>
    )
}