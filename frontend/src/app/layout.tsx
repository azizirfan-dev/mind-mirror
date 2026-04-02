import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader, Space_Mono } from "next/font/google";
import "./globals.css";
import NoiseOverlay from "@/shared/ui/NoiseOverlay";
import AuthProvider from "@/shared/providers/AuthProvider";
import QueryProvider from "@/shared/providers/QueryProvider";
import ToasterProvider from "@/shared/providers/ToasterProvider";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"]
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "MindMirror",
  description: "Your Personalized AI Mind-Mirror, created by Sanity.ID",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hankenGrotesk.variable} ${newsreader.variable} ${spaceMono.variable} antialiased selection:bg-accent/30 selection:text-foreground`}
      >
        <NoiseOverlay />
        <AuthProvider>
          <QueryProvider>
            <ToasterProvider />
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
