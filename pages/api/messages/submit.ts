import { PrismaClient } from '@prisma/client';
import { ipRateLimit } from 'lib/wall-ratelimit';
import { NextApiHandler } from 'next';
import z from 'zod';

const prisma = new PrismaClient();

const RouteBodySchema = z.object({ name: z.string(), message: z.string() });

// TODO: implement Rate limiting, trusted agents (e.g. Discord bot, etc.)
const SubmitMessage: NextApiHandler = async (req, res) => {
    const rateLimitRes = await ipRateLimit(req);

    if (rateLimitRes.status !== 200) return rateLimitRes;

    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const parsedBody = RouteBodySchema.safeParse(JSON.parse(req.body));

    if (!parsedBody.success) {
        return res.status(400).json({
            success: false,
            error: parsedBody.error.issues
        });
    }

    try {
        await prisma.message.create({
            data: {
                message_name: parsedBody.data.name,
                message_text: parsedBody.data.message
            }
        });

        return res
            .status(200)
            .json({ success: true, message: 'Message added!' });
    } catch (e) {
        return res.status(500).json({ success: false, error: e });
    }
};

export default SubmitMessage;
