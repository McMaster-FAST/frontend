// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    // By extending session with accessToken useSession() knows it exists
    accessToken?: string;

    user: {
      roles: string[];
      // Attach courses to the session user when available
      courses?: Course[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    // Tells JWT it can handle an accessToken
    accessToken?: string;
    roles: string[];
    // Persist courses on the JWT so they can be exposed via the session
    courses?: Course[];
  }
}
