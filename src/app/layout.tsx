import type { Metadata } from "next";
import { Instrument_Sans, Fragment_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fragmentMono = Fragment_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-fragment",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verdict — Independent AI Coding Benchmark & Leaderboard",
  description:
    "Verdict runs every frontier model through the same real coding tasks, scores the output with an auditable judge panel, and publishes the results in the open.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${instrument.variable} ${fragmentMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--fog)] text-[var(--ink)] font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--ink)] focus:text-[var(--paper)] focus:rounded-lg focus:shadow-lg focus:outline-none font-semibold text-xs"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

