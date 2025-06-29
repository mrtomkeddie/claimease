import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, FileText, Settings, User, Calendar, TrendingUp } from 'lucide-react';
import { ClaimEaseLogo } from './ClaimEaseLogo';
import { useUser } from '../contexts/UserContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user } = useUser();

  const navItems = [
    {
      id: 'journal',
      label: 'Daily Journal',
      icon: BookOpen,
      description: 'Log your daily experiences',
      count: null
    },
    {
      id: 'summary',
      label: 'Claim Evidence',
      icon: FileText,
      description: 'View & generate summaries',
      count: null,
      badge: 'Coming Soon'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Account & preferences',
      count: null
    }
  ];

  return (
    <Card className="card-elevated mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Left Side - Logo and User Info */}
          <div className="flex items-center gap-6">
            <ClaimEaseLogo 
              width={140} 
              height={32} 
              showText={true} 
              className="text-foreground"
            />
            <div className="hidden lg:block w-px h-8 bg-border"></div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Welcome back, {user?.name}</p>
                <p className="text-xs text-muted-foreground">Building your PIP evidence</p>
              </div>
            </div>
          </div>

          {/* Right Side - Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className={`
                    flex items-center gap-2 h-auto p-3 justify-start
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg glow-primary' 
                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }
                  `}
                  disabled={item.badge === 'Coming Soon'}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          className="text-xs px-1.5 py-0.5 bg-warning/20 text-warning border-warning/30"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.count && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          {item.count}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs opacity-75 hidden lg:block">{item.description}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Mobile User Info */}
        <div className="lg:hidden mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Welcome back, {user?.name}</p>
              <p className="text-xs text-muted-foreground">Building your PIP evidence</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="hidden lg:flex items-center justify-center gap-8 mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Entries this week:</span>
            <span className="font-medium">7</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Evidence strength:</span>
            <Badge className="bg-success/20 text-success border-success/30 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Strong
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-tertiary rounded-full"></div>
            <span className="text-muted-foreground">Last entry:</span>
            <span className="font-medium">Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}