import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "GBZQR | QR Menü Sistemi",
  description: "Premium dijital menü deneyimi.",
  keywords: ["qr menu", "restoran", "menü", "gbzqr"],
  authors: [{ name: "GBZQR" }],
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
      <body className={`${plusJakarta.className} antialiased min-h-screen`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}


