import { PrismaClient } from '@prisma/client';
import { NextApiHandler } from 'next';
import { TweetV2, Tweetv2SearchResult, UserV2 } from 'twitter-api-v2';

const prisma = new PrismaClient();

const fetchNewFeed = async () => {
    return {} as Tweetv2SearchResult;
};

const getUsers = (timeline: Tweetv2SearchResult) => {
    return [] as UserV2[];
};

const getTweets = (timeline: Tweetv2SearchResult) => {
    return [] as TweetV2[];
};

const Populate: NextApiHandler = async (_, res) => {
    const feed = await fetchNewFeed();

    const users = getUsers(feed);
    const tweets = getTweets(feed);

    return res.status(200).json({ success: true });
};

export default Populate;
