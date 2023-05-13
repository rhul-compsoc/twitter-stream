import { Processed, Message, User } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';
import Spinner from '@components/spinner';

import { XCircleIcon } from '@heroicons/react/24/outline'

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
    const queryClient = useQueryClient();

    const postProcess = useMutation({
        mutationFn: (deny: boolean) => fetch('/api/messages/process', {
            method: 'POST',
            body: JSON.stringify({ id: props.id, denied: deny })
        }),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['timeline', query?.filterType?.[0]]})
    })

    return (
        <div className="my-2 flex rounded-xl bg-accent p-5 text-accent-content">
            <div className="flex-1">
                {props.author?.name} {props.author?.username}:{props.text}
            </div>
            <div className="btn-group">
                <button
                    disabled={query?.filterType == 'valid'}
                    onClick={() => postProcess.mutate(false)}
                    className="btn btn-success">
                    Allow
                </button>
                <button
                    disabled={query?.filterType == 'invalid'}
                    onClick={() => postProcess.mutate(true)}
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

            <div className="mx-auto max-w-4xl">
                {request.isLoading && (<span><Spinner className="h-24 w-24"/><div>Fetching messages...</div></span>)}
                {request.isError && (<span><XCircleIcon className="h-24 w-24"/><div>Failed to fetch messages</div></span>)}
                {request.isSuccess && (request.data.messages?.length == 0) && (<div>It's quiet here...</div>)}

                {request.isSuccess &&
                    request.data.messages?.map((v, i) => <Row {...v} key={i} />)}
            </div>
        </>
    );
};

export default Admin;
