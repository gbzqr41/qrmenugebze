"use client";

import { useParams } from "next/navigation";
import { DataStoreProvider } from "@/context/DataStoreContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FeedbackProvider } from "@/context/FeedbackContext";
import GlobalUI from "@/components/GlobalUI";

export default function SlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <ThemeProvider>
            <DataStoreProvider initialSlug={slug}>
                <FeedbackProvider>
                    {children}
                    <GlobalUI />
                </FeedbackProvider>
            </DataStoreProvider>
        </ThemeProvider>
    );
}
