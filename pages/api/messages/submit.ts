import { PrismaClient } from '@prisma/client';
import { NextApiHandler } from 'next';
import z from 'zod';

const prisma = new PrismaClient();

const RouteBodySchema = z.object({ name: z.string(), message: z.string() });

// TODO: implement Rate limiting, trusted agents (e.g. Discord bot, etc.)
const SubmitMessage: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const parsedBody = RouteBodySchema.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(400).json({
            success: false,
            error: parsedBody.error.issues
        });
    }

    // // Allow agents that are trusted to set values like IDs or Dates.
    // await prisma.user.createMany({
    //     data:
    //         users.map((u) => ({
    //          w ''
    //         })) || [],
    //     skipDuplicates: true
    // });

    // // TODO: Add check for duplicate comment spam
    // await prisma.message.createMany({
    //     data:
    //         messages.map((m) => ({
    //             id: secretPresent ? m.id : `${uId}-${randomUUID()}`,
    //             text: m.text,
    //             author_id: secretPresent ? m.author_id : uId,
    //             created_at: secretPresent ? m.date : new Date()
    //         })) || [],
    //     skipDuplicates: true
    // });

//     return res
//         .status(200)
//         .json({
//             success: true,
//             message: `${messages.length} message(s) added!`
//         });
// };

export default SubmitMessage;
