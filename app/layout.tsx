import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./styles.css";

const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const outfit = Outfit({ weight: ["300", "400", "500", "600"], subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Mike E. Taylor | Full Stack Developer",
  description: "Mission-driven developer with 15+ years building responsive, accessible web applications for federal and defense clients — including NASA and the U.S. Naval Academy.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Mike E. Taylor | Full Stack Developer",
    description: "Mission-driven developer with 15+ years building responsive, accessible web applications for federal and defense clients — including NASA and the U.S. Naval Academy.",
    url: "https://mikeetaylor.com",
    siteName: "Mike E. Taylor",
    type: "website",
    images: [{ url: "https://mikeetaylor.com/og-image.png", width: 1200, height: 630, alt: "Mike E. Taylor — Full Stack Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mike E. Taylor | Full Stack Developer",
    description: "Mission-driven developer with 15+ years building responsive, accessible web applications for federal and defense clients.",
    images: ["https://mikeetaylor.com/og-image.png"],
  },
  alternates: {
    canonical: "https://mikeetaylor.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mike E. Taylor",
  "url": "https://mikeetaylor.com",
  "image": "https://mikeetaylor.com/og-image.png",
  "jobTitle": "Full Stack Developer",
  "description": "Mission-driven developer with 15+ years building responsive, accessible web applications for federal and defense clients — including NASA and the U.S. Naval Academy.",
  "email": "miketaylorforhire@gmail.com",
  "telephone": "+14109402232",
  "sameAs": [
    "https://www.linkedin.com/in/miketaylorforhire/",
    "https://github.com/miketaylorforhire/"
  ],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "CompTIA Security+",
    "credentialCategory": "certification"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-76X4SGJXE2" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-76X4SGJXE2');
      `}</Script>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
