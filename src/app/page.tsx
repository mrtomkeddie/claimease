
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/contexts/UserContext';
import { TopMenu } from '@/components/TopMenu';
import { Footer } from '@/components/Footer';
import { FooterSlim } from '@/components/FooterSlim';
import { SavedClaim } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { List, Plus } from 'lucide-react';
import { UpsellModal } from '@/components/UpsellModal';
import { UserTier } from '@/lib/constants';

// Dynamic imports to reduce initial bundle
const Onboarding = dynamic(() => import('@/components/onboarding').then(m => m.Onboarding), { ssr: false });
const ClaimForm = dynamic(() => import('@/components/claim-form').then(m => m.ClaimForm), { ssr: false });
const SavedClaims = dynamic(() => import('@/components/SavedClaims').then(m => m.default), { ssr: false });

type ViewMode = 'saved-claims' | 'claim-form';

export default function HomePage() {
  const { user, setUser, canCreateClaim, incrementClaimCount, getRemainingClaims } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>('saved-claims');
  const [loadedClaim, setLoadedClaim] = useState<SavedClaim | null>(null);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  
  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  const handleLoadClaim = (claim: SavedClaim) => {
    setLoadedClaim(claim);
    setViewMode('claim-form');
  };

  const handleNewClaim = () => {
    // Check if user can create a new claim based on their tier
    if (!canCreateClaim()) {
      setShowUpsellModal(true);
      return;
    }
    
    setLoadedClaim(null);
    setViewMode('claim-form');
    // Increment claim count when starting a new claim
    incrementClaimCount();
  };

  const handlePurchaseExtraClaim = () => {
    // TODO: Implement payment flow
    setShowUpsellModal(false);
    setLoadedClaim(null);
    setViewMode('claim-form');
  };

  const handleContinueFree = () => {
    setShowUpsellModal(false);
    setLoadedClaim(null);
    setViewMode('claim-form');
  };

  const handleBackToSaved = () => {
    setViewMode('saved-claims');
    setLoadedClaim(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
        <TopMenu />
        <main className="container mx-auto px-4 pt-20 md:pt-24 pb-12 flex-1">
          {/* Navigation Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'saved-claims' ? 'default' : 'outline'}
                onClick={() => setViewMode('saved-claims')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Saved Claims
              </Button>
              <Button
                variant={viewMode === 'claim-form' ? 'default' : 'outline'}
                onClick={handleNewClaim}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Claim
              </Button>
            </div>
          </div>

          {viewMode === 'saved-claims' ? (
            <SavedClaims 
              onLoadClaim={handleLoadClaim}
              onNewClaim={handleNewClaim}
            />
          ) : (
            <ClaimForm 
              loadedClaim={loadedClaim}
              onBackToSaved={handleBackToSaved}
            />
          )}
        </main>
        
        <FooterSlim />
        
        <UpsellModal
          isOpen={showUpsellModal}
          onClose={() => setShowUpsellModal(false)}
          onPurchase={handlePurchaseExtraClaim}
          onContinueFree={handleContinueFree}
        />
      </div>
  )
}
