
'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Sparkles, CheckCircle, FileText, TrendingUp, ArrowRight, Lock, Database, Smartphone } from 'lucide-react';
import { ClaimEaseLogo } from './ClaimEaseLogo';
import type { User } from '@/contexts/UserContext';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      icon: Shield,
      title: 'PIP-Focused Design',
      description: 'Specifically built for Personal Independence Payment claims and assessments.',
      color: 'text-primary'
    },
    {
      icon: FileText,
      title: 'Evidence Builder',
      description: 'Automatically generates professional summaries from your daily entries.',
      color: 'text-accent'
    },
    {
      icon: TrendingUp,
      title: 'Smart Tracking',
      description: 'AI-powered pattern recognition to highlight key challenges.',
      color: 'text-tertiary'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties.',
      color: 'text-success'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-dark-brand"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-center mb-8">
              <ClaimEaseLogo />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-medium leading-tight text-foreground">
                      Build stronger PIP claims with{' '}
                      <span className="text-primary">evidence-based</span> answers
                    </h1>
                    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                      ClaimEase helps you turn your daily experiences into clear, DWP-friendly phrasing for your PIP application.
                    </p>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <Card key={index} className="glass-effect hover-lift border-0 backdrop-blur-md">
                        <CardContent className="p-4 lg:p-5 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-card/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                              <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${feature.color}`} />
                            </div>
                            <h3 className="font-medium text-base lg:text-lg text-foreground">{feature.title}</h3>
                          </div>
                          <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 flex items-start justify-center">
                <Card className="w-full max-w-md glass-effect backdrop-blur-lg border-primary/30">
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
                          <Label htmlFor="name" className="text-sm text-foreground">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your name"
                            required
                            className="text-sm py-2.5 bg-input/80 backdrop-blur-sm border-border/50 focus:border-primary focus:ring-primary/20 text-foreground"
                          />
                        </div>

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
                        {isSubmitting ? 'Logging in...' : 'Start Your Claim'}
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
      </div>
    </div>
  );
}
