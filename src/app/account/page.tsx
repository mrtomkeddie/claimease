'use client';

import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, User as UserIcon, Bell, CreditCard, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
  const { user } = useUser();

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <p className="text-lg text-muted-foreground">You need to be logged in to view this page.</p>
            <Button asChild className="mt-4">
                <Link href="/">Go to Login</Link>
            </Button>
        </div>
    );
  }
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">Manage your personal information and application settings.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Focus</p>
                    <p className="text-base">{user.pip_focus.join(', ')}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Timezone</p>
                    <p className="text-base">{user.timezone}</p>
                </div>
             </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Profile Settings</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription className="mb-4">Update your name, email, and password.</CardDescription>
                    <Button variant="outline">Edit Profile</Button>
                </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Subscription</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription className="mb-4">You are on the Free plan. Upgrade for full features.</CardDescription>
                    <Button>Upgrade to Pro</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
