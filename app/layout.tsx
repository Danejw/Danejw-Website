import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { cn } from '@/lib/utils';
import { ThemeAwareCircuitBackground } from '@/app/components/ThemeAwareCircuitBackground';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourindie.dev"),
  title: "Dane Willacker | AI + XR Developer",
  description:
    "Portfolio of Dane Willacker (Danejw), an independent AI + XR developer based in Hawai'i.",
  keywords: [
    "Dane Willacker",
    "Danejw",
    "AI",
    "XR",
    "Unity",
    "Game Development",
    "Next.js",
    "Portfolio",
    "Hawaii",
  ],
  openGraph: {
    title: "Dane Willacker | AI + XR Developer",
    description:
      "Portfolio of Dane Willacker (Danejw), an independent AI + XR developer based in Hawai'i.",
    url: "https://yourindie.dev",
    siteName: "Danejw",
    images: [
      {
        url: "/favicon_io/android-chrome-192x192.png",
        width: 192,
        height: 192,
        alt: "Dane Willacker Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Djw_learn",
    title: "Dane Willacker | AI + XR Developer",
    description:
      "Portfolio of Dane Willacker (Danejw), an independent AI + XR developer based in Hawai'i.",
    images: ["/favicon_io/android-chrome-192x192.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased relative',
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeAwareCircuitBackground />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="relative z-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
