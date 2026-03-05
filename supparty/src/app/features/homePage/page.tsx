"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <Button onClick={() => router.push("/login")}>Regresar</Button>
    </div>
  );
}