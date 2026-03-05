import type { Metadata } from "next";
import "./globals.css";
import "./styles.css";

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
    card: "summary_large_image",
    title: "Mike E. Taylor | Full Stack Developer",
    description: "Mission-driven developer with 15+ years building responsive, accessible web applications for federal and defense clients.",
  },
  alternates: {
    canonical: "https://mikeetaylor.com",
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
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
