import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Image from 'next/image';
import { Tweetv2SearchResult } from 'twitter-api-v2';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';

const fetchTimeline = async () => {
  const req = await fetch('/api/main/tweets');
  return req.json();
};

const Admin = () => {
  const { data } = useQuery(['timeline'], fetchTimeline) as {data: Tweetv2SearchResult};
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log(data, 'changed');
    if (data) {
      if (data.meta.result_count === 0) {
        alert('There are no tweets to display!');
      } else if (data.data) {
        setLoaded(true);
      }
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>

      <Navbar />

      <h1 className="my-2 text-center text-2xl font-bold capitalize">
        Admin User Detected
      </h1>

      {

          loaded ? data.data.map((tweet) => {
            const user = data.includes?.users?.find((u) => u.id === tweet.author_id);
            return (
              <div
                className="m-10 flex justify-center rounded-2xl bg-primary
                    text-center font-bold text-primary-content shadow-2xl overflow-hidden"
              >
                { user?.profile_image_url
                  && (
                  <div className="flex-initial text-2xl flex items-center">
                    <Image
                      src={user?.profile_image_url}
                      alt="profile"
                      className="rounded-full m-auto p-2"
                      width={80}
                      height={80}
                    />

                  </div>
                  )}
                <div className="flex-initial text-2xl flex items-center">
                  <div className="m-auto">{user?.username}</div>
                </div>
                <div className="flex-1 flex m-5 text-xl">
                  {tweet.text}
                </div>
                <div className="flex">
                  <div className="w-32 h-full flex align-middle justify-center bg-green-700 hover:bg-green-600 cursor-pointer">
                    <div className="m-auto">
                      Accept
                    </div>
                  </div>
                  <div className="w-32 h-full flex align-middle justify-center bg-orange-700 hover:bg-orange-600 cursor-pointer">
                    <div className="m-auto">
                      Deny
                    </div>
                  </div>
                  <div className="w-32 flex align-middle justify-center bg-red-700 hover:bg-red-600 cursor-pointer">
                    <div className="m-auto">
                      Ban
                    </div>
                  </div>
                </div>

              </div>
            );
          }) : (<div>Loading...</div>)
}

      {JSON.stringify(data)}
    </>
  );
};

export default Admin;
