import { authOptions } from '@api/auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth/next';
import * as z from 'zod';

const prisma = new PrismaClient();

const process_body = z.preprocess(
    (v) => JSON.parse(v as string),
    z.object({
        id: z.number(),
        denied: z.boolean()
    })
);

const Process: NextApiHandler = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session?.user?.name) return res.status(401).end();

    if (req.method !== 'POST') return res.status(405).end();

    const z_parse = process_body.safeParse(req.body);
    if (!z_parse.success)
        return res.status(400).json({ success: false, error: z_parse.error });

    const { id, denied } = z_parse.data;

    const db_insert_result = await prisma.processed.upsert({
        where: { messageId: id },
        create: {
            messageId: id,
            processed_result: denied,
            processed_by: session.user.name
        },
        update: { processed_result: denied, processed_by: session.user.name }
    });
    return res.status(200).json({ success: true, result: db_insert_result });
};

export default Process;
