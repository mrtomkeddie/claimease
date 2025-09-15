
'use client';

import { useUser } from '@/contexts/UserContext';
import { Onboarding } from '@/components/onboarding';
import { ClaimForm } from '@/components/claim-form';
import { TopMenu } from '@/components/TopMenu';
import { ClaimEaseLogo } from '@/components/ClaimEaseLogo';

export default function Home() {
  const { user, setUser } = useUser();
  
  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  return (
    <div className="min-h-screen">
        <TopMenu />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <ClaimForm />
        </main>
      </div>
  )
}
