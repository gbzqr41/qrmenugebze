"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Ana sayfa açıldığında login sayfasına yönlendir
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/60">Yönlendiriliyor...</p>
      </div>
    </div>
  );
}
