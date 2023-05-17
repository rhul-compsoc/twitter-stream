import { authOptions } from '@api/auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth/next';
import * as z from 'zod';

const prisma = new PrismaClient();

const delete_body = z.preprocess(
    (v) => JSON.parse(v as string),
    z.object({
        id: z.number()
    })
);

const Delete: NextApiHandler = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session?.user?.name) return res.status(401).end();

    if (req.method !== 'POST') return res.status(405).end();

    const z_parse = delete_body.safeParse(req.body);
    if (!z_parse.success)
        return res.status(400).json({ success: false, error: z_parse.error });

    const { id } = z_parse.data;

    let processExists = await prisma.processed.count(
        {
            where: {
                messageId: id
            }
        }
    )

    if (processExists)
        await prisma.processed.delete({
            where: { messageId: id }
        });

    await prisma.message.delete({
        where: { id: id }
    });

    return res.status(200).json({ success: true });
};

export default Delete;
