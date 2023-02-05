import Footer from '@components/footer';
import VaporWave from '@components/themes/VaporWave';
import { Tweet, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/mainLayout';
import { NextPageWithLayout } from './_app';

const Wall: NextPageWithLayout = () => {
    const tweets = useQuery(
        ['tweets'],
        async () =>
            (await fetch('/api/tweets/get_by/valid')).json() as Promise<{
                success: true;
                tweets: (Tweet & { author: User })[];
            }>,
        { refetchInterval: 25000, refetchIntervalInBackground: true }
    );

    const [tweetIndex, setTweetIndex] = useState(0);

    useEffect(() => {
        if (tweets?.data?.tweets && (tweets?.data?.tweets?.length || 0)) {
            {
                const interval = setInterval(
                    () =>
                        setTweetIndex((p) => {
                            const result = (p + 1) % tweets.data.tweets.length;
                            console.log(result);
                            return result;
                        }),
                    5000
                );

                return () => clearInterval(interval);
            }
        }
    }, [tweets?.data?.tweets?.length]);

    if (tweets.isSuccess && tweets.data.tweets.length > 0)
        return (
            <>
                <VaporWave
                    topBanner="The 80s90s00s Twitter Feed!"
                    tweet={tweets.data.tweets[tweetIndex].text}
                    author={`by ${tweets.data.tweets[tweetIndex].author.name}`}
                />
                <Footer />
            </>
        );
    if (tweets.isSuccess && tweets.data.tweets.length == 0)
        return (
            <>
                <VaporWave
                    topBanner="The 80s90s00s Twitter Feed!"
                    tweet="No tweets to display!"
                    author=""
                />
                <Footer />
            </>
        );

    return <div>Loading...</div>;
};

Wall.getLayout = (page) => (
    <MainLayout className="flex h-screen w-screen bg-slate-900">
        {page}
    </MainLayout>
);

export default Wall;
