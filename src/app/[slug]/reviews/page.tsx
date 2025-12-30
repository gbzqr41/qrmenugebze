"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReviewsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    useEffect(() => {
        router.push(`/${slug}`);
    }, [slug, router]);

    return null;
}
