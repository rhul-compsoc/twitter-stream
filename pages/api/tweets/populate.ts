import { PrismaClient } from '@prisma/client';
import { NextApiHandler } from 'next';
import { Tweetv2SearchResult } from 'twitter-api-v2';

const prisma = new PrismaClient();

const HASHTAG = 'COMPSOCTEST' as const;
const TWITTER_BASEURL = 'https://api.twitter.com' as const;
const TWITTER_ENDPOINTS = {
    RECENT_TWEETS: '2/tweets/search/recent/'
} as const;

/**
 * @todo paginate, paginate, paginate
 */
const fetchNewFeed = async (max_id?: string) => {
    // preparing url
    const fetch_url = new URL(TWITTER_ENDPOINTS.RECENT_TWEETS, TWITTER_BASEURL);
    Object.entries({
        query: `#${HASHTAG}'`,
        expansions: 'author_id',
        'tweet.fields': 'created_at',
        'user.fields': 'profile_image_url,username',
        max_results: 100
    }).forEach(([k, v]) => fetch_url.searchParams.append(k, v.toString()));

    if (max_id) fetch_url.searchParams.append('since_id', max_id);

    const req = await fetch(fetch_url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_API_BEARER}`
        }
    });

    return req.json() as Promise<Tweetv2SearchResult>;
};

const Populate: NextApiHandler = async (_, res) => {
    const most_recent_tweet = await prisma.tweet.findFirst({
        orderBy: {
            created_at: 'desc'
        }
    });

    const feed = await fetchNewFeed(most_recent_tweet?.id);

    if (feed.meta.result_count === 0)
        return res.status(200).json({ success: true, added: 0 });

    await prisma.user.createMany({
        data:
            feed.includes?.users?.map((u) => ({
                id: u.id,
                name: u.name,
                username: u.username,
                profile_image_url: u.profile_image_url || ''
            })) || [],
        skipDuplicates: true
    });

    await prisma.tweet.createMany({
        data:
            feed.data?.map((t) => ({
                id: t.id,
                text: t.text,
                author_id: t.author_id || '',
                created_at: t.created_at ? new Date(t.created_at) : new Date()
            })) || [],
        skipDuplicates: true
    });

    return res
        .status(200)
        .json({ success: true, added: feed.meta.result_count });
};

export default Populate;
