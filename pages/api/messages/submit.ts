import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto'
import { NextApiHandler } from 'next';

const prisma = new PrismaClient();

const TRUSTED_AGENT_SECRET = process.env.TRUSTED_AGENT_SECRET;
const AGENT_SECRET_PROVIDED = TRUSTED_AGENT_SECRET != undefined;

const ResultConstructor = function(s: boolean, a: number, msg: string) {
    return {success: s, added: a, message: msg}
}

const GetCookieByKey = function(name: string, cookies: string) {
    let filtered = RegExp(`${name}=[^;]+`).exec(cookies);

    return decodeURIComponent(!!filtered ? filtered.toString().replace(/^[^=]+./, "") : "");
}

// TODO: implement Rate limiting, trusted agents (e.g. Discord bot, etc.)
const SubmitMessage: NextApiHandler = async (req, res) => {
    const messages = req.body.messages;
    const users = req.body.users;
    const uId = GetCookieByKey("id", req.headers.cookie ?? "");

    const secretPresent = AGENT_SECRET_PROVIDED && (req.body.secret != undefined) ? req.body.secret == TRUSTED_AGENT_SECRET : false;

    if (req.method !== "POST" || req.headers['content-type'] !== "application/json") return res.status(405).json(ResultConstructor(false, 0, "Invalid request."))
    if (!Array.isArray(messages) || !Array.isArray(users)) return res.status(400).json(ResultConstructor(false, 0, "Missing messages or users field."))

    if (messages.length < 1)
        return res.status(400).json(ResultConstructor(false, 0, "No messages provided."))

    if (uId == "" && !secretPresent)
        return res.status(400).json(ResultConstructor(false, 0, "Cannot generate identifier."));

    // Allow agents that are trusted to set values like IDs or Dates.
    await prisma.user.createMany({
        data: users.map((u) => ({
                id: secretPresent ? u.id : uId,
                name: u.name,
                username: u.username,
                accent_colour: u.accent_colour || '0',
                profile_image_url: u.profile_image_url || ''
            })) || [],
        skipDuplicates: true
    })

    await prisma.message.createMany({
        data: messages.map((m) => ({
            id: secretPresent? m.id : `${uId}-${randomUUID()}`,
            text: m.text,
            author_id: secretPresent ? m.author_id : uId,
            created_at: secretPresent ? m.date : new Date()
        })) || [],
        skipDuplicates: true
    })


    return res.status(200).json(ResultConstructor(true, messages.length, `${messages.length} message(s) added!`))
}

export default SubmitMessage;