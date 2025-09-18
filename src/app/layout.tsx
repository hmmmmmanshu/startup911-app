import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Startup911 - Startup Grants India',
    default: 'Startup Grants India 2024 | VC List | Government Funding - Startup911',
  },
  description: "Find 100+ startup grants in India, venture capital firms, and funding opportunities. Complete VC list, government grants, and incubator directory for Indian entrepreneurs. Apply for NIDHI grants, Startup India schemes, and connect with 500+ VCs.",
  keywords: "startup grants india, venture capital india, VC list india, funding for indian startups, government grants for startups, startup funding india, angel investors india, startup incubators india, NIDHI grants, startup india scheme, bangalore VC firms, mumbai angel investors",
  authors: [{ name: "Himanshu Goswami", url: "https://www.linkedin.com/in/himanshu-goswami-72270813b/" }],
  creator: "Startup911",
  publisher: "Startup911",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://startup911.in',
    title: 'Startup Grants India 2024 | VC List | Government Funding - Startup911',
    description: 'Find 100+ startup grants in India, venture capital firms, and funding opportunities. Complete VC list and government grants directory.',
    siteName: 'Startup911',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Startup911 - Startup Grants India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup Grants India 2024 | VC List | Government Funding - Startup911',
    description: 'Find 100+ startup grants in India, venture capital firms, and funding opportunities. Complete VC list and government grants directory.',
    creator: '@Startup_911',
    site: '@Startup_911',
    images: ['/logo.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://startup911.in',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Startup911",
              "url": "https://startup911.in",
              "logo": "https://startup911.in/logo.png",
              "description": "Find startup grants in India, venture capital firms, and funding opportunities. Complete directory of government grants, VCs, and incubators for Indian entrepreneurs.",
              "foundingDate": "2024",
              "founder": {
                "@type": "Person",
                "name": "Himanshu Goswami",
                "url": "https://www.linkedin.com/in/himanshu-goswami-72270813b/"
              },
              "sameAs": [
                "https://x.com/Startup_911",
                "https://www.linkedin.com/in/himanshu-goswami-72270813b/"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "serviceType": [
                "Startup Funding Directory",
                "Venture Capital Database",
                "Government Grants Information",
                "Startup Incubator Directory",
                "Mentor Matching Service"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Analytics />
      </body>
    </html>
  );
}
