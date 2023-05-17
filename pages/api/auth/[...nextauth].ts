import NextAuth, { NextAuthOptions } from 'next-auth';

import DiscordProvider from 'next-auth/providers/discord';

const DISCORD_API = 'https://discord.com/api';

async function fetchJSONData(api_path: string, token: string) {
    const res = await fetch(`${api_path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accepts: 'application/json'
        }
    });

    return res.json();
}

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization: {
                params: { scope: 'identify guilds guilds.members.read' }
            }
        })
    ],
    theme: {
        colorScheme: 'dark'
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }

            return token;
        },
        async signIn({ user, account, profile, email, credentials }) {
            const token = account?.access_token;
            const authRoles = (process.env.DISCORD_AUTH_ROLES || '').split(' ');

            // Invalid configuration
            if (token == undefined || authRoles.length < 1) {
                return false;
            }

            // Check if the user is on the server
            const guilds = await fetchJSONData(
                `${DISCORD_API}/users/@me/guilds`,
                token
            );

            if (
                !guilds.find(
                    (e: { id: string }) =>
                        e.id == process.env.DISCORD_AUTH_SERVER_ID
                )
            ) {
                return false;
            }

            // Check if the user has the needed roles
            const memberInfo = await fetchJSONData(
                `${DISCORD_API}/users/@me/guilds/${process.env.DISCORD_AUTH_SERVER_ID}/member`,
                token
            );

            if (
                !memberInfo.roles.some((val: string) => authRoles.includes(val))
            ) {
                return false;
            }

            // Authorised user!
            return true;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    },
    pages: {
        signIn: '/login'
    }
};

export default NextAuth(authOptions);
