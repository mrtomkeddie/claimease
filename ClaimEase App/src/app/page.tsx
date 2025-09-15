
'use client';

import { useState } from 'react';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { Onboarding } from '@/components/onboarding';
import { ClaimForm } from '@/components/claim-form';
import { TopMenu } from '@/components/TopMenu';

function AppContent() {
  const { user, setUser } = useUser();
  
  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  return (
    <div className="min-h-screen">
        <TopMenu />
        <main className="container mx-auto px-4 py-8 md:py-12 pt-24">
          <ClaimForm />
        </main>
      </div>
  )
}

export default function Home() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
