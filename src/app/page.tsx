"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/context/DataStoreContext";

export default function HomePage() {
  const router = useRouter();
  const { business } = useDataStore();

  useEffect(() => {
    // Redirect to the business menu page
    if (business?.slug) {
      router.replace(`/${business.slug}`);
    } else {
      // Default redirect if no slug is set
      router.replace("/resital-lounge");
    }
  }, [business, router]);

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </main>
  );
}
