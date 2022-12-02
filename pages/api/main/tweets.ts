import { NextApiHandler } from 'next';
import { Tweetv2SearchResult } from 'twitter-api-v2';
import prisma from '../../_prisma';

const TWITTER_BASEURL = 'https://api.twitter.com';
const HASHTAG = 'COMPSOCTEST';

enum TWITTER_ENDPOINTS {
    RECENT_TWEETS = '2/tweets/search/recent/'
}

const Timeline: NextApiHandler = async (req, res) => {
  const url = new URL(TWITTER_ENDPOINTS.RECENT_TWEETS, TWITTER_BASEURL);

  Object.entries({
    query: `#${HASHTAG}'`,
    expansions: 'author_id',
    'tweet.fields': 'created_at',
    'user.fields': 'profile_image_url,username',
    max_results: 100,
  }).map(([k, v]) => url.searchParams.append(k, v.toString()));

  const tweetReq = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_API_BEARER}`,
    },
  });
  const data = await tweetReq.json() as Tweetv2SearchResult;

  // check if there are any tweets
  if (data.meta.result_count > 0) {
    data.data.forEach(async (tweet) => {
      if (!tweet.id || !tweet.author_id) return;
      const author = data.includes?.users?.find((u) => u.id === tweet.author_id);
      // check if the tweet already exists
      const exists = await prisma.tweets.findUnique({
        where: {
          tweet_id: tweet.id,
        },
      });

      if (!exists) {
        // check if the user has posted a banned tweet
        const banned = await prisma.tweets.findFirst({
          where: {
            tweet_author_id: tweet.author_id,
            process_result: 'b',
          },
        });

        const dataToPost = {
          tweet_id: tweet.id,
          tweet_text: tweet.text,
          tweet_created_at: new Date(tweet.created_at || ''),
          tweet_author_id: tweet.author_id,
          tweet_author_name: author?.name || '',
          tweet_author_username: author?.username || '',
          tweet_author_profile_image_url: author?.profile_image_url,
          tweet_author_created_at: new Date(tweet.created_at ? tweet.created_at : ''),
          process_result: banned ? 'b' : 'u',
        };
        await prisma.tweets.create({
          data: dataToPost,
        });
      }
    });
  }
  if (req.query.filter !== undefined) {
    const tweets = await prisma.tweets.findMany({
      orderBy: {
        tweet_created_at: 'asc',
      },
      where: {
        process_result: req.query.filter as string,
      },
      take: 100,
    });
    res.status(200).json(tweets);
  } else {
    const tweets = await prisma.tweets.findMany({
      orderBy: {
        tweet_created_at: 'asc',
      },
      where: {
        process_result: 'u',
      },
      take: 100,
    });
    console.log('request', req.query);

    res.status(200).json(tweets);
  }
};

export default Timeline;
