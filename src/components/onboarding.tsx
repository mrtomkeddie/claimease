
'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Sparkles, CheckCircle, FileText, TrendingUp, ArrowRight, Lock, Database, Smartphone } from 'lucide-react';
import { ClaimEaseLogo } from './ClaimEaseLogo';
import type { User } from '@/contexts/UserContext';
import { poppins, gilroyHeavy } from '@/lib/fonts';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToForm = () => {
    const el = document.getElementById('start-claim');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create a dummy user object
    const dummyUser: User = {
      id: 'usr_12345',
      name: formData.name,
      email: formData.email,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      pip_focus: ['PIP (Personal Independence Payment)'],
      created_at: new Date().toISOString(),
    };

    onComplete(dummyUser);
    setIsSubmitting(false);
  };

  const features = [
    {
      icon: FileText,
      title: 'Built for PIP, not generic forms',
      description: 'Every question is tailored specifically to the PIP application. No jargon, no confusion.',
      color: 'text-primary'
    },
    {
      icon: Sparkles,
      title: 'AI-Optimised Answers',
      description: 'Your words are automatically rewritten into clear, professional, DWP-friendly phrasing.',
      color: 'text-accent'
    },
    {
      icon: TrendingUp,
      title: 'Evidence Integration',
      description: 'Highlight the challenges that matter most to the DWP: safety, repetition, reliability, and time.',
      color: 'text-tertiary'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared. You stay in control from start to finish.',
      color: 'text-success'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">{/* removed overflow-hidden to allow sticky to work */}
        <div className="absolute inset-0 gradient-dark-brand pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 md:pb-12">{/* extra bottom padding so mobile CTA doesn't overlap */}
            <div className="flex justify-center mb-8">
              <ClaimEaseLogo />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                    <h1 className={`${gilroyHeavy.className} text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-foreground max-w-3xl`}>
                      Struggling with your PIP application?{' '}
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ClaimEase makes it easier.
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                      Turn your daily experiences into clear, DWP-friendly answers — written in your own words, but optimised for approval.
                    </p>
                    {/* Hero CTA */}
                    <div className="pt-2">
                      <Button onClick={scrollToForm} className="text-sm py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary hover-lift">
                        Start My Claim
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <div className="text-xs text-muted-foreground mt-2">No subscription. One-time £49. Takes ~10–15 minutes.</div>
                    </div>
                  </div>

                {/* Trust/Proof Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-border/30">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Lock className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-foreground">Secure & Private</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Smartphone className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-foreground">Mobile Friendly</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-foreground">One-time Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-foreground">Free Appeal Support</span>
                  </div>
                </div>

                {/* How it works */}
                <div className="mt-2 space-y-4">
                  <h2 className={`${gilroyHeavy.className} text-2xl lg:text-3xl font-medium text-foreground`}>How it works</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="glass-effect hover-lift border-0 backdrop-blur-md">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="font-medium text-base text-foreground">Answer simple questions</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Guided prompts tailored to the PIP form. No jargon, no guesswork.</p>
                      </CardContent>
                    </Card>
                    <Card className="glass-effect hover-lift border-0 backdrop-blur-md">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-5 w-5 text-accent" />
                          <h3 className="font-medium text-base text-foreground">AI-optimised phrasing</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Your words rewritten into clear, DWP-friendly language.</p>
                      </CardContent>
                    </Card>
                    <Card className="glass-effect hover-lift border-0 backdrop-blur-md">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <h3 className="font-medium text-base text-foreground">Export & submit</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Download as PDF or Word and submit with confidence.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Key benefits (lighter style to avoid “7 card” clutter) */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <li key={index} className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/40 p-3">
                        <div className="w-9 h-9 rounded-lg bg-card/60 flex items-center justify-center">
                          <Icon className={`h-4 w-4 ${feature.color}`} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium text-foreground">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="lg:col-span-5 flex items-start justify-center">
                <div className="w-full max-w-md lg:sticky lg:top-20" id="start-claim">{/* adjusted offset for clearer stickiness */}
                  <Card className="w-full glass-effect backdrop-blur-lg border-primary/30">
                    <CardHeader className="text-center space-y-4 pb-6">
                      <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto glow-primary">
                        <Sparkles className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div className="space-y-3">
                        <CardTitle className="text-xl lg:text-2xl text-foreground">Start Your Claim</CardTitle>
                        <CardDescription className="text-sm lg:text-base leading-relaxed text-muted-foreground">
                          Let's get started. Enter your details below.
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="glass-effect backdrop-blur-sm rounded-xl p-3 space-y-2 border-accent/20">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <Shield className="h-4 w-4 text-accent" />
                          </div>
                          <span className="font-medium text-sm text-accent">Your Data is Safe</span>
                        </div>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-success" />
                            <span>This is a demo, no data is saved.</span>
                          </li>
                        </ul>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm text-foreground">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="your.email@example.com"
                              required
                              className="text-sm py-2.5 bg-input/80 backdrop-blur-sm border-border/50 focus:border-primary focus:ring-primary/20 text-foreground"
                            />
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full text-sm py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary hover-lift transition-all duration-200 group" 
                          disabled={isSubmitting}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {isSubmitting ? 'Logging in...' : 'Start My Claim'}
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </form>

                      <div className="text-center space-y-2 pt-3 border-t border-border/30">
                        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            <span>Secure Storage</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Smartphone className="h-3 w-3" />
                            <span>Mobile Friendly</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            <span>Private</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                      </div>

                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mt-16 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-medium text-foreground">
                  One low price. No hidden costs.
                </h2>
              </div>
              
              <Card className="max-w-md mx-auto glass-effect backdrop-blur-lg border-primary/30">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">£49</div>
                    <div className="text-sm text-muted-foreground">one-time fee</div>
                  </div>
                  
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-sm">Full access to the ClaimEase PIP Builder</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-sm">Export your ready-to-submit answers in PDF or Word format</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-sm">Free appeal support if needed</span>
                    </li>
                  </ul>
                  
                  <div className="space-y-1">
                    <Button onClick={scrollToForm} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Start My Claim for £49 →
                    </Button>
                    <div className="text-xs text-muted-foreground">No subscription. Includes free appeal support.</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appeal Promise Section moved below pricing */}
            <div className="mt-16 text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-medium text-foreground">
                  And if your claim is rejected… we're still with you.
                </h2>
                <div className="max-w-3xl mx-auto space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Over half of PIP decisions are overturned on appeal.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    If that happens to you, ClaimEase will guide you step-by-step through the appeal process — free of charge.
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    Because your benefits are too important to risk.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 max-w-4xl mx-auto space-y-8">
              <h2 className="text-2xl lg:text-3xl font-medium text-center text-foreground">
                Frequently Asked Questions
              </h2>
              
              <div className="grid gap-6">
                <Card className="glass-effect backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3 text-foreground">Is this legal?</h3>
                    <p className="text-muted-foreground">
                      Yes. ClaimEase does not provide legal advice. It simply helps you express your answers more clearly in your own words.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3 text-foreground">Will you store my data?</h3>
                    <p className="text-muted-foreground">
                      No. Your answers are processed securely and never shared with third parties.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3 text-foreground">Can ClaimEase guarantee my claim will be accepted?</h3>
                    <p className="text-muted-foreground">
                      No tool can guarantee an outcome. But ClaimEase ensures your answers are clear, detailed, and focused on what the DWP looks for — giving you the strongest possible chance.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3 text-foreground">What if my claim is rejected?</h3>
                    <p className="text-muted-foreground">
                      We'll guide you through the appeal process for free.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Final CTA Section */}
            <div className="mt-16 text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-medium text-foreground">
                  Don't leave your PIP claim to chance.
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your benefits can be life-changing — make sure your application is as strong as it can be.
                </p>
              </div>
              
              <Button size="lg" onClick={scrollToForm} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                Start My Claim Today →
              </Button>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center z-50">
              <Button onClick={scrollToForm} className="px-6 py-3 bg-primary text-primary-foreground shadow-lg rounded-full">
                Start My Claim
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
