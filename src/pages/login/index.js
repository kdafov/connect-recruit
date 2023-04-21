import Head from 'next/head';
import Nav from '@/components/Nav/Default';
import LoginPage from '@/components/Login/Default';
import Router from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const router = Router.useRouter();

  useEffect(() => {
    // Check if the user has already logged in
    if(localStorage.getItem('accessToken') !== null && localStorage.getItem('refreshToken') !== null && localStorage.getItem('route') !== null) {
        router.push(localStorage.getItem('route'));
    } else {
        localStorage.clear();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Connect - Login</title>
        <meta name="description" content="All in One Jobs Tool that connects you to the the job you need. Posting a job is easier than ever. Streamlined. User-friendly. Time-efficient." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav actionLabel={'Register'}/>
      <LoginPage />
    </>
  )
}
