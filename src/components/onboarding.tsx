
'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Sparkles, CheckCircle, FileText, TrendingUp, ArrowRight, Lock, Database, Smartphone, HelpCircle } from 'lucide-react';
import { ClaimEaseLogo } from './ClaimEaseLogo';
import { Footer } from './Footer';
import type { User } from '@/contexts/UserContext';
import { UserTier } from '@/lib/constants';
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
      tier: UserTier.SINGLE_CLAIM, // Default to single claim tier
      claims_used: 0, // Start with 0 claims used
      claims_remaining: 1, // Single claim tier gets 1 claim
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 md:pb-12 flex flex-col min-h-screen">{/* extra bottom padding so mobile CTA doesn't overlap */}
            <div className="flex justify-center mb-8">
              <ClaimEaseLogo />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-1 lg:items-center pb-12 pt-8">
              <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                    <h1 className={`${gilroyHeavy.className} text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-foreground max-w-3xl`}>
                      Struggling with your PIP application?{' '}
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ClaimEase makes it easier.
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                      Answer simple questions. We'll turn them into clear, DWP-friendly answers — in your own words, made stronger.
                    </p>
                    {/* Hero CTA removed: form is visible within hero */}
                    {/* Previously contained a scroll button and helper text. Intentionally left blank for layout spacing. */}
                    {/* Spacer removed to tighten layout now that CTA is gone */}
                  </div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="w-full max-w-md lg:sticky lg:top-20" id="start-claim">{/* adjusted offset for clearer stickiness */}
                  <Card className="w-full glass-effect backdrop-blur-lg border-primary/30">
                    <CardHeader className="text-center space-y-4 pb-6">
                      <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto glow-primary">
                        <Sparkles className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div className="space-y-3">
                        <CardTitle className={`${gilroyHeavy.className} text-xl lg:text-2xl text-foreground`}>Start Your Claim</CardTitle>
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
                          {isSubmitting ? 'Logging in...' : 'Start My Claim for £49 →'}
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

            {/* Key Benefits Section */}
            <div className="mt-24 max-w-6xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <h2 className={`${gilroyHeavy.className} text-3xl lg:text-4xl font-medium text-foreground`}>
                  Why Choose ClaimEase?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Built specifically for PIP applications with features that make the difference
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/40 p-6 hover:bg-card/60 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-card/60 flex items-center justify-center flex-shrink-0">
                        <Icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How It Works Section - Minimal Vertical Steps */}
            <div className="mt-32 max-w-4xl mx-auto">
              <div className="text-center space-y-4 mb-16">
                <h2 className={`${gilroyHeavy.className} text-3xl lg:text-4xl font-medium text-foreground`}>
                  How it works
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Three simple steps to strengthen your PIP claim
                </p>
              </div>

              <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0 w-16 md:w-20">
                    <div className="text-6xl md:text-7xl font-light text-primary/20 leading-none">
                      01
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                      Answer simple questions
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      We'll guide you through plain English questions about your condition and daily challenges. No confusing jargon or complex forms to navigate.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0 w-16 md:w-20">
                    <div className="text-6xl md:text-7xl font-light text-primary/20 leading-none">
                      02
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                      Get AI-optimised answers
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      Our AI transforms your responses into clear, DWP-friendly language that highlights your needs and maximizes your chances of approval.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0 w-16 md:w-20">
                    <div className="text-6xl md:text-7xl font-light text-primary/20 leading-none">
                      03
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                      Export & submit with confidence
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      Download your completed answers as a PDF or Word document. Each response is clearly matched to the correct section of the PIP form, so you can copy them across quickly and accurately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mt-28 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-medium text-foreground">
                  Choose Your Plan
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* ClaimEase Standard */}
                <Card className="glass-effect backdrop-blur-lg border-primary/30 relative flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="text-center space-y-3">
                      <h3 className="text-xl font-semibold text-foreground">ClaimEase Standard</h3>
                      <div className="text-3xl font-bold text-primary">£49</div>
                      <div className="text-sm text-muted-foreground">one-time</div>
                      <div className="text-sm text-muted-foreground/80">For your first PIP claim</div>
                    </div>
                    
                    <ul className="space-y-3 text-left flex-1 mt-6">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">Full access to the ClaimEase PIP Builder</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">Export your ready-to-submit answers (PDF/Word)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">Free appeal support if needed</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm font-medium">Covers one full PIP claim</span>
                      </li>
                    </ul>
                    
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        Need another claim later? You can add extra claim slots from inside your account for just £29 each.
                      </p>
                    </div>
                    
                    <Button onClick={scrollToForm} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
                      Start My Claim for £49 →
                    </Button>
                  </CardContent>
                </Card>

                {/* ClaimEase Pro */}
                <Card className="glass-effect backdrop-blur-lg border-accent/30 relative flex flex-col">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="text-center space-y-3">
                      <h3 className="text-xl font-semibold text-foreground">ClaimEase Pro</h3>
                      <div className="text-3xl font-bold text-accent">£79</div>
                      <div className="text-sm text-muted-foreground">one-time</div>
                      <div className="text-sm text-muted-foreground/80">For unlimited support</div>
                    </div>
                    
                    <ul className="space-y-3 text-left flex-1 mt-6">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">Unlimited claim slots</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">Document upload + AI integration (letters, prescriptions, evidence)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">Free appeal support for every claim</span>
                      </li>
                    </ul>
                    
                    <Button onClick={scrollToForm} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-6">
                      Upgrade to Pro for £79 →
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Trust Note */}
              <div className="text-center pt-6">
                <p className="text-sm text-muted-foreground">
                  No subscriptions. One-time payment. Your data stays private and secure.
                </p>
              </div>
            </div>

            {/* Appeal Promise Section moved below pricing */}
            <div className="mt-28 text-center space-y-6">
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
            <div className="mt-28 max-w-4xl mx-auto space-y-8">
              <h2 className="text-2xl lg:text-3xl font-medium text-center text-foreground">
                Frequently Asked Questions
              </h2>
              
              <div className="grid gap-6">
                <Card className="glass-effect backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-3 text-foreground">What if my claim is rejected?</h3>
                        <p className="text-muted-foreground">
                          Don't panic. Over half of PIP claims are overturned on appeal. If it happens, ClaimEase will guide you step-by-step through the appeal process — free of charge.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-3 text-foreground">Is this legal?</h3>
                        <p className="text-muted-foreground">
                          Yes. ClaimEase doesn't give legal advice. We simply help you put your own experiences into clear, detailed answers that the DWP can easily understand.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-3 text-foreground">Will you store my data?</h3>
                        <p className="text-muted-foreground">
                          No. Your answers are processed securely and never shared. You're always in control of your information.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-3 text-foreground">Can ClaimEase guarantee my claim will be accepted?</h3>
                        <p className="text-muted-foreground">
                          No tool can promise that. What ClaimEase does is make sure your answers are clear, detailed, and focused on what the DWP looks for — giving you the strongest chance possible.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-3 text-foreground">Can I add more claims later?</h3>
                        <p className="text-muted-foreground">
                          Yes. Your £49 plan covers one full PIP claim. If you need to create another claim in the future (for yourself, a partner, or a new application), you can add extra claim slots inside your account for just £29 each.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Final CTA Section */}
            <div className="mt-28 text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-medium text-foreground">
                  Don't risk losing the benefits you deserve.
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Start today — give your claim the best chance of success.
                </p>
              </div>
              
              <Button size="lg" onClick={scrollToForm} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                Start My Claim for £49 →
              </Button>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center z-50">
              <Button onClick={scrollToForm} className="px-6 py-3 bg-primary text-primary-foreground shadow-lg rounded-full">
                Start My Claim for £49 →
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
