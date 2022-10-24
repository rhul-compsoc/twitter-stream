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

            <h1 className="text-center text-2xl font-bold my-2 capitalize">
                admin User Detected
            </h1>

            <span
                className="bg-primary text-primary-content font-bold text-center m-10 shadow-2xl
            rounded-2xl flex items-center justify-center p-8">
                {JSON.stringify(data)}
            </span>
        </>
    );
};

export default Admin;
