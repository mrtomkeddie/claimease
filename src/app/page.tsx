
import { ClaimForm } from "@/components/claim-form";
import { FileText } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-4 rounded-full mb-4">
            <FileText className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary-foreground tracking-tight">
            ClaimEase
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Your AI-powered guide to PIP applications. Let's make this process simpler, together.
          </p>
        </header>
        <ClaimForm />
      </div>
    </main>
  );
}
