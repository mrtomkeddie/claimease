import React from 'react';
import { Button } from './ui/button';
import { ClaimEaseLogo } from './ClaimEaseLogo';
import { Home, Upload, Edit3, FolderPlus, Settings } from 'lucide-react';

interface TopMenuProps {
  currentAppView: string;
  onAppViewChange: (view: string) => void;
  currentDashboardView: 'home' | 'upload' | 'build' | 'support' | 'settings';
  onDashboardViewChange: (view: 'home' | 'upload' | 'build' | 'support' | 'settings') => void;
}

export function TopMenu({ currentAppView, onAppViewChange, currentDashboardView, onDashboardViewChange }: TopMenuProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'build', label: 'Build', icon: Edit3 },
    { id: 'support', label: 'Support', icon: FolderPlus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <ClaimEaseLogo />
            <div className="hidden sm:block">
              <h1 className="text-xl font-medium">ClaimEase</h1>
              <p className="text-xs text-muted-foreground">AI-Powered PIP Helper</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentDashboardView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onDashboardViewChange(item.id as any)}
                  className={`flex items-center gap-2 ${
                    isActive ? 'glow-primary' : 'hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}