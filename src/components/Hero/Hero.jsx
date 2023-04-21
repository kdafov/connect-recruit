/**
 * JSX Component for landing page
 */

import Image from 'next/image'
import Link from 'next/link'
import HeroSVG from '@/public/assets/hero_img.svg'
import styles from '@/styles/LandingPage/Hero.module.css'
import Features from '@/components/Features/Features'

const Hero = () => {
    return(
        <main className={styles.parent}>
            <section className={styles.frame}>
                <div className={styles.leftSide}>
                    <div className={styles.labels}>
                        <span className={styles.mainLabel}>All in One Jobs Tool</span>
                        <span>Streamlined</span>
                        <span>User-friendly</span>
                        <span>Time-efficient</span>
                    </div>
                    <div className={styles.buttonFrame}>
                        <Link href={'/register'}>
                            <button>
                                Join now
                            </button>
                        </Link>
                    </div>
                    <Features />
                </div> 
                <Image src={HeroSVG}
                    priority={true}
                    alt='Network of people and organizations'
                    height={300}
                />
            </section>
        </main>
    )
}

export default Hero;