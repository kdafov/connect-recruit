import { useAuthContext } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import CustomNav from '@/components/Nav/Custom';
import ProfileSettings from '@/components/Recruiter/Profile';
import axios from 'axios';

export default function Profile() {
    const {accessToken, setAccessToken, refreshToken, setRefreshToken} = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        // Check if tokens are available in the local storage
        let accessToken = localStorage.getItem('accessToken');
        let refreshToken = localStorage.getItem('refreshToken');
        let route = localStorage.getItem('route');
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        // Check if tokens are valid and if user has permission to access page
        axios.post('/api/checkPrivilege', {
            accessToken,
            refreshToken,
            access: route
        }).then((response) => {
            if (response.data.action === 'valid') {
                // User has valid tokens and is permitted to access page
                if (response.data.updatedTokens !== null) {
                    // New access token generated
                    localStorage.setItem('accessToken', response.data.updatedTokens);
                    setAccessToken(response.data.updatedTokens);
                }

            } else {
                localStorage.clear();
                setAccessToken('');
                setRefreshToken('');
                router.push('/login');
            }
        });
    }, []);

    return(
        <>
            <Head>
            <title>Connect - Recruiter Profile</title>
            <meta name="description" content="All in One Jobs Tool that connects you to the the job you need. Posting a job is easier than ever. Streamlined. User-friendly. Time-efficient." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="robots" content="noindex"></meta>
            <link rel="icon" href="/favicon.ico" />
            </Head>

            <CustomNav type={'company'} notifications={[false]}/>
            <ProfileSettings />
        </>
    )
}