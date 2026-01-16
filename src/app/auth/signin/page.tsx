"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  // If there is no callbackUrl (like if the user went directly to /auth/signin), redirect to home "/"
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    // "auth0" is the provider ID. This might be changed in the future when we swap to Azure Active Directory / Entra (whatever Microsoft calls it these days)
    signIn("auth0", { callbackUrl });
  }, [callbackUrl]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting to Login...</h1>
        <p>Please wait while we send you to SSO</p>
      </div>
    </div>
  );
}
