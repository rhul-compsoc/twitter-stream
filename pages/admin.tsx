/* eslint-disable camelcase */
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { processed, tweets } from '@prisma/client';
import Navbar from '../components/navbar';

const fetchTimeline = async (filter?: string) => {
  let req;
  if (filter === undefined) {
    req = await fetch('/api/main/tweets');
  } else {
    req = await fetch(`/api/main/tweets?filter=${filter}`);
  }
  return req.json();
};

const fetchUnprocessed = () => fetchTimeline();
const fetchUnverified = () => fetchTimeline('d');
const fetchVerified = () => fetchTimeline('v');
const fetchBanned = () => fetchTimeline('b');

const Admin = () => {
  const [filter, setFilter] = useState('u');
  const [tweetsArr, setTweets] = useState<(tweets & {processed: processed[];})[]>([]);

  const changeFilter = async (f: string) => {
    let newData;
    switch (f) {
      case 'u':
        newData = await fetchUnprocessed();
        break;
      case 'v':
        newData = await fetchVerified();
        break;
      case 'd':
        newData = await fetchUnverified();
        break;
      case 'b':
        newData = await fetchBanned();
        break;
      default:
        newData = await fetchUnprocessed();
    }
    return newData;
  };

  const processTweet = async (tweet_id: string, process_result: string) => {
    const req = await fetch('/api/main/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tweet_id,
        process_result,
      }),
    });
    if (process_result !== filter) {
      const newTweets = tweetsArr.filter((tweet) => tweet.tweet_id !== tweet_id);
      setTweets(newTweets);
    }

    return req;
  };

  useEffect(() => {
    changeFilter(filter).then((data) => {
      setTweets(data);
    });
  }, [filter]);

  useEffect(() => {
    changeFilter(filter).then((d) => setTweets(d));
  }, [filter]);

  useEffect(() => {
    console.log(tweetsArr, 'changed');
  }, [tweetsArr]);

  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>

      <Navbar setFilter={(f) => setFilter(f)} />

      <h1 className="my-2 text-center text-2xl font-bold capitalize">
        Admin User Detected
      </h1>

      {

tweetsArr.length > 0 ? tweetsArr.map((tweet) => (
  <div
    className="m-10 flex justify-center rounded-2xl bg-primary
                    text-center font-bold text-primary-content shadow-2xl overflow-hidden"
  >
    { tweet.tweet_author_profile_image_url
                  && (
                  <div className="flex-initial text-2xl flex items-center">
                    <Image
                      src={tweet.tweet_author_profile_image_url}
                      alt="profile"
                      className="rounded-full m-auto p-2"
                      width={80}
                      height={80}
                    />

                  </div>
                  )}
    <div className="flex-initial text-2xl flex items-center">
      <div className="m-auto">{`${tweet.tweet_author_username} ${tweet.tweet_author_name}`}</div>
    </div>
    <div className="flex-1 flex m-5 text-xl">
      {tweet.tweet_text}
    </div>
    <div className="flex">
      <button className="w-32 h-full flex align-middle justify-center bg-green-700 hover:bg-green-600 cursor-pointer" onClick={() => processTweet(tweet.tweet_id, 'v')}>
        <div className="m-auto">
          Accept
        </div>
      </button>
      <button className="w-32 h-full flex align-middle justify-center bg-orange-700 hover:bg-orange-600 cursor-pointer" onClick={() => processTweet(tweet.tweet_id, 'd')}>
        <div className="m-auto">
          Deny
        </div>
      </button>
      <button className="w-32 flex align-middle justify-center bg-red-700 hover:bg-red-600 cursor-pointer" onClick={() => processTweet(tweet.tweet_id, 'b')}>
        <div className="m-auto">
          Ban
        </div>
      </button>
    </div>

  </div>
)) : (<div className="bg-gray-900 text-3xl p-5 text-center">No Tweets To Show!</div>)
}

      {JSON.stringify(tweets)}
    </>
  );
};

export default Admin;
