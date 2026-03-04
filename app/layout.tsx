import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./portfolio-styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mike E. Taylor | Full Stack Developer",
  description: "Mission-driven developer with 15+ years building responsive, accessible web applications for federal and defense clients — including NASA and the U.S. Naval Academy.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Mike E. Taylor | Full Stack Developer",
    description: "Mission-driven developer with 15+ years building responsive, accessible web applications for federal and defense clients — including NASA and the U.S. Naval Academy.",
    url: "https://mikeetaylor.com",
    siteName: "Mike E. Taylor",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mike E. Taylor | Full Stack Developer",
    description: "Mission-driven developer with 15+ years building responsive, accessible web applications for federal and defense clients.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
