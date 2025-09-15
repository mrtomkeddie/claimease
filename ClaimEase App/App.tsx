import { UserProvider } from './contexts/UserContext';
import { ClaimForm } from './components/claim-form';
import { Toaster } from "@/components/ui/toaster"

export default function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-background font-sans antialiased gradient-dashboard">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <ClaimForm />
        </div>
      </div>
      <Toaster />
    </UserProvider>
  );
}
