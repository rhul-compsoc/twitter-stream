import Footer from '@components/footer';
import Spinner from '@components/spinner';
import VaporWave from '@components/themes/VaporWave';
import { Message } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/mainLayout';
import { NextPageWithLayout } from './_app';

const Wall: NextPageWithLayout = () => {
    const message = useQuery(
        ['messages'],
        async () =>
            (await fetch('/api/messages/get_by/valid')).json() as Promise<{
                success: true;
                messages: (Message)[];
            }>,
        { refetchInterval: 25000, refetchIntervalInBackground: true }
    );

    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (message?.data?.messages && (message?.data?.messages?.length || 0)) {
            {
                const interval = setInterval(
                    () =>
                        setMessageIndex((p) => {
                            const result =
                                (p + 1) % message.data.messages.length;
                            console.log(result);
                            return result;
                        }),
                    5000
                );

                return () => clearInterval(interval);
            }
        }
    }, [message?.data?.messages?.length]);

    if (message.isSuccess && message.data.messages.length > 0)
        return (
            <>
                <VaporWave
                    topBanner="The 80s90s00s Twitter Feed!"
                    tweet={message.data.messages[messageIndex].message_text}
                    author={`by ${message.data.messages[messageIndex].message_name}`}
                />
                <Footer />
            </>
        );
    if (message.isSuccess && message.data.messages.length == 0)
        return (
            <>
                <VaporWave
                    topBanner="The 80s90s00s Feed!"
                    tweet="No messages to display!"
                    author=""
                />
                <Footer />
            </>
        );

    return (
        <span className="flex flex-col items-center p-4">
            <Spinner className="h-24 w-24" />
            <div className="text-2xl font-bold">Loading...</div>
        </span>
    );
};

Wall.getLayout = (page) => (
    <MainLayout className="flex h-screen w-screen bg-slate-900">
        {page}
    </MainLayout>
);

export default Wall;
