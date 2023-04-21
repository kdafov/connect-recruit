import Head from 'next/head';
import DefaultNav from '@/components/Nav/Default';
import ResetPasswordPage from '@/components/Login/ResetPassword';

export default function Home() {
    return (
      <>
        <Head>
          <title>Connect - Reset password</title>
          <meta name="description" content="All in One Jobs Tool that connects you to the the job you need. Posting a job is easier than ever. Streamlined. User-friendly. Time-efficient." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex"></meta>
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <DefaultNav actionLabel={'Log in'}/>
        <ResetPasswordPage />
      </>
    )
  }
  