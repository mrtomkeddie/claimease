'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { TopMenu } from '@/components/TopMenu';
import { FooterSlim } from '@/components/FooterSlim';
import { Onboarding } from '@/components/onboarding';
import { ClaimForm } from '@/components/claim-form';
import SavedClaims from '@/components/SavedClaims';
import { SavedClaim } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { List, Plus } from 'lucide-react';
import { UpsellModal } from '@/components/UpsellModal';

type ViewMode = 'saved-claims' | 'claim-form';

function AppContent() {
  const { user, setUser, canCreateClaim, incrementClaimCount } = useUser();
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
    if (!canCreateClaim()) {
      setShowUpsellModal(true);
      return;
    }
    
    setLoadedClaim(null);
    setViewMode('claim-form');
    incrementClaimCount();
  };

  const handlePurchaseExtraClaim = () => {
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
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <UserProvider>
        <AppContent />
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  );
}