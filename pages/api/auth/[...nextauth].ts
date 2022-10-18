import NextAuth, { NextAuthOptions } from 'next-auth';

import AzureADProvider from 'next-auth/providers/azure-ad';

export const authOptions: NextAuthOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID
        })
    ],
    theme: {
        colorScheme: 'dark'
    },
    callbacks: {
        async jwt({ token }) {
            token.userRole = 'admin';
            return token;
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
