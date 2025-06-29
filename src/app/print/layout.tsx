
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Print Claim Form',
  description: 'Your completed PIP application form.',
};

export default function PrintLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-gray-100">{children}</body>
    </html>
  );
}
