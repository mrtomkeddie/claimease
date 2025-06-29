
'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import { UserProvider } from '@/contexts/UserContext';
import { Toaster } from "@/components/ui/sonner";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
            <Toaster 
              position="top-center"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  color: 'var(--card-foreground)',
                  border: '1px solid var(--border)',
                  fontSize: '16px',
                  boxShadow: '0 8px 32px rgba(78, 185, 185, 0.3)',
                },
              }}
            />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
