import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;

        // Fetch user permissions from Django and include them in the token (not implemented yet, waiting on developer API from McMaster)
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/user-permissions/`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            token.roles = data.roles || [];
            token.courses = data.courses || [];
          }
        } catch (error) {
          console.error("Failed to fetch permissions from Django:", error);
          token.roles = [];
          token.courses = [];
        }
      }

      return token;
    },

    async session({ session, token }) {
      // 3. Make the roles and courses available to your Next.js frontend
      if (session.user) {
        (session.user as any).roles = token.roles;
        (session.user as any).courses = token.courses;
      }
      return session;
    },
  },
});
