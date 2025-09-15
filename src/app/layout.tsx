
'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`${inter.className} antialiased h-full gradient-dashboard`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
