
'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/toaster";
import { inter } from '@/lib/fonts';
import { UserProvider } from '@/contexts/UserContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>ClaimEase - AI-Powered PIP Helper</title>
        <meta name="description" content="ClaimEase - AI-Powered PIP Helper for building strong, evidence-backed answers" />
        <meta name="theme-color" content="#4EB9B9" />
      </head>
      <body className={`${inter.className} antialiased h-full gradient-dashboard`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
          </UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
