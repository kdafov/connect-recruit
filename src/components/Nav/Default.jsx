/**
 * JSX component to provide a generic navigation bar
 * for the user to see when they haven't authenticated
 * themselves thus being neutral user/visitor. 
 * Contains: Connect logo, demo link and register or login
 * link depending on the actionLabel passed as prop.
 */

import Image from 'next/image'
import Link from 'next/link'
import LogoSVG from '@/public/assets/logo_default.svg'
import LogoMobileSVG from '@/public/assets/logo_mobile.svg'
import styles from '@/styles/Nav/main.module.css'

const DefaultNav = ({ actionLabel }) => {
    return(
        <>
            <nav className={styles.nav}>
                <div className={styles.sectionLeft}>
                    <Link href={'/'}>
                        <Image src={LogoSVG} 
                            alt='Logo' 
                            height={75} 
                            className={styles.logoDefault}/>
                    </Link>
                    <Link href={'/'}>
                        <Image src={LogoMobileSVG}
                            priority={true} 
                            alt='Logo'
                            height={65} 
                            className={styles.logoMobile} />
                    </Link>
                </div>
                <div className={styles.sectionRight}>
                    <Link href={'/demo'} className={styles.demoLink}>
                        How it Works
                    </Link>
                    <Link href={actionLabel === 'Log in' ? '/login' : '/register'} className={styles.login}>
                        {actionLabel}
                    </Link>
                </div>
            </nav>
        </>
    )
}

export default DefaultNav;