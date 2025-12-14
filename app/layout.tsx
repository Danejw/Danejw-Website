import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { cn } from '@/lib/utils';
import { ThemeAwareCircuitBackground } from '@/app/components/ThemeAwareCircuitBackground';
import { DottedGridBackground } from '@/app/components/DottedGridBackground';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danejw.com"),
  title: "Dane Willacker | AI + XR Developer",
  description:
    "Portfolio of Dane Willacker (Danejw), an independent AI + XR developer based in Hawai&#39;i.",
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
      "Portfolio of Dane Willacker (Danejw), an independent AI + XR developer based in Hawai&#39;i.",
    url: "https://danejw.com",
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
      "Portfolio of Dane Willacker (Danejw), an independent AI + XR developer based in Hawai&#39;i.",
    images: ["/favicon_io/android-chrome-192x192.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased relative flex flex-col',
          geistSans.variable,
          geistMono.variable
        )}
      >
        {/* Dotted grid below everything */}
        <DottedGridBackground className="-z-20" opacity={0.25} />
        <ThemeAwareCircuitBackground />
        {/* Dotted grid above the main circuit layer but below content */}
        <DottedGridBackground className="-z-5" opacity={0.15} />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <main className="relative z-10 flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
