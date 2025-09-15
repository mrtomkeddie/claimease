
'use client';

import React from 'react';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { inter, poppins } from '@/lib/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ClaimEase — Make your PIP claim easier</title>
        <meta
          name="description"
          content="Turn your daily experiences into clear, DWP‑friendly answers. ClaimEase rewrites your words for PIP in 10–15 minutes. One‑time £49. Free appeal support."
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://www.claimease.app/" />

        {/* Theme & Icons */}
        <meta name="theme-color" content="#000000" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ClaimEase" />
        <meta property="og:title" content="ClaimEase — Make your PIP claim easier" />
        <meta
          property="og:description"
          content="Turn your daily experiences into clear, DWP‑friendly answers. One‑time £49. Free appeal support."
        />
        <meta property="og:url" content="https://www.claimease.app/" />
        {/* Optional: Add og:image when available */}
        {/* <meta property="og:image" content="https://www.claimease.app/og-image.png" /> */}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ClaimEase — Make your PIP claim easier" />
        <meta
          name="twitter:description"
          content="Turn your daily experiences into clear, DWP‑friendly answers. One‑time £49. Free appeal support."
        />
        {/* <meta name="twitter:image" content="https://www.claimease.app/og-image.png" /> */}
      </head>
      <body suppressHydrationWarning className={`${inter.className} ${poppins.variable} min-h-screen font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
