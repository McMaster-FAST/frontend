import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

// followed example from https://authjs.dev/guides/refresh-token-rotation and https://authjs.dev/reference/core/providers/microsoft-entra-id

export const { handlers, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope: "openid profile email offline_access",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("new sign-in, saving tokens");
        return {
          ...token,
          access_token: account.access_token,
          id_token: account.id_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      }

      const bufferSeconds = 600;

      const shouldRefresh =
        !token.expires_at ||
        Date.now() >= (token.expires_at - bufferSeconds) * 1000;

      if (!shouldRefresh) {
        const secondsLeft = token.expires_at
          ? Math.floor(token.expires_at - Date.now() / 1000)
          : "unknown";
        console.log(`token still valid, ${secondsLeft}s until refresh`);
        return token;
      }

      console.log("token expired, attempting refresh...");

      if (!token.refresh_token) {
        console.error("no refresh token available");
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
              refresh_token: token.refresh_token as string,
            }),
          },
        );

        const tokensOrError = await response.json();
        if (!response.ok) throw tokensOrError;

        return {
          ...token,
          access_token: tokensOrError.access_token,
          id_token: tokensOrError.id_token ?? token.id_token,
          expires_at: Math.floor(Date.now() / 1000) + tokensOrError.expires_in,
          refresh_token: tokensOrError.refresh_token ?? token.refresh_token,
          error: undefined,
        };
      } catch (error) {
        console.error("token refresh failed:", error);
        return { ...token, error: "RefreshTokenError" };
      }
    },

    async session({ session, token }) {
      session.id_token = token.id_token;
      session.error = token.error;
      return session;
    },
  },
});
