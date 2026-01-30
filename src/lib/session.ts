import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Mock session for local development when auth is disabled
const DISABLE_AUTH = process.env.DISABLE_AUTH === "true";

const mockSession = {
  user: {
    name: "Developer",
    email: "dev@localhost",
    image: null,
    roles: ["admin", "instructor"],
    courses: [],
  },
  accessToken: "mock-token-for-local-dev",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

/**
 * Get server session with fallback to mock session when auth is disabled
 * Use this instead of getServerSession directly to support local development
 */
export async function getSession() {
  if (DISABLE_AUTH) {
    return mockSession as any;
  }
  
  const session = await getServerSession(authOptions);
  return session;
}
