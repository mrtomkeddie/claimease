
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/contexts/UserContext';
import { TopMenu } from '@/components/TopMenu';
import { SavedClaim } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { List, Plus } from 'lucide-react';
import { UpsellModal } from '@/components/UpsellModal';

// Dynamic imports to reduce initial bundle
const Onboarding = dynamic(() => import('@/components/onboarding').then(m => m.Onboarding), { ssr: false });
const ClaimForm = dynamic(() => import('@/components/claim-form').then(m => m.ClaimForm), { ssr: false });
const SavedClaims = dynamic(() => import('@/components/SavedClaims').then(m => m.default), { ssr: false });

type ViewMode = 'saved-claims' | 'claim-form';

export default function Home() {
  const { user, setUser } = useUser();
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
    // Check if user has saved claims (mock check - in real app would check user's actual claims)
    const hasSavedClaims = true; // This would be dynamic based on user's actual claims
    
    if (hasSavedClaims && viewMode === 'saved-claims') {
      setShowUpsellModal(true);
    } else {
      setLoadedClaim(null);
      setViewMode('claim-form');
    }
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
    <div className="min-h-screen">
        <TopMenu />
        <main className="container mx-auto px-4 pt-20 md:pt-24 pb-12">
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
        
        <UpsellModal
          isOpen={showUpsellModal}
          onClose={() => setShowUpsellModal(false)}
          onPurchase={handlePurchaseExtraClaim}
          onContinueFree={handleContinueFree}
        />
      </div>
  )
}
