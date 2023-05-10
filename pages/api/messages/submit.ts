import { PrismaClient } from '@prisma/client';
import { NextApiHandler } from 'next';

const prisma = new PrismaClient();

const ResultConstructor = function(s: boolean, a: number, msg: string) {
    return {success: s, added: a, message: msg}
}

// TODO: implement Rate limiting, trusted agents (e.g. Discord bot, etc.)
const SubmitMessage: NextApiHandler = async (req, res) => {
    const messages = req.body.messages;
    const users = req.body.users;

    if (req.method !== "POST" || req.headers['content-type'] !== "application/json") return res.status(405).json(ResultConstructor(false, 0, "Invalid request."))
    if (!Array.isArray(messages) || !Array.isArray(users)) return res.status(400).json(ResultConstructor(false, 0, "Missing messages or users field."))

    if (messages.length < 1)
        return res.status(400).json(ResultConstructor(false, 0, "No messages provided."))

    await prisma.user.createMany({
        data: users.map((u) => ({
                id: u.id,
                name: u.name,
                username: u.username,
                accent_colour: u.accent_colour || '0',
                profile_image_url: u.profile_image_url || ''
            })) || [],
        skipDuplicates: true
    })

    await prisma.message.createMany({
        data: messages.map((m) => ({
            id: m.id,
            text: m.text,
            author_id: m.author_id || '',
            created_at: new Date()
        })) || [],
        skipDuplicates: true
    })


    return res.status(200).json(ResultConstructor(true, messages.length, `${messages.length} message(s) added!`))
}

export default SubmitMessage;