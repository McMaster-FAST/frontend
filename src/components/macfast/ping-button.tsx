"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

export function PingButton() {
  const authFetch = useAuthFetch();
  const [pongMessage, setPongMessage] = useState<string | null>(null);

  const handlePing = async () => {
    try {
      const res = await authFetch("/api/core/ping/");

      // Check for 200
      if (res.ok) {
        // Read response
        const data = await res.json();

        setPongMessage(data.message);
      } else {
        setPongMessage("Failed to Ping");
        console.error("Ping error:", res.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="flex items-center">
      <Button className="m-5" variant="primary" onClick={handlePing}>
        Ping
      </Button>

      {pongMessage && (
        <span className="text-xl font-bold text-green-600">{pongMessage}</span>
      )}
    </div>
  );
}
