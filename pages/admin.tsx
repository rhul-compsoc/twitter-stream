import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';

import Navbar from '../components/navbar';

const fetchTimeline = async () => {
    const req = await fetch('/api/main/tweets');
    return req.json();
};

const Admin = () => {
    const { data } = useQuery(['timeline'], fetchTimeline);

    return (
        <>
            <Head>
                <title>Admin Panel</title>
            </Head>

            <Navbar />

            <h1 className="my-2 text-center text-2xl font-bold capitalize">
                admin User Detected
            </h1>

            <span
                className="m-10 flex items-center justify-center rounded-2xl bg-primary
            p-8 text-center font-bold text-primary-content shadow-2xl">
                {JSON.stringify(data)}
            </span>
        </>
    );
};

export default Admin;
