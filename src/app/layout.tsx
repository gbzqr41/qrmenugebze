import type { Metadata } from "next";
import "./globals.css";
import { DataStoreProvider } from "@/context/DataStoreContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FeedbackProvider } from "@/context/FeedbackContext";
import GlobalUI from "@/components/GlobalUI";

export const metadata: Metadata = {
  title: "Antigravity Kitchen | Premium QR Menu",
  description: "Premium dijital menü deneyimi. Fine dining, modern Türk mutfağı ve fusion lezzetler.",
  keywords: ["qr menu", "restoran", "fine dining", "menü", "antigravity"],
  authors: [{ name: "Antigravity Kitchen" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          <DataStoreProvider>
            <FeedbackProvider>
              {children}
              <GlobalUI />
            </FeedbackProvider>
          </DataStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


