import { NextApiHandler } from 'next';

const TWITTER_BASEURL = 'https://api.twitter.com' as const;
const HASHTAG = 'COMPSOCTEST' as const;

enum TWITTER_ENDPOINTS {
    RECENT_TWEETS = '2/tweets/search/recent/'
}

const Timeline: NextApiHandler = async (_, res) => {
    const url = new URL(TWITTER_ENDPOINTS.RECENT_TWEETS, TWITTER_BASEURL);

    Object.entries({
        query: `#${HASHTAG}'`,
        expansions: 'author_id',
        'tweet.fields': 'created_at',
        'user.fields': 'profile_image_url,username',
        max_results: 100
    }).map(([k, v]) => url.searchParams.append(k, v.toString()));

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_API_BEARER}`
        }
    });

    res.status(200).json(await req.json());
};

export default Timeline;
