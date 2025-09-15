import { useState } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import { Onboarding } from './components/Onboarding';
import { ClaimForm } from './components/claim-form';
import { TopMenu } from './components/TopMenu';
import { Toaster } from "@/components/ui/toaster"

function AppContent() {
  const { user, setUser } = useUser();
  const [currentView, setCurrentView] = useState('home');
  
  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased gradient-dashboard">
        <TopMenu 
            currentAppView={currentView}
            onAppViewChange={setCurrentView}
            currentDashboardView='build'
            onDashboardViewChange={() => {}}
        />
        <div className="container mx-auto px-4 py-8 md:py-12 pt-24">
          <ClaimForm />
        </div>
      </div>
  )
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
      <Toaster />
    </UserProvider>
  );
}
