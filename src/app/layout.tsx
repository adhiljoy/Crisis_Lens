import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrisisLens AI",
  description: "AI-Powered Crisis Management Console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Ambient Decorative Background */}
        <div className="ambient-container" aria-hidden="true">
          <div className="ambient-blob blob-1" />
          <div className="ambient-blob blob-2" />
          <div className="ambient-blob blob-3" />
          <div className="ambient-blob blob-4" />
        </div>
        {children}
      </body>
    </html>
  );
}
