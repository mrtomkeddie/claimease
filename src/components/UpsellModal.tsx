'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus } from 'lucide-react';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  onContinueFree: () => void;
}

export function UpsellModal({ isOpen, onClose, onPurchase, onContinueFree }: UpsellModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Need another claim?
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Extra claim slots are just £29 — one-time payment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-sm">Full PIP claim support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-sm">Same expert guidance</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-sm">Free appeal support if needed</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Perfect for partners, family members, or new applications
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onPurchase}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Claim for £29
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onContinueFree}
            className="w-full"
          >
            Continue with existing plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}