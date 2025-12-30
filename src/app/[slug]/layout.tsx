"use client";

import { useParams } from "next/navigation";
import { DataStoreProvider, useDataStore } from "@/context/DataStoreContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { FeedbackProvider } from "@/context/FeedbackContext";
import GlobalUI from "@/components/GlobalUI";
import { useEffect } from "react";

// Component that syncs theme from business data
function ThemeSync({ children }: { children: React.ReactNode }) {
    const { business, isLoading } = useDataStore();
    const { updateTheme } = useTheme();

    useEffect(() => {
        // When business loads and has theme settings, apply them
        if (!isLoading && business?.themeSettings && Object.keys(business.themeSettings).length > 0) {
            updateTheme(business.themeSettings as Record<string, unknown>);
        }
    }, [business?.themeSettings, isLoading, updateTheme]);

    return <>{children}</>;
}

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
                <ThemeSync>
                    <FeedbackProvider>
                        {children}
                        <GlobalUI />
                    </FeedbackProvider>
                </ThemeSync>
            </DataStoreProvider>
        </ThemeProvider>
    );
}
