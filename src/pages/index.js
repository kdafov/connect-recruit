import Head from 'next/head'
import DefaultNav from '@/components/Nav/Default'
import Hero from '@/components/Hero/Hero'

export default function Home() {
  return (
    <>
      <Head>
        <title>Connect - All in One Jobs Tool</title>
        <meta name="description" content="All in One Jobs Tool that connects you to the the job you need. Posting a job is easier than ever. Streamlined. User-friendly. Time-efficient." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DefaultNav actionLabel={'Log in'}/>
      <Hero />
    </>
  )
}
