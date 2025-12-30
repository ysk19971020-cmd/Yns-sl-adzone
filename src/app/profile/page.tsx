'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, Star, Edit, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto max-w-2xl py-12">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">My Profile</CardTitle>
          <CardDescription>Manage your account details and settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-card-foreground/5">
            <div className="p-3 bg-primary/10 rounded-full">
                <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-foreground">{user.email}</h3>
              <p className="text-sm text-muted-foreground">User ID: {user.uid}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <Star className="w-10 h-10 text-accent mb-2" />
                <h4 className="font-semibold">Membership</h4>
                <p className="text-sm text-muted-foreground mb-3">No Active Plan</p>
                <Button variant="outline" size="sm" asChild><a href="/pricing">View Plans</a></Button>
            </Card>
             <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <ShoppingBag className="w-10 h-10 text-accent mb-2" />
                <h4 className="font-semibold">My Ads</h4>
                <p className="text-sm text-muted-foreground mb-3">You have 0 active ads.</p>
                <Button variant="outline" size="sm" asChild><a href="/my-ads">Manage Ads</a></Button>
            </Card>
          </div>

          <div>
            <Button className="w-full" disabled>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile (Coming Soon)
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
