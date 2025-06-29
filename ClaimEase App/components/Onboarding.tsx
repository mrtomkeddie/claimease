import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { createUser, User } from '../services/airtable';
import { toast } from 'sonner@2.0.3';
import { Shield, Sparkles, CheckCircle, FileText, TrendingUp, Calendar, Users, Star, ArrowRight, Lock, Database, Smartphone } from 'lucide-react';
import { ClaimEaseLogo } from './ClaimEaseLogo';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Create user in Airtable with PIP focus
      const user = await createUser({
        name: formData.name,
        email: formData.email,
        timezone: formData.timezone,
        conditions: [], // We'll collect this later
        claimTypes: ['PIP (Personal Independence Payment)'], // Default to PIP
      });

      toast.success('Welcome to ClaimEase! Let\'s start tracking your daily experiences.');
      onComplete(user);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'PIP-Focused Design',
      description: 'Specifically built for Personal Independence Payment claims and assessments',
      color: 'text-primary'
    },
    {
      icon: FileText,
      title: 'Evidence Builder',
      description: 'Automatically generates professional summaries from your daily entries',
      color: 'text-accent'
    },
    {
      icon: TrendingUp,
      title: 'Smart Tracking',
      description: 'AI-powered pattern recognition to highlight key challenges',
      color: 'text-tertiary'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties',
      color: 'text-success'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Users Helped', icon: Users },
    { number: '95%', label: 'Success Rate', icon: TrendingUp },
    { number: '4.8★', label: 'User Rating', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Full-Screen Hero Section with Gradient */}
      <div className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 gradient-dark-brand"></div>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo at Top - Compact */}
            <div className="flex justify-center pt-6 pb-6">
              <ClaimEaseLogo 
                width={160} 
                height={36} 
                showText={true} 
                className="text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12">
              
              {/* Left Side - Features and Benefits */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-medium leading-tight text-foreground">
                      Build stronger PIP claims with{' '}
                      <span className="text-primary">evidence-based</span> tracking
                    </h1>
                    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                      ClaimEase helps you document your daily challenges and automatically generates 
                      professional summaries perfect for PIP applications and assessments.
                    </p>
                  </div>

                  {/* Stats - Compact */}
                  <div className="grid grid-cols-3 gap-4 lg:gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="text-center space-y-1">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto glow-primary">
                            <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                          </div>
                          <div className="text-xl lg:text-2xl font-bold text-foreground">{stat.number}</div>
                          <div className="text-sm lg:text-base text-muted-foreground">{stat.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Features Grid - Compact */}
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

                {/* Testimonial - Compact */}
                <Card className="glass-effect backdrop-blur-md hover-lift border-primary/20">
                  <CardContent className="p-5 lg:p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                        <span className="text-lg">💙</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-base lg:text-lg text-foreground leading-relaxed italic">
                          "ClaimEase helped me document my daily struggles in a way that really 
                          showed how my condition affects me. The summaries were perfect for my PIP review."
                        </p>
                        <div className="text-sm lg:text-base text-accent font-medium">Sarah M. - PIP Recipient</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side - Signup Form - Optimized */}
              <div className="lg:col-span-5 flex items-start justify-center">
                <Card className="w-full max-w-md glass-effect backdrop-blur-lg border-primary/30">
                  <CardHeader className="text-center space-y-4 pb-6">
                    <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto glow-primary">
                      <Sparkles className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="space-y-3">
                      <CardTitle className="text-xl lg:text-2xl text-foreground">Start Your Journey</CardTitle>
                      <CardDescription className="text-sm lg:text-base leading-relaxed text-muted-foreground">
                        Join thousands of users building stronger PIP claims with professional evidence tracking
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Trust Badge - Compact */}
                    <div className="glass-effect backdrop-blur-sm rounded-xl p-3 space-y-2 border-accent/20">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <Shield className="h-4 w-4 text-accent" />
                        </div>
                        <span className="font-medium text-sm text-accent">Trusted by PIP claimants</span>
                      </div>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-success" />
                          <span>GDPR compliant data protection</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-success" />
                          <span>End-to-end encryption</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-success" />
                          <span>No data sharing with DWP</span>
                        </li>
                      </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Form Fields - Compact */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm text-foreground">What should we call you? *</Label>
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your first name"
                            required
                            className="text-sm py-2.5 bg-input/80 backdrop-blur-sm border-border/50 focus:border-primary focus:ring-primary/20 text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm text-foreground">Email Address *</Label>
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

                        <div className="space-y-2">
                          <Label htmlFor="timezone" className="text-sm text-foreground">Your Location</Label>
                          <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                            <SelectTrigger className="text-sm py-2.5 bg-input/80 backdrop-blur-sm border-border/50 focus:border-primary focus:ring-primary/20 text-foreground">
                              <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                            <SelectContent className="bg-card/90 backdrop-blur-lg border-border/50">
                              <SelectItem value="Europe/London">England (London)</SelectItem>
                              <SelectItem value="Europe/Belfast">Northern Ireland (Belfast)</SelectItem>
                              <SelectItem value="Europe/Edinburgh">Scotland (Edinburgh)</SelectItem>
                              <SelectItem value="Europe/Cardiff">Wales (Cardiff)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full text-sm py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary hover-lift transition-all duration-200 group" 
                        disabled={isSubmitting}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Setting up your account...' : 'Start Building My Evidence'}
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
                        By continuing, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Compact */}
      <div className="relative bg-card/30 backdrop-blur-sm border-t border-border/20">
        <div className="absolute inset-0 gradient-dark-brand opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <h2 className="text-2xl lg:text-3xl font-medium text-foreground">
              Everything you need for a successful PIP claim
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 lg:w-14 lg:h-14 glass-effect backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border-primary/20">
                  <Calendar className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                </div>
                <h3 className="text-lg lg:text-xl font-medium text-foreground">Daily Tracking</h3>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Log your daily challenges, symptoms, and activities with our intuitive interface designed for accessibility.
                </p>
              </div>
              
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 lg:w-14 lg:h-14 glass-effect backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border-accent/20">
                  <FileText className="h-6 w-6 lg:h-7 lg:w-7 text-accent" />
                </div>
                <h3 className="text-lg lg:text-xl font-medium text-foreground">Smart Summaries</h3>
                <p className="text-sm lg:text-base text-muted-foreground">
                  AI-powered analysis generates professional reports that highlight patterns and evidence for your claim.
                </p>
              </div>
              
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 lg:w-14 lg:h-14 glass-effect backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border-tertiary/20">
                  <TrendingUp className="h-6 w-6 lg:h-7 lg:w-7 text-tertiary" />
                </div>
                <h3 className="text-lg lg:text-xl font-medium text-foreground">Progress Insights</h3>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Visualize your data over time to understand trends and prepare for assessments with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}