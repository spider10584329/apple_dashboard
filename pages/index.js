import Head from 'next/head'
import Dashboard from '../components/Dashboard'

export default function Home() {
  return (
    <>
      <Head>
        <title>Apple Harvest Dashboard</title>
        <meta name="description" content="Apple Harvest and Storage Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dashboard />
    </>
  )
}
