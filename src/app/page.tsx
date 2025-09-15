
'use client';

import { ClaimForm } from '@/components/claim-form';
import { ClaimEaseLogo } from '@/components/ClaimEaseLogo';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex justify-center mb-8">
        <ClaimEaseLogo />
      </div>
      <ClaimForm />
    </main>
  );
}
