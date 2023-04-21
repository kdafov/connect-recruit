import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/LandingPage/Features.module.css'
import scrollStyles from '@/styles/Scroll.module.css'
import dashboardSVG from '@/public/assets/f_dashboard.svg'
import aiSearchSVG from '@/public/assets/f_ai_search.svg'
import smartRecruitSVG from '@/public/assets/f_smart_recruit.svg'
import alertsSVG from '@/public/assets/f_alerts.svg'
import Link from 'next/link'

const separator = () => {
    return(
        <div className={styles.separator}></div>
    )
}

const descriptor = (id, text, show) => {
    return(
        <div id={`descriptor-${id}`} className={show ? '' : styles.descriptionDefault}>
            <span className={styles.descriptionSpan}>{text} See more information <Link href={'/demo'}>here</Link>.</span>
            <div className={styles.mobileDescriptionSpan}><span>{text.split(" ").slice(0, 30).join(" ") + '... See '}</span><Link href={'/demo'}>more</Link><span>.</span></div>
        </div>
    )
}

const Features = () => {
    const [featureInView, setFeatureInView] = useState(0);

    useEffect(() => {
        activeObserver();
    }, [])

    useEffect(() => {
        scroll()
    }, [featureInView])

    const feature = (id, img, alt_text, img_text) => {
        return(
            <div id={`feature-${id}`} className={styles.soloFeature} onClick={() => setFeatureInView(id)}>
                <Image src={img}
                    alt={alt_text}
                    height={80}
                />
                <span className={styles.featureText}>{img_text[0]}</span>
                <span className={styles.featureTextEnd}>{img_text[1]}</span>
            </div>
        )
    }

    const intervalArray = [];

    const activeObserver = () => {
        let element = document.getElementById('features-slider');
        const observer = new IntersectionObserver((e) => {
            if (e[0].isIntersecting) {
                activateSlider();
            } else {
                stopSlider();
            }
        }, {
            root: null,
            threshold: 0.5,
        });
        observer.observe(element);
    }

    const activateSlider = () => {
        let intervalID = setInterval(() => {
            setFeatureInView(prevState => (prevState + 1) % 4);
        }, 6000);
        intervalArray.push(intervalID);
    }

    const stopSlider = () => {
        intervalArray.forEach(val => {
            clearInterval(val);
        })
        intervalArray.length = 0;
    }

    const scroll = () => {
        [0,1,2,3].forEach(val => {
            document.getElementById('feature-' + val).classList.remove(styles.activeFeature);
            document.getElementById('descriptor-' + val).classList.add(styles.descriptionDefault);
        });
        let element = document.getElementById('feature-' + featureInView);
        element.scrollIntoView({behavior: 'smooth', inline: 'start', block: 'nearest'});
        element.classList.add(styles.activeFeature);
        document.getElementById('descriptor-' + featureInView).classList.remove(styles.descriptionDefault);
    }

    return(
        <section className={styles.parent}>
            <div className={styles.block}>
                <div id='features-slider' className={`${styles.featureIcons} ${scrollStyles.disableScrollX}`}>
                    {feature(0, dashboardSVG, 'Dashboard Icon', ['Powerful', 'Dashboard'])}
                    {separator()}
                    {feature(1, aiSearchSVG, 'Job Search Icon', ['Advanced Job', 'Search'])}
                    {separator()}
                    {feature(2, smartRecruitSVG, 'Smart Recruit Icon', ['Smart', 'Recruit'])}
                    {separator()}
                    {feature(3, alertsSVG, 'Alerts Icon', ['Instant', 'Alert'])}
                </div>
                <div className={styles.descriptorParent}>
                    {descriptor(0, 'This powerful recruitment platform dashboard offers an all-encompassing view of the recruitment process, providing recruiters with detailed insights into job posts and candidate data. It highlights the number of active job posts, as well as the number of successful and unsuccessful candidates who have applied. The dashboard also provides a summary of all candidates, along with the success rate percentage. Additionally, it provides analysis of the company\'s hiring trends, including the number of candidates hired per month, the most common type of candidates, the number of candidates who apply per job, and the average salary for similar positions.', true)}
                    {descriptor(1, 'The Advanced Job Search feature on our platform allows candidates to easily find the perfect job by narrowing down their search using an extensive range of filters. With options to filter by job title, company name, job type, method of work, location, experience, and when it was posted, candidates can refine their search to the most relevant and suitable job opportunities. Additionally, filters for salary and more provide even greater flexibility in finding the perfect job. Our advanced job search ensures that candidates have access to the most relevant job opportunities, saving them time and effort in the job hunt process.', false)}
                    {descriptor(2, 'Smart Recruit is a revolutionary feature of our recruitment platform that provides access to a massive database of candidate CVs. Recruiters can browse through the database and filter CVs using specific keywords such as "Microsoft Office" or "Python," or by years of experience and degree of education. With Smart Recruit, recruiters can save time and effort in the hiring process by easily finding the most suitable candidates for their job vacancies. The feature is designed to simplify and accelerate the hiring process, helping recruiters quickly and efficiently find the perfect candidate for their job openings.', false)}
                    {descriptor(3, 'Instant Alerts is a powerful feature of our recruitment platform that keeps users informed about any changes in job notifications and new job applications. With a built-in alert system, recruiters receive notifications about new applications, while applicants receive alerts about any changes in the job notification. Users can also set up additional notifications for new job postings and new messages from other users. All alerts are fully manageable, and users can easily disable them to suit their preferences. The Instant Alerts feature ensures that users never miss out on important updates, providing a seamless and efficient experience for both applicants and recruiters.', false)}
                </div>
            </div>
        </section>
    )
}

export default Features;