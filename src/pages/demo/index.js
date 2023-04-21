import { useRouter } from "next/router";
import Head from 'next/head';
import DemoPage from '@/components/Demo/Default';
import Nav from '@/components/Nav/Default';

export default function Page() {
    return (
        <>
        <Head>
            <title>Connect - Demo</title>
            <meta name="description" content="All in One Jobs Tool that connects you to the the job you need. Posting a job is easier than ever. Streamlined. User-friendly. Time-efficient." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="robots" content="noindex"></meta>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav actionLabel={'Register'}/>
        <DemoPage />
        </>
    )
}