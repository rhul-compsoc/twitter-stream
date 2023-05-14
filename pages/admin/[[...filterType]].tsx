import { Processed, Message, User } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';
import Spinner from '@components/spinner';

import { ChatBubbleLeftRightIcon, XCircleIcon } from '@heroicons/react/24/outline'

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

const determineTitle = (filter: string) => {
    switch(filter) {
        case "valid":
            return "Accepted";
        case "invalid":
            return "Denied";
        default:
            return "Unmoderated";
    }
}

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

    console.log(request.error)

    return (
        <>
            <Head>
                <title>Admin Panel</title>
            </Head>

            <Navbar />

            <div className="mx-auto max-w-4xl">
                <span className="text-2xl">{determineTitle(query?.filterType?.[0] ?? "")} Messages</span>

                {request.isLoading && (<span className="flex flex-col items-center p-4"><Spinner className="h-24 w-24"/><span className="text-2xl font-bold">Loading</span>Fetching messages...</span>)}
                {request.isError && (<span className="flex flex-col items-center p-4"><XCircleIcon className="h-24 w-24"/><span className="text-2xl font-bold">Failed to fetch messages</span><code>{request.error?.toString()}</code></span>)}
                {request.isSuccess && (request.data.messages?.length == 0) && (<span className="flex flex-col items-center p-4"><ChatBubbleLeftRightIcon className="h-24 w-24" /><span className="text-2xl font-bold">It's quiet here...</span>No messages to display.</span>)}

                {request.isSuccess &&
                    request.data.messages?.map((v, i) => <Row {...v} key={i} />)}
            </div>
        </>
    );
};

export default Admin;
