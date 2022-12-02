/* eslint-disable camelcase */
import { NextApiHandler } from 'next';
import prisma from '../../_prisma';

type verifyType = {
  tweet_id: string;
  process_result: string; // char v = verified,
}

const Verify: NextApiHandler = async (req, res) => {
  const { tweet_id, process_result } = req.body as verifyType;
  console.log(tweet_id, process_result);
  try {
    const tweet = await prisma.tweets.update({
      where: {
        tweet_id,
      },
      data: {
        process_result,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false });
  }
};

export default Verify;
