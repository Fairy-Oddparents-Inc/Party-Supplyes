"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/login");
    localStorage.setItem('isLoggedIn', 'false');
  };


  return (
    <div className="space-y-2">
      <Button onClick={handleBack}>Regresar</Button>
    </div>
  );
}