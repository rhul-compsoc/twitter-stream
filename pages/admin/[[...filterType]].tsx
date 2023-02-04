import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { TweetV2, UserV2 } from 'twitter-api-v2';
import Navbar from '../../components/navbar';

const fetchTimeline = async () => {
    const req = await fetch('/api/main/tweets');
    return req.json();
};

const Row: React.FC<{ tweet: TweetV2; author?: UserV2 }> = ({
    tweet,
    author
}) => {
    const { query } = useRouter();

    return (
        <div className="my-2 flex rounded-xl bg-accent p-5 text-accent-content">
            <div className="flex-1">
                {author?.name} {author?.username}:{tweet.text}
            </div>
            <div className="btn-group">
                <button
                    disabled={query?.filterType == 'good'}
                    className="btn btn-success">
                    Allow
                </button>
                <button
                    disabled={query?.filterType == 'denied'}
                    className="btn btn-error">
                    Deny
                </button>
            </div>
        </div>
    );
};

const Admin: NextPage = () => {
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
                <Row
                    // @ts-expect-error
                    tweet={{ text: 'test' }}
                    // @ts-expect-error
                    author={{ name: 'test', username: 'sadfasdf' }}
                />
            </div>
        </>
    );
};

export default Admin;
