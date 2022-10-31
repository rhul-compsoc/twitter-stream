import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Image from 'next/image';
import { Tweetv2SearchResult } from 'twitter-api-v2';
import Navbar from '../components/navbar';

const fetchTimeline = async () => {
  const req = await fetch('/api/main/tweets');
  return req.json();
};

const Admin = () => {
  const { data } = useQuery(['timeline'], fetchTimeline) as {data: Tweetv2SearchResult};

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
            data && data.data.map((tweet) => {
              const user = data.includes?.users?.find((u) => u.id === tweet.author_id);
              return (
                <span
                  className="m-10 flex items-center justify-center rounded-2xl bg-primary
                    text-center font-bold text-primary-content shadow-2xl overflow-hidden"
                >
                  { user?.profile_image_url
                  && (
                  <Image
                    src={user?.profile_image_url}
                    alt="profile"
                    className="rounded-full"
                    width={100}
                    height={100}
                  />
                  )}
                  <div className="flex-initial">
                    {user?.username}
                  </div>
                  <div className="flex-1 flex m-5">
                    {tweet.text}
                  </div>
                  <div className="w-32 h-24 flex align-middle justify-center bg-green-700 hover:bg-green-600 cursor-pointer">
                    <div className="flex-initial m-auto">
                      Accept
                    </div>
                  </div>
                  <div className="w-32 h-24 flex align-middle justify-center bg-orange-700 hover:bg-orange-600 cursor-pointer">
                    <div className="flex-initial m-auto">
                      Deny
                    </div>
                  </div>
                  <div className="w-32 h-24 flex align-middle justify-center bg-red-700 hover:bg-red-600 cursor-pointer">
                    <div className="flex-initial m-auto">
                      Ban
                    </div>
                  </div>
                </span>
              );
            })
}

      {JSON.stringify(data)}
    </>
  );
};

export default Admin;
