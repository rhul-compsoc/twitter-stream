import Footer from '@components/footer';
import VaporWave from '@components/themes/VaporWave';
import { tweets } from '@prisma/client';
import { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/mainLayout';
import Ninteens from '../components/themes/Nintees';
import { NextPageWithLayout } from './_app';

const scenesCount = 2;

const testTweets = [
  'RHUL Rowing is superior! #80s90s00s',
  'Computing society is the best society! #80s90s00s',
];

const fetchTimeline = async () => {
  const req = await fetch('/api/main/tweets?filter=v');
  return req.json();
};

const Wall: NextPageWithLayout = () => {
  const [tweetsArr, setTweets] = useState<(tweets)[]>([{
    tweet_id: '1598748206057209856',
    tweet_text: '#80s90s00s is sick',
    tweet_created_at: '2022-12-02T18:37:30.000Z',
    tweet_author_id: '1489248049855557633',
    tweet_author_name: 'James Arnott',
    tweet_author_username: 'JamesArnott21',
    tweet_author_created_at: '2022-12-02T18:37:30.000Z',
    tweet_author_profile_image_url: 'https://pbs.twimg.com/profile_images/1489248111725740039/1kmLtVly_normal.png',
    process_result: 'v',
    processed_at: null,
  }]);
  const [scene, setScene] = useState(0);
  const [currentTweet, setCurrentTweet] = useState<number>(0);
  const [gotInitialTweets, setGotInitialTweets] = useState(false);

  const getAndSet = async () => {
    const newTweets = await fetchTimeline();
    // remove the tweets that have been posted 15 minutes ago
    const allTweets = [...tweetsArr, ...newTweets];
    const now = new Date();
    const filteredTweets = allTweets.filter((tweet) => {
      const tweetDate = new Date(tweet.tweet_created_at);
      const diff = now.getTime() - tweetDate.getTime();
      const minutes = Math.floor(diff / 60000);
      return minutes < 15;
    });
    console.log('filteredTweets', filteredTweets);
    const nextTweet = (currentTweet + 1) % (tweetsArr.length === 0 ? 1 : tweetsArr.length);
    setCurrentTweet(nextTweet);
  };
  const nextScene = () => {
    setScene((scene + 1) % scenesCount);
  };

  useEffect(() => {
    getAndSet();
  }, []);

  useEffect(() => {
    if (!gotInitialTweets) {
      console.log('fetching', tweetsArr);
      setInterval(() => {
        getAndSet();
      }, 20000);

      setInterval(() => {
        nextScene();
      }, 5 * 60 * 1000);

      setInterval(() => {
        const nextTweet = (currentTweet + 1) % tweetsArr.length;
        setCurrentTweet(nextTweet);
      }, 1 * 1000);
      setGotInitialTweets(true);
    }
  }, [tweetsArr]);

  return (
    <>
      <div className="flex flex-1 justify-center p-20 align-middle">
        <div className="relative m-auto h-full w-full overflow-hidden rounded-2xl bg-slate-700 shadow-2xl">
          {
            scene === 0 && (
              <VaporWave
                tweet={tweetsArr[currentTweet].tweet_text}
                key={currentTweet}
                // authorName={tweetsArr[currentTweet].author_name}
                topBanner="The 80s90s00s Twitter Feed!"
              />
            )
          }
          {
            scene === 1 && (
              <Ninteens
                tweet={tweetsArr[currentTweet].tweet_text}
                key={currentTweet}
                // authorName={tweetsArr[currentTweet].author_name}
                topBanner="The 80s90s00s Twitter Feed!"
              />
            )
          }

        </div>
      </div>

      <Footer />
    </>
  );
};

Wall.getLayout = (page) => (
  <MainLayout className="flex h-screen w-screen bg-slate-900">
    {page}
  </MainLayout>
);

export default Wall;
