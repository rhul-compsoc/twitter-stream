import { Processed, Message, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';

const fetchTimeline = async (filter = '') => {
    const req = await fetch('/api/messages/get_by/' + filter, {
        method: 'GET'
    });
    return req.json() as Promise<{
        success: boolean;
        messages?: (Message & {
            processed: Processed | null;
            author: User | null;
        })[];
    }>;
};

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

const Row: React.FC<
    ArrayElement<
        NonNullable<Awaited<ReturnType<typeof fetchTimeline>>['messages']>
    >
> = (props) => {
    const { query } = useRouter();

    const post_process = (deny: boolean) => {
        fetch('/api/messages/process', {
            method: 'POST',
            body: JSON.stringify({ id: props.id, denied: deny })
        });
    };

    return (
        <div className="my-2 flex rounded-xl bg-accent p-5 text-accent-content">
            <div className="flex-1">
                {props.author?.name} {props.author?.username}:{props.text}
            </div>
            <div className="btn-group">
                <button
                    disabled={query?.filterType == 'valid'}
                    onClick={() => post_process(false)}
                    className="btn btn-success">
                    Allow
                </button>
                <button
                    disabled={query?.filterType == 'invalid'}
                    onClick={() => post_process(true)}
                    className="btn btn-error">
                    Deny
                </button>
            </div>
        </div>
    );
};

const Admin: NextPage = () => {
    const { query } = useRouter();

    const request = useQuery(['timeline', query?.filterType?.[0]], () =>
        fetchTimeline(query?.filterType?.[0])
    );

    return (
        <>
            <Head>
                <title>Admin Panel</title>
            </Head>

            <Navbar />

            <h1 className="my-2 text-center text-2xl font-bold capitalize">
                Admin User Detected
            </h1>

            <div className="mx-auto max-w-4xl">
                {request.isLoading && <div>Loading...</div>}
                {request.isSuccess &&
                    request.data.messages?.map((v, i) => <Row {...v} key={i} />)}
            </div>
        </>
    );
};

export default Admin;
