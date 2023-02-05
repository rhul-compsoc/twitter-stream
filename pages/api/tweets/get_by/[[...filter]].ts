import { PrismaClient } from '@prisma/client';
import { NextApiHandler } from 'next';

const prisma = new PrismaClient();

const GetTweetByFilter: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();

    const { filter } = req.query;

    let filterBy;
    if (filter == undefined) filterBy = { is: null };
    else if (filter.length == 1 && ['valid', 'invalid'].includes(filter[0]))
        filterBy = { processed_result: filter[0] == 'valid' };

    // if the filter slug is not valid, return 400
    if (filterBy == undefined) return res.status(400).end();

    const tweets = await prisma.tweet.findMany({
        where: { processed: filterBy },
        include: { processed: true }
    });

    return res.status(200).json({ success: true, tweets });
};

export default GetTweetByFilter;
