import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export const { handlers, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          // Entra requires "offline_access" to provide a `refresh_token`
          scope: "openid profile email offline_access",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // sign ing in for the first time, save the tokens from Microsoft
      if (account) {
        return {
          ...token,
          id_token: account.id_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      }

      // check if token is still valid
      // authjs uses seconds for expires_at
      if (token.expires_at && Date.now() < token.expires_at * 1000) {
        return token;
      }

      // try to refresh token
      if (!token.refresh_token) {
        console.error("Missing refresh token");
        return { ...token, error: "RefreshTokenError" };
      }

      try {
        const response = await fetch(
          `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/oauth2/v2.0/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
              client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
          },
        );

        const tokensOrError = await response.json();

        if (!response.ok) throw tokensOrError;

        return {
          ...token,
          id_token: tokensOrError.id_token,
          expires_at: Math.floor(Date.now() / 1000 + tokensOrError.expires_in),
          // fallback to old refresh token if Microsoft doesn't issue a new one
          refresh_token: tokensOrError.refresh_token ?? token.refresh_token,
        };
      } catch (error) {
        console.error("Error refreshing token", error);
        return { ...token, error: "RefreshTokenError" };
      }
    },

    async session({ session, token }) {
      session.idToken = token.id_token;
      session.error = token.error;
      return session;
    },
  },
});
