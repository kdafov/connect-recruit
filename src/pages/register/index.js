import Head from 'next/head'
import Nav from '@/components/Nav/Default'
import RegisterPage from '@/components/Register/Default'

export default function Register() {
  return (
    <>
        <Head>
            <title>Connect - Register</title>
            <meta name="description" content="All in One Jobs Tool that connects you to the the job you need. Posting a job is easier than ever. Streamlined. User-friendly. Time-efficient." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="robots" content="noindex"></meta>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Nav actionLabel={'Log in'}/>
        <RegisterPage />
    </>
  )
}
