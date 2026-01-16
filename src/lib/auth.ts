import { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const clientId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_CLIENT_SECRET;
const issuer = process.env.AUTH_ISSUER;

// Ensure all necessary environment variables are set
if (!clientId || !clientSecret || !issuer) {
  // Only throw if we are actually on the server trying to run this
  if (typeof window === "undefined") {
    throw new Error("Missing Auth0 environment variables");
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: clientId as string,
      clientSecret: clientSecret as string,
      issuer: issuer as string,
      authorization: {
        params: {
          scope: "openid email profile offline_access",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) token.accessToken = account.access_token;

      if (profile) {
        const customProfile = profile as any;
        const namespace = "https://chemfast.ca/roles";
        token.roles = customProfile[namespace] || customProfile.roles || [];
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
