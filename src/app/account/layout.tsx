'use client';

import { TopMenu } from "@/components/TopMenu";
import { UserProvider } from "@/contexts/UserContext";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
        <div className="min-h-screen">
            <TopMenu />
            <main className="container mx-auto px-4 py-8 md:py-12 pt-24">
            {children}
            </main>
        </div>
    </UserProvider>
  )
}
