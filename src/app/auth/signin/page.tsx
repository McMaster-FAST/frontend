"use client";

import { useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function SignInContent() {
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    signIn("microsoft-entra-id", { redirectTo });
  }, [redirectTo]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting to Login...</h1>
        <p className="text-muted-foreground">
          Please wait while we connect to McMaster SSO
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
